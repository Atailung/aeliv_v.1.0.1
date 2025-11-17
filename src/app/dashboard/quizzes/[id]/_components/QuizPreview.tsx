"use client";

import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Clock,
  Trophy,
  BookOpen,
  Play,
  BarChart3,
  CheckCircle2,
  XCircle,
  Timer,
} from "lucide-react";
import type { UserQuizDataType } from "@/app/data/quiz/get-user-quiz-data";
import RenderQuiz from "./RenderQuiz";
import Image from "next/image";

interface QuizPreviewProps {
  data: UserQuizDataType;
}

export default function QuizPreview({ data }: QuizPreviewProps) {
  const { quiz, userProgress } = data;
  const [hasStarted, setHasStarted] = useState(false);

  // Check if there's an ongoing attempt
  const ongoingAttempt = userProgress.currentAttempt?.endedAt === null;

  if (hasStarted || ongoingAttempt) {
    return <RenderQuiz quiz={quiz} userProgress={userProgress} />;
  }

  const { statistics } = userProgress;
  const hasAttempts = statistics.totalAttempts > 0;

  return (
    <div className="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Quiz Header */}
          <Card>
            <CardHeader>
              {quiz.imageUrl && (
                <div className="relative w-full h-48 mb-4 rounded-lg overflow-hidden">
                  <Image
                    src={quiz.imageUrl}
                    alt={quiz.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {quiz.lesson && (
                    <>
                      <BookOpen className="h-4 w-4" />
                      <span>
                        {quiz.lesson.Chapter?.Course?.title} →{" "}
                        {quiz.lesson.Chapter?.title} → {quiz.lesson.title}
                      </span>
                    </>
                  )}
                </div>
                <CardTitle className="text-3xl">{quiz.title}</CardTitle>
                {quiz.description && (
                  <CardDescription className="text-base">
                    {quiz.description}
                  </CardDescription>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Quiz Info Grid */}
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                  <div className="p-2 rounded-md bg-primary/10">
                    <BookOpen className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Questions</p>
                    <p className="text-xl font-bold">{quiz.questions.length}</p>
                  </div>
                </div>

                {quiz.timeLimit && (
                  <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                    <div className="p-2 rounded-md bg-orange-500/10">
                      <Clock className="h-5 w-5 text-orange-500" />
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">
                        Time Limit
                      </p>
                      <p className="text-xl font-bold">{quiz.timeLimit} min</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                  <div className="p-2 rounded-md bg-green-500/10">
                    <Trophy className="h-5 w-5 text-green-500" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">
                      Total Points
                    </p>
                    <p className="text-xl font-bold">
                      {quiz.totalPoints ||
                        quiz.questions.reduce((sum, q) => sum + q.points, 0)}
                    </p>
                  </div>
                </div>
              </div>

              <Separator />

              {/* Instructions */}
              <div className="space-y-3">
                <h3 className="font-semibold text-lg">Instructions</h3>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-500 shrink-0" />
                    <span>
                      This quiz contains {quiz.questions.length} questions
                    </span>
                  </li>
                  {quiz.timeLimit && (
                    <li className="flex items-start gap-2">
                      <Timer className="h-4 w-4 mt-0.5 text-orange-500 shrink-0" />
                      <span>
                        You have {quiz.timeLimit} minutes to complete the quiz
                      </span>
                    </li>
                  )}
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-500 shrink-0" />
                    <span>Each question has one or more correct answers</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-500 shrink-0" />
                    <span>You can navigate between questions freely</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 mt-0.5 text-green-500 shrink-0" />
                    <span>
                      Make sure to submit your quiz before time runs out
                    </span>
                  </li>
                </ul>
              </div>

              {/* Start Button */}
              <Button
                size="lg"
                className="w-full gap-2"
                onClick={() => setHasStarted(true)}
              >
                <Play className="h-5 w-5" />
                {ongoingAttempt ? "Resume Quiz" : "Start Quiz"}
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar - Statistics */}
        <div className="lg:col-span-1 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5" />
                Your Statistics
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {hasAttempts ? (
                <>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Total Attempts
                      </span>
                      <span className="font-bold">
                        {statistics.totalAttempts}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Completed
                      </span>
                      <span className="font-bold">
                        {statistics.completedAttempts}
                      </span>
                    </div>
                    <Separator />
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-muted-foreground">
                        Passed
                      </span>
                      <div className="flex items-center gap-2">
                        <span className="font-bold">
                          {statistics.passedAttempts}
                        </span>
                        {statistics.passedAttempts > 0 && (
                          <CheckCircle2 className="h-4 w-4 text-green-500" />
                        )}
                      </div>
                    </div>
                    {statistics.bestScore !== null && (
                      <>
                        <Separator />
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Best Score
                          </span>
                          <Badge variant="secondary" className="font-bold">
                            {statistics.bestScore}/
                            {quiz.totalPoints ||
                              quiz.questions.reduce(
                                (sum, q) => sum + q.points,
                                0
                              )}
                          </Badge>
                        </div>
                      </>
                    )}
                    {statistics.averageScore !== null && (
                      <>
                        <Separator />
                        <div className="flex justify-between items-center">
                          <span className="text-sm text-muted-foreground">
                            Average Score
                          </span>
                          <span className="font-bold">
                            {statistics.averageScore.toFixed(1)}/
                            {quiz.totalPoints ||
                              quiz.questions.reduce(
                                (sum, q) => sum + q.points,
                                0
                              )}
                          </span>
                        </div>
                      </>
                    )}
                  </div>
                </>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <XCircle className="h-12 w-12 mx-auto mb-3 opacity-50" />
                  <p className="text-sm">No attempts yet</p>
                  <p className="text-xs mt-1">
                    Start the quiz to see your stats
                  </p>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Attempts */}
          {userProgress.attempts.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="text-base">Recent Attempts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {userProgress.attempts.slice(0, 5).map((attempt, index) => (
                  <div
                    key={attempt.id}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
                  >
                    <div className="space-y-1">
                      <p className="text-sm font-medium">
                        Attempt {userProgress.attempts.length - index}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {new Date(attempt.startedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      {attempt.endedAt ? (
                        <>
                          <Badge
                            variant={
                              attempt.status === "Completed"
                                ? "default"
                                : "destructive"
                            }
                            className="mb-1"
                          >
                            {attempt.status}
                          </Badge>
                          <p className="text-sm font-bold">
                            {attempt.score}/
                            {quiz.totalPoints ||
                              quiz.questions.reduce(
                                (sum, q) => sum + q.points,
                                0
                              )}
                          </p>
                        </>
                      ) : (
                        <Badge variant="outline">In Progress</Badge>
                      )}
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
