import { description } from "@/components/sidebar/chart-area-interactive";
import { z } from "zod";
import { th } from "zod/v4/locales";

export const CourseLevels = ["BEGINNER", "INTERMEDIATE", "ADVANCED"] as const;

export const CourseStatus = ["DRAFT", "PUBLISHED", "ARCHIVED"] as const;

export const CourseCategories = [
  "WEB_DEVELOPMENT",
  "DATA_SCIENCE",
  "MOBILE_DEVELOPMENT",
  "AI",
  "CLOUD_COMPUTING",
  "DEVOPS",
  "TECHING & ACADEMICS",
  "IT & SOFTWARE",
  "DESIGN",
  "MARKETING",
  "HEALTH",
  "FINANCE",
  "MUSIC",
  "PERSONAL_DEVELOPMENT",
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
  fileKey: z
    .string()
    .min(1, { message: "File key must be at least 1 character long" })
    .max(100, { message: "File key must be at most 100 characters long" }),
  price: z.number().min(1, { message: "Price must be at least 1" }).optional(),
  duration: z
    .number()
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
  // User: z.string().min(3, { message: 'User must be at least 3 characters long' }).max(100, { message: 'User must be at most 100 characters long' }),
  // userId: z.string().min(3, { message: 'User ID must be at least 3 characters long' }).max(100, { message: 'User ID must be at most 100 characters long' }),
  // instructor: z.string().min(2, { message: 'Instructor must be at least 2 characters long' }).max(100, { message: 'Instructor must be at most 100 characters long' }),
  // createdAt: z.date().default(() => new Date()),
  // updatedAt: z.date().default(() => new Date()),
});

export type CourseSchemaType = {
  title: string;
  slug: string;
  description: string;
  fileKey: string;
  duration: number;
  level: (typeof CourseLevels)[number];
  category: (typeof CourseCategories)[number];
  smallDescription: string;
  status: (typeof CourseStatus)[number];
  price?: number;
};

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
