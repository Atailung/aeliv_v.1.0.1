import React from "react";
import SingalQuizCard from "./SingalQuizCard";
import SortingDropDown from "./SortingDropDown";

const CurrentQuizzes = () => {
  return (
    <div className="mt-2">
      {/* sorting dropdown */}
      <div className="flex justify-end items-center">
        <span className="text-sm text-foreground/60">Sort by:</span>
        <SortingDropDown />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-3">
        {[1, 2, 3, 4, 5, 6].map((quiz) => (
          <SingalQuizCard key={quiz} />
        ))}
      </div>
    </div>
  );
};

export default CurrentQuizzes;
