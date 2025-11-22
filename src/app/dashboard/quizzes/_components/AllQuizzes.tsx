import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  IconBrandCucumber,
  IconBrandJavascript,
  IconBrandPython,
  IconFilter,
} from "@tabler/icons-react";
import React, { useState, useMemo } from "react";
import AllQuizzesPageCard from "./AllQuizzesPageCard";
import { PublicQuizType } from "@/app/data/quiz/get-public-quizzes";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface iAppProps {
  quizzes: PublicQuizType[];
}

function AllQuizzes({ quizzes }: iAppProps) {
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  const iconColors = {
    easy: "bg-green-500/10 text-green-500",
    medium: "bg-yellow-500/10 text-yellow-500",
    hard: "bg-red-500/10 text-red-500",
    default: "bg-gray-500/10 text-gray-500",
  };

  // Get unique categories
  const categories = useMemo(() => {
    const cats = quizzes.map((quiz) => quiz.category).filter(Boolean);
    return [...new Set(cats)];
  }, [quizzes]);

  // Filter quizzes based on selected categories
  const filteredQuizzes = useMemo(() => {
    if (selectedCategories.length === 0) return quizzes;
    return quizzes.filter((quiz) => selectedCategories.includes(quiz.category));
  }, [quizzes, selectedCategories]);

  // Calculate quiz counts for each difficulty
  const quizCounts = useMemo(() => {
    const counts = {
      all: filteredQuizzes.length,
      easy: filteredQuizzes.filter((quiz) => quiz.level === "EASY").length,
      medium: filteredQuizzes.filter((quiz) => quiz.level === "MEDIUM").length,
      hard: filteredQuizzes.filter((quiz) => quiz.level === "HARD").length,
    };
    return counts;
  }, [filteredQuizzes]);

  return (
    <Card>
      <div className="p-4 border-b">
        <div className="flex items-center justify-between">
          <h2 className="text-lg font-semibold">All Quizzes</h2>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                <IconFilter className="h-4 w-4 mr-2" />
                Filter by Category
                {selectedCategories.length > 0 && (
                  <span className="ml-2 bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                    {selectedCategories.length}
                  </span>
                )}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              {categories.map((category) => (
                <DropdownMenuCheckboxItem
                  key={category}
                  checked={selectedCategories.includes(category)}
                  onCheckedChange={(checked) => {
                    if (checked) {
                      setSelectedCategories([...selectedCategories, category]);
                    } else {
                      setSelectedCategories(
                        selectedCategories.filter((c) => c !== category)
                      );
                    }
                  }}
                >
                  {category}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <Tabs
        defaultValue="all"
        className="max-w-full bg-transparent shadow-sm p-2"
      >
        <TabsList className="grid w-full grid-cols-4 gap-4">
          <TabsTrigger value="all" className="h-8 rounded-md">
            <span>All ({quizCounts.all})</span>
          </TabsTrigger>
          <TabsTrigger value="easy" className="h-8 rounded-md">
            <IconBrandJavascript
              className={`size-5 p-1 rounded-md ${iconColors.easy}`}
            />
            <span>Easy ({quizCounts.easy})</span>
          </TabsTrigger>
          <TabsTrigger value="medium" className="h-8 rounded-md">
            <IconBrandPython
              className={`size-5 p-1 rounded-md ${iconColors.medium}`}
            />
            <span>Medium ({quizCounts.medium})</span>
          </TabsTrigger>
          <TabsTrigger value="hard" className="h-8 rounded-md">
            <IconBrandCucumber
              className={`size-5 mr-2 rounded-md ${iconColors.hard}`}
            />
            <span>Hard ({quizCounts.hard})</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="all" className="mt-11">
          <AllQuizzesPageCard difficulty="ALL" quizzes={filteredQuizzes} />
        </TabsContent>
        <TabsContent value="easy" className="mt-11">
          <AllQuizzesPageCard difficulty="EASY" quizzes={filteredQuizzes} />
        </TabsContent>
        <TabsContent value="medium" className="mt-11">
          <AllQuizzesPageCard difficulty="MEDIUM" quizzes={filteredQuizzes} />
        </TabsContent>
        <TabsContent value="hard" className="mt-11">
          <AllQuizzesPageCard difficulty="HARD" quizzes={filteredQuizzes} />
        </TabsContent>
      </Tabs>
    </Card>
  );
}

export default AllQuizzes;
