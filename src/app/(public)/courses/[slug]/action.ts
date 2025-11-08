"use server";

import { requireUser } from "@/app/data/user/require-user";
import arcjet, { slidingWindow } from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { stripe } from "@/lib/stripe";
import { env } from "@/lib/env";
import { ApiResponse } from "@/lib/types";
import { request } from "@arcjet/next";
import { redirect } from "next/navigation";

const aj = arcjet.withRule(
  slidingWindow({
    mode: "LIVE",
    interval: "10m", // 10 minutes sliding window
    max: 15, // max 15 requests per 10-minute sliding window
  })
);

export async function enrollInCourseAction(
  courseId: string
): Promise<ApiResponse> {
  const user = await requireUser();
  let checkoutUrl: string | null = null;
  try {
    // First check if course exists and user enrollment status
    const course = await prisma.course.findUnique({
      where: { id: courseId },
      select: { id: true, title: true, price: true, slug: true },
    });

    if (!course) {
      return {
        status: "error",
        message: "Course not found.",
      };
    }

    // Check existing enrollment before applying rate limits
    const existingEnrollment = await prisma.enrollment.findUnique({
      where: {
        userId_courseId: {
          userId: user.id,
          courseId: course.id,
        },
      },
      select: { status: true, id: true },
    });

    // If already enrolled, don't apply rate limiting for this legitimate check
    if (existingEnrollment?.status === "Active") {
      return {
        status: "error",
        message: "You are already enrolled in this course.",
      };
    }

    // Apply rate limiting only for actual enrollment attempts
    // Use course-specific fingerprinting to allow enrollment in different courses
    const req = await request();
    const decision = await aj.protect(req, {
      fingerprint: `${user.id}-enrollment-${courseId}`,
    });

    if (decision.isDenied()) {
      return {
        status: "error",
        message:
          "Too many enrollment attempts for this course. Please wait a few minutes before trying again.",
      };
    }

    const userWithStripeCustomerId = await prisma.user.findUnique({
      where: { id: user.id },
      select: { stripeCustomerId: true },
    });

    let stripeCustomerId: string;
    if (userWithStripeCustomerId?.stripeCustomerId) {
      stripeCustomerId = userWithStripeCustomerId.stripeCustomerId;
    } else {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.name || undefined,
        metadata: { userId: user.id },
      });
      stripeCustomerId = customer.id;

      await prisma.user.update({
        where: { id: user.id },
        data: { stripeCustomerId: stripeCustomerId },
      });
    }

    // First, handle enrollment creation/update in a shorter transaction
    const enrollmentResult = await prisma.$transaction(
      async (tx) => {
        // Re-check enrollment within transaction for consistency
        const currentEnrollment = await tx.enrollment.findUnique({
          where: {
            userId_courseId: {
              userId: user.id,
              courseId: course.id,
            },
          },
          select: { status: true, id: true },
        });

        if (currentEnrollment?.status === "Active") {
          throw new Error("You are already enrolled in this course.");
        }

        let enrollment;
        if (currentEnrollment) {
          // Update existing pending enrollment
          enrollment = await tx.enrollment.update({
            where: { id: currentEnrollment.id },
            data: {
              status: "Pending",
              updatedAt: new Date(),
              amount: course.price,
            },
          });
        } else {
          // Create new enrollment
          enrollment = await tx.enrollment.create({
            data: {
              userId: user.id,
              courseId: course.id,
              status: "Pending",
              createdAt: new Date(),
              updatedAt: new Date(),
              amount: course.price,
            },
          });
        }

        return enrollment;
      },
      {
        timeout: 10000, // 10 seconds timeout for enrollment transaction
      }
    );

    // Create Stripe checkout session outside of transaction to avoid timeout
    const baseUrl = env.NEXT_PUBLIC_APP_URL || env.NEXT_PUBLIC_BASE_URL;
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: stripeCustomerId,
      line_items: [
        {
          price: "price_1SQuHNPPmqmCyECuAHRKfKZP",
          quantity: 1,
          // price_data: {
          //   currency: "usd",
          //   product_data: {
          //     name: course.title,
          //   },
          //   unit_amount: course.price * 100, // Stripe expects amount in cents
          // },
          // quantity: 1,
        },
      ],
      mode: "payment",
      success_url: `${baseUrl}/payment/success?success=true`,
      cancel_url: `${baseUrl}/courses/${course.slug}?canceled=true`,
      metadata: {
        enrollmentId: enrollmentResult.id,
        courseId: course.id,
        userId: user.id,
      },
    });

    checkoutUrl = checkoutSession.url;
  } catch (error) {
    if (error instanceof Error) {
      return {
        status: "error",
        message: error.message,
      };
    }
    return {
      status: "error",
      message: "An unknown error occurred.",
    };
  }
  redirect(checkoutUrl || "/courses");
}
