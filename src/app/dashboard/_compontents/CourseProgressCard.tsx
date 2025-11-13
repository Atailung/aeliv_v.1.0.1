"use client";

import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Progress } from "@/components/ui/progress";
import { BookOpen, CheckCircle2, Play, ArrowRight, Award } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { EnrolledCourseType } from "@/app/data/user/get-enrolled-courses";
import { useCourseProgress } from "@/hooks/use-course-progress";

interface iAppProps {
  data: EnrolledCourseType;
}

const getLevelColor = (level: string) => {
  switch (level.toLowerCase()) {
    case "beginner":
      return "bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300";
    case "intermediate":
      return "bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300";
    case "advanced":
      return "bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300";
    default:
      return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300";
  }
};

const getProgressBadgeColor = (percentage: number) => {
  if (percentage === 100)
    return "bg-green-100 text-green-700 dark:bg-green-950 dark:text-green-300";
  if (percentage >= 50)
    return "bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300";
  return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
};

export function CourseProgressCard({ data }: iAppProps) {
  const thumbnailUrl = data.Course.filekey;
  const { completedLessons, totalLessons, progressPercentage } =
    useCourseProgress({ courseData: data.Course });

  return (
    <Card className="group h-full overflow-hidden border border-border/40 hover:border-border/80 transition-all duration-300 shadow-sm hover:shadow-md bg-card">
      <Link
        href={`/dashboard/${data.Course.slug}`}
        className="block relative overflow-hidden aspect-video bg-muted"
      >
        <Image
          src={
            thumbnailUrl ||
            "/placeholder.svg?height=400&width=600&query=course" ||
            "/placeholder.svg"
          }
          alt={data.Course.title}
          width={600}
          height={400}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          priority={false}
        />

        <div className="absolute top-3 right-3">
          <Badge
            className={cn(
              "font-semibold px-2.5 py-1 text-xs",
              getProgressBadgeColor(progressPercentage)
            )}
          >
            {progressPercentage}%
          </Badge>
        </div>
      </Link>

      <CardContent className="p-5 space-y-4">
        <div className="space-y-2">
          <div className="flex items-start gap-2 justify-between">
            <Link
              href={`/dashboard/${data.Course.slug}`}
              className="flex-1 group/title"
            >
              <h3 className="text-lg font-bold text-foreground group-hover/title:text-primary transition-colors line-clamp-2">
                {data.Course.title}
              </h3>
            </Link>
          </div>

          <div className="flex items-center gap-2">
            <Badge variant="secondary" className="text-xs font-medium">
              {data.Course.category}
            </Badge>
            <Badge
              className={cn(
                "text-xs font-semibold",
                getLevelColor(data.Course.level)
              )}
            >
              <Award className="w-3 h-3 mr-1" />
              {data.Course.level}
            </Badge>
          </div>
        </div>

        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {data.Course.smallDescription}
        </p>

        <div className="space-y-2 pt-1">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-foreground flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-primary" />
              Progress
            </span>
            <span className="text-sm font-bold text-primary">
              {completedLessons}/{totalLessons}
            </span>
          </div>

          <Progress value={progressPercentage} className="h-2 bg-muted" />

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <span className="flex items-center gap-1">
              <BookOpen className="w-3.5 h-3.5" />
              {completedLessons} of {totalLessons} lessons
            </span>
            {progressPercentage === 100 && (
              <span className="text-green-600 dark:text-green-400 font-semibold">
                ✓ Complete
              </span>
            )}
          </div>
        </div>

        <Link
          href={`/dashboard/${data.Course.slug}`}
          className={buttonVariants({
            variant: "default",
            className: "w-full justify-center gap-2 h-10 mt-2",
          })}
        >
          <Play className="w-4 h-4 fill-current" />
          {progressPercentage === 0
            ? "Start Learning"
            : progressPercentage === 100
            ? "Review"
            : "Continue"}
          <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </CardContent>
    </Card>
  );
}

export function PublicCourseCardSkeleton() {
  return (
    <Card className="h-full overflow-hidden border border-border/40 shadow-sm bg-card">
      <div className="relative overflow-hidden aspect-video bg-muted">
        <Skeleton className="w-full h-full" />
        <div className="absolute top-3 right-3">
          <Skeleton className="h-6 w-14 rounded-full" />
        </div>
      </div>

      <CardContent className="p-5 space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-5 w-3/4" />
          <div className="flex gap-2">
            <Skeleton className="h-6 w-20 rounded-full" />
            <Skeleton className="h-6 w-24 rounded-full" />
          </div>
        </div>

        <div className="space-y-2">
          <Skeleton className="h-3 w-full" />
          <Skeleton className="h-3 w-4/5" />
        </div>

        <div className="space-y-2 pt-1">
          <div className="flex justify-between">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-4 w-12" />
          </div>
          <Skeleton className="h-2 w-full rounded-full" />
          <Skeleton className="h-3 w-32" />
        </div>

        <Skeleton className="h-10 w-full rounded-md mt-2" />
      </CardContent>
    </Card>
  );
}
