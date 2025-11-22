import "server-only";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { cache } from "react";

/**
 * Get detailed results for a specific quiz attempt
 * @param quizId - The ID of the quiz
 * @param attemptId - The ID of the attempt
 */
export const getQuizAttemptResults = cache(
  async (quizId: string, attemptId: string) => {
    // Get session
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      throw new Error("Unauthorized: Please login to continue");
    }

    const userId = session.user.id;

    // Get the quiz attempt with full details
    const attempt = await prisma.quizAttempt.findFirst({
      where: {
        id: attemptId,
        quizId,
        userId, // Ensure user owns this attempt
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
            answeredAt: true,
          },
        },
      },
    });

    if (!attempt) {
      throw new Error("Attempt not found");
    }

    // Get quiz details
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      select: {
        id: true,
        title: true,
        description: true,
        totalPoints: true,
        timeLimit: true,
        questions: {
          select: {
            id: true,
            text: true,
            points: true,
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

    // Calculate detailed statistics
    const totalQuestions = quiz.questions.length;
    const correctAnswers = attempt.answers.filter((a) => a.isCorrect).length;
    const incorrectAnswers = totalQuestions - correctAnswers;
    const accuracy =
      totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

    // Group answers by correctness for detailed breakdown with question details
    const correctAnswersList = attempt.answers
      .filter((a) => a.isCorrect)
      .map((answer) => {
        const question = quiz.questions.find((q) => q.id === answer.questionId);
        return {
          ...answer,
          question: question
            ? {
                id: question.id,
                text: question.text,
                points: question.points,
                options: question.options,
              }
            : null,
        };
      });

    const incorrectAnswersList = attempt.answers
      .filter((a) => !a.isCorrect)
      .map((answer) => {
        const question = quiz.questions.find((q) => q.id === answer.questionId);
        return {
          ...answer,
          question: question
            ? {
                id: question.id,
                text: question.text,
                points: question.points,
                options: question.options,
              }
            : null,
        };
      });

    // Calculate time taken
    const timeTaken =
      attempt.endedAt && attempt.startedAt
        ? Math.floor(
            (new Date(attempt.endedAt).getTime() -
              new Date(attempt.startedAt).getTime()) /
              1000
          )
        : null;

    return {
      quiz: {
        id: quiz.id,
        title: quiz.title,
        description: quiz.description,
        totalPoints: quiz.totalPoints,
        timeLimit: quiz.timeLimit,
        totalQuestions,
      },
      attempt: {
        id: attempt.id,
        score: attempt.score,
        status: attempt.status,
        startedAt: attempt.startedAt,
        endedAt: attempt.endedAt,
        timeTaken,
        answers: attempt.answers.map((answer) => {
          const question = quiz.questions.find(
            (q) => q.id === answer.questionId
          );
          return {
            ...answer,
            question: question
              ? {
                  id: question.id,
                  text: question.text,
                  points: question.points,
                  options: question.options,
                }
              : null,
          };
        }),
      },
      statistics: {
        correctAnswers,
        incorrectAnswers,
        accuracy: Math.round(accuracy * 100) / 100,
        totalScore: attempt.score || 0,
        maxScore: quiz.totalPoints || 0,
      },
      detailedResults: {
        correct: correctAnswersList,
        incorrect: incorrectAnswersList,
      },
    };
  }
);

export type QuizAttemptResultsType = Awaited<
  ReturnType<typeof getQuizAttemptResults>
>;
