"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { CourseSchema, CourseSchemaType } from "@/lib/ZodSchemas";
import { request } from "@arcjet/next";
import { revalidatePath } from "next/cache";

const aj = arcjet
  .withRule(
    fixedWindow({
      mode: "LIVE",
      max: 5,
      window: "1m",
    })
  );

export async function CreateCourse(
  values: CourseSchemaType
): Promise<ApiResponse> {
  const session = await requireAdmin();
  try {
    // Check authentication
    const req = await request();
    const decision = await aj.protect(req, {
      fingerprint: session.user.id as string,
    });

     if (!session?.user?.id) {
      return {
        status: "error",
        message: "Unauthorized: Please login to continue",
      };
    }

    if (decision.isDenied()) {
      if (decision.reason.isRateLimit()) {
        return {
          status: "error",
          message: "Too many requests. Please try again later.",
        };
      } else {
        return {
          status: "error",
          message:
            "Request denied by security rule. you are a bot, never touch my sites.",
        };
      }
    }

    // Validate input data
    const validation = CourseSchema.safeParse(values);
    if (!validation.success) {
      console.error("Validation errors:", validation.error.issues);
      return {
        status: "error",
        message:
          "Validation failed: " +
          validation.error.issues.map((issue: any) => issue.message).join(", "),
      };
    }

    // Check for duplicate slug
    const existingCourse = await prisma.course.findUnique({
      where: { slug: validation.data.slug },
    });

    if (existingCourse) {
      return {
        status: "error",
        message:
          "A course with this slug already exists. Please use a different slug.",
      };
    }

    // Create the course
    const course = await prisma.course.create({
      data: {
        title: validation.data.title,
        slug: validation.data.slug,
        description: validation.data.description,
        smallDescription: validation.data.smallDescription,
        filekey: validation.data.filekey, // Fixed: using filekey as per schema
        duration: validation.data.duration,
        price: validation.data.price ?? 0,
        level: validation.data.level,
        category: validation.data.category,
        status: validation.data.status,
        userId: session.user.id,
      },
    });

    console.log("Course created successfully:", course.id);

    revalidatePath("/admin/courses");

    return {
      status: "success",
      message: "Course created successfully",
    };
  } catch (error) {
    console.error("Error creating course:", error);

    // Handle specific database errors
    if (error instanceof Error) {
      if (error.message.includes("Unique constraint")) {
        return {
          status: "error",
          message: "A course with this information already exists",
        };
      }

      return {
        status: "error",
        message: `Database error: ${error.message}`,
      };
    }

    return {
      status: "error",
      message: "An unexpected error occurred while creating the course",
    };
  }
}
