"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import {
  CheckCircle,
  XCircle,
  Clock,
  BookOpen,
  RotateCcw,
  Home,
  Share2,
  TrendingUp,
  Trophy,
} from "lucide-react";
import Link from "next/link";
import type { QuizAttemptResultsType } from "@/app/data/quiz/get-quiz-attempt-results";
import { formatDistanceToNow } from "date-fns";
import { useEffect, useState } from "react";
import { useConfetti } from "@/hooks/use-confetti";
import { CopyButton } from "@/components/ui/copybutton";

interface QuizResultsProps {
  data: QuizAttemptResultsType;
}

export default function QuizResults({ data }: QuizResultsProps) {
  const { quiz, attempt, statistics, detailedResults } = data;
  const { triggerConfetti } = useConfetti();
  const [showConfetti, setShowConfetti] = useState(false);
  const copyAttemptId = quiz.id;

  const percentage = (statistics.totalScore / statistics.maxScore) * 100;

  useEffect(() => {
    if (percentage >= 80) {
      setShowConfetti(true);
      triggerConfetti();
      const timer = setTimeout(() => setShowConfetti(false), 3000);
      return () => clearTimeout(timer);
    }
  }, [percentage, triggerConfetti]);

  const getPerformanceLevel = (score: number) => {
    const pct = (score / statistics.maxScore) * 100;
    if (pct >= 90) return { level: "Exceptional", className: "text-accent" };
    if (pct >= 80) return { level: "Excellent", className: "text-accent" };
    if (pct >= 70) return { level: "Good", className: "text-primary" };
    if (pct >= 60)
      return { level: "Satisfactory", className: "text-foreground" };
    return { level: "Needs Improvement", className: "text-destructive" };
  };

  const performance = getPerformanceLevel(statistics.totalScore);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="min-h-screen bg-background">
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden">
            {Array.from({ length: 40 }).map((_, i) => (
              <div
                key={i}
                className="absolute animate-bounce"
                style={{
                  left: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 2}s`,
                  animationDuration: `${2 + Math.random() * 2}s`,
                }}
              >
                <div
                  className="w-2 h-2 rounded-full bg-accent"
                  style={{
                    opacity: Math.random() * 0.7 + 0.3,
                  }}
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto p-6 md:p-8 space-y-8">
        <div className="text-center space-y-6 pt-6 md:pt-12">
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <div className="inline-flex items-center justify-center w-20 h-20 bg-accent rounded-full shadow-lg">
                <Trophy className="h-10 w-10 text-accent-foreground" />
              </div>
            </div>
            <div className="space-y-2">
              <h1 className="text-4xl md:text-5xl font-bold tracking-tight">
                Quiz Complete!
              </h1>
              <p className="text-lg text-muted-foreground line-clamp-2 truncate">
                {quiz.title}
              </p>
            </div>
          </div>

          <div className="bg-card rounded-2xl p-8 md:p-12 shadow-sm border border-border">
            <div className="space-y-6">
              <div className="flex items-baseline justify-center gap-2">
                <span className="text-6xl md:text-7xl font-bold text-accent">
                  {statistics.totalScore}
                </span>
                <span className="text-2xl text-muted-foreground font-semibold">
                  / {statistics.maxScore}
                </span>
              </div>

              <div className="flex items-center justify-center gap-3">
                <Badge variant="secondary" className="text-base px-4 py-1.5">
                  {performance.level}
                </Badge>
                <span className="text-lg font-semibold text-foreground">
                  {Math.round(percentage)}%
                </span>
              </div>

              <div className="w-full max-w-xs mx-auto">
                <Progress value={percentage} className="h-2" />
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="bg-card border border-border hover:shadow-md transition-shadow  p-6">
            <CardContent className="text-center justify-center p-6">
              <div className="space-y-3">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                  <CheckCircle className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-bold text-foreground">
                    {statistics.correctAnswers}
                  </div>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Correct
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border border-border hover:shadow-md transition-shadow text-center justify-center p-6">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-destructive/10 rounded-lg">
                  <XCircle className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-bold text-foreground">
                    {statistics.incorrectAnswers}
                  </div>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Incorrect
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border border-border hover:shadow-md transition-shadow text-center justify-center p-6">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                  <BookOpen className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-bold text-foreground">
                    {quiz.totalQuestions}
                  </div>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Questions
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border border-border hover:shadow-md transition-shadow text-center justify-center p-6">
            <CardContent className="p-6">
              <div className="space-y-3">
                <div className="inline-flex items-center justify-center w-10 h-10 bg-primary/10 rounded-lg">
                  <Clock className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <div className="text-2xl md:text-3xl font-bold text-foreground">
                    {attempt.timeTaken ? formatTime(attempt.timeTaken) : "—"}
                  </div>
                  <p className="text-xs md:text-sm text-muted-foreground">
                    Time Taken
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader className="border-b border-border">
            <CardTitle className="flex items-center gap-2 text-lg">
              <TrendingUp className="h-5 w-5" />
              Answer Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="divide-y divide-border p-0">
            {detailedResults.correct.length > 0 && (
              <div className="space-y-2 p-6">
                <h3 className="font-semibold text-primary flex items-center gap-2 mb-4">
                  <CheckCircle className="h-4 w-4" />
                  Correct Answers
                </h3>
                <div className="space-y-3">
                  {detailedResults.correct.map((answer) => (
                    <div key={answer.id} className="space-y-2">
                      <p className="text-sm md:text-base font-medium text-foreground">
                        {answer.question?.text}
                      </p>
                      <div className="flex items-center gap-2 text-sm">
                        <Badge
                          variant="outline"
                          className="bg-primary/5 text-primary border-primary/20"
                        >
                          {
                            answer.question?.options.find(
                              (opt: {
                                id: string;
                                text: string;
                                isCorrect: boolean;
                              }) => opt.id === answer.selectedId
                            )?.text
                          }
                        </Badge>
                        <Badge
                          variant="outline"
                          className="text-muted-foreground "
                        >
                          +{answer.question?.points} points
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {detailedResults.incorrect.length > 0 && (
              <div className="space-y-2 p-6">
                <h3 className="font-semibold text-destructive flex items-center gap-2 mb-4">
                  <XCircle className="h-4 w-4" />
                  Incorrect Answers
                </h3>
                <div className="space-y-4">
                  {detailedResults.incorrect.map((answer) => (
                    <div key={answer.id} className="space-y-2">
                      <p className="text-sm md:text-base font-medium text-foreground">
                        {answer.question?.text}
                      </p>
                      <div className="space-y-2 text-sm">
                        <div className="flex flex-col gap-1">
                          <span className="text-muted-foreground">
                            Your answer:
                          </span>
                          <Badge
                            variant="outline"
                            className="w-fit bg-destructive/5 text-destructive border-destructive/20"
                          >
                            {answer.question?.options.find(
                              (opt: {
                                id: string;
                                text: string;
                                isCorrect: boolean;
                              }) => opt.id === answer.selectedId
                            )?.text || "Not answered"}
                          </Badge>
                        </div>
                        <div className="flex flex-col gap-1">
                          <span className="text-muted-foreground">
                            Correct answer:
                          </span>
                          <Badge
                            variant="outline"
                            className="w-fit bg-primary/5 text-primary border-primary/20"
                          >
                            {
                              answer.question?.options.find(
                                (opt: {
                                  id: string;
                                  text: string;
                                  isCorrect: boolean;
                                }) => opt.isCorrect
                              )?.text
                            }
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="border-b border-border">
            <CardTitle className="text-lg">Attempt Details</CardTitle>
          </CardHeader>
          <CardContent className="grid grid-cols-2 gap-6 pt-6">
            <div className="flex items-center gap-2 text-center">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                Started:
              </p>
              <p className="text-sm text-foreground mb-2">
                {formatDistanceToNow(new Date(attempt.startedAt), {
                  addSuffix: true,
                })}
              </p>
            </div>
            {attempt.endedAt && (
              <div className="flex items-center gap-2 text-center">
                <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                  Completed:
                </p>
                <p className="text-sm text-foreground mb-2 uppercase-first-letter tracking-wide">
                  {formatDistanceToNow(new Date(attempt.endedAt), {
                    addSuffix: true,
                  })}
                </p>
              </div>
            )}
            <div className="flex items-center gap-2 text-center">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                Status
              </p>
              <Badge className="bg-green-500 mb-2">{attempt.status}</Badge>
            </div>
            <div className="flex items-center gap-2 text-center">
              <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-1">
                Attempt ID:
              </p>
              <code className="text-xs bg-muted px-2 py-1 rounded font-mono text-foreground mb-2">
                {attempt.id.substring(0, 8)}...
              </code>
              <CopyButton
                size="sm"
                variant="outline"
                className="mb-2"
                content={copyAttemptId}
              />
            </div>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-3 justify-center pb-8">
          <Button asChild size="lg" className="shadow-sm hover:shadow-md">
            <Link href={`/dashboard/quizzes/${quiz.id}`}>
              <RotateCcw className="h-4 w-4 mr-2" />
              Retake Quiz
            </Link>
          </Button>
          <Button variant="outline" asChild size="lg">
            <Link href="/dashboard/quizzes">
              <Home className="h-4 w-4 mr-2" />
              Back to Quizzes
            </Link>
          </Button>
          <Button variant="outline" size="lg">
            <Share2 className="h-4 w-4 mr-2" />
            Share Results
          </Button>
        </div>
      </div>
    </div>
  );
}
