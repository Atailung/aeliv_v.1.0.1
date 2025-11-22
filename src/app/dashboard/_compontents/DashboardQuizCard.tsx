"use client";

import { getUserQuizzes, UserQuizType } from "@/app/data/quiz/get-user-quizzes";
import SingalQuizCard from "../quizzes/_components/SingalQuizCard";
import React, { useEffect, useState } from "react";
import { toast } from "sonner";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";

const DashboardQuizCard = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [quizzes, setQuizzes] = useState<UserQuizType[]>([]);

  useEffect(() => {
    const fetchQuizzes = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getUserQuizzes();
        setQuizzes(data || []);
      } catch (error) {
        console.error("Failed to fetch quizzes:", error);git
        setError("Failed to load quizzes. Please try again.");
        toast.error("Failed to fetch quizzes");
      } finally {
        setLoading(false);
      }
    };
    fetchQuizzes();
  }, []);

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {Array.from({ length: 6 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <Skeleton className="h-6 w-16" />
                <Skeleton className="h-6 w-20" />
              </div>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full" />
              <div className="grid grid-cols-2 gap-3">
                {Array.from({ length: 4 }).map((_, j) => (
                  <div
                    key={j}
                    className="flex items-center gap-3 p-3 rounded-lg bg-muted/30"
                  >
                    <Skeleton className="h-8 w-8 rounded-md" />
                    <div className="space-y-1">
                      <Skeleton className="h-4 w-8" />
                      <Skeleton className="h-3 w-12" />
                    </div>
                  </div>
                ))}
              </div>
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <Card className="border-destructive/50 bg-destructive/5">
        <CardContent className="flex items-center justify-center py-12">
          <div className="text-center space-y-3">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto" />
            <div>
              <h3 className="font-semibold text-destructive">
                Error Loading Quizzes
              </h3>
              <p className="text-sm text-muted-foreground mt-1">{error}</p>
            </div>
            <button
              onClick={() => window.location.reload()}
              className="text-sm text-primary hover:underline"
            >
              Try again
            </button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (quizzes.length === 0) {
    return (
      <Card className="border-dashed">
        <CardContent className="flex items-center justify-center py-16">
          <div className="text-center space-y-3">
            <BookOpen className="h-12 w-12 text-muted-foreground mx-auto" />
            <div>
              <h3 className="font-semibold">No Quizzes Available</h3>
              <p className="text-sm text-muted-foreground mt-1">
                You haven&apos;t been assigned any quizzes yet.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Your Quizzes</h2>
          <p className="text-muted-foreground">
            Complete your assigned quizzes and track your progress
          </p>
        </div>
        <Badge variant="outline" className="text-sm text-muted-foreground">
          {quizzes.length} quiz{quizzes.length !== 1 ? "es" : ""}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {quizzes.map((quiz) => (
          <SingalQuizCard key={quiz.id} quiz={quiz} />
        ))}
      </div>
    </div>
  );
};

export default DashboardQuizCard;
