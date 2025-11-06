import { adminGetCourses } from "@/app/data/admin/admin-get-courses";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

import React, { Suspense } from "react";
import { AdminCoursesCard, AdminCoursesSkeleton } from "./_components/AdminCoursesCard";
import EmptyState from "@/components/general/EmptyState";
import { Plus } from "lucide-react";

export default function CoursesCreationPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Courses</h1>

        <Link
          href="/admin/courses/create"
          className={buttonVariants({ variant: "default" })}
        >
          <Plus className="size-4 " />
          Create a Course
        </Link>
      </div>
      <Suspense fallback ={<AdminCoursesSkeletonLayout />}>
        <RenderCourses />
      </Suspense>
    </>
  );
}

async function RenderCourses() {
  const data = await adminGetCourses();

  return (
    <>
      {data.length === 0 ? (
        <EmptyState />
      ) : (
        <div className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-7">
          {data.map((course) => (
            <AdminCoursesCard key={course.id} data={course} />
          ))}
        </div>
      )}
    </>
  );
}




function AdminCoursesSkeletonLayout() {
  return (
    <div className="grid grid-cols-1  sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 gap-7">
      {Array.from({ length: 4 }).map((_, index) => (
        <AdminCoursesSkeleton key={index} />
      ))}
    </div>
  )
}