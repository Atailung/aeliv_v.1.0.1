import "server-only";

import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";

export async function adminGetQuizzes() {
  await requireAdmin();

  const data = await prisma.quiz.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      imageUrl: true,
      timeLimit: true,
      totalPoints: true,
      level: true,
      category: true,
      createdAt: true,
      updatedAt: true,
      lessonId: true,
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
                  category: true,
                },
              },
            },
          },
        },
      },
      _count: {
        select: {
          questions: true,
          attempts: true,
        },
      },
    },
  });

  return data;
}

export type AdminQuizzesType = Awaited<ReturnType<typeof adminGetQuizzes>>[0];
