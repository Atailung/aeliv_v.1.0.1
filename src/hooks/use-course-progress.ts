"use client";

import { CourseSidebarDataType } from "@/app/data/course/get-course-sidebar-data";
import { useMemo } from "react";

interface iAppProps {
  courseData: CourseSidebarDataType["course"];
}

interface CourseProgressResult {
  completedLessons: number;
  totalLessons: number;
  progressPercentage: number;
}
export function useCourseProgress({
  courseData,
}: iAppProps): CourseProgressResult {
  return useMemo(() => {
    let completedLessons = 0;
    let totalLessons = 0;

    // Logic to calculate completedLessons and totalLessons
    courseData.chapter.forEach((chapter) => {
      chapter.Lesson.forEach((lesson) => {
        totalLessons += 1;

        // Check if the lesson is completed
        const isCompleted = lesson.lessonProgresses.some(
          (progress) => progress.lessonId === lesson.id && progress.completed
        );
        if (isCompleted) {
          completedLessons += 1;
        }
      });
    });
    const progressPercentage =
      totalLessons > 0
        ? Math.round((completedLessons / totalLessons) * 100)
        : 0;

    return { completedLessons, totalLessons, progressPercentage };
  }, [courseData]);
}
