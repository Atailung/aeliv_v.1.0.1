import { getAllCourses } from "@/app/data/course/get-all-courses";
import React, { Suspense } from "react";
import {
  PublicCourseCard,
  PublicCourseCardSkeleton,
} from "../_components/PublicCourseCard";

export const dynamic = "force-dynamic";
function PublicCoursesRoute() {
  return (
    <div className="container mt-10">
      <div className="flex flex-col space-y-2 mb-10">
        <h1 className="text-2xl font-bold md:text-4xl tracking-tight ">
          Explore Courses
        </h1>
        <p className="text-sm text-muted-foreground max-w-md">
          Discover a variety of courses tailored for your learning needs.
        </p>
      </div>
      <Suspense fallback={<LoadingSkeletonLayout />}>
        <RenderCourses />
      </Suspense>
    </div>
  );
}

export default PublicCoursesRoute;

async function RenderCourses() {
  const courses = await getAllCourses();
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {courses.map((course) => (
        <PublicCourseCard key={course.id} data={course} />
      ))}
    </div>
  );
}

function LoadingSkeletonLayout() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: 9 }).map((_, index) => (
        <PublicCourseCardSkeleton key={index} />
      ))}
    </div>
  );
}
