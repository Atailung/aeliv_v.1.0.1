import { getQuizForEdit } from "@/app/data/quiz/get-quiz-for-edit";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { EditQuizForm } from "./_components/EditQuizForm";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function EditQuizPage({ params }: PageProps) {
  const { id } = await params;
  const quiz = await getQuizForEdit(id);

  return (
    <>
      <div className="flex items-center gap-4">
        <Link
          href="/admin/quizzes"
          className={buttonVariants({ variant: "outline", size: "icon" })}
        >
          <ArrowLeft className="size-5" />
        </Link>

        <h1 className="text-2xl font-bold">Edit Quiz</h1>
      </div>

      <EditQuizForm quiz={quiz} />
    </>
  );
}
