
"use server"

import { requireAdmin } from "@/app/data/admin/require-admin"
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { LessonSchema, LessonSchemaType } from "@/lib/ZodSchemas"

export async function UpdateLesson(
    lessonId: string,
    values: LessonSchemaType 
): Promise<ApiResponse> {
    await requireAdmin();
  
    try {
        const result = LessonSchema.safeParse(values);

        if (!result.success) {
            return {
                status: "error",
                message: "Invalid input data",
            }
        }

        await prisma.lesson.update({
            where: {
                id: lessonId,
            },
            data: {
                title: values.name,
                description: values.description,
                videoKey: values.videoKey,
                thumbnailKey: values.thumbnailKey,
                position: values.position,
            }
        });

        return {
            status: "success",
            message: "Lesson updated successfully",
        };
    } catch (error) {
        return {
            status: "error",
            message: "An error occurred while updating the lesson."
        }
    }
}