// app/data/quiz/admin-create-quiz.ts
"use server";

import { prisma } from "@/lib/db";
import slugify from "slugify";
import { requireAdmin } from "@/app/data/admin/require-admin";
import arcjet, { fixedWindow } from "@/lib/arcjet";
import { request } from "@arcjet/next";
import { revalidatePath } from "next/cache";
import { QuizSchema, QuizSchemaType } from "@/lib/ZodSchemas";

const aj = arcjet.withRule(
  fixedWindow({
    mode: "LIVE",
    max: 5,
    window: "1m",
  })
);

export async function adminCreateQuiz(input: QuizSchemaType) {
  const session = await requireAdmin();

  const req = await request();
  const decision = await aj.protect(req, {
    fingerprint: session.user.id,
  });

  if (decision.isDenied()) {
    if (decision.reason.isRateLimit()) {
      return { status: "error" as const, message: "Too many requests." };
    }
    return { status: "error" as const, message: "Access denied." };
  }

  const parsed = QuizSchema.safeParse(input);
  if (!parsed.success) {
    const msg = parsed.error.issues.map((i) => i.message).join(", ");
    return { status: "error" as const, message: `Validation failed: ${msg}` };
  }
  const data = parsed.data;

  // Generate unique slug
  const base = data.slug
    ? slugify(data.slug, { lower: true, strict: true })
    : slugify(data.title, { lower: true, strict: true });

  let slug = base;
  let i = 1;
  while (await prisma.quiz.findUnique({ where: { slug } })) {
    slug = `${base}-${i++}`;
  }

  try {
    await prisma.quiz.create({
      data: {
        title: data.title,
        slug,
        description: data.description || null,
        imageUrl: data.imageUrl || null,
        timeLimit: data.timeLimit || null,
        totalPoints: data.totalPoints || 0,
        lessonId: data.lessonId || null,
      },
    });
  } catch (err: unknown) {
    if (err instanceof Error && "code" in err && err.code === "P2002") {
      return { status: "error" as const, message: "Quiz already exists." };
    }
    console.error("Create quiz error:", err);
    return { status: "error" as const, message: "Failed to create quiz." };
  }

  revalidatePath("/admin/quizzes");
  return { status: "success" as const, message: "Quiz created!" };
}
