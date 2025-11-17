"use server";

import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";

export async function adminGetLessons() {
  await requireAdmin();

  const data = await prisma.lesson.findMany({
    orderBy: { position: "asc" },
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
            },
          },
        },
      },
    },
  });

  return data;
}

export type AdminLessonsType = Awaited<ReturnType<typeof adminGetLessons>>[0];
