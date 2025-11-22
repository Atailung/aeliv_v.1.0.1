"use client";
import React from "react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

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

interface QuizBodyProps {
  question: Question;
  questionNumber: number;
  selectedAnswer?: Answer;
  onAnswerSelect: (answer: Answer) => void;
}

export default function QuizBody({
  question,
  questionNumber,
  selectedAnswer,
  onAnswerSelect,
}: QuizBodyProps) {
  const correctOptionsCount = question.options.filter(
    (opt) => opt.isCorrect
  ).length;
  const isMultipleChoice = correctOptionsCount > 1;

  const handleSingleSelect = (optionId: string) => {
    onAnswerSelect({ selectedOptionId: optionId });
  };

  const handleMultipleSelect = (optionId: string, checked: boolean) => {
    const currentIds = selectedAnswer?.selectedOptionIds || [];
    const newIds = checked
      ? [...currentIds, optionId]
      : currentIds.filter((id) => id !== optionId);
    onAnswerSelect({ selectedOptionIds: newIds });
  };

  return (
    <div className="space-y-6">
      {/* Question Header */}
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2 flex-1">
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="font-mono">
              Q{questionNumber}
            </Badge>
            <Badge variant="secondary">{question.points} points</Badge>
            {isMultipleChoice && (
              <Badge variant="default" className="bg-blue-500">
                Multiple Choice
              </Badge>
            )}
          </div>
          <h2 className="text-xl font-semibold leading-relaxed">
            {question.text}
          </h2>
        </div>
      </div>

      {/* Question Image */}
      {question.imageUrl && (
        <div className="relative w-full h-64 rounded-lg overflow-hidden border">
          <Image
            src={question.imageUrl}
            alt="Question illustration"
            fill
            className="object-contain"
          />
        </div>
      )}

      {/* Options */}
      <div className="space-y-3">
        {isMultipleChoice ? (
          // Multiple Choice (Checkboxes)
          <div className="space-y-3">
            {question.options.map((option, index) => {
              const isSelected =
                selectedAnswer?.selectedOptionIds?.includes(option.id) || false;

              return (
                <div
                  key={option.id}
                  className={cn(
                    "flex items-start gap-3 p-4 rounded-lg border-2 transition-all cursor-pointer hover:border-primary/50 hover:bg-primary/5",
                    isSelected
                      ? "border-primary bg-primary/10"
                      : "border-border"
                  )}
                  onClick={() => handleMultipleSelect(option.id, !isSelected)}
                >
                  <Checkbox
                    id={option.id}
                    checked={isSelected}
                    onCheckedChange={(checked) =>
                      handleMultipleSelect(option.id, checked === true)
                    }
                    className="mt-0.5"
                  />
                  <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex items-center justify-center size-8 rounded-md font-bold shrink-0 transition-colors",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {renderOptionLetter(index)}
                      </div>
                      <span className="text-base">{option.text}</span>
                    </div>
                  </Label>
                </div>
              );
            })}
          </div>
        ) : (
          // Single Choice (Radio Buttons)
          <RadioGroup
            value={selectedAnswer?.selectedOptionId || ""}
            onValueChange={handleSingleSelect}
            className="space-y-3"
          >
            {question.options.map((option, index) => {
              const isSelected = selectedAnswer?.selectedOptionId === option.id;

              return (
                <div
                  key={option.id}
                  className={cn(
                    "flex items-start gap-3 p-4 rounded-lg border-2 transition-all cursor-pointer hover:border-primary/50 hover:bg-primary/5",
                    isSelected
                      ? "border-primary bg-primary/10"
                      : "border-border"
                  )}
                  onClick={() => handleSingleSelect(option.id)}
                >
                  <RadioGroupItem
                    value={option.id}
                    id={option.id}
                    className="mt-0.5"
                  />
                  <Label htmlFor={option.id} className="flex-1 cursor-pointer">
                    <div className="flex items-center gap-3">
                      <div
                        className={cn(
                          "flex items-center justify-center size-8 rounded-md font-bold shrink-0 transition-colors",
                          isSelected
                            ? "bg-primary text-primary-foreground"
                            : "bg-muted text-muted-foreground"
                        )}
                      >
                        {renderOptionLetter(index)}
                      </div>
                      <span className="text-base">{option.text}</span>
                    </div>
                  </Label>
                </div>
              );
            })}
          </RadioGroup>
        )}
      </div>
    </div>
  );
}

function renderOptionLetter(index: number) {
  return String.fromCharCode(65 + index); // A, B, C, D, etc.
}
