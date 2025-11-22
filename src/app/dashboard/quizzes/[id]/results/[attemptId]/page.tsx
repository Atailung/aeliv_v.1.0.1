import { getQuizAttemptResults } from "@/app/data/quiz/get-quiz-attempt-results";
import { notFound } from "next/navigation";
import QuizResults from "../../_components/QuizResults";

interface QuizResultsPageProps {
  params: Promise<{
    id: string;
    attemptId: string;
  }>;
}

export default async function QuizResultsPage({
  params,
}: QuizResultsPageProps) {
  const { id: quizId, attemptId } = await params;

  try {
    const data = await getQuizAttemptResults(quizId, attemptId);
    return <QuizResults data={data} />;
  } catch (error) {
    console.error("Error loading quiz results:", error);
    notFound();
  }
}
