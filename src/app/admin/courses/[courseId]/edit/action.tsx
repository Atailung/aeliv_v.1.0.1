"use server"

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import { CourseSchema, CourseSchemaType } from "@/lib/ZodSchemas";
import arcjet, { detectBot, fixedWindow } from "@arcjet/next";
import { ZodError } from "zod/v3";

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

    try {

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