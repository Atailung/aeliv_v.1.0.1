"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { updateQuizSchema, UpdateQuizSchemaType } from "@/lib/ZodSchemas";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { ZodError } from "zod/v3";
import { request } from "@arcjet/next";
import { revalidatePath } from "next/cache";

const aj = arcjet.withRule(
  fixedWindow({
    mode: "LIVE",
    max: 5,
    window: "1m",
  })
);

// ---------------------- Edit Quiz ---------------------- //
export async function editQuiz(
  data: UpdateQuizSchemaType
): Promise<ApiResponse> {
  const user = await requireAdmin();

  try {
    if (!user?.user?.id) {
      return {
        status: "error",
        message: "Unauthorized: Please login to continue",
      };
    }

    const req = await request();
    const decision = await aj.protect(req, { fingerprint: user.user.id });

    if (decision.isDenied()) {
      return {
        status: "error",
        message: decision.reason.isRateLimit()
          ? "Too many requests. Please try again later."
          : "Request denied by security rule. You look like a bot.",
      };
    }

    const validatedData = updateQuizSchema.parse(data);
    const { id, slug, ...rest } = validatedData;

    // Check if slug is being updated and if it's already taken
    if (slug) {
      const existingQuiz = await prisma.quiz.findFirst({
        where: {
          slug,
          NOT: { id },
        },
      });

      if (existingQuiz) {
        return {
          status: "error",
          message:
            "A quiz with this slug already exists. Please use a different slug.",
        };
      }
    }

    await prisma.quiz.update({
      where: { id },
      data: {
        ...rest,
        ...(slug && { slug }),
      },
      select: {
        id: true,
        title: true,
        slug: true,
        description: true,
        imageUrl: true,
        timeLimit: true,
        totalPoints: true,
        lessonId: true,
        updatedAt: true,
      },
    });

    revalidatePath("/admin/quizzes");
    revalidatePath(`/admin/quizzes/${id}/edit`);
    return {
      status: "success",
      message: "Quiz updated successfully",
    };
  } catch (error) {
    console.error("Error updating quiz:", error);

    if (error instanceof ZodError) {
      return {
        status: "error",
        message:
          "Validation failed: " + error.errors.map((e) => e.message).join(", "),
      };
    }

    if (error instanceof Error) {
      if (error.message.includes("Unique constraint")) {
        return {
          status: "error",
          message: "A quiz with this information already exists",
        };
      }

      return {
        status: "error",
        message: `Database error: ${error.message}`,
      };
    }

    return {
      status: "error",
      message: "Failed to update quiz",
    };
  }
}
