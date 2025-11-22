import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Clock, Users, Target, BookOpen, Play, Award } from "lucide-react";
import Link from "next/link";
import { UserQuizType } from "@/app/data/quiz/get-user-quizzes";
import { PublicQuizType } from "@/app/data/quiz/get-public-quizzes";
import { formatDistanceToNow } from "date-fns";

interface SingleQuizCardProps {
  quiz: UserQuizType | PublicQuizType;
}

const SingleQuizCard = ({ quiz }: SingleQuizCardProps) => {
  const latestAttempt = "userAttempts" in quiz ? quiz.userAttempts[0] : null; // already ordered by startedAt desc

  const getStatusConfig = (status: string) => {
    switch (status) {
      case "Completed":
        return {
          label: "Completed",
          className:
            "bg-green-50 text-green-700 border-green-200 dark:bg-green-950 dark:text-green-300 dark:border-green-800",
          icon: Award,
        };
      case "InProgress":
        return {
          label: "In Progress",
          className:
            "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
          icon: Play,
        };
      case "Failed":
        return {
          label: "Failed",
          className:
            "bg-red-50 text-red-700 border-red-200 dark:bg-red-950 dark:text-red-300 dark:border-red-800",
          icon: Target,
        };
      default:
        return {
          label: "Not Started",
          className:
            "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-800",
          icon: BookOpen,
        };
    }
  };

  const statusConfig = latestAttempt
    ? getStatusConfig(latestAttempt.status)
    : getStatusConfig("Not Started");

  const getDifficultyConfig = (level: string) => {
    switch (level.toLowerCase()) {
      case "easy":
        return {
          className:
            "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
          dotColor: "bg-emerald-500",
        };
      case "medium":
        return {
          className:
            "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
          dotColor: "bg-amber-500",
        };
      case "hard":
        return {
          className:
            "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800",
          dotColor: "bg-rose-500",
        };
      default:
        return {
          className:
            "bg-gray-50 text-gray-700 border-gray-200 dark:bg-gray-900 dark:text-gray-300 dark:border-gray-800",
          dotColor: "bg-gray-500",
        };
    }
  };

  const formatTimeLimit = (minutes: number | null) => {
    if (!minutes) return "No limit";
    if (minutes < 60) return `${minutes} min`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const difficultyConfig = getDifficultyConfig(quiz.level);

  return (
    <Card className="group relative overflow-hidden hover:shadow-xl transition-all duration-300 border hover:border-primary/30  from-background to-muted/20">
      {/* Decorative gradient overlay */}
      <div className="absolute inset-0   to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

      <CardHeader className="relative pb-4 space-y-3">
        {/* Top meta row */}
        <div className="flex items-center justify-between gap-3">
          <Badge
            variant="outline"
            className={`${difficultyConfig.className} border font-medium px-3 py-1`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${difficultyConfig.dotColor} mr-2`}
            />
            {quiz.level}
          </Badge>

          <div className="flex items-center gap-2">
            <Badge
              variant="outline"
              className={`${statusConfig.className} border font-medium px-3 py-1`}
            >
              <statusConfig.icon className="w-3 h-3 mr-1" />
              {statusConfig.label}
            </Badge>

            {quiz.category && (
              <Badge variant="secondary" className="font-normal px-3 py-1">
                {quiz.category}
              </Badge>
            )}
          </div>
        </div>

        {/* Title */}
        <CardTitle className="text-xl font-bold line-clamp-2 leading-tight group-hover:text-primary transition-colors">
          {quiz.title}
        </CardTitle>

        {/* Description */}
        {quiz.description && (
          <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2">
            {quiz.description}
          </p>
        )}
      </CardHeader>

      <CardContent className="relative space-y-5 pt-2">
        {/* Course/Lesson path */}
        {quiz.lesson && (
          <div className="flex items-start gap-2 p-3 rounded-lg bg-muted/50 border border-border/50">
            <BookOpen className="h-4 w-4 mt-0.5 text-primary shrink-0" />
            <div className="text-xs leading-relaxed text-muted-foreground min-w-0">
              <span className="font-medium text-foreground">
                {quiz.lesson.Chapter?.Course?.title}
              </span>
              {" • "}
              <span>{quiz.lesson.Chapter?.title}</span>
              {" • "}
              <span>{quiz.lesson.title}</span>
            </div>
          </div>
        )}

        {/* Stats grid with better visual hierarchy */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2.5 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
            <div className="p-2 rounded-md bg-background/80 border">
              <Target className="h-4 w-4 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold leading-none">
                {quiz._count.questions}
              </span>
              <span className="text-xs text-muted-foreground mt-1">
                Questions
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
            <div className="p-2 rounded-md bg-background/80 border">
              <Users className="h-4 w-4 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold leading-none">
                {"userAttempts" in quiz
                  ? quiz.userAttempts.length
                  : quiz._count.attempts}
              </span>
              <span className="text-xs text-muted-foreground mt-1">
                {"userAttempts" in quiz ? "Your Attempts" : "Attempts"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
            <div className="p-2 rounded-md bg-background/80 border">
              <Clock className="h-4 w-4 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold leading-none">
                {formatTimeLimit(quiz.timeLimit)}
              </span>
              <span className="text-xs text-muted-foreground mt-1">
                Time Limit
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2.5 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
            <div className="p-2 rounded-md bg-background/80 border">
              <Award className="h-4 w-4 text-primary" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg font-semibold leading-none">
                {latestAttempt?.score || 0}
              </span>
              <span className="text-xs text-muted-foreground mt-1">
                Best Score
              </span>
            </div>
          </div>
        </div>

        {/* Footer with timestamp and CTA */}
        <div className="pt-2 space-y-3 border-t">
          <div className="text-xs text-muted-foreground flex items-center gap-1.5">
            <div className="w-1 h-1 rounded-full bg-muted-foreground/50" />
            {latestAttempt ? (
              <>
                Last attempted{" "}
                {formatDistanceToNow(new Date(latestAttempt.startedAt), {
                  addSuffix: true,
                })}
              </>
            ) : (
              <>
                Created{" "}
                {formatDistanceToNow(new Date(quiz.createdAt), {
                  addSuffix: true,
                })}
              </>
            )}
          </div>

          <Button
            asChild
            size="lg"
            className="w-full font-semibold shadow-sm group-hover:shadow-md transition-all"
          >
            <Link href={`/dashboard/quizzes/${quiz.id}`}>
              <statusConfig.icon className="h-4 w-4 mr-2 group-hover:translate-x-0.5 transition-transform" />
              {latestAttempt?.status === "Completed"
                ? "Review Quiz"
                : latestAttempt?.status === "InProgress"
                ? "Continue Quiz"
                : "Start Quiz"}
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default SingleQuizCard;
