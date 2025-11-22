"use client";
import React, { useEffect, useState, useMemo } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { ArrowUpDown, AlertCircle } from "lucide-react";
import { getUserQuizzes, UserQuizType } from "@/app/data/quiz/get-user-quizzes";
import SingalQuizCard from "./SingalQuizCard";
import EmptyState from "@/components/general/EmptyState";

type SortOption =
  | "newest"
  | "oldest"
  | "title-asc"
  | "title-desc"
  | "difficulty"
  | "attempts";

const CurrentQuizzes = () => {
  const [quizzes, setQuizzes] = useState<UserQuizType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sortBy, setSortBy] = useState<SortOption>("newest");

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getUserQuizzes();
        setQuizzes(data || []);
      } catch (err) {
        console.error("Failed to fetch quizzes:", err);
        setError("Failed to load quizzes. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  const sortedQuizzes = useMemo(() => {
    const sorted = [...quizzes];

    switch (sortBy) {
      case "newest":
        return sorted.sort(
          (a, b) =>
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      case "oldest":
        return sorted.sort(
          (a, b) =>
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
        );
      case "title-asc":
        return sorted.sort((a, b) => a.title.localeCompare(b.title));
      case "title-desc":
        return sorted.sort((a, b) => b.title.localeCompare(a.title));
      case "difficulty":
        const difficultyOrder = { easy: 1, medium: 2, hard: 3 };
        return sorted.sort(
          (a, b) =>
            (difficultyOrder[
              a.level.toLowerCase() as keyof typeof difficultyOrder
            ] || 0) -
            (difficultyOrder[
              b.level.toLowerCase() as keyof typeof difficultyOrder
            ] || 0)
        );
      case "attempts":
        return sorted.sort((a, b) => b._count.attempts - a._count.attempts);
      default:
        return sorted;
    }
  }, [quizzes, sortBy]);

  const getSortLabel = (sort: SortOption) => {
    switch (sort) {
      case "newest":
        return "Newest First";
      case "oldest":
        return "Oldest First";
      case "title-asc":
        return "Title A-Z";
      case "title-desc":
        return "Title Z-A";
      case "difficulty":
        return "Difficulty";
      case "attempts":
        return "Most Popular";
      default:
        return "Newest First";
    }
  };

  const sortOptions: SortOption[] = [
    "newest",
    "oldest",
    "title-asc",
    "title-desc",
    "difficulty",
    "attempts",
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header Skeleton */}
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <Skeleton className="h-8 w-48" />
            <Skeleton className="h-4 w-64" />
          </div>
          <Skeleton className="h-10 w-32" />
        </div>

        {/* Quiz Cards Skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="overflow-hidden">
              <CardHeader className="pb-3">
                <Skeleton className="h-6 w-3/4" />
                <Skeleton className="h-4 w-1/2" />
              </CardHeader>
              <CardContent className="space-y-4">
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-2/3" />
                <div className="grid grid-cols-2 gap-3">
                  <Skeleton className="h-8 w-full" />
                  <Skeleton className="h-8 w-full" />
                </div>
                <Skeleton className="h-10 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive/50">
        <CardContent className="flex flex-col items-center justify-center py-12">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <h3 className="text-lg font-semibold mb-2">Error Loading Quizzes</h3>
          <p className="text-muted-foreground text-center mb-4">{error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Try Again
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-1">
          <h2 className="text-2xl font-bold tracking-tight">Your Quizzes</h2>
          <p className="text-muted-foreground">
            Review your quiz history, progress, and recent activity
          </p>
        </div>

        {/* Sort Dropdown */}
        <div className="flex items-center gap-2">
          <span className="text-sm text-muted-foreground">Sort by:</span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowUpDown className="h-4 w-4" />
                {getSortLabel(sortBy)}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {sortOptions.map((option) => (
                <DropdownMenuCheckboxItem
                  key={option}
                  checked={sortBy === option}
                  onCheckedChange={() => setSortBy(option)}
                  className="cursor-pointer"
                >
                  {getSortLabel(option)}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {/* Quiz Grid */}
      {sortedQuizzes.length === 0 ? (
        <EmptyState
          title="have'n sloved Quizzes Yet"
          description=" Start practicing by attempting quizzes. Sharpen your skills and track your progress along the way."
          buttonText="Browse quizzes"
          href="/quizzes"
        />
      ) : (
        <div className="grid space-y-6 gap-6">
          {sortedQuizzes.map((quiz) => (
            <SingalQuizCard key={quiz.id} quiz={quiz} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CurrentQuizzes;
