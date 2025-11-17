"use client";

import React, { useState, useEffect } from "react";
import QuizHeader from "./QuizHeader";
import QuizBody from "./QuizBody";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import type { UserQuizDataType } from "@/app/data/quiz/get-user-quiz-data";
import { userSubmitQuiz } from "../action";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import QuizSidebar from "./QuizSidebar";

interface RenderQuizProps {
  quiz: UserQuizDataType["quiz"];
  userProgress: UserQuizDataType["userProgress"];
}

type Answer = {
  selectedOptionId?: string;
  selectedOptionIds?: string[];
};

function RenderQuiz({ quiz, userProgress }: RenderQuizProps) {
  const router = useRouter();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState<Record<string, Answer>>({});
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [startTime] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const totalQuestions = quiz.questions.length;
  const progress = ((currentQuestionIndex + 1) / totalQuestions) * 100;

  // Initialize timer
  useEffect(() => {
    if (quiz.timeLimit) {
      setTimeLeft(quiz.timeLimit * 60); // Convert minutes to seconds
    }
  }, [quiz.timeLimit]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft === null || timeLeft <= 0) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev === null || prev <= 1) {
          clearInterval(timer);
          handleSubmitQuiz();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handleAnswerSelect = (questionId: string, answer: Answer) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: answer,
    }));
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < totalQuestions - 1) {
      setCurrentQuestionIndex((prev) => prev + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex((prev) => prev - 1);
    }
  };

  const handleQuestionNavigate = (index: number) => {
    setCurrentQuestionIndex(index);
  };

  const handleSubmitQuiz = async () => {
    setIsSubmitting(true);

    try {
      const result = await userSubmitQuiz(quiz.id, answers, startTime);

      if (result.status === "success" && result.data) {
        toast.success(result.message);
        router.push(
          `/dashboard/quizzes/${quiz.id}/results/${result.data.attemptId}`
        );
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      toast.error("Failed to submit quiz");
    } finally {
      setIsSubmitting(false);
    }
  };

  const answeredQuestionsCount = Object.keys(answers).length;

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Quiz Area */}
        <div className="lg:col-span-2 space-y-6">
          <QuizHeader
            title={quiz.title}
            currentQuestion={currentQuestionIndex + 1}
            totalQuestions={totalQuestions}
            progress={progress}
            timeLeft={timeLeft}
            timeLimit={quiz.timeLimit}
          />

          <Card className="p-6">
            <QuizBody
              question={currentQuestion}
              questionNumber={currentQuestionIndex + 1}
              selectedAnswer={answers[currentQuestion.id]}
              onAnswerSelect={(answer) =>
                handleAnswerSelect(currentQuestion.id, answer)
              }
            />
          </Card>

          {/* Navigation Buttons */}
          <div className="flex justify-between items-center">
            <Button
              variant="outline"
              onClick={handlePreviousQuestion}
              disabled={currentQuestionIndex === 0}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Previous
            </Button>

            {currentQuestionIndex === totalQuestions - 1 ? (
              <Button
                onClick={handleSubmitQuiz}
                disabled={isSubmitting}
                className="gap-2"
              >
                <CheckCircle className="h-4 w-4" />
                {isSubmitting ? "Submitting..." : "Submit Quiz"}
              </Button>
            ) : (
              <Button onClick={handleNextQuestion}>
                Next
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="lg:col-span-1">
          <QuizSidebar
            questions={quiz.questions}
            currentQuestionIndex={currentQuestionIndex}
            answers={answers}
            onQuestionNavigate={handleQuestionNavigate}
            totalPoints={quiz.totalPoints}
            answeredCount={answeredQuestionsCount}
            totalQuestions={totalQuestions}
          />
        </div>
      </div>
    </div>
  );
}

export default RenderQuiz;
