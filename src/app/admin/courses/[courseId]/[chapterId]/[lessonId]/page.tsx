import { adminGetLesson } from "@/app/data/admin/admin-get-lesson";
import React from "react";
import { LessonForm } from "./_components/LessonForm";


type Params = Promise<{
  courseId: string;
  chapterId: string;
  lessonId: string;
}>;

async function LessonIdPage({ params }: { params: Params }) {
  const { courseId, chapterId, lessonId } = await params;

  console.log("Lesson page params:", { courseId, chapterId, lessonId });

  const lesson = await adminGetLesson(lessonId);

  console.log("Lesson data:", lesson);

  return (
    <div>
     <LessonForm data={lesson} chapterId={chapterId} courseId={courseId} />
    </div>
  );
}

export default LessonIdPage;


