import "server-only";
import { requireAdmin } from "./require-admin";
import { prisma } from "@/lib/db";


export async function adminGetCourse(id: string) {
  await requireAdmin();
  // await new Promise<void>((resolve) => setTimeout(resolve, 10000)); // artificial delay for demo purposes 10s
  const data = await prisma.course.findUnique({
    where: { id: id },

    select: {
      id: true,
      title: true,
      slug: true,
      description: true,
      smallDescription: true,
      filekey: true,
      level: true,
      price: true,
      duration: true,
      status: true,
      category: true,
      createdAt: true,
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
              thumbnailKey: true,
              videoKey: true,
              position: true,
             
            },
          }
        }
      },
      User: {
        select: {
          id: true,
          name: true,
            email: true,
            image: true,
        },
      },
    },
  });
  if (!data) {
    throw new Error("Course not found");
  }
    return data;
}


export type AdminCourseSingularType = Awaited<ReturnType<typeof adminGetCourse>>;