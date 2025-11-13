import { prisma } from "@/lib/db";
import "server-only";
import { requireUser } from "../user/require-user";
import { notFound } from "next/navigation";

export async function getLessonContent(lessonId: string) {
  const session = await requireUser();
  const lesson = await prisma.lesson.findUnique({
    where: {
      id: lessonId,
    },
    select: {
      id: true,
      title: true,
      content: true,
      position: true,
      thumbnailKey: true,
      videoKey: true,
      description: true,
      lessonProgresses: {
        where: { userId: session.id },
        select: {
          completed: true,
          lessonId: true,
        },
      },
      Chapter: {
        select: {
          id: true,
          title: true,
          courseId: true,
          Course: {
            select: {
              id: true,
              slug: true,
              title: true,
            },
          },
        },
      },
    },
  });
  if (!lesson) {
    return notFound();
  }

  const enrollment = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: session.id,
        courseId: lesson.Chapter.courseId,
      },
    },
    select: {
      status: true,
    },
  });
  if (!enrollment || enrollment.status !== "Active") {
    return notFound();
  }
  return lesson;
}

export type LessonContentType = Awaited<ReturnType<typeof getLessonContent>>;
