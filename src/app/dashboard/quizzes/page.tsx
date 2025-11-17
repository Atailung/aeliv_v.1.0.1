"use client";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { PanelLeftOpen } from "lucide-react";
import React, { useState } from "react";
import CurrentQuizzes from "./_components/CurrentQuizzes";
import AllQuizzes from "./_components/AllQuizzes";
import RightSideBar from "./_components/RightSideBar";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function Quizzes() {
  const [isSelectedTab, setIsSelectedTab] = useState("completed");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
      {/* Mobile: Tabs + Toggle Button | Desktop: Grid */}
      <div className="flex flex-col lg:flex-row gap-6 lg:gap-8">
        {/* Main Content: Tabs */}
        <div className="w-full lg:w-3/4">
          <Tabs
            defaultValue={isSelectedTab}
            className="w-full"
            onValueChange={(value) => setIsSelectedTab(value)}
          >
            {/* Tabs List - Scrollable on Mobile */}
            <div className="flex items-center justify-between mb-4">
              <TabsList className="inline-flex h-auto p-0 bg-transparent border-b overflow-x-auto scrollbar-hide">
                <TabsTrigger
                  value="completed"
                  className={cn(
                    "px-3 py-2 text-sm font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary whitespace-nowrap flex items-center gap-2"
                  )}
                >
                  Completed
                  <Badge
                    variant={
                      isSelectedTab === "completed" ? "default" : "secondary"
                    }
                    className="text-xs"
                  >
                    0
                  </Badge>
                </TabsTrigger>
                <TabsTrigger
                  value="all"
                  className={cn(
                    "px-3 py-2 text-sm font-medium rounded-none border-b-2 border-transparent data-[state=active]:border-primary data-[state=active]:text-primary whitespace-nowrap flex items-center gap-2"
                  )}
                >
                  All Quizzes
                  <Badge
                    variant={isSelectedTab === "all" ? "default" : "secondary"}
                    className="text-xs"
                  >
                    0
                  </Badge>
                </TabsTrigger>
              </TabsList>

              {/* Sidebar Toggle Button - Mobile Only */}
              <Sheet open={isSidebarOpen} onOpenChange={setIsSidebarOpen}>
                <Tooltip>
                  <SheetTrigger asChild>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="lg:hidden shrink-0"
                      >
                        <PanelLeftOpen className="size-5 rotate-180" />
                      </Button>
                    </TooltipTrigger>
                  </SheetTrigger>
                  <TooltipContent>
                    <span>Open sidebar</span>
                  </TooltipContent>
                </Tooltip>
                <SheetContent
                  side="right"
                  className="w-[300px] sm:w-[350px] p-0"
                >
                  <SheetHeader className="p-4 border-b">
                    <SheetTitle>Quiz Info</SheetTitle>
                  </SheetHeader>
                  <div className="p-4">
                    <RightSideBar />
                  </div>
                </SheetContent>
              </Sheet>
            </div>

            {/* Tab Content */}
            <TabsContent value="completed" className="mt-4">
              <CurrentQuizzes />
            </TabsContent>
            <TabsContent value="all" className="mt-4">
              <AllQuizzes />
            </TabsContent>
          </Tabs>
        </div>

        {/* Desktop Sidebar */}
        <aside className="hidden lg:block lg:w-1/4">
          <RightSideBar />
        </aside>
      </div>
    </div>
  );
}

export default Quizzes;
