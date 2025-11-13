import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Check, Play } from "lucide-react";
import Link from "next/link";
import React from "react";

interface iAppProps {
  lesson: {
    id: string;
    title: string;
    position: number;
    description: string | null;
  };
  slug: string;
  isActive?: boolean;
  completed?: boolean;
}

export default function LessonItem({ lesson, slug, isActive, completed  }: iAppProps) {
  const baseClasses = cn(
    "w-full p-3 h-auto justify-start group transition-all duration-200 hover:scale-[1.01] border",
    completed
      ? "bg-green-50/80 dark:bg-green-950/30 border-green-200/60 dark:border-green-800/40 hover:bg-green-100/90 dark:hover:bg-green-950/50 hover:border-green-300/80 dark:hover:border-green-700/60 shadow-sm"
      : "border-border/50 hover:border-primary/30 hover:bg-accent/50",
    isActive &&
      !completed &&
      "bg-primary/10 dark:bg-primary/20 hover:bg-primary/20 dark:hover:bg-primary/30 border-primary/50 hover:border-primary/20 text-primary-foreground"
  );

  return (
    <Link
      href={`/dashboard/${slug}/${lesson.id}`}
      className={buttonVariants({
        variant: completed ? "secondary" : "ghost",
        className: baseClasses,
      })}
    >
      <div className="flex items-start gap-3 w-full min-w-0">
        {/* Lesson Status Icon */}
        <div className="shrink-0 mt-0.5">
          {completed ? (
            <div className="size-6 rounded-full bg-linear-to-br from-green-500 to-green-600 dark:from-green-600 dark:to-green-700 flex items-center justify-center shadow-sm ring-2 ring-green-100 dark:ring-green-900/50">
              <Check className="size-3.5 text-white stroke-[2.5]" />
            </div>
          ) : (
            <div className="size-6 rounded-full border-2 border-primary/60 bg-background flex items-center justify-center group-hover:border-primary group-hover:bg-primary/5 transition-colors">
              <Play className="size-3 fill-primary/80 text-primary/80 ml-0.5" />
            </div>
          )}
        </div>

        {/* Lesson Info */}
        <div className="flex-1 min-w-0 space-y-1">
          {isActive && !completed && (
            <p className="text-[10px] font-medium text-primary/80">
              Currently Watching
            </p>
          )}
          <div
            className={cn(
              "text-sm font-medium leading-tight truncate transition-colors",
              completed
                ? "text-green-900 dark:text-green-100"
                : "text-foreground group-hover:text-primary"
            )}
          >
            <span className="text-muted-foreground/80 font-normal mr-1.5">
              {lesson.position}.
            </span>
            {lesson.title}
          </div>
        </div>

        {/* Completion Badge */}
        {completed && (
          <span className="shrink-0 self-start inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-medium bg-green-500/10 text-green-700 dark:text-green-300 border border-green-500/20">
            Done
          </span>
        )}
      </div>
    </Link>
  );
}
