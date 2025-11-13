"use server";

import { ChartBarInteractive } from "@/components/sidebar/chart-area-interactive";
import { SectionCards } from "@/components/sidebar/section-cards";
import React, { Suspense } from "react";
import { getEnrollmentStats } from "../data/admin/admin-get-enrollment-stats";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { getRecentCourses } from "../data/admin/admin-get-recent-courses";
import EmptyState from "@/components/general/EmptyState";
import {
  AdminCoursesCard,
  AdminCoursesSkeleton,
} from "./courses/_components/AdminCoursesCard";

const AdminIndexPage = async () => {
  const enrollmentData = await getEnrollmentStats();
  return (
    <>
      <SectionCards />
      <br />
      <ChartBarInteractive data={enrollmentData.last30Days} />

      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Recent Courses</h2>
          <Link
            href={`/admin/courses`}
            className={buttonVariants({ variant: "outline" })}
          >
            view All courses
          </Link>
        </div>
        <Suspense fallback={<AdminCoursesSkeletonLayout />}>
          <RenderRecentCourses />
        </Suspense>
      </div>
    </>
  );
};

export default AdminIndexPage;

async function RenderRecentCourses() {
  const data = await getRecentCourses();

  if (data.length === 0) {
    return (
      <EmptyState
        buttonText="Create Course"
        description="You don't have any course. create some to see them here"
        title="You dont have any courses yet"
        href="/admin/courses/create"
      />
    );
  }

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {data.map((course) => (
        <AdminCoursesCard key={course.id} data={course} />
      ))}
    </div>
  );
}

function AdminCoursesSkeletonLayout() {
  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
      {Array.from({ length: 2 }).map((_, index) => (
        <AdminCoursesSkeleton key={index} />
      ))}
    </div>
  );
}
