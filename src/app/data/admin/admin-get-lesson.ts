"use server"

import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";
import { notFound } from "next/navigation";

export async function adminGetLesson(lessonId: string) {

    await requireAdmin  ();

    const  data = await prisma.lesson.findUnique({
        where: {
            id: lessonId
        },
        select:{
            id: true,
            title: true,
            videoKey: true,
            thumbnailKey: true,
            description: true,
            position: true,
        }
    });


    if(!data){
        return notFound();
    }

    return data;
}


export type AdminGetLesson = Awaited<ReturnType<typeof adminGetLesson>>;