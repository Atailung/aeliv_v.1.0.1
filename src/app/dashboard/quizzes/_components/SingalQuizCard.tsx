import { Button, buttonVariants } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Gauge, Play } from "lucide-react";
import Link from "next/link";
import React from "react";



function SingalQuizCard() {
  // Responsive icon size: 1.75rem → 2.5rem
  const iconSize = "clamp(1.75rem, 5vw, 2.5rem)";

  return (
    <Card className="w-full max-w-sm mx-auto p-4 sm:p-5 md:p-6 flex flex-col justify-between gap-4 sm:gap-5 h-full shadow-sm hover:shadow-md transition-shadow">
      {/* Header */}
      <CardHeader className="p-0">
        <header className="flex items-center gap-3">
          <div
            className="bg-primary/10 rounded-full flex items-center justify-center shrink-0"
            style={{ width: iconSize, height: iconSize }}
          >
            <CheckCircle className="text-green-500" style={{ width: `calc(${iconSize} * 0.75)`, height: `calc(${iconSize} * 0.75)` }} />
          </div>
          <div className="flex flex-col min-w-0 flex-1">
            <h2 className="text-base sm:text-lg font-medium truncate">Quiz Title</h2>
            <p className="text-xs sm:text-sm text-slate-400">10 Questions</p>
          </div>
        </header>
      </CardHeader>

      {/* Content */}
      <CardContent className="p-0">
        <section className="flex flex-col gap-3 text-sm">
          <div className="flex items-center gap-2 sm:gap-3 w-full text-xs sm:text-sm">
            <span className="text-slate-600 font-medium whitespace-nowrap">Score</span>
            <Progress className="h-1.5 flex-1" value={20} />
            <span className="text-slate-700 font-medium whitespace-nowrap">20%</span>
          </div>
        </section>
      </CardContent>

      {/* Footer */}
      <CardFooter className="p-0 flex justify-between items-center gap-3">
        <div className="flex items-center gap-1.5 text-slate-500 text-xs sm:text-sm">
          <Gauge className="w-5 h-5 sm:w-6 sm:h-6" />
          <span className="font-medium">Easy</span>
        </div>
        <Link
          href={`/dashboard/quizzes/${"quiz-id"}`}
         
          className={buttonVariants({ className: "font-medium text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 flex items-center gap-1.5 min-w-fit"})}
        >
          <Play className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span className="hidden xs:inline">Play</span>
          <span className="xs:hidden">Go</span>
        </Link>
      </CardFooter>
    </Card>
  );
}

export default SingalQuizCard;