import { getUserQuizData } from "@/app/data/quiz/get-user-quiz-data";
import { notFound } from "next/navigation";
import QuizPreview from "./_components/QuizPreview";

interface QuizPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function QuizPage({ params }: QuizPageProps) {
  const { id } = await params;

  try {
    const data = await getUserQuizData(id);

    return <QuizPreview data={data} />;
  } catch (error) {
    console.error("Error loading quiz:", error);
    notFound();
  }
}
