"use server";

import { prisma } from "@/lib/db";
import { requireAdmin } from "@/app/data/admin/require-admin";
import { ApiResponse } from "@/lib/types";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { request } from "@arcjet/next";
import { revalidatePath } from "next/cache";
import { z } from "zod";

const aj = arcjet.withRule(
  fixedWindow({
    mode: "LIVE",
    max: 10,
    window: "1m",
  })
);

export async function adminDeleteQuiz(id: string): Promise<ApiResponse> {
  const user = await requireAdmin();

  try {
    if (!user?.user?.id) {
      return {
        status: "error",
        message: "Unauthorized: Please login to continue",
      };
    }

    // Validate ID format
    const idSchema = z.string().uuid({ message: "Invalid quiz ID format" });
    const validationResult = idSchema.safeParse(id);

    if (!validationResult.success) {
      return {
        status: "error",
        message: "Invalid quiz ID format",
      };
    }

    // Rate limiting
    const req = await request();
    const decision = await aj.protect(req, { fingerprint: user.user.id });

    if (decision.isDenied()) {
      return {
        status: "error",
        message: decision.reason.isRateLimit()
          ? "Too many requests. Please try again later."
          : "Request denied by security rule.",
      };
    }

    // Check if quiz exists
    const quiz = await prisma.quiz.findUnique({
      where: { id },
      select: { id: true, title: true },
    });

    if (!quiz) {
      return {
        status: "error",
        message: "Quiz not found",
      };
    }

    // Delete the quiz
    await prisma.quiz.delete({
      where: { id },
    });

    revalidatePath("/admin/quizzes");

    return {
      status: "success",
      message: "Quiz deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting quiz:", error);

    if (error instanceof Error) {
      return {
        status: "error",
        message: `Failed to delete quiz: ${error.message}`,
      };
    }

    return {
      status: "error",
      message: "An unexpected error occurred while deleting the quiz",
    };
  }
}
