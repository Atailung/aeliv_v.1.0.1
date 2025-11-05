"use server"

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { CourseSchema, CourseSchemaType } from "@/lib/ZodSchemas";
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


export async function editCourse(data: CourseSchemaType, courseId: string): Promise<ApiResponse> {
    const user = await requireAdmin();
    const session = await requireAdmin();

    try {

        if (!session?.user?.id) {
      return {
        status: "error",
        message: "Unauthorized: Please login to continue",
      };
    }
     const req = await request();
      const decision = await aj.protect(req, {
        fingerprint: session.user.id as string,
       });
     
         if (decision.isDenied()) {
           if(decision.reason.isRateLimit()) {
            return {
             status : "error",
             message : "Too many requests. Please try again later."
            }
           }else{
             return {
               status: "error",
               message: "Request denied by security rule. you are a bot, never touch my sites.",
             }
           }
         }
      
      
      const result = CourseSchema.parse(data);
      if (!user) {
        return {
          status: "error",
          message: "Unauthorized",
        };
      }
      await prisma.course.update({
        where: { id: courseId,
            userId: user.user.id,
         },
        data: {
          ...result,
        },
      });
        return {
        status: "success",
        message: "Course updated successfully",
      };
    } catch (error) {
      if (error instanceof ZodError) {
        return {
          status: "error",
          message: "Invalid data",
        
        };
      }
      return {
        status: "error",
        message: "Failed to update course",
      };
    }
}


export async function reorderLessons(
  chapterId: string,
  lessons: { id: string; position: number }[],
  courseId: string,

): Promise<ApiResponse> {
  await requireAdmin();
  try {

    if(!lessons || lessons.length === 0){
      return {
        status: "error",
        message: "No lessons provided for reordering",
      };
    }
    const updates = lessons.map((lesson) => prisma.lesson.update({
      where: { id: lesson.id, chapterId: chapterId },
      data: { position: lesson.position },
    }));

    await prisma.$transaction(updates);

    revalidatePath(`/admin/courses/${courseId}/edit`);

    return {
      status: "success",
      message: "Lessons reordered successfully",
    };

  } catch (error) {
    return {
      status: "error",
      message: "Failed to reorder lessons",
    };
  }
}

export async function reorderChapters(
  chapters: { id: string; position: number }[],
  courseId: string,
): Promise<ApiResponse> {
  await requireAdmin();
  try {
    if(!chapters || chapters.length === 0){
      return {
        status: "error",
        message: "No chapters provided for reordering",
      };
    }
    const updates = chapters.map((chapter) => prisma.chapter.update({
      where: { id: chapter.id },
      data: { position: chapter.position },
    }));
    await prisma.$transaction(updates);

    revalidatePath(`/admin/courses/${courseId}/edit`);
    return {
      status: "success",
      message: "Chapters reordered successfully",
    };
  }
    catch (error) {
    return {
      status: "error",
      message: "Failed to reorder chapters",
    };
  }
}