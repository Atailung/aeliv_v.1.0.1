"use client";
import React from "react";
import { CourseSidebarDataType } from "@/app/data/course/get-course-sidebar-data";
import { Button } from "@/components/ui/button";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Progress } from "@/components/ui/progress";
import { ChevronDown, Play } from "lucide-react";
import LessonItem from "./LessonItem";
import { usePathname } from "next/navigation";
import { useCourseProgress } from "@/hooks/use-course-progress";

interface iAppProps {
  course: CourseSidebarDataType["course"];
}

export default function CourseSideBar({ course }: iAppProps) {
  const pathname = usePathname();

  const currentLessonId = pathname.split("/").pop();

  const { completedLessons, totalLessons, progressPercentage } = useCourseProgress({ courseData: course });

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="pb-4 pr-4 border-b border-border">
        <div className="flex items-center gap-3 mb-3">
          <div className="size-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
            <Play className="size-5 text-primary" />
          </div>

          <div className="flex-1 min-w-0">
            <h1 className="font-semibold text-base leading-tight truncate">
              {course.title}
            </h1>
            <p className="text-xs mt-1 text-muted-foreground truncate">
              {course.category}
            </p>
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{completedLessons}/{totalLessons} lessons</span>
          </div>
          <Progress value={progressPercentage} className="h-1.5" />
          <p className="text-xs text-muted-foreground">{progressPercentage}% completed</p>
        </div>
      </div>

      {/* Collapsible Chapters */}
      <div className="py-4 pr-4 space-y-3">
        {course.chapter.map((chapter, index) => (
          <Collapsible key={chapter.id} defaultOpen={index === 0}>
            <CollapsibleTrigger asChild>
              <Button
                variant="outline"
                className="w-full p-3 h-auto flex items-center gap-2 justify-between"
              >
                <div className="flex items-center gap-2">
                  <ChevronDown className="size-4 text-primary transition-transform data-[state=open]:rotate-180" />
                  <p className="font-semibold text-sm truncate text-foreground">
                    {chapter.position}: {chapter.title}
                  </p>
                </div>
                <span className="text-[10px] text-muted-foreground font-medium truncate">
                  {chapter.Lesson.length} lessons
                </span>
              </Button>
            </CollapsibleTrigger>

            <CollapsibleContent>
              <div className="pl-6 pt-2 space-y-1">
                {chapter.Lesson.map((lesson) => (
                  <LessonItem
                    key={lesson.id}
                    lesson={lesson}
                    slug={course.slug}
                    isActive={currentLessonId === lesson.id}
                    completed={
                      lesson.lessonProgresses.find(
                        (progress) =>
                          progress.lessonId === lesson.id && progress.completed
                      ) !== undefined
                    }
                  />
                ))}
              </div>
            </CollapsibleContent>
          </Collapsible>
        ))}
      </div>
    </div>
  );
}
