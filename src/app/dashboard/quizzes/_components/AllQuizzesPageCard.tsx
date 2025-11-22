import React from "react";
import { PublicQuizType } from "@/app/data/quiz/get-public-quizzes";
import SingalQuizCard from "./SingalQuizCard";

// Reusable Quiz Grid
function QuizGrid({ quizzes }: { quizzes: PublicQuizType[] }) {
  return (
    <div className="grid lg:grid-cols-2 gap-4   space-y-2 mt-5">
      {quizzes
        .filter((quiz) => quiz && quiz.id)
        .map((quiz) => (
          <SingalQuizCard key={quiz.id} quiz={quiz} />
        ))}
    </div>
  );
}

function AllQuizzesPageCard({
  difficulty,
  quizzes,
}: {
  difficulty: string;
  quizzes: PublicQuizType[];
}) {
  const filteredQuizzes =
    difficulty === "ALL"
      ? quizzes.filter((quiz) => quiz && quiz.id)
      : quizzes.filter((quiz) => quiz && quiz.level === difficulty);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <header className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
          Explore {difficulty === "ALL" ? "All" : difficulty} Quizzes
        </h2>
        <p className="mt-1 text-sm sm:text-base text-muted-foreground">
          {difficulty === "ALL"
            ? "Test your knowledge with quizzes of all difficulty levels. Challenge yourself and improve your skills!"
            : `Test your knowledge with these ${difficulty.toLowerCase()} quizzes. Challenge yourself and improve your skills!`}
        </p>
      </header>

      {/* Quiz Grid */}
      {filteredQuizzes.length === 0 ? (
        <div className="text-center py-8 text-muted-foreground">
          No {difficulty === "ALL" ? "" : difficulty.toLowerCase() + " "}quizzes
          available yet.
        </div>
      ) : (
        <QuizGrid quizzes={filteredQuizzes} />
      )}
    </div>
  );
}

export default AllQuizzesPageCard;
