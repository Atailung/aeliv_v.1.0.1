"use server";

import { requireUser } from "@/app/data/user/require-user";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { revalidatePath } from "next/cache";

export async function markLessonComplete(
  lessonId: string,
  slug: string
): Promise<ApiResponse> {
  const session = await requireUser();

  console.log("Session user ID:", session.id);
  console.log("Lesson ID:", lessonId);

  try {
    const result = await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: {
          userId: session.id,
          lessonId: lessonId,
        },
      },
      update: {
        completed: true,
      },
      create: {
        userId: session.id,
        lessonId: lessonId,
        completed: true,
      },
    });

    console.log("Lesson progress updated:", result);

    revalidatePath(`/dashboard/${slug}`);

    return {
      status: "success",
      message: "Lesson progress updated successfully.",
    };
  } catch (error) {
    console.error("Error updating lesson progress:", error);
    return {
      status: "error",
      message: `Failed to update lesson progress. ${
        error instanceof Error ? error.message : "Unknown error"
      }`,
    };
  }
}
