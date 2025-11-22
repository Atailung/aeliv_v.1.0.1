"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { ApiResponse } from "@/lib/types";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { request } from "@arcjet/next";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { AttemptStatus } from "@/generated/prisma";

const aj = arcjet.withRule(
  fixedWindow({
    mode: "LIVE",
    max: 10,
    window: "5m",
  })
);

type Answer = {
  selectedOptionId?: string;
  selectedOptionIds?: string[];
};

type SubmitResult = {
  score: number;
  pointsEarned: number;
  totalPoints: number;
  attemptId: string;
  isPassed: boolean;
  timeSpent?: number;
};

export async function userSubmitQuiz(
  quizId: string,
  answers: Record<string, Answer>,
  startTime?: Date
): Promise<ApiResponse<SubmitResult>> {
  try {
    // Get authenticated user
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return {
        status: "error",
        message: "Unauthorized: Please login to continue",
      };
    }

    const userId = session.user.id;

    // Validate quiz ID format
    const idSchema = z.string().uuid({ message: "Invalid quiz ID format" });
    const validationResult = idSchema.safeParse(quizId);

    if (!validationResult.success) {
      return {
        status: "error",
        message: "Invalid quiz ID format",
      };
    }

    // Rate limiting
    const req = await request();
    const decision = await aj.protect(req, { fingerprint: userId });

    if (decision.isDenied()) {
      return {
        status: "error",
        message: decision.reason.isRateLimit()
          ? "Too many quiz submissions. Please try again later."
          : "Request denied by security rule.",
      };
    }

    // Get quiz with questions and options
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        questions: {
          include: {
            options: true,
          },
        },
      },
    });

    if (!quiz) {
      return {
        status: "error",
        message: "Quiz not found",
      };
    }

    // Check if there's an ongoing attempt
    const ongoingAttempt = await prisma.quizAttempt.findFirst({
      where: {
        userId,
        quizId,
        endedAt: null,
      },
    });

    // Calculate score
    let earned = 0;
    const totalPoints =
      quiz.totalPoints || quiz.questions.reduce((sum, q) => sum + q.points, 0);
    const userAnswers: Array<{
      questionId: string;
      selectedId: string | null;
      isCorrect: boolean;
    }> = [];

    for (const question of quiz.questions) {
      const userAnswer = answers[question.id];
      if (!userAnswer) continue;

      const correctOptions = question.options.filter((opt) => opt.isCorrect);
      let isCorrect = false;
      let selectedOptionId: string | null = null;

      // Single selection (one correct answer)
      if (correctOptions.length === 1 && userAnswer.selectedOptionId) {
        selectedOptionId = userAnswer.selectedOptionId;
        isCorrect = correctOptions[0].id === userAnswer.selectedOptionId;
      }
      // Multiple selection (multiple correct answers)
      else if (correctOptions.length > 1 && userAnswer.selectedOptionIds) {
        const correctIds = correctOptions.map((opt) => opt.id).sort();
        const selectedIds = userAnswer.selectedOptionIds.sort();
        isCorrect =
          correctIds.length === selectedIds.length &&
          correctIds.every((id, idx) => id === selectedIds[idx]);

        // For multiple choice, store first selected or null
        selectedOptionId = selectedIds[0] || null;
      }

      if (isCorrect) {
        earned += question.points;
      }

      // Store user answer for this question
      userAnswers.push({
        questionId: question.id,
        selectedId: selectedOptionId,
        isCorrect,
      });
    }

    const percentage = totalPoints > 0 ? (earned / totalPoints) * 100 : 0;
    const isPassed = percentage >= 60; // 60% passing score

    // Calculate time spent
    let timeSpent: number | undefined;
    if (startTime) {
      timeSpent = Math.floor(
        (Date.now() - new Date(startTime).getTime()) / 1000
      );
    }

    // Create or update attempt
    let attempt;
    if (ongoingAttempt) {
      attempt = await prisma.quizAttempt.update({
        where: { id: ongoingAttempt.id },
        data: {
          score: earned,
          endedAt: new Date(),
          status: AttemptStatus.Completed,
        },
      });

      // Delete old answers and create new ones
      await prisma.userAnswer.deleteMany({
        where: { attemptId: attempt.id },
      });
    } else {
      attempt = await prisma.quizAttempt.create({
        data: {
          userId,
          quizId,
          score: earned,
          startedAt: startTime || new Date(),
          endedAt: new Date(),
          status: AttemptStatus.Completed,
        },
      });
    }

    // Create user answers
    await prisma.userAnswer.createMany({
      data: userAnswers.map((ans) => ({
        attemptId: attempt.id,
        questionId: ans.questionId,
        selectedId: ans.selectedId,
        isCorrect: ans.isCorrect,
      })),
    });

    // Revalidate paths
    revalidatePath(`/dashboard/quizzes/${quizId}`);
    revalidatePath("/dashboard/quizzes");

    return {
      status: "success",
      message: isPassed
        ? "Quiz completed successfully!"
        : "Quiz completed. Keep practicing!",
      data: {
        score: percentage,
        pointsEarned: earned,
        totalPoints,
        attemptId: attempt.id,
        isPassed,
        timeSpent,
      },
    };
  } catch (error) {
    console.error("Error submitting quiz:", error);

    if (error instanceof Error) {
      return {
        status: "error",
        message: `Failed to submit quiz: ${error.message}`,
      };
    }

    return {
      status: "error",
      message: "An unexpected error occurred while submitting the quiz",
    };
  }
}
