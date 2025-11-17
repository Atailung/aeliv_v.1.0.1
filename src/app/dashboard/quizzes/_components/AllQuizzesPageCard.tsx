import { Gauge } from "lucide-react";
import React from "react";
import SingalQuizCard from "./SingalQuizCard";

// Reusable Difficulty Section
function DifficultySection({ difficulty, category }: { difficulty: string; category: string }) {
  const switchColor = (diff: string) => {
    switch (diff.toLowerCase()) {
      case "beginner":
        return "text-green-700 dark:text-green-400";
      case "intermediate":
        return "text-yellow-700 dark:text-yellow-400";
      case "advanced":
        return "text-red-700 dark:text-red-400";
      default:
        return "text-gray-700 dark:text-gray-400";
    }
  };

  return (
    <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 text-sm">
      <div className="flex items-center gap-1.5">
        <Gauge className={`w-5 h-5 ${switchColor(difficulty)}`} />
        <h3 className="text-base sm:text-lg font-semibold text-foreground">Difficulty:</h3>
      </div>
      <span className={`font-medium capitalize ${switchColor(difficulty)}`}>
        {difficulty}
      </span>
    </div>
  );
}

// Reusable Quiz Grid
function QuizGrid() {
  return (
    <div className="grid grid-cols-1 xs:grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4 p-2 sm:p-3 mt-5">
      {[1, 2, 3].map((i) => (
        <SingalQuizCard key={i} />
      ))}
    </div>
  );
}

function AllQuizzesPageCard({ category }: { category: string }) {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <header className="mb-6">
        <h2 className="text-xl sm:text-2xl font-bold text-foreground">
          Explore {category} Quizzes
        </h2>
        <p className="mt-1 text-sm sm:text-base text-muted-foreground">
          Test your {category} knowledge with these quizzes. Challenge yourself and improve your skills! 
        </p>
      </header>

      {/* Difficulty Sections */}
      <DifficultySection difficulty="Beginner" category={category} />
      <QuizGrid />

      <DifficultySection difficulty="Intermediate" category={category} />
      <QuizGrid />

      <DifficultySection difficulty="Advanced" category={category} />
      <QuizGrid />
    </div>
  );
}

export default AllQuizzesPageCard;