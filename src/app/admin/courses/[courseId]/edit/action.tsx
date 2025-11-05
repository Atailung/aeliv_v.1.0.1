"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import {
  ChapterSchema,
  ChapterSchemaType,
  CourseSchema,
  CourseSchemaType,
  LessonSchema,
  LessonSchemaType,
} from "@/lib/ZodSchemas";
import arcjet, { detectBot, fixedWindow } from "@/lib/arcjet";
import { ZodError } from "zod/v3";
import { request } from "@arcjet/next";
import { revalidatePath } from "next/cache";

const aj = arcjet
  .withRule(
    detectBot({
      mode: "LIVE",
      allow: [],
    })
  )
  .withRule(
    fixedWindow({
      mode: "LIVE",
      max: 5,
      window: "1m",
    })
  );

// ---------------------- Edit Course ---------------------- //
export async function editCourse(
  data: CourseSchemaType,
  courseId: string
): Promise<ApiResponse> {
  const user = await requireAdmin();

  try {
    if (!user?.user?.id) {
      return {
        status: "error",
        message: "Unauthorized: Please login to continue",
      };
    }

    const req = await request();
    const decision = await aj.protect(req, { fingerprint: user.user.id });

    if (decision.isDenied()) {
      return {
        status: "error",
        message: decision.reason.isRateLimit()
          ? "Too many requests. Please try again later."
          : "Request denied by security rule. You look like a bot.",
      };
    }

    const result = CourseSchema.parse(data);

    await prisma.course.update({
      where: {
        id: courseId,
        userId: user.user.id,
      },
      data: result,
    });

    return {
      status: "success",
      message: "Course updated successfully",
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        status: "error",
        message: "Invalid data format",
      };
    }
    return {
      status: "error",
      message: "Failed to update course",
    };
  }
}

// ---------------------- Reorder Lessons ---------------------- //
export async function reorderLessons(
  chapterId: string,
  lessons: { id: string; position: number }[],
  courseId: string
): Promise<ApiResponse> {
  await requireAdmin();

  try {
    if (!lessons?.length) {
      return { status: "error", message: "No lessons provided for reordering" };
    }

    await prisma.$transaction(
      lessons.map((lesson) =>
        prisma.lesson.update({
          where: { id: lesson.id, chapterId },
          data: { position: lesson.position },
        })
      )
    );

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Lessons reordered successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to reorder lessons",
    };
  }
}

// ---------------------- Reorder Chapters ---------------------- //
export async function reorderChapters(
  chapters: { id: string; position: number }[],
  courseId: string
): Promise<ApiResponse> {
  await requireAdmin();

  try {
    if (!chapters?.length) {
      return {
        status: "error",
        message: "No chapters provided for reordering",
      };
    }

    await prisma.$transaction(
      chapters.map((chapter) =>
        prisma.chapter.update({
          where: { id: chapter.id },
          data: { position: chapter.position },
        })
      )
    );

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Chapters reordered successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to reorder chapters",
    };
  }
}

// ---------------------- Create Chapter ---------------------- //
export async function CreateChapter(
  values: ChapterSchemaType
): Promise<ApiResponse> {
  try {
    await requireAdmin();

    const result = ChapterSchema.parse(values);

    await prisma.$transaction(async (tx) => {
      const maxPos = await tx.chapter.findFirst({
        where: { courseId: result.CourseId },
        select: { position: true },
        orderBy: { position: "desc" },
      });

      await tx.chapter.create({
        data: {
          title: result.name,
          courseId: result.CourseId,
          position: (maxPos?.position ?? 0) + 1,
        },
      });
    });

    revalidatePath(`/admin/courses/${result.CourseId}/edit`);

    return {
      status: "success",
      message: "Chapter created successfully",
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        status: "error",
        message: "Invalid chapter data",
      };
    }
    return {
      status: "error",
      message: "Failed to create chapter",
    };
  }
}

// ---------------------- Create Lesson ---------------------- //
export async function CreateLesson(
  values: LessonSchemaType
): Promise<ApiResponse> {
  try {
    await requireAdmin();

    const result = LessonSchema.parse(values);

    await prisma.$transaction(async (tx) => {
      const maxPos = await tx.lesson.findFirst({
        where: { chapterId: result.chapterId },
        select: { position: true },
        orderBy: { position: "desc" },
      });

      await tx.lesson.create({
        data: {
          title: result.name,
          description: result.description || "",
          videoKey: result.videoKey || "",
          thumbnailKey: result.thumbnailKey || "",
          chapterId: result.chapterId,
          courseId: result.courseId,
          content: "",
          position: (maxPos?.position ?? 0) + 1,
        },
      });
    });

    revalidatePath(`/admin/courses/${result.courseId}/edit`);

    return {
      status: "success",
      message: "Lesson created successfully",
    };
  } catch (error) {
    if (error instanceof ZodError) {
      return {
        status: "error",
        message: "Invalid lesson data",
      };
    }
    return {
      status: "error",
      message: "Failed to create lesson",
    };
  }
}

