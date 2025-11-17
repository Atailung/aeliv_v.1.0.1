import "server-only";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { cache } from "react";

/**
 * Get quiz data for a user including their progress and attempt history
 * @param quizId - The ID of the quiz
 * @param userId - Optional user ID, if not provided, gets from session
 */
export const getUserQuizData = cache(
  async (quizId: string, userId?: string) => {
    // Get session if userId not provided
    let currentUserId = userId;

    if (!currentUserId) {
      const session = await auth.api.getSession({
        headers: await headers(),
      });

      if (!session?.user?.id) {
        throw new Error("Unauthorized: Please login to continue");
      }

      currentUserId = session.user.id;
    }

    // Get quiz data
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      select: {
        id: true,
        title: true,
        description: true,
        slug: true,
        imageUrl: true,
        timeLimit: true,
        totalPoints: true,
        lessonId: true,
        createdAt: true,
        updatedAt: true,
        lesson: {
          select: {
            id: true,
            title: true,
            Chapter: {
              select: {
                id: true,
                title: true,
                Course: {
                  select: {
                    id: true,
                    title: true,
                    slug: true,
                  },
                },
              },
            },
          },
        },
        questions: {
          orderBy: { order: "asc" },
          select: {
            id: true,
            text: true,
            imageUrl: true,
            points: true,
            order: true,
            options: {
              select: {
                id: true,
                text: true,
                isCorrect: true,
              },
            },
          },
        },
      },
    });

    if (!quiz) {
      throw new Error("Quiz not found");
    }

    // Get user's attempts for this quiz
    const userProgress = await prisma.quizAttempt.findMany({
      where: {
        userId: currentUserId,
        quizId,
      },
      orderBy: {
        startedAt: "desc",
      },
      select: {
        id: true,
        score: true,
        status: true,
        startedAt: true,
        endedAt: true,
        answers: {
          select: {
            id: true,
            questionId: true,
            selectedId: true,
            isCorrect: true,
          },
        },
      },
    });

    // Calculate statistics
    const completedAttempts = userProgress.filter((p) => p.endedAt !== null);
    const bestScore =
      completedAttempts.length > 0
        ? Math.max(...completedAttempts.map((p) => p.score || 0))
        : null;
    const averageScore =
      completedAttempts.length > 0
        ? completedAttempts.reduce((sum, p) => sum + (p.score || 0), 0) /
          completedAttempts.length
        : null;
    const totalAttempts = userProgress.length;
    const passedAttempts = completedAttempts.filter(
      (p) => p.status === "Completed"
    ).length;
    const canAttempt = true; // No attempt limit in new schema

    // Get the latest in-progress or last completed attempt
    const currentAttempt =
      userProgress.find((p) => !p.endedAt) || userProgress[0];

    return {
      quiz,
      userProgress: {
        attempts: userProgress,
        currentAttempt,
        statistics: {
          totalAttempts,
          completedAttempts: completedAttempts.length,
          passedAttempts,
          canAttempt,
          bestScore,
          averageScore,
        },
      },
    };
  }
);

export type UserQuizDataType = Awaited<ReturnType<typeof getUserQuizData>>;
