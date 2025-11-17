import { z } from "zod";

export const CourseLevels = ["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const;

export const CourseStatus = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;
export const DifficultyLevelsOfQuiz = ["EASY", "MEDIUM", "HARD"] as const;
export const QuizStatus = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;
export const QuizQuestionTypes = [
  "SINGLE_CHOICE",
  "MULTI_CHOICE",
  "TRUE_FALSE",
  "SHORT_ANSWER",
] as const;

export const CourseCategories = [
  "Web_development",
  "Data_science",
  "Mobile_development",
  "Ai",
  "Cloud_computing",
  "Devops",
  "Teaching_&_academics",
  "It_&_software",
  "Design",
  "Marketing",
  "Health",
  "Finance",
  "Music",
  "Personal_development",
] as const;

export const CourseSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long" })
    .max(100, { message: "Title must be at most 100 characters long" }),
  slug: z
    .string()
    .min(3, { message: "Slug must be at least 3 characters long" })
    .max(100, { message: "Slug must be at most 100 characters long" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters long" })
    .max(1000, { message: "Description must be at most 1000 characters long" }),
  filekey: z
    .string()
    .min(1, { message: "File key must be at least 1 character long" })
    .max(100, { message: "File key must be at most 100 characters long" }),
  price: z.number().min(0, { message: "Price must be at least 0" }),
  duration: z
    .number()
    .int({ message: "Duration must be a whole number" })
    .min(1, { message: "Duration must be at least 1" })
    .max(500, { message: "Duration must be at most 500" }),
  level: z.enum(CourseLevels, {
    message: "Level must be one of BEGINNER, INTERMEDIATE, ADVANCED",
  }),
  category: z.enum(CourseCategories, {
    message: "Category must be Required",
  }),
  smallDescription: z
    .string()
    .min(10, {
      message: "Small description must be at least 10 characters long",
    })
    .max(200, {
      message: "Small description must be at most 200 characters long",
    }),
  status: z.enum(CourseStatus),
});

export type CourseSchemaType = z.infer<typeof CourseSchema>;

export type CourseUpdateSchemaType = z.infer<typeof CourseSchema>;

export const ChapterSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(100, { message: "Name must be at most 100 characters long" }),
  CourseId: z.string().uuid({ message: "Invalid Course ID" }),
});

export type ChapterSchemaType = z.infer<typeof ChapterSchema>;

export const LessonSchema = z.object({
  name: z
    .string()
    .min(3, { message: "Name must be at least 3 characters long" })
    .max(100, { message: "Name must be at most 100 characters long" }),
  courseId: z.string().uuid({ message: "Invalid Course ID" }),
  chapterId: z.string().uuid({ message: "Invalid Chapter ID" }),
  description: z.string().max(1000).optional(),
  videoKey: z.string().optional(),
  thumbnailKey: z.string().optional(),
  position: z
    .number()
    .min(1, { message: "Position must be at least 1" })
    .optional(),
});

export type LessonSchemaType = z.infer<typeof LessonSchema>;

export const QuizSchema = z.object({
  title: z
    .string()
    .min(3, { message: "Title must be at least 3 characters long" })
    .max(100, { message: "Title must be at most 100 characters long" }),
  lessonId: z
    .string()
    .uuid({ message: "Invalid Lesson ID" })
    .optional()
    .nullable(),
  slug: z
    .string()
    .min(3, { message: "Slug must be at least 3 characters long" })
    .max(100, { message: "Slug must be at most 100 characters long" }),
  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters long" })
    .max(1000, { message: "Description must be at most 1000 characters long" })
    .optional(),
  imageUrl: z
    .string()
    .url({ message: "Invalid image URL" })
    .optional()
    .nullable(),
  timeLimit: z.number().int().min(0).optional().nullable(),
  totalPoints: z.number().int().min(0).optional(),
  level: z.enum(DifficultyLevelsOfQuiz, {
    message: "Level must be one of EASY, MEDIUM, HARD",
  }),
  category: z.enum(CourseCategories, {
    message: "Category must be Required",
  }),
});
export type QuizSchemaType = z.infer<typeof QuizSchema>;

export const updateQuizSchema = QuizSchema.partial().extend({
  id: z.string().uuid({ message: "Invalid Quiz ID" }),
});
export type UpdateQuizSchemaType = z.infer<typeof updateQuizSchema>;

export const QuestionSchema = z.object({
  text: z
    .string()
    .min(1, { message: "Question text must be at least 1 character long" }),
  imageUrl: z.string().url().optional().nullable(),
  points: z.number().int().min(1).default(1),
  order: z.number().int().min(1),
  quizId: z.string().uuid(),
});
export type QuestionSchemaType = z.infer<typeof QuestionSchema>;

export const OptionSchema = z.object({
  text: z.string().min(1, { message: "Option text is required" }),
  isCorrect: z.boolean().default(false),
  questionId: z.string().uuid(),
});
export type OptionSchemaType = z.infer<typeof OptionSchema>;

export const QuizAttemptSchema = z.object({
  quizId: z.string().uuid(),
  userId: z.string(),
});
export type QuizAttemptSchemaType = z.infer<typeof QuizAttemptSchema>;

export const UserAnswerSchema = z.object({
  attemptId: z.string().uuid(),
  questionId: z.string().uuid(),
  selectedId: z.string().uuid().optional().nullable(),
  isCorrect: z.boolean().default(false),
});
export type UserAnswerSchemaType = z.infer<typeof UserAnswerSchema>;
