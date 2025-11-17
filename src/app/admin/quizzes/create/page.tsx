"use client";

import { Button, buttonVariants } from "@/components/ui/button";
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
  QuizSchema,
  QuizSchemaType,
} from "@/lib/ZodSchemas";
import { ArrowLeft, SparkleIcon } from "lucide-react";
import Link from "next/link";
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
import { adminCreatequiz } from "../action";
import { useConfetti } from "@/hooks/use-confetti";
import {
  adminGetLessons,
  AdminLessonsType,
} from "@/app/data/admin/admin-get-lessons";
import { useRouter } from "next/navigation";

function CreateQuizPage() {
  const [isPending, startTransition] = useTransition();
  const [lessons, setLessons] = useState<AdminLessonsType[]>([]);
  const [isLoadingLessons, setIsLoadingLessons] = useState(true);
  const { triggerConfetti } = useConfetti();
  const router = useRouter();

  const form = useForm<QuizSchemaType>({
    resolver: zodResolver(QuizSchema),
    defaultValues: {
      title: "",
      slug: "",
      description: "",
      lessonId: undefined,
      imageUrl: undefined,
      timeLimit: undefined,
      totalPoints: 0,
      level: "EASY",
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
  function onSubmit(values: QuizSchemaType) {
    console.log("Form submitted with values:", values);
    startTransition(async () => {
      const { data: result, error } = await tryCatch(adminCreatequiz(values));
      console.log("Result:", result, "Error:", error);
      if (error) {
        console.error("Error creating quiz:", error);
        toast.error("Failed to create quiz. Please try again.");
        return;
      }
      if (result?.status === "success") {
        toast.success("Quiz created successfully!");
        triggerConfetti();
        form.reset();
        router.push("/admin/quizzes");
      } else if (result?.status === "error") {
        toast.error(result.message);
      }
    });
  }

  const generateSlug = () => {
    const titleValue = form.getValues("title");
    if (!titleValue.trim()) {
      toast.error("Please enter a title first");
      return;
    }

    const slug = slugify(titleValue, { lower: true, strict: true });
    form.setValue("slug", slug, { shouldValidate: true });
    toast.success("Slug generated successfully!");
  };

  return (
    <>
      <div className="flex items-center gap-4">
        <Link
          href="/admin/quizzes"
          className={buttonVariants({ variant: "outline", size: "icon" })}
        >
          <ArrowLeft className="size-5" />
        </Link>

        <h1 className="text-2xl font-bold">Create Quiz</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quiz Information</CardTitle>
          <CardDescription>
            Create a new quiz for your course lessons.
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
              <div className="flex  justify-between">
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
                  control={form.control}
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                            onChange(
                              val === "" ? undefined : parseInt(val) || 0
                            );
                          }}
                          disabled={isPending}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Time limit in seconds (optional)
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
                          value={value}
                          onChange={(e) => {
                            const val = e.target.value;
                            onChange(parseInt(val) || 0);
                          }}
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        minutes Maximum points achievable in this quiz
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="flex gap-4">
                <Button type="submit" disabled={isPending}>
                  {isPending ? "Creating..." : "Create Quiz"}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => form.reset()}
                  disabled={isPending}
                >
                  Reset
                </Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </>
  );
}

export default CreateQuizPage;
