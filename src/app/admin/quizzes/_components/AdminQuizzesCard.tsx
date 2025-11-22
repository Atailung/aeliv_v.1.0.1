"use client";

import { AdminQuizzesType } from "@/app/data/admin/admin-get-quizzes";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Brain,
  Clock,
  Eye,
  ListChecks,
  MoreVertical,
  Pencil,
  Trash2,
  BookOpen,
  Target,
  Users,
  FileQuestion,
} from "lucide-react";
import Link from "next/link";
import { useConstructUrl as constructUrl } from "@/hooks/use-construct";

interface AdminQuizzesCardProps {
  data: AdminQuizzesType;
}

export function AdminQuizzesCard({ data }: AdminQuizzesCardProps) {
  const imageUrl = data.imageUrl ? constructUrl(data.imageUrl) : null;
  const level = data.level || "Uncategorized";
  const category = data.category;
  const completedAttempts = data._count.attempts || 0;
  const totalQuestions = data._count.questions || 0;

  return (
    <Card className="group relative overflow-hidden border border-border/40 shadow-sm hover:shadow-lg transition-all duration-300 from-card to-card/95 hover:border-primary/30">
      {/* Action Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-3 right-3 z-10 h-8 w-8 rounded-lg bg-background/70 backdrop-blur-md border border-border/50 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-background hover:border-primary/40 hover:scale-110 shadow-md"
          >
            <MoreVertical className="h-4 w-4" />
            <span className="sr-only">Quiz menu</span>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          className="w-48 rounded-lg border border-border/60 bg-popover/95 shadow-lg backdrop-blur-md"
        >
          <DropdownMenuItem asChild className="cursor-pointer group/item">
            <Link
              href={`/admin/quizzes/${data.id}/edit`}
              className="flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors hover:bg-accent/50 focus:bg-accent/50"
            >
              <Pencil className="h-4 w-4 text-muted-foreground group-hover/item:text-primary transition-colors" />
              <span className="font-medium">Edit Quiz</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild className="cursor-pointer group/item">
            <Link
              href={`/admin/quizzes/${data.id}/questions`}
              className="flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors hover:bg-accent/50 focus:bg-accent/50"
            >
              <ListChecks className="h-4 w-4 text-muted-foreground group-hover/item:text-blue-500 transition-colors" />
              <span className="font-medium">Manage Questions</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuItem asChild className="cursor-pointer group/item">
            <Link
              href={`/dashboard/quizzes/${data.id}`}
              className="flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors hover:bg-accent/50 focus:bg-accent/50"
            >
              <Eye className="h-4 w-4 text-muted-foreground group-hover/item:text-blue-500 transition-colors" />
              <span className="font-medium">Preview Quiz</span>
            </Link>
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem asChild className="cursor-pointer group/item">
            <Link
              href={`/admin/quizzes/${data.id}/delete`}
              className="flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-colors hover:bg-destructive/10 focus:bg-destructive/10"
            >
              <Trash2 className="h-4 w-4 text-destructive" />
              <span className="font-medium text-destructive">Delete Quiz</span>
            </Link>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Quiz Header */}
      <CardHeader className="pb-4 pt-6">
        <div className="flex items-start gap-3">
          {!imageUrl && (
            <div className="p-3 rounded-xl  from-primary/15 to-primary/5 border border-primary/25 shadow-sm shrink-0">
              <Brain className="h-6 w-6 text-primary" />
            </div>
          )}
          <div className="flex-1 min-w-0">
            {/* Category Badge */}
            <div className="flex items-center gap-2 mb-3">
              {level === "EASY" ? (
                <>
                  {" "}
                  <Badge variant={"default"} className="bg-green-500">
                    {" "}
                    <BookOpen className="size-4 mr-1.5" />
                    Easy
                  </Badge>
                </>
              ) : level === "MEDIUM" ? (
                <>
                  {" "}
                  <Badge variant={"default"} className="bg-yellow-500">
                    {" "}
                    <BookOpen className="size-4 mr-1.5" />
                    Medium
                  </Badge>
                </>
              ) : level === "HARD" ? (
                <>
                  {" "}
                  <Badge variant={"default"} className="bg-red-500">
                    {" "}
                    <BookOpen className="size-4 mr-1.5" />
                    Hard
                  </Badge>
                </>
              ) : (
                "Uncategorized"
              )}
              <Badge variant={"default"} className="bg-blue-500">
                {" "}
                <BookOpen className="size-4 mr-1.5" />
                {category}
              </Badge>
            </div>

            <Link
              href={`/admin/quizzes/${data.id}/edit`}
              className="block text-base font-bold text-foreground hover:text-primary transition-colors duration-200 line-clamp-2 leading-snug"
            >
              {data.title}
            </Link>
            {data.description && (
              <p className="text-xs text-muted-foreground line-clamp-2 mt-2 leading-relaxed">
                {data.description}
              </p>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-4 pb-5">
        <div className="grid grid-cols-2 gap-2.5">
          {/* Questions Count */}
          <div className="flex items-center gap-2.5 px-3 py-3 rounded-lg bg-blue-50 dark:bg-blue-950/20 border border-blue-200/60 dark:border-blue-800/40 hover:border-blue-300 dark:hover:border-blue-700/60 transition-colors">
            <div className="p-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30">
              <FileQuestion className="h-4 w-4 text-blue-600 dark:text-blue-400 shrink-0" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs text-blue-700 dark:text-blue-300 font-semibold">
                Questions
              </span>
              <span className="text-sm font-bold text-blue-900 dark:text-blue-100">
                {totalQuestions}
              </span>
            </div>
          </div>

          {/* Time Limit */}
          <div className="flex items-center gap-2.5 px-3 py-3 rounded-lg bg-amber-50 dark:bg-amber-950/20 border border-amber-200/60 dark:border-amber-800/40 hover:border-amber-300 dark:hover:border-amber-700/60 transition-colors">
            <div className="p-1.5 rounded-lg bg-amber-100 dark:bg-amber-900/30">
              <Clock className="h-4 w-4 text-amber-600 dark:text-amber-400 shrink-0" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs text-amber-700 dark:text-amber-300 font-semibold">
                Time Limit
              </span>
              <span className="text-sm font-bold text-amber-900 dark:text-amber-100">
                {data.timeLimit ? `${data.timeLimit}m` : "No limit"}
              </span>
            </div>
          </div>

          {/* Total Points */}
          <div className="flex items-center gap-2.5 px-3 py-3 rounded-lg bg-emerald-50 dark:bg-emerald-950/20 border border-emerald-200/60 dark:border-emerald-800/40 hover:border-emerald-300 dark:hover:border-emerald-700/60 transition-colors">
            <div className="p-1.5 rounded-lg bg-emerald-100 dark:bg-emerald-900/30">
              <Target className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs text-emerald-700 dark:text-emerald-300 font-semibold">
                Points
              </span>
              <span className="text-sm font-bold text-emerald-900 dark:text-emerald-100">
                {data.totalPoints || 0}
              </span>
            </div>
          </div>

          {/* User Attempts */}
          <div className="flex items-center gap-2.5 px-3 py-3 rounded-lg bg-violet-50 dark:bg-violet-950/20 border border-violet-200/60 dark:border-violet-800/40 hover:border-violet-300 dark:hover:border-violet-700/60 transition-colors">
            <div className="p-1.5 rounded-lg bg-violet-100 dark:bg-violet-900/30">
              <Users className="h-4 w-4 text-violet-600 dark:text-violet-400 shrink-0" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-xs text-violet-700 dark:text-violet-300 font-semibold">
                Attempts
              </span>
              <span className="text-sm font-bold text-violet-900 dark:text-violet-100">
                {completedAttempts}
              </span>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-border/30" />

        <div className="flex gap-2">
          <Link
            href={`/admin/quizzes/${data.id}/edit`}
            className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-semibold rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 active:scale-95 transition-all duration-150 shadow-sm hover:shadow-md"
          >
            <Pencil className="h-3.5 w-3.5" />
            Edit Quiz
          </Link>
          <Link
            href={`/admin/quizzes/${data.id}/questions`}
            className="flex-1 inline-flex items-center justify-center gap-2 px-3 py-2.5 text-xs font-semibold rounded-lg border border-border bg-background hover:bg-muted active:scale-95 transition-all duration-150"
          >
            <ListChecks className="h-3.5 w-3.5" />
            Questions
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}

export function AdminQuizzesCardSkeleton() {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="pb-3">
        <div className="flex items-start gap-3">
          <Skeleton className="h-12 w-12 rounded-xl" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-5 w-3/4" />
            <Skeleton className="h-4 w-full" />
            <Skeleton className="h-3 w-1/2" />
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-2.5">
          <Skeleton className="h-16 rounded-lg" />
          <Skeleton className="h-16 rounded-lg" />
          <Skeleton className="h-16 rounded-lg" />
          <Skeleton className="h-16 rounded-lg" />
        </div>
        <Skeleton className="h-px w-full" />
        <div className="flex gap-2">
          <Skeleton className="h-9 flex-1" />
          <Skeleton className="h-9 flex-1" />
        </div>
      </CardContent>
    </Card>
  );
}
