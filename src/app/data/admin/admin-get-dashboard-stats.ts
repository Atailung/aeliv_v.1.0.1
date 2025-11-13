"use server";

import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";

export async function getDashboardStats() {
  await requireAdmin(); // Ensure the user is an admin
  const [totalSignups, totalCustomers, totalCourses, totalLessons] = await Promise.all([
    // Future stats fetching can be added here
    // total user signups
    prisma.user.count(),
    // total customers who made purchases
    prisma.user.count({
        where: {
            enrollments: {
                some: {
                    status: "Active"
                }
            }
        }
    }),
    // total courses created
    prisma.course.count({
        where: {},
    }),
    // total lessons created
    prisma.lesson.count(),
  ]);

  return {
    totalSignups,
    totalCustomers,
    totalCourses,
    totalLessons
  };
}
