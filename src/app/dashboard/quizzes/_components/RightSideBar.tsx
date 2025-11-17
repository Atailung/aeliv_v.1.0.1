import { Card } from "@/components/ui/card";
import React from "react";
import StatCard from "./StatCard";
import CircularProgress from "./CircularProgress";

function RightSideBar() {
  const statCards = [
    { id: "1", value: 12, label: "Total Quizzes" },
    { id: "2", value: 8, label: "Completed Quizzes" },
    { id: "3", value: 4, label: "Pending Quizzes" },
    { id: "4", value: "85%", label: "Average Score" },

  ];
  return (
    <Card className="border shadow-none border-none p-8 h-svh">
        <span> Quizzes Summary</span>
            <CircularProgress />
        <div className="mt-11 gap-4 grid grid-cols-2">
            {statCards.map((card) => (
                <StatCard key={card.id} value={card.value} label={card.label} />
            ))}
        </div>
    </Card>
  )
  
}

export default RightSideBar;
