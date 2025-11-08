"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { revalidatePath } from "next/cache";
import { request } from "@arcjet/next";

const aj = arcjet
  .withRule(
    fixedWindow({
      mode: "LIVE",
      max: 5,
      window: "1m",
    })
  );

export async function DeleteCourse(courseId: string): Promise<ApiResponse> {
  const session = await requireAdmin();
  ;
  try {
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
    await prisma.course.delete({
      where: {
        id: courseId,
      },
    });

    revalidatePath("/admin/courses");

    return {
      status: "success",
      message: "Course deleted successfully.",
    };
  } catch (error) {
    return {
      status: "error",
      message: "An error occurred while deleting the course.",
    };
  }
}
