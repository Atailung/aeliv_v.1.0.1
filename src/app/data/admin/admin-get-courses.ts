import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";

export async function adminGetCourses() {
  await requireAdmin();

  const data = await prisma.course.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      slug: true,
      smallDescription: true,
      level: true,
      price: true,
      status: true,
      filekey: true,
      duration: true,
      category: true,
      createdAt: true,
      User: {
        select: {
          name: true,
          email: true,
          id: true,
          image: true,
        },
      },
    },
  });

  return data;
}

export type AdminCoursesType = Awaited<ReturnType<typeof adminGetCourses>>[0];