// ---------------------- Delete Lesson ---------------------- //
export async function deleteLesson({
  lessonId,
  chapterId,
  courseId,
}: {
  lessonId: string;
  chapterId: string;
  courseId: string;
}): Promise<ApiResponse> {
  await requireAdmin();

  try {
    const ChapterWithLessons = await prisma.chapter.findUnique({
      where: { id: chapterId },
      select: {
        Lesson: {
          orderBy: { position: "asc" },
          select: { id: true, position: true },
        },
      },
    });
    if (!ChapterWithLessons || ChapterWithLessons.Lesson.length === 0) {
      return {
        status: "error",
        message: "Lesson not found in the specified chapter",
      };
    }
    const lessons = ChapterWithLessons.Lesson;
    const lessonToDelete = lessons.find((lesson) => lesson.id === lessonId);
    if (!lessonToDelete) {
      return {
        status: "error",
        message: "Lesson to delete not found",
      };
    }

    const remainingLessons = lessons.filter((lesson) => lesson.id !== lessonId);
    // update positions of remaining lessons
    const updates = remainingLessons.map((lesson, index) => {
      return prisma.lesson.update({
        where: { id: lesson.id },
        data: {
          position: index + 1,
        },
      });
    });

    await prisma.$transaction([
      ...updates,
      prisma.lesson.delete({ where: { id: lessonId, chapterId: chapterId } }),
    ]);

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Lesson deleted successfully",
    };
  } catch {
    return {
      status: "error",
      message: "Failed to delete lesson",
    };
  }
}

// ---------------------- Delete Chapter ---------------------- //
// export async function deleteChapter({
//   chapterId,
//   courseId,
// }: {
//   chapterId: string;
//   courseId: string;
// }): Promise<ApiResponse> {
//   await requireAdmin();

//   try {
//     const courseWithChapters = await prisma.course.findUnique({
//       where: { id: courseId },
//       select: {
//         chapter: {
//           orderBy: { position: "asc" },
//           select: { id: true, position: true },
//         },
//       },
//     });
//     if (!courseWithChapters || courseWithChapters.chapter.length === 0) {
//       return {
//         status: "error",
//         message: "Chapter not found in the specified course",
//       };
//     }
//     const chapter = courseWithChapters.chapter;
//     const chapterToDelete = chapter.find((Chapter) => Chapter.id === chapterId);
//     if (!chapterToDelete) {
//       return {
//         status: "error",
//         message: "Chapter to delete not found in the course",
//       };
//     }

//     const remainingChapters = chapter.filter(
//       (Chapter) => Chapter.id !== chapterId
//     );
//     // update positions of remaining lessons
//     const updates = remainingChapters.map(( Chapter, index) => {
//       return prisma.chapter.update({
//         where: { id: Chapter.id },
//         data: {
//           position: index + 1,
//         },
//       });
//     });

//     await prisma.$transaction([
//       ...updates,
//       prisma.chapter.delete({ where: { id: chapterId } }),
//     ]);

//     revalidatePath(`/admin/courses/${courseId}/edit`);

//     return {
//       status: "success",
//       message: "Chapter deleted successfully",
//     };
//   } catch {
//     return {
//       status: "error",
//       message: "Failed to delete chapter",
//     };
//   }
// }



export async function deleteChapter({
  chapterId,
  courseId,
}: {
  chapterId: string;
  courseId: string;
}): Promise<ApiResponse> {
  await requireAdmin();

  try {
    const courseWithChapters = await prisma.course.findUnique({
      where: { id: courseId },
      select: {
        chapter: {
          orderBy: { position: "asc" },
          select: { id: true, position: true },
        },
      },
    });

    if (!courseWithChapters || courseWithChapters.chapter.length === 0) {
      return {
        status: "error",
        message: "Chapter not found in the specified course",
      };
    }

    const chapters = courseWithChapters.chapter;
    const chapterToDelete = chapters.find((ch) => ch.id === chapterId);

    if (!chapterToDelete) {
      return {
        status: "error",
        message: "Chapter to delete not found in the course",
      };
    }

    const remainingChapters = chapters.filter((ch) => ch.id !== chapterId);

    // Update positions of remaining chapters
    const updates = remainingChapters.map((ch, index) =>
      prisma.chapter.update({
        where: { id: ch.id },
        data: { position: index + 1 },
      })
    );

    await prisma.$transaction([
      // Delete the chapter (lessons will be automatically deleted due to cascade)
      prisma.chapter.delete({ where: { id: chapterId } }),
      // Then update positions of remaining chapters
      ...updates,
    ]);

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Chapter deleted successfully",
    };
  } catch (error) {
    console.error("Error deleting chapter:", error);
    return {
      status: "error",
      message: "Failed to delete chapter",
    };
  }
}