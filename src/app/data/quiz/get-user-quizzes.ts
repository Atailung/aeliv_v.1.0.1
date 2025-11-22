"use server";

import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { cache } from "react";

export type UserQuizType = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  imageUrl: string | null;
  timeLimit: number | null;
  totalPoints: number;
  level: string;
  category: string;
  createdAt: Date;
  updatedAt: Date;
  lessonId: string | null;
  lesson: {
    id: string;
    title: string;
    Chapter: {
      id: string;
      title: string;
      Course: {
        id: string;
        title: string;
        slug: string;
        category: string;
      };
    };
  } | null;
  _count: {
    questions: number;
    attempts: number;
  };
  userAttempts: {
    id: string;
    status: string;
    startedAt: Date;
    endedAt: Date | null;
    score: number;
  }[];
};

export const getUserQuizzes = cache(async () => {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user?.id) {
    throw new Error("Unauthorized: Please login to continue");
  }

  const userId = session.user.id;

  const data = await prisma.quiz.findMany({
    where: {
      attempts: {
        some: {
          userId: userId,
        },
      },
    },
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
      attempts: {
        where: {
          userId: userId,
        },
        select: {
          id: true,
          status: true,
          startedAt: true,
          endedAt: true,
          score: true,
        },
        orderBy: {
          startedAt: "desc",
        },
      },
    },
  });

  // Transform to include userAttempts and ensure lesson.Chapter.Course is not null
  const transformedData: UserQuizType[] = data.map((quiz) => ({
    ...quiz,
    lesson: quiz.lesson
      ? {
          ...quiz.lesson,
          Chapter: {
            ...quiz.lesson.Chapter,
            Course:
              quiz.lesson.Chapter.Course ??
              {
                id: "",
                title: "",
                slug: "",
                category: "",
              },
          },
        }
      : null,
    userAttempts: quiz.attempts,
  }));

  return transformedData;
});
