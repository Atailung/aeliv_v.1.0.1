"use client";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CourseCategories,
  CourseSchema,
  CourseSchemaType,
  DifficultyLevelsOfQuiz,
  updateQuizSchema,
  UpdateQuizSchemaType,
} from "@/lib/ZodSchemas";
import { SparkleIcon } from "lucide-react";
import React, { useEffect, useState, useTransition } from "react";
import { useForm } from "react-hook-form";
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
import slugify from "slugify";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { tryCatch } from "@/hooks/try-catch";
import { useRouter } from "next/navigation";
import {
  adminGetLessons,
  AdminLessonsType,
} from "@/app/data/admin/admin-get-lessons";
import { QuizForEditType } from "@/app/data/quiz/get-quiz-for-edit";
import { editQuiz } from "../../../edit/action";

interface EditQuizFormProps {
  quiz: QuizForEditType;
}

export function EditQuizForm({ quiz }: EditQuizFormProps) {
  const [isPending, startTransition] = useTransition();
  const [lessons, setLessons] = useState<AdminLessonsType[]>([]);
  const [isLoadingLessons, setIsLoadingLessons] = useState(true);
  const router = useRouter();

  const form = useForm<UpdateQuizSchemaType>({
    resolver: zodResolver(updateQuizSchema),
    defaultValues: {
      id: quiz.id,
      title: quiz.title,
      slug: quiz.slug,
      description: quiz.description || "",
      lessonId: quiz.lessonId || undefined,
      imageUrl: quiz.imageUrl || "",
      timeLimit: quiz.timeLimit || undefined,
      totalPoints: quiz.totalPoints || 0,
      level: quiz.level || "EASY",
    },
  });

  const categoryOfQuiz = useForm<CourseSchemaType>({
    resolver: zodResolver(CourseSchema),
    defaultValues: {
      category: "Web_development",
    },
  });

  // Fetch lessons on mount
  useEffect(() => {
    async function fetchLessons() {
      setIsLoadingLessons(true);
      const { data, error } = await tryCatch(adminGetLessons());
      if (error) {
        toast.error("Failed to load lessons");
        console.error(error);
      } else if (data) {
        setLessons(data);
      }
      setIsLoadingLessons(false);
    }
    fetchLessons();
  }, []);

  // Submit handler with proper error handling
  function onSubmit(values: UpdateQuizSchemaType) {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(editQuiz(values));
      if (error) {
        console.error("Error updating quiz:", error);
        toast.error("Failed to update quiz. Please try again.");
        return;
      }
      if (result?.status === "success") {
        toast.success("Quiz updated successfully!");
        router.push("/admin/quizzes");
        router.refresh();
      } else if (result?.status === "error") {
        toast.error(result.message);
      }
    });
  }

  const generateSlug = () => {
    const titleValue = form.getValues("title");
    if (!titleValue?.trim()) {
      toast.error("Please enter a title first");
      return;
    }

    const slug = slugify(titleValue, { lower: true, strict: true });
    form.setValue("slug", slug, { shouldValidate: true });
    toast.success("Slug generated successfully!");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quiz Information</CardTitle>
        <CardDescription>
          Update the quiz information and settings.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6 w-full"
          >
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter quiz title"
                      {...field}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-4 items-end">
              <FormField
                control={form.control}
                name="slug"
                render={({ field }) => (
                  <FormItem className="flex-1">
                    <FormLabel>Slug</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="quiz-slug"
                        {...field}
                        value={field.value || ""}
                        disabled={isPending}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button
                type="button"
                variant="outline"
                onClick={generateSlug}
                disabled={isPending}
              >
                Generate Slug <SparkleIcon className="ml-1" size={16} />
              </Button>
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      className="min-h-[120px]"
                      placeholder="Brief description of the quiz"
                      {...field}
                      value={field.value || ""}
                      disabled={isPending}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex justify-between">
              <FormField
                control={form.control}
                name="lessonId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Lesson (Optional)</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value ?? undefined}
                      disabled={isPending || isLoadingLessons}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue
                            placeholder={
                              isLoadingLessons
                                ? "Loading lessons..."
                                : "Select a lesson (optional)"
                            }
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {lessons.map((lesson) => (
                          <SelectItem key={lesson.id} value={lesson.id}>
                            {lesson.Chapter?.Course?.title} →{" "}
                            {lesson.Chapter?.title} → {lesson.title}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      Optionally link this quiz to a specific lesson
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="level"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Difficulty Level</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isPending}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select difficulty level" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {DifficultyLevelsOfQuiz.map((level) => (
                          <SelectItem key={level} value={level}>
                            {level}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>

                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={categoryOfQuiz.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                      disabled={isPending}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {CourseCategories.map((category) => (
                          <SelectItem key={category} value={category}>
                            {category.replace(/_/g, " ")}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4\">
              <FormField
                control={form.control}
                name="timeLimit"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>Time Limit (seconds)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Leave empty for no time limit"
                        type="number"
                        min="0"
                        step="1"
                        value={value || ""}
                        onChange={(e) => {
                          const val = e.target.value;
                          onChange(val === "" ? undefined : parseInt(val) || 0);
                        }}
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Time allowed to complete the quiz
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="totalPoints"
                render={({ field: { value, onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>Total Points</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="0"
                        type="number"
                        min="0"
                        step="1"
                        value={value || ""}
                        onChange={(e) =>
                          onChange(parseInt(e.target.value) || 0)
                        }
                        disabled={isPending}
                        {...field}
                      />
                    </FormControl>
                    <FormDescription>
                      Maximum points achievable in this quiz
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="flex gap-4">
              <Button type="submit" disabled={isPending} className="flex-1">
                {isPending ? "Updating..." : "Update Quiz"}
              </Button>

              <Button
                type="button"
                variant="outline"
                disabled={isPending}
                onClick={() => router.push("/admin/quizzes")}
              >
                Cancel
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
