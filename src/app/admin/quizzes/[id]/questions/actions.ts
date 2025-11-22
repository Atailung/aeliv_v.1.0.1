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
    max: 20,
    window: "1m",
  })
);

const OptionSchema = z.object({
  text: z.string().min(1, "Option text is required"),
  isCorrect: z.boolean().default(false),
});

const QuestionSchema = z.object({
  quizId: z.string().uuid(),
  text: z.string().min(1),
  imageUrl: z.string().url().optional(),
  points: z.number().int().default(1),
  order: z.number().int().optional(),
  options: z.array(OptionSchema).optional(),
});

type QuestionInput = z.infer<typeof QuestionSchema>;

export async function createQuestion(
  input: QuestionInput
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
          : "Request denied by security rule.",
      };
    }

    const validation = QuestionSchema.safeParse(input);
    if (!validation.success) {
      return {
        status: "error",
        message: "Validation failed: " + validation.error.issues[0].message,
      };
    }

    // Get next order if not provided
    let order = validation.data.order;
    if (!order) {
      const lastQuestion = await prisma.question.findFirst({
        where: { quizId: validation.data.quizId },
        orderBy: { order: "desc" },
        select: { order: true },
      });
      order = (lastQuestion?.order || 0) + 1;
    }

    const { options, ...questionData } = validation.data;

    await prisma.question.create({
      data: {
        ...questionData,
        order,
        options: options
          ? {
              create: options.map((option) => ({
                text: option.text,
                isCorrect: option.isCorrect,
              })),
            }
          : undefined,
      },
    });

    revalidatePath(`/admin/quizzes/${validation.data.quizId}/questions`);

    return {
      status: "success",
      message: "Question created successfully",
    };
  } catch (error) {
    console.error("Error creating question:", error);
    return {
      status: "error",
      message: "Failed to create question",
    };
  }
}

export async function updateQuestion(
  id: string,
  input: Partial<QuestionInput>
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
          : "Request denied by security rule.",
      };
    }

    const { quizId: _quizId, options: _options, ...updateData } = input;

    const question = await prisma.question.update({
      where: { id },
      data: updateData,
      select: { quizId: true },
    });

    revalidatePath(`/admin/quizzes/${question.quizId}/questions`);

    return {
      status: "success",
      message: "Question updated successfully",
    };
  } catch (error) {
    console.error("Error updating question:", error);
    return {
      status: "error",
      message: "Failed to update question",
    };
  }
}

export async function deleteQuestion(id: string): Promise<ApiResponse> {
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
          : "Request denied by security rule.",
      };
    }

    const question = await prisma.question.delete({
      where: { id },
      select: { quizId: true },
    });

    revalidatePath(`/admin/quizzes/${question.quizId}/questions`);

    return {
      status: "success",
      message: "Question deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting question:", error);
    return {
      status: "error",
      message: "Failed to delete question",
    };
  }
}
