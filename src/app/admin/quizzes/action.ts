// // "use server"
// // import { prisma } from "@/lib/db";
// // import slugify from "slugify";
// // import { requireAdmin } from "@/app/data/admin/require-admin";
// // import arcjet, { fixedWindow } from "@/lib/arcjet";
// // import { request } from "@arcjet/next";
// // import { revalidatePath } from "next/cache";
// // import { QuizSchema, QuizSchemaType } from "@/lib/ZodSchemas";
// // import { ApiResponse } from "@/lib/types";

// // const aj = arcjet.withRule(
// //   fixedWindow({
// //     mode: "LIVE",
// //     max: 5,
// //     window: "1m",
// //   })
// // );

// // export async function adminCreatequiz(input: QuizSchemaType):Promise<ApiResponse> {
// //   const session = await requireAdmin();
// //   // Check authentication
// //   try {
// //     const req = await request();
// //     const decision = await aj.protect(req, {
// //       fingerprint: session.user.id as string,
// //     });

// //     if (!session?.user?.id) {
// //       return {
// //         status: "error",
// //         message: "Unauthorized: Please login to continue",
// //       };
// //     }

// //     if (decision.isDenied()) {
// //       if (decision.reason.isRateLimit()) {
// //         return {
// //           status: "error",
// //           message: "Too many requests. Please try again later.",
// //         };
// //       } else {
// //         return {
// //           status: "error",
// //           message:
// //             "Request denied by security rule. you are a bot, never touch my sites.",
// //         };
// //       }
// //     }

// //     // Validate input data
// //     const validation = QuizSchema.safeParse(input);
// //     if (!validation.success) {
// //       console.error("Validation errors:", validation.error.issues);
// //       return {
// //         status: "error",
// //         message:
// //           "Validation failed: " +
// //           validation.error.issues.map((issue) => issue.message).join(", "),
// //       };
// //     }

// //     // Generate slug from title or use provided slug
// //     const slug =
// //       validation.data.slug ||
// //       slugify(validation.data.title, { lower: true, strict: true });

// //     // Check for duplicate slug
// //     const existingQuiz = await prisma.quiz.findUnique({
// //       where: { slug },
// //     });

// //     if (existingQuiz) {
// //       return {
// //         status: "error",
// //         message:
// //           "A quiz with this slug already exists. Please use a different slug.",
// //       };
// //     } // Create the quiz
// //     await prisma.quiz.create({
// //       data: {
// //         ...validation.data,
// //         slug,
// //       },
// //     });

// //     revalidatePath("/admin/quizzes");

// //     return {
// //       status: "success",
// //       message: "Quiz created successfully",
// //     };
// //   } catch (error) {
// //     console.error("Error creating quiz:", error);

// //     // Handle specific database errors
// //     if (error instanceof Error) {
// //       if (error.message.includes("Unique constraint")) {
// //         return {
// //           status: "error",
// //           message: "A quiz with this information already exists",
// //         };
// //       }

// //       return {
// //         status: "error",
// //         message: `Database error: ${error.message}`,
// //       };
// //     }

// //     return {
// //       status: "error",
// //       message: "An unexpected error occurred while creating the quiz",
// //     };
// //   }

// // }

// // app/data/quiz/admin-create-quiz.ts
// "use server";

// import { prisma } from "@/lib/db";
// import slugify from "slugify";
// import { requireAdmin } from "@/app/data/admin/require-admin";
// import arcjet, { fixedWindow } from "@/lib/arcjet";
// import { request } from "@arcjet/next";
// import { revalidatePath } from "next/cache";
// import { QuizSchema, QuizSchemaType } from "@/lib/ZodSchemas";

// const aj = arcjet.withRule(
//   fixedWindow({
//     mode: "LIVE",
//     max: 5,
//     window: "1m",
//   })
// );

// const CREATE_FIELDS = [
//   "title",
//   "description",
//   "difficulty",
//   "timeLimit",
//   "shuffle",
//   "attempts",
//   "lessonId",
// ] as const;

// export async function adminCreateQuiz(input: QuizSchemaType) {
//   const session = await requireAdmin();

//   const req = await request();
//   const decision = await aj.protect(req, {
//     fingerprint: session.user.id,
//   });

//   if (decision.isDenied()) {
//     if (decision.reason.isRateLimit()) {
//       return { status: "error" as const, message: "Too many requests." };
//     }
//     return { status: "error" as const, message: "Access denied." };
//   }

//   const parsed = QuizSchema.safeParse(input);
//   if (!parsed.success) {
//     const msg = parsed.error.issues.map((i) => i.message).join(", ");
//     return { status: "error" as const, message: `Validation failed: ${msg}` };
//   }
//   const data = parsed.data;

//   // Generate unique slug
//   const base = data.slug
//     ? slugify(data.slug, { lower: true, strict: true })
//     : slugify(data.title, { lower: true, strict: true });

//   let slug = base;
//   let i = 1;
//   while (await prisma.quiz.findUnique({ where: { slug } })) {
//     slug = `${base}-${i++}`;
//   }

//   // Build safe payload
//   const payload = {
//     slug,
//     title: data.title,
//     description: data.description,
//     difficulty: data.difficulty,
//     timeLimit: data.timeLimit,
//     shuffle: data.shuffle,
//     attempts: data.attempts,
//     lesson: {
//       connect: { id: data.lessonId }
//     }
//   };

//   try {
//     await prisma.quiz.create({ data: payload });
//   } catch (err: any) {
//     if (err.code === "P2002") {
//       return { status: "error" as const, message: "Quiz already exists." };
//     }
//     console.error("Create quiz error:", err);
//     return { status: "error" as const, message: "Failed to create quiz." };
//   }

//   revalidatePath("/admin/quizzes");
//   return { status: "success" as const, message: "Quiz created!" };
// }

// app/admin/quizzes/action.ts
"use server";

import { adminCreateQuiz } from "@/app/data/quiz/admin-create-quiz";
import { QuizSchemaType } from "@/lib/ZodSchemas";

export async function adminCreatequiz(input: QuizSchemaType) {
  return await adminCreateQuiz(input);
}
