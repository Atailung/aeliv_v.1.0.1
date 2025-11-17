"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { CheckCircle2, Circle, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";

type Question = {
  id: string;
  text: string;
  imageUrl: string | null;
  points: number;
  order: number;
  options: {
    id: string;
    text: string;
    isCorrect: boolean;
  }[];
};

type Answer = {
  selectedOptionId?: string;
  selectedOptionIds?: string[];
};

interface QuizSidebarProps {
  questions: Question[];
  currentQuestionIndex: number;
  answers: Record<string, Answer>;
  onQuestionNavigate: (index: number) => void;
  totalPoints: number | null;
  answeredCount: number;
  totalQuestions: number;
}

export default function QuizSidebar({
  questions,
  currentQuestionIndex,
  answers,
  onQuestionNavigate,
  totalPoints,
  answeredCount,
  totalQuestions,
}: QuizSidebarProps) {
  const calculatedTotalPoints =
    totalPoints || questions.reduce((sum, q) => sum + q.points, 0);

  return (
    <div className="sticky top-6 space-y-4">
      {/* Progress Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Trophy className="h-4 w-4" />
            Quiz Overview
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">Answered</span>
              <Badge variant="secondary" className="font-bold">
                {answeredCount}/{totalQuestions}
              </Badge>
            </div>
            <Separator />
            <div className="flex justify-between items-center">
              <span className="text-sm text-muted-foreground">
                Total Points
              </span>
              <span className="font-bold">{calculatedTotalPoints}</span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Questions Navigation */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Questions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-5 gap-2">
            {questions.map((question, index) => {
              const isAnswered = !!answers[question.id];
              const isCurrent = index === currentQuestionIndex;

              return (
                <button
                  key={question.id}
                  onClick={() => onQuestionNavigate(index)}
                  className={cn(
                    "relative aspect-square rounded-lg font-bold text-sm transition-all",
                    "hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2",
                    isCurrent
                      ? "bg-primary text-primary-foreground shadow-md ring-2 ring-primary ring-offset-2"
                      : isAnswered
                      ? "bg-green-500/10 text-green-600 border-2 border-green-500/50"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  )}
                  aria-label={`Question ${index + 1}${
                    isAnswered ? " (answered)" : ""
                  }${isCurrent ? " (current)" : ""}`}
                >
                  {index + 1}
                  {isAnswered && !isCurrent && (
                    <CheckCircle2 className="absolute -top-1 -right-1 h-4 w-4 text-green-600" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Legend */}
          <div className="mt-4 pt-4 border-t space-y-2 text-xs">
            <div className="flex items-center gap-2">
              <div className="size-4 rounded bg-primary" />
              <span className="text-muted-foreground">Current Question</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-4 rounded bg-green-500/10 border-2 border-green-500/50" />
              <span className="text-muted-foreground">Answered</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="size-4 rounded bg-muted" />
              <span className="text-muted-foreground">Not Answered</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
