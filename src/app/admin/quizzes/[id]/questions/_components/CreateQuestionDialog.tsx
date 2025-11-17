"use client";

import { useState, useTransition } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Plus, Trash2 } from "lucide-react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { tryCatch } from "@/hooks/try-catch";
import { createQuestion } from "../actions";
import { useRouter } from "next/navigation";
import { z } from "zod";
import Uploader from "@/components/file-uploader/Uploader";

const choiceSchema = z.object({
  id: z.string().optional(),
  text: z.string().min(1, "Choice text is required"),
  isCorrect: z.boolean(),
});

const questionFormSchema = z.object({
  type: z.enum(["SINGLE_CHOICE", "MULTI_CHOICE", "TRUE_FALSE", "SHORT_ANSWER"]),
  text: z.string().min(1, "Question text is required"),
  imageKey: z.string().optional(),
  choices: z.array(choiceSchema).optional(),
  answer: z.string().optional(),
  points: z.number().int().min(1),
});

type QuestionFormValues = z.infer<typeof questionFormSchema>;

interface CreateQuestionDialogProps {
  quizId: string;
}

export function CreateQuestionDialog({ quizId }: CreateQuestionDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const form = useForm<QuestionFormValues>({
    resolver: zodResolver(questionFormSchema),
    defaultValues: {
      type: "SINGLE_CHOICE",
      text: "",
      points: 1,
      choices: [
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
        { text: "", isCorrect: false },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "choices",
  });

  const questionType = form.watch("type");

  function onSubmit(values: QuestionFormValues) {
    startTransition(async () => {
      let choices: any = null;

      if (values.type === "SINGLE_CHOICE" || values.type === "MULTI_CHOICE") {
        choices = values.choices?.map((choice, index) => ({
          id: `choice_${index}`,
          text: choice.text,
          isCorrect: choice.isCorrect,
        }));
      } else if (values.type === "TRUE_FALSE") {
        choices = [
          {
            id: "true",
            text: "True",
            isCorrect: values.choices?.[0]?.isCorrect || false,
          },
          {
            id: "false",
            text: "False",
            isCorrect: values.choices?.[1]?.isCorrect || false,
          },
        ];
      }

      const { data: result, error } = await tryCatch(
        createQuestion({
          quizId,
          text: values.text,
          points: values.points,
          imageUrl: values.imageKey,
          options: choices || undefined,
        })
      );

      if (error) {
        console.error("Error creating question:", error);
        toast.error("Failed to create question");
        return;
      }

      if (result?.status === "success") {
        toast.success("Question created successfully!");
        setOpen(false);
        form.reset();
        router.refresh();
      } else if (result?.status === "error") {
        toast.error(result.message);
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4 mr-2" />
          Add Question
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Create New Question</DialogTitle>
          <DialogDescription>
            Add a new question to this quiz with multiple choice options
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="type"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question Type</FormLabel>
                  <Select
                    onValueChange={(value) => {
                      field.onChange(value);
                      // Reset choices based on type
                      if (value === "TRUE_FALSE") {
                        form.setValue("choices", [
                          { text: "True", isCorrect: true },
                          { text: "False", isCorrect: false },
                        ]);
                      } else if (value === "SHORT_ANSWER") {
                        form.setValue("choices", []);
                      } else {
                        form.setValue("choices", [
                          { text: "", isCorrect: false },
                          { text: "", isCorrect: false },
                          { text: "", isCorrect: false },
                          { text: "", isCorrect: false },
                        ]);
                      }
                    }}
                    value={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value="SINGLE_CHOICE">
                        Single Choice
                      </SelectItem>
                      <SelectItem value="MULTI_CHOICE">
                        Multiple Choice
                      </SelectItem>
                      <SelectItem value="TRUE_FALSE">True/False</SelectItem>
                      <SelectItem value="SHORT_ANSWER">Short Answer</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="text"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question Text</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Enter your question..."
                      className="min-h-[100px]"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="imageKey"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Question Image (Optional)</FormLabel>
                  <FormControl>
                    <Uploader
                      value={field.value}
                      onChange={field.onChange}
                      fileTypeAccept="image"
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormDescription>
                    Upload an image to display with this question
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="points"
              render={({ field: { value, onChange, ...field } }) => (
                <FormItem>
                  <FormLabel>Points</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      min="1"
                      value={value}
                      onChange={(e) => onChange(parseInt(e.target.value) || 1)}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Choices for SINGLE_CHOICE and MULTI_CHOICE */}
            {(questionType === "SINGLE_CHOICE" ||
              questionType === "MULTI_CHOICE") && (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <FormLabel>Answer Options</FormLabel>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => append({ text: "", isCorrect: false })}
                  >
                    <Plus className="size-4 mr-2" />
                    Add Option
                  </Button>
                </div>

                {fields.map((field, index) => (
                  <div
                    key={field.id}
                    className="flex items-start gap-2 p-3 border rounded-lg"
                  >
                    <FormField
                      control={form.control}
                      name={`choices.${index}.text`}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              placeholder={`Option ${index + 1}`}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name={`choices.${index}.isCorrect`}
                      render={({ field }) => (
                        <FormItem className="flex items-center gap-2 space-y-0 pt-2">
                          <FormControl>
                            <Checkbox
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                          <FormLabel className="text-sm font-normal">
                            Correct
                          </FormLabel>
                        </FormItem>
                      )}
                    />

                    {fields.length > 2 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => remove(index)}
                        className="shrink-0"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    )}
                  </div>
                ))}
                <FormDescription>
                  {questionType === "SINGLE_CHOICE"
                    ? "Mark one option as correct"
                    : "Mark all correct options"}
                </FormDescription>
              </div>
            )}

            {/* TRUE/FALSE options */}
            {questionType === "TRUE_FALSE" && (
              <div className="space-y-4">
                <FormLabel>Correct Answer</FormLabel>
                {fields.slice(0, 2).map((field, index) => (
                  <FormField
                    key={field.id}
                    control={form.control}
                    name={`choices.${index}.isCorrect`}
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-3 space-y-0">
                        <FormControl>
                          <Checkbox
                            checked={field.value}
                            onCheckedChange={(checked) => {
                              // Only one can be true
                              form.setValue(
                                "choices.0.isCorrect",
                                index === 0 && checked === true
                              );
                              form.setValue(
                                "choices.1.isCorrect",
                                index === 1 && checked === true
                              );
                            }}
                          />
                        </FormControl>
                        <FormLabel className="font-normal">
                          {index === 0 ? "True" : "False"}
                        </FormLabel>
                      </FormItem>
                    )}
                  />
                ))}
              </div>
            )}

            {/* SHORT_ANSWER */}
            {questionType === "SHORT_ANSWER" && (
              <FormField
                control={form.control}
                name="answer"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Correct Answer</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter the correct answer..."
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Answer is case-insensitive
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <div className="flex gap-3 pt-4">
              <Button type="submit" disabled={isPending} className="flex-1">
                {isPending ? "Creating..." : "Create Question"}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
