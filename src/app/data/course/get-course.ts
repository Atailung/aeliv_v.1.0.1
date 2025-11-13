import "server-only";
import { prisma } from "@/lib/db";

export async function getIndividualCourse(slug: string) {

    const course =  await prisma.course.findUnique({
        where: {
            slug: slug
        },
        select: {
            id: true,
            title: true,
            description: true,
            smallDescription: true,
            level: true,
            category: true,
            price: true,
            filekey: true,
            createdAt: true,
            updatedAt: true,
            duration: true,
            slug: true,
            chapter: {
                select: {
                    id: true,
                    title: true,
                    Lesson: {
                        select: {
                            id: true,
                            title: true,
                        },
                        orderBy: {
                            position: 'asc'
                        }
                    },
                },
                orderBy: {
                    position: 'asc'
                }
            },
            User: {
                select: {
                    id: true,
                    email: true,
                    name: true,
                    image: true,
                },
            },
        }
    });

    if(!course){
        throw new Error("Course not found");
    }

    return course;
}