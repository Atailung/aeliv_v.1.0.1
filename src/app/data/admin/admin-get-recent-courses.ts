import "server-only";
import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";

export async function getRecentCourses() {
  await requireAdmin();

  const data = await prisma.course.findMany({
    orderBy: {
      createdAt: "desc",
    },
    select: {
      id: true,
      title: true,
      smallDescription: true,
      duration: true,
      level: true,
      status: true,
      price: true,
      filekey: true,
      slug: true,
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
    take: 2,
  });
  return data;
}
