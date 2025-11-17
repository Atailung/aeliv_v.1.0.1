import "server-only";

import { prisma } from "@/lib/db";
import { requireAdmin } from "../admin/require-admin";

export async function getAdminQuizData(quizId: string) {
  await requireAdmin();
  const data = await prisma.quiz.findUnique({
    where: { id: quizId },
    select: {
      id: true,
      title: true,
      description: true,
      slug: true,
      imageUrl: true,
      timeLimit: true,
      totalPoints: true,
      createdAt: true,
      updatedAt: true,
      category: true,
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
            orderBy: { text: "asc" },
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
  if (!data) {
    throw new Error("Quiz not found");
  }
  return data;
}

export type AdminQuizSingularType = Awaited<
  ReturnType<typeof getAdminQuizData>
>;
