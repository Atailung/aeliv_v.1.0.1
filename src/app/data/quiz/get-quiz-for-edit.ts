import "server-only";

import { prisma } from "@/lib/db";
import { requireAdmin } from "../admin/require-admin";
import { notFound } from "next/navigation";

export async function getQuizForEdit(quizId: string) {
  await requireAdmin();

  const data = await prisma.quiz.findUnique({
    where: { id: quizId },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      lessonId: true,
      imageUrl: true,
      timeLimit: true,
      totalPoints: true,
      level: true,
      lesson: {
        select: {
          id: true,
          title: true,
          Chapter: {
            select: {
              Course: {
                select: {
                  title: true,
                },
              },
            },
          },
        },
      },
    },
  });

  if (!data) {
    return notFound();
  }

  return data;
}

export type QuizForEditType = Awaited<ReturnType<typeof getQuizForEdit>>;
