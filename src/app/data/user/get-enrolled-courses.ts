import { prisma } from "@/lib/db";
import { FileKey } from "lucide-react";
import "server-only";
import { id } from "zod/v4/locales";
import { requireUser } from "./require-user";

export async function getEnrolledCourses(userId: string) {
  const user = await requireUser();
  const data = await prisma.enrollment.findMany({
    where: {
      userId: user.id,
      status: "Active",
    },
    select: {
      Course: {
        select: {
          id: true,
          smallDescription: true,
          filekey: true,
          title: true,
          slug: true,
          duration: true,
          createdAt: true,
          updatedAt: true,
          level: true,
          price: true,
          category: true,
          chapter: {
            select: {
              id: true,
              title: true,
              position: true,
              Lesson: {
                select: {
                  id: true,
                  title: true,
                  description: true,
                  position: true,
                  lessonProgresses: {
                    where: {
                      userId: user.id,
                    },
                    select: {
                      id: true,
                      completed: true,
                      lessonId: true,
                    },
                  },
                },
              },
            },
          },
        },
      },
    },
  });
  return data;
}

export type EnrolledCourseType = Awaited<
  ReturnType<typeof getEnrolledCourses>
>[0];
