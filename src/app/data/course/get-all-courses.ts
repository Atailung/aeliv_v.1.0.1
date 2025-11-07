import { prisma } from "@/lib/db";

export async function getAllCourses() {
    const data = await prisma.course.findMany({
        where: {status: "PUBLISHED"},
        orderBy: {createdAt: "desc"},
        select: {
            id: true,
            title: true,
            slug: true,
            description: true,
            filekey: true,
            duration: true,
            price: true,
            level: true,
            category: true,
            smallDescription: true,
            createdAt: true,
        },
    })
    return data;
}

export type PublicCourseType = Awaited<ReturnType<typeof getAllCourses>>[0];
