import React from "react";
import { getAllCourses } from "../data/course/get-all-courses";
import { getEnrolledCourses } from "../data/user/get-enrolled-courses";
import EmptyState from "@/components/general/EmptyState";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { PublicCourseCard } from "../(public)/_components/PublicCourseCard";
import { Sparkles } from "lucide-react";
import { CourseProgressCard } from "./_compontents/CourseProgressCard";
async function dashboardUserPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const userId = session?.user?.id;

  if (!userId) {
    throw new Error("User not authenticated");
  }

  const [courses, enrolledCourses] = await Promise.all([
    getAllCourses(),
    getEnrolledCourses(),
  ]);

  const availableCourses = courses.filter(
    (course) =>
      !enrolledCourses.some(({ Course: enrolled }) => enrolled.id === course.id)
  );
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        {/* Enrolled Courses Section */}
        <section className="mb-16">
          <div className="mb-6 flex items-baseline justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">
                Enrolled Courses
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                {enrolledCourses.length === 0
                  ? "Get started by enrolling in a course"
                  : `${enrolledCourses.length} course${
                      enrolledCourses.length !== 1 ? "s" : ""
                    } in progress`}
              </p>
            </div>
          </div>

          {enrolledCourses.length === 0 ? (
            <EmptyState
              title="No Enrolled Courses Yet"
              description="Start your learning journey by enrolling in a course. Browse our collection of expert-led courses to find the perfect fit for you."
              buttonText="Browse Courses"
              href="/courses"
            />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {enrolledCourses.map((course) => (
                <CourseProgressCard key={course.Course.id} data={course} />
              ))}
            </div>
          )}
        </section>

        {/* Available Courses Section */}
        <section>
          <div className="mb-6 flex items-baseline justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-2xl font-bold text-foreground">
                  Discover More Courses
                </h2>
                <Sparkles className="h-5 w-5 text-primary" />
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                {availableCourses.length === 0
                  ? "You have completed all available courses"
                  : `${availableCourses.length} course${
                      availableCourses.length !== 1 ? "s" : ""
                    } available to explore`}
              </p>
            </div>
          </div>

          {availableCourses.length === 0 ? (
            <EmptyState
              title="All Caught Up!"
              description="You are enrolled in all available courses. Check back soon for new content or explore your enrolled courses."
              buttonText="View My Courses"
              href="/dashboard"
            />
          ) : (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {availableCourses.map((course) => (
                <PublicCourseCard
                  key={course.id}
                  data={{ ...course, description: course.smallDescription }}
                />
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

export default dashboardUserPage;
