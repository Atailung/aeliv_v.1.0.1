"use client";
import { LessonContentType } from "@/app/data/course/get-lesson-content";
import { RenderDescription } from "@/components/rich-text-editor/RenderDescription";
import { Button } from "@/components/ui/button";
import { tryCatch } from "@/hooks/try-catch";
import { useConfetti } from "@/hooks/use-confetti";
import { BookIcon, CheckCircle } from "lucide-react";
import React, { use, useTransition } from "react";
import { toast } from "sonner";
import { markLessonComplete } from "../action";
import { useConstructUrl } from "@/hooks/use-construct";

interface iAppProps {
  data: LessonContentType;
}

function CourseContent({ data }: iAppProps) {
  const [ispending, startTransition] = useTransition();
  const { triggerConfetti } = useConfetti();
  function VideoPlayer({
    thumbnailkey,
    videokey,
  }: {
    thumbnailkey: string;
    videokey: string;
  }) {
    const videoUrl = useConstructUrl(videokey);
    const thumbnailUrl = useConstructUrl(thumbnailkey);

    // FIX: return the "no video" block
    if (!videokey) {
      return (
        <div className="aspect-video bg-muted rounded-lg flex flex-col items-center justify-center">
          <BookIcon className="size-6 mx-auto mb-4 text-primary" />
          <p className="text-muted-foreground text-center">
            No video available in this lesson
          </p>
        </div>
      );
    }

    return (
      <div className="aspect-video w-full rounded-lg bg-black overflow-hidden">
        <video
          poster={thumbnailUrl}
          controls
          className="aspect-video w-full h-full object-cover rounded-lg"
        >
          <source src={videoUrl} type="video/mp4" />
          <source src={videoUrl} type="video/webm" />
          <source src={videoUrl} type="video/ogg" />
          Your browser does not support the video tag.
        </video>
      </div>
    );
  }

  function onSubmit() {
    startTransition(async () => {
      // Add null check before accessing Course.slug
      if (!data?.Chapter?.Course?.slug) {
        toast.error("Course information is missing");
        console.error("Course data structure:", data);
        return;
      }

      const { data: result, error } = await tryCatch(
        markLessonComplete(data.id, data.Chapter.Course.slug)
      );
      if (error) {
        console.error("Error marking lesson complete:", error);
        toast.error("Failed to mark lesson as complete. Please try again.");
        return;
      }
      if (result.status === "success") {
        toast.success("Lesson marked as complete!");
        triggerConfetti();
      } else if (result?.status === "error") {
        toast.error(result.message);
      }
    });
  }

  return (
    <div className="flex flex-col h-full bg-background pl-6">
      <VideoPlayer
        thumbnailkey={data.thumbnailKey || ""}
        videokey={data.videoKey || ""}
      />
      <div className="py-4 border-b">
        {data.lessonProgresses.length > 0 ? (
          <Button variant="outline" className="mt-4 mb-4 bg-green-500/10 text-green-500 hover:bg-green-500" disabled>
            <CheckCircle className="size-4 mr-2 text-green-500" />
            Completed
          </Button>
        ) : (
          <Button
            variant="outline"
            className="mt-4 mb-4"
            onClick={onSubmit}
            disabled={ispending}
          >
            <CheckCircle className="size-4 mr-2 text-green-500" />
            Mark as Complete
          </Button>
        )}
      </div>
      <div className="flex-1 overflow-y-auto pr-6 pb-6">
        <h1 className="font-bold text-3xl tracking-tight mb-4 mt-4">
          {data.title}
        </h1>
        {data.description && (
          <RenderDescription json={JSON.parse(data.description)} />
        )}
      </div>
    </div>
  );
}

export default CourseContent;
