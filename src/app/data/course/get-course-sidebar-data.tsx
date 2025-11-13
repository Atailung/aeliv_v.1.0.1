import "server-only";
import { requireUser } from "../user/require-user";
import { prisma } from "@/lib/db";
import { notFound } from "next/navigation";

export const getCourseSidebarData = async (slug: string) => {
  const session = await requireUser();

  const course = await prisma.course.findUnique({
    where: {
      slug: slug,
    },
    select: {
      id: true,
      title: true,
      filekey: true,
      duration: true,
      category: true,
      slug: true,
      chapter: {
        select: {
          id: true,
          title: true,
          position: true,

          Lesson: {
            orderBy: { position: "asc" },
            select: {
              id: true,
              title: true,
              position: true,
              description: true,
              lessonProgresses:{
                where: {
                  userId: session.id
              },
              select: {
                id: true,
                completed: true,
                lessonId: true
              }
              }
            },
          },
        },
        orderBy: { position: "asc" },
      },
    },
  });

  if (!course) return notFound();

  const enrolled = await prisma.enrollment.findUnique({
    where: {
      userId_courseId: {
        userId: session.id,
        courseId: course.id,
      },
    },
  });

  if (!enrolled || enrolled.status !== "Active") return notFound();

  return { course };
};

export type CourseSidebarDataType = Awaited<
  ReturnType<typeof getCourseSidebarData>
>;
