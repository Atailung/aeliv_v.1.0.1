"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Trash2,
  CheckCircle2,
  Circle,
  AlertCircle,
  List,
  Image as ImageIcon,
} from "lucide-react";
import Image from "next/image";
import { AdminQuizSingularType } from "@/app/data/quiz/get-admin-quiz-data";
import { useState, useTransition } from "react";
import { toast } from "sonner";
import { tryCatch } from "@/hooks/try-catch";
import { deleteQuestion } from "../actions";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { useConstructUrl as constructUrl } from "@/hooks/use-construct";

interface QuestionsListProps {
  questions: AdminQuizSingularType["questions"];
  quizId: string;
}

export function QuestionsList({
  questions,
  quizId: _quizId,
}: QuestionsListProps) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const handleDelete = (questionId: string) => {
    startTransition(async () => {
      setDeletingId(questionId);
      const { data: result, error } = await tryCatch(
        deleteQuestion(questionId)
      );

      if (error) {
        toast.error("Failed to delete question");
        console.error(error);
      } else if (result?.status === "success") {
        toast.success("Question deleted successfully");
        router.refresh();
      } else if (result?.status === "error") {
        toast.error(result.message);
      }

      setDeletingId(null);
    });
  };

  if (questions.length === 0) {
    return (
      <Card>
        <CardContent className="flex flex-col items-center justify-center py-16">
          <p className="text-muted-foreground text-center">
            No questions added yet. Click &quot;Add Question&quot; to get
            started.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      {questions.map((question, index) => (
        <Card key={question.id}>
          <CardHeader>
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-2">
                  <Badge variant="outline">Q {index + 1}</Badge>
                  <Badge>
                    {question.points}{" "}
                    {question.points === +1 ? "point" : "points"}
                  </Badge>
                </div>
                <CardTitle className="text-lg line-clamp-2 mt-4">
                  {question.text}
                </CardTitle>
              </div>

              <div className="flex gap-2">
                <AlertDialog>
                  <Tooltip>
                    <AlertDialogTrigger asChild>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="icon"
                          disabled={isPending && deletingId === question.id}
                        >
                          <Trash2 className="size-4 text-destructive" />
                        </Button>
                      </TooltipTrigger>
                    </AlertDialogTrigger>
                    <TooltipContent>Delete Question</TooltipContent>
                  </Tooltip>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete Question?</AlertDialogTitle>
                      <AlertDialogDescription>
                        This action cannot be undone. This will permanently
                        delete this question and all its data.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(question.id)}
                        className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </CardHeader>

          <CardContent className="pt-4 border-t space-y-6">
            {/* Question Image Section */}
            {question.imageUrl && (
              <div className="space-y-2">
                <h4 className="text-sm font-semibold text-foreground/90 flex items-center gap-2">
                  <ImageIcon className="size-4 text-muted-foreground" />
                  Question Image
                </h4>
                <div className="relative w-full max-w-md h-48 rounded-lg overflow-hidden border bg-muted/50">
                  <Image
                    src={constructUrl(question.imageUrl)}
                    alt="Question illustration"
                    fill
                    className="object-contain"
                  />
                </div>
              </div>
            )}

            {/* Options Section */}
            {Array.isArray(question.options) && question.options.length > 0 ? (
              <div className="space-y-3">
                <h4 className="text-sm font-semibold text-foreground/90 flex items-center gap-2">
                  <List className="size-4 text-muted-foreground" />
                  Options
                </h4>

                <div className="grid gap-2.5">
                  {question.options.map((option, idx) => (
                    <div
                      key={option.id ?? idx}
                      className={`flex items-center gap-3 p-3.5 rounded-xl border transition-all ${
                        option.isCorrect
                          ? "bg-emerald-50/80 dark:bg-emerald-950/30 border-emerald-200 dark:border-emerald-800 shadow-sm"
                          : "bg-muted/40 hover:bg-muted/70 border-transparent"
                      }`}
                    >
                      <div className="shrink-0">
                        {option.isCorrect ? (
                          <CheckCircle2 className="size-5.5 text-emerald-600 dark:text-emerald-400" />
                        ) : (
                          <Circle className="size-5.5 text-muted-foreground/60" />
                        )}
                      </div>

                      <span className="flex-1 font-medium text-foreground">
                        {option.text || (
                          <em className="text-muted-foreground">
                            Empty option
                          </em>
                        )}
                      </span>

                      {option.isCorrect && (
                        <Badge className="bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300 border-emerald-300 dark:border-emerald-700">
                          Correct Answer
                        </Badge>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="py-6 text-center text-sm text-muted-foreground">
                <AlertCircle className="size-10 mx-auto mb-3 opacity-40" />
                <p>No answer options added yet</p>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
