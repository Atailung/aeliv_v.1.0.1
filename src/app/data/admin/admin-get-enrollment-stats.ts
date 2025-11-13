
import "server-only";
import { prisma } from "@/lib/db";
import { requireAdmin } from "./require-admin";

export async function getEnrollmentStats() {
  await requireAdmin();

  // Create UTC cutoff (30 days ago)
  const now = new Date();
  const thirtyDaysAgoUTC = new Date(
    Date.UTC(
      now.getUTCFullYear(),
      now.getUTCMonth(),
      now.getUTCDate() - 30,
      now.getUTCHours(),
      now.getUTCMinutes(),
      now.getUTCSeconds()
    )
  );

  const enrollments = await prisma.enrollment.findMany({
    where: {
      enrolledAt: {
        gte: thirtyDaysAgoUTC,
      },
    },
    select: {
      enrolledAt: true,
    },
    orderBy: {
      enrolledAt: "asc",
    },
  });

  // console.log("Enrollments found:", enrollments.length);

  // Build list for last 30 days (local format for chart)
  const last30Days: { date: string; enrollments: number }[] = [];
  for (let i = 0; i < 30; i++) {
    const date = new Date();
    date.setDate(date.getDate() - 29 + i); // oldest to newest
    const formatted = date.toLocaleDateString("en-CA");
    last30Days.push({ date: formatted, enrollments: 0 });
  }

  // Count enrollments
  enrollments.forEach((enrollment) => {
    const date = new Date(enrollment.enrolledAt);
    const localDate = date.toLocaleDateString("en-CA");
    const idx = last30Days.findIndex((d) => d.date === localDate);
    if (idx !== -1) last30Days[idx].enrollments++;
  });

  return { last30Days };
}
