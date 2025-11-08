import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export async function getSuccessPageData(
  sessionId?: string,
  courseSlug?: string
) {
  try {
    // Try to get the current session, but don't require it
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      // If no user session, return null for fallback UI
      return null;
    }

    const user = session.user;

    // Get the most recent enrollment for this user
    const recentEnrollment = await prisma.enrollment.findFirst({
      where: {
        userId: user.id,
        status: "Active",
        ...(courseSlug && {
          Course: {
            slug: courseSlug,
          },
        }),
      },
      include: {
        Course: {
          select: {
            id: true,
            title: true,
            slug: true,
            price: true,
            duration: true,
            level: true,
            category: true,
            smallDescription: true,
            User: {
              select: {
                name: true,
                image: true,
              },
            },
            chapter: {
              select: {
                id: true,
                Lesson: {
                  select: {
                    id: true,
                  },
                },
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    if (!recentEnrollment) {
      return null;
    }

    const course = recentEnrollment.Course;
    const totalLessons = course.chapter.reduce(
      (total, chapter) => total + chapter.Lesson.length,
      0
    );

    return {
      enrollment: {
        id: recentEnrollment.id,
        enrolledAt: recentEnrollment.createdAt,
        amount: recentEnrollment.amount,
        status: recentEnrollment.status,
      },
      course: {
        ...course,
        totalLessons,
        totalChapters: course.chapter.length,
      },
      user: {
        name: user.name,
        email: user.email,
      },
    };
  } catch (error) {
    console.error("Error fetching success page data:", error);
    return null;
  }
}

export type SuccessPageData = Awaited<ReturnType<typeof getSuccessPageData>>;
