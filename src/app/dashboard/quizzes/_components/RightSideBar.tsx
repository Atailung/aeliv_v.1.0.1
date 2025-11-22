// components/dashboard/RightSidebar.tsx
import { Card } from "@/components/ui/card";
import {
  BookOpen,
  Trophy,
  Clock,
  Target,
  TrendingUp,
  Calendar,
  Sparkles,
} from "lucide-react";
import { PublicQuizType } from "@/app/data/quiz/get-public-quizzes";
import { format } from "date-fns";
import { motion } from "framer-motion";
import CircularProgress from "./CircularProgress";

interface RightSidebarProps {
  quizzes: PublicQuizType[];
}

export default function RightSidebar({ quizzes }: RightSidebarProps) {
  const sortedQuizzes = [...quizzes].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );

  const totalQuizzes = quizzes.length;
  const totalAttempts = quizzes.reduce((sum, q) => sum + q._count.attempts, 0);
  const avgTime =
    totalQuizzes > 0
      ? Math.round(
          quizzes.reduce((sum, q) => sum + (q.timeLimit || 0), 0) / totalQuizzes
        )
      : 0;
  const totalQuestions = quizzes.reduce(
    (sum, q) => sum + q._count.questions,
    0
  );
  const completionRate = totalQuizzes > 0 ? totalAttempts / totalQuizzes : 0;

  // Recent activity (last 3 quizzes with attempts)
  const recentActivity = sortedQuizzes
    .filter((q) => q._count.attempts > 0)
    .slice(0, 3);

  return (
    <aside className="h-full w-full">
      <Card className="h-full border-0 shadow-2xl from-background via-background/98 to-primary/5 backdrop-blur-2xl rounded-3xl overflow-hidden flex flex-col relative">
        {/* Ambient gradient overlay */}
        <div className="absolute inset-0  from-primary/5 via-transparent to-accent/5 pointer-events-none" />

        {/* Content wrapper */}
        <div className="relative z-10 flex flex-col h-full">
          {/* Header with sparkle effect */}
          <div className="p-4 sm:p-6 lg:p-8 pb-3 sm:pb-4 border-b border-border/40">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <Sparkles className="h-5 w-5 text-primary animate-pulse" />
                  <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold tracking-tight-b ">
                    Learning Stats
                  </h2>
                </div>
                <p className="text-xs sm:text-sm text-muted-foreground/80 leading-relaxed line-clamp-2 ">
                  Track your progress and achievements
                </p>
              </div>
            </div>
          </div>

          {/* Scrollable content area */}
          <div className="flex-1 overflow-y-auto overflow-x-hidden scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
            {/* Circular Progress - Featured metric */}
            <div className="flex justify-center py-6 sm:py-8 px-4">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.7, ease: [0.34, 1.56, 0.64, 1] }}
              >
                <CircularProgress
                  percentage={Math.round(completionRate * 100)}
                  current={totalAttempts}
                  total={totalQuizzes}
                />
              </motion.div>
            </div>

            {/* Stats Grid - Responsive layout */}
            <div className="px-4 sm:px-6 lg:px-8 w-full">
              <div className="grid grid-cols-2 gap-2 sm:gap-3 lg:gap-4 mb-6">
                <StatItem
                  icon={
                    <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 line-clamp-2 truncate" />
                  }
                  label="Total Quizzes"
                  value={totalQuizzes}
                  color="text-blue-600 dark:text-blue-400"
                  bg="bg-blue-500/10"
                  borderColor="border-blue-500/20"
                  delay={0}
                />
                <StatItem
                  icon={
                    <Trophy className="h-4 w-4 sm:h-5 sm:w-5 line-clamp-2 truncate" />
                  }
                  label="Attempts"
                  value={totalAttempts}
                  color="text-amber-600 dark:text-amber-400"
                  bg="bg-amber-500/10"
                  borderColor="border-amber-500/20"
                  delay={0.1}
                />
                <StatItem
                  icon={
                    <Clock className="h-4 w-4 sm:h-5 sm:w-5 line-clamp-2 truncate" />
                  }
                  label="Avg. Time"
                  value={avgTime ? `${avgTime}m` : "—"}
                  color="text-purple-600 dark:text-purple-400"
                  bg="bg-purple-500/10"
                  borderColor="border-purple-500/20"
                  delay={0.2}
                />
                <StatItem
                  icon={
                    <Target className="h-4 w-4 sm:h-5 sm:w-5 line-clamp-2 truncate" />
                  }
                  label="Questions"
                  value={totalQuestions}
                  color="text-emerald-600 dark:text-emerald-400"
                  bg="bg-emerald-500/10"
                  borderColor="border-emerald-500/20"
                  delay={0.3}
                />
              </div>
            </div>

            {/* Recent Activity Section */}
            {recentActivity.length > 0 && (
              <div className="px-4 sm:px-6 lg:px-8 pb-6 sm:pb-8">
                <div className="bg-card/50 backdrop-blur-sm border border-border/50 rounded-2xl p-4 sm:p-5 shadow-lg">
                  <div className="flex items-center gap-2 mb-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <TrendingUp className="h-4 w-4 text-primary" />
                    </div>
                    <h3 className="font-bold text-sm sm:text-base text-foreground">
                      Recent Activity
                    </h3>
                  </div>

                  <div className="space-y-3">
                    {recentActivity.map((quiz, idx) => (
                      <motion.div
                        key={quiz.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4 + idx * 0.1, duration: 0.4 }}
                        className="group relative"
                      >
                        <div className="flex items-start gap-3 p-3   transition-all duration-300 hover:shadow-md">
                          {/* Animated indicator */}
                          <div className="shrink-0 mt-1">
                            <div className="relative">
                              <div className="w-2 h-2 rounded-full bg-primary" />
                              <div className="absolute inset-0 w-2 h-2 rounded-full bg-primary animate-ping opacity-75" />
                            </div>
                          </div>

                          {/* Content */}
                          <div className="flex-1 min-w-0">
                            <p className="text-xs sm:text-sm font-medium line-clamp-2 group-hover:text-primary transition-colors leading-snug mb-1">
                              {quiz.title}
                            </p>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              <Calendar className="h-3 w-3" />
                              <span>
                                {format(
                                  new Date(quiz.createdAt),
                                  "MMM d, yyyy"
                                )}
                              </span>
                            </div>
                          </div>

                          {/* Attempts badge */}
                          <div className="shrink-0">
                            <div className="px-2 py-1 rounded-lg bg-primary/15 border border-primary/20">
                              <span className="text-xs font-bold text-primary whitespace-nowrap">
                                {quiz._count.attempts}
                              </span>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Empty State */}
            {recentActivity.length === 0 && (
              <div className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 py-8 sm:py-12 text-center">
                <div className="relative">
                  <div className="absolute inset-0 bg-primary/5 blur-2xl rounded-full" />
                  <Calendar className="h-12 w-12 sm:h-16 sm:w-16 mb-4 text-muted-foreground/30 relative" />
                </div>
                <p className="text-sm sm:text-base font-semibold text-foreground/70 mb-1">
                  No attempts yet
                </p>
                <p className="text-xs sm:text-sm text-muted-foreground/60 max-w-[200px]">
                  Start your first quiz to see your activity here
                </p>
              </div>
            )}
          </div>
        </div>
      </Card>
    </aside>
  );
}

function StatItem({
  icon,
  label,
  value,
  color,
  bg,
  borderColor,
  delay,
}: {
  icon: React.ReactNode;
  label: string;
  value: string | number;
  color: string;
  bg: string;
  borderColor: string;
  delay: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ delay, duration: 0.5, ease: "easeOut" }}
      whileHover={{ scale: 1.03, y: -2 }}
      whileTap={{ scale: 0.98 }}
      className="group cursor-default"
    >
      <div
        className={`relative bg-card/60 backdrop-blur-sm border ${borderColor} hover:border-primary/30 rounded-2xl p-3 sm:p-4 text-center transition-all duration-300 hover:shadow-xl hover:shadow-primary/5 overflow-hidden`}
      >
        {/* Hover gradient effect */}
        <div className="absolute inset-0  from-primary/0 via-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="relative z-10">
          {/* Icon */}
          <div className="inline-flex mb-2 sm:mb-3">
            <div
              className={`p-2 sm:p-2.5 rounded-xl ${bg} ring-1 ring-inset ring-border/20 group-hover:ring-primary/30 transition-all duration-300`}
            >
              <div
                className={`${color} transition-transform duration-300 group-hover:scale-110`}
              >
                {icon}
              </div>
            </div>
          </div>

          {/* Value */}
          <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-foreground mb-1 tabular-nums">
            {value}
          </p>

          {/* Label */}
          <p className="text-[10px] sm:text-xs font-medium text-muted-foreground/80 leading-tight">
            {label}
          </p>
        </div>
      </div>
    </motion.div>
  );
}
