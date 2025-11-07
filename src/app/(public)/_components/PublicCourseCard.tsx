"use client";

import type { PublicCourseType } from "@/app/data/course/get-all-courses";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  BadgeDollarSign,
  SchoolIcon,
  TimerIcon,
  ArrowRight,
  Star,
  Users,
  Calendar,
  Play,
  BookOpen,
  Heart,
  Share2,
  ChartNoAxesColumnIncreasing,
  Award,
  Coins,
  Landmark,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Separator } from "@radix-ui/react-select";

interface iAppProps {
  data: PublicCourseType;
}

// Level color mapping for badges
const getLevelColor = (level: string) => {
  switch (level.toLowerCase()) {
    case "beginner":
      return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
    case "intermediate":
      return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
    case "advanced":
      return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
    default:
      return "bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400";
  }
};

export function PublicCourseCard({ data }: iAppProps) {
  const thumbnailUrl = data.filekey;

  return (
    <Card className="group relative h-full overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 cursor-pointer bg-card/60 backdrop-blur-sm hover:bg-card/90 hover:-translate-y-2 hover:scale-[1.02]">
      {/* Course Thumbnail with Enhanced Overlay */}
      <Link href={`/courses/${data.slug}`} className="block relative">
        <div className="relative overflow-hidden bg-muted aspect-video">
          <Image
            src={
              thumbnailUrl ||
              "/placeholder.svg?height=400&width=600&query=course"
            }
            alt={`${data.title} course thumbnail`}
            width={600}
            height={400}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
            priority={false}
          />

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          {/* Play Button Overlay */}
          <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 transform scale-75 group-hover:scale-100">
            <div className="bg-primary/90 backdrop-blur-sm rounded-full p-4 shadow-2xl hover:bg-primary transition-colors duration-300">
              <Play className="h-8 w-8 text-primary-foreground fill-current" />
            </div>
          </div>

          {/* Level Badge */}
          <div className="absolute top-4 right-4 z-10">
            <Badge
              className={cn(
                "text-sm font-semibold px-3 py-1 rounded-full border-0 shadow-lg",
                getLevelColor(data.level)
              )}
            >
              <Award className="size-4" />
              {data.level}
            </Badge>
          </div>

          {/* Price Badge */}
          <div className="absolute bottom-4 left-4 z-10">
            <Badge className="bg-primary/95 backdrop-blur-sm text-primary-foreground font-bold text-sm px-3 py-1.5 rounded-full border border-primary-foreground/20 shadow-lg">
              <Landmark className="size-4" />
              NRs.{data.price}
            </Badge>
          </div>
        </div>
      </Link>

      <CardContent className="p-6 space-y-5">
        {/* Course Title and Category */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <Link href={`/courses/${data.slug}`} className="flex-1">
              <h3 className="text-xl font-bold line-clamp-2 text-foreground group-hover:text-primary transition-colors duration-300 leading-tight">
                {data.title}
              </h3>
            </Link>
            <Badge
              variant="outline"
              className="text-xs font-medium px-2 py-1 rounded-md border-primary/30 text-primary bg-primary/5"
            >
              {data.category}
            </Badge>
          </div>
            <Separator className="my-8" />
            <h2 className="text-3xl font-semibold tracking-tight">Course Description</h2>
          <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed">
            {data.smallDescription}
          </p>
        </div>

        {/* Enhanced Course Stats */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors duration-300">
              <TimerIcon className="h-4 w-4 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Duration
              </span>
              <span className="text-sm font-bold text-foreground">
                {data.duration} hours
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-500/10 group-hover:bg-blue-500/20 transition-colors duration-300">
              <ChartNoAxesColumnIncreasing className="h-4 w-4 text-blue-500" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                Level
              </span>
              <span className="text-sm font-bold text-foreground capitalize">
                {data.level.toLowerCase()}
              </span>
            </div>
          </div>
        </div>

        {/* Course Date */}
        <div className="flex items-center gap-2 text-xs text-muted-foreground pt-2">
          <Calendar className="h-3.5 w-3.5" />
          <span>Updated {data.createdAt.toLocaleDateString()}</span>
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0 space-y-3">
        {/* Primary Action Button */}
        <Link
          href={`/courses/${data.slug}`}
          className={buttonVariants({
            variant: "default",
            className: "w-full justify-center group/btn",
          })}
        >
          <Play className="h-4 w-4 mr-2 group-hover/btn:scale-110 transition-transform" />
          Start Learning
          <ArrowRight className="h-4 w-4 ml-2 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </CardFooter>
    </Card>
  );
}

export function PublicCourseCardSkeleton() {
  return (
    <Card className="group relative h-full overflow-hidden border-0 shadow-lg bg-card/60 backdrop-blur-sm">
      {/* Thumbnail Skeleton */}
      <div className="relative overflow-hidden bg-muted aspect-video">
        <Skeleton className="w-full h-full" />

        {/* Level Badge Skeleton */}
        <div className="absolute top-4 left-4 z-10">
          <Skeleton className="h-6 w-20 rounded-full" />
        </div>

        {/* Price Badge Skeleton */}
        <div className="absolute bottom-4 left-4 z-10">
          <Skeleton className="h-7 w-24 rounded-full" />
        </div>
      </div>

      <CardContent className="p-6 space-y-5">
        {/* Course Title and Category Skeleton */}
        <div className="space-y-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex-1 space-y-2">
              <Skeleton className="h-6 w-4/5" />
              <Skeleton className="h-6 w-3/5" />
            </div>
            <Skeleton className="h-6 w-16 rounded-md" />
          </div>

          <div className="space-y-2">
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-4 w-4/5" />
            <Skeleton className="h-4 w-3/5" />
          </div>
        </div>

        {/* Enhanced Course Stats Skeleton */}
        <div className="grid grid-cols-2 gap-4 pt-4 border-t border-border/50">
          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="flex flex-col gap-1">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>

          <div className="flex items-center gap-3">
            <Skeleton className="h-10 w-10 rounded-lg" />
            <div className="flex flex-col gap-1">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="h-4 w-16" />
            </div>
          </div>
        </div>

        {/* Course Date Skeleton */}
        <div className="flex items-center gap-2 pt-2">
          <Skeleton className="h-3.5 w-3.5" />
          <Skeleton className="h-3 w-32" />
        </div>
      </CardContent>

      <CardFooter className="p-6 pt-0 space-y-3">
        {/* Primary Action Button Skeleton */}
        <Skeleton className="h-11 w-full rounded-md" />
      </CardFooter>
    </Card>
  );
}
