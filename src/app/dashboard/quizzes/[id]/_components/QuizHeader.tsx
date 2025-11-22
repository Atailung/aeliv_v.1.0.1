import React from "react";
import { Card } from "@/components/ui/card";
import { Clock, AlertCircle } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface QuizHeaderProps {
  title: string;
  currentQuestion: number;
  totalQuestions: number;
  progress: number;
  timeLeft: number | null;
  timeLimit: number | null;
}

function QuizHeader({
  title,
  currentQuestion,
  totalQuestions,
  progress,
  timeLeft,
  timeLimit,
}: QuizHeaderProps) {
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const isTimeRunningOut = timeLeft !== null && timeLeft < 60; // Less than 1 minute

  return (
    <Card className=" sticky top-6 space-y-4 p-6">
      <div className="space-y-4">
        {/* Quiz Title and Progress */}
        <div className="flex items-start justify-between gap-4">
          <div className="space-y-1">
            <h1 className="text-2xl font-bold">{title}</h1>
            <p className="text-sm text-muted-foreground">
              Question {currentQuestion} of {totalQuestions}
            </p>
          </div>

          {/* Timer */}
          {timeLimit && timeLeft !== null && (
            <div
              className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                isTimeRunningOut
                  ? "bg-red-500/10 text-red-500"
                  : "bg-primary/10 text-primary"
              }`}
            >
              {isTimeRunningOut && (
                <AlertCircle className="h-4 w-4 animate-pulse" />
              )}
              <Clock className="h-4 w-4" />
              <span className="font-mono font-bold text-lg">
                {formatTime(timeLeft)}
              </span>
            </div>
          )}
        </div>

        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-muted-foreground">Progress</span>
            <span className="font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </div>
    </Card>
  );
}

export default QuizHeader;
