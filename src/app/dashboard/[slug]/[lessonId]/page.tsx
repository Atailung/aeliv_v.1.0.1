import { getLessonContent } from "@/app/data/course/get-lesson-content";
import React, { Suspense } from "react";
import CourseContent from "./_components/CourseContent";
import { LessonSkeleton } from "./_components/LessonSkeleton";

type Params = Promise<{ lessonId: string }>;

async function LessonContentPage({ params }: { params: Params }) {
  const { lessonId } = await params;
  return (
    <Suspense fallback={<LessonSkeleton />}>
      <LessonContentLoader lessonId={lessonId} />
    </Suspense>
  );
}

export default LessonContentPage;

async function LessonContentLoader({ lessonId }: { lessonId: string }) {
  const data = await getLessonContent(lessonId);
  return <CourseContent data={data} />;
}
