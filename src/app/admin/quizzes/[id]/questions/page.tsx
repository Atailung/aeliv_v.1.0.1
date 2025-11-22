import { getAdminQuizData } from "@/app/data/quiz/get-admin-quiz-data";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { CreateQuestionDialog } from "./_components/CreateQuestionDialog";
import { QuestionsList } from "./_components/QuestionsList";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default async function ManageQuestionsPage({ params }: PageProps) {
  const { id } = await params;
  const quiz = await getAdminQuizData(id);

  return (
    <>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link
            href="/admin/quizzes"
            className={buttonVariants({ variant: "outline", size: "icon" })}
          >
            <ArrowLeft className="size-5" />
          </Link>

          <div>
            <h1 className="text-2xl font-bold">{quiz.title}</h1>
            <p className="text-sm text-muted-foreground">Manage Questions</p>
          </div>
        </div>

        <CreateQuestionDialog quizId={quiz.id} />
      </div>

      <QuestionsList questions={quiz.questions} quizId={quiz.id} />
    </>
  );
}
