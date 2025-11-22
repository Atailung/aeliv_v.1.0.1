import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

import { format } from "date-fns";
import { Clock, Trophy, BarChart3, Play } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { PublicQuizType } from "@/app/data/quiz/get-public-quizzes";

interface PublicQuizCardProps {
  quiz: PublicQuizType;
}

export function PublicQuizCard({ quiz }: PublicQuizCardProps) {
  const {
    title,
    description,
    imageUrl,
    timeLimit,
    totalPoints,
    level,
    category,
    createdAt,
    _count,
    lesson,
  } = quiz;

  const course = lesson?.Chapter?.Course;
  const chapterTitle = lesson?.Chapter?.title;
  const lessonTitle = lesson?.title;

  const getLevelColor = (level: string) => {
    switch (level) {
      case "EASY":
        return "bg-green-100 text-green-800 border-green-200";
      case "MEDIUM":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "HARD":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  return (
    <Card className="overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
      {/* Image */}
      <div className="relative aspect-video bg-muted">
        {imageUrl ? (
          <Image src={imageUrl} alt={title} fill className="object-cover" />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-linear-to-br from-purple-100 to-blue-100">
            <Trophy className="h-16 w-16 text-muted-foreground/30" />
          </div>
        )}
        <div className="absolute right-2 top-2">
          <Badge className={getLevelColor(level)}>{level}</Badge>
        </div>
      </div>

      <CardHeader>
        <div className="flex items-start justify-between">
          <CardTitle className="line-clamp-2 text-lg">{title}</CardTitle>
        </div>
        {description && (
          <CardDescription className="line-clamp-2 mt-2">
            {description}
          </CardDescription>
        )}
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Breadcrumb */}
        {course && (
          <div className="text-xs text-muted-foreground">
            <Link
              href={`/courses/${course.slug}`}
              className="hover:underline font-medium"
            >
              {course.title}
            </Link>
            {" > "}
            <span>{chapterTitle}</span>
            {" > "}
            <span>{lessonTitle}</span>
          </div>
        )}

        {/* Stats */}
        <div className="flex flex-wrap gap-3 text-sm">
          <div className="flex items-center gap-1">
            <Clock className="h-4 w-4 text-muted-foreground" />
            <span>{timeLimit ? `${timeLimit} min` : "No limit"}</span>
          </div>
          <div className="flex items-center gap-1">
            <Trophy className="h-4 w-4 text-muted-foreground" />
            <span>{totalPoints} pts</span>
          </div>
          <div className="flex items-center gap-1">
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
            <span>{_count.questions} questions</span>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2">
          <Badge variant="outline">{category}</Badge>
          <Badge variant="outline">{_count.attempts} attempts</Badge>
        </div>
      </CardContent>

      <CardFooter className="flex items-center justify-between border-t pt-4">
        <p className="text-xs text-muted-foreground">
          Created {format(new Date(createdAt), "MMM d, yyyy")}
        </p>

        <Button size="sm" asChild>
          <Link href={`/login`}>
            <Play className="mr-1 h-4 w-4" />
            Start Quiz
          </Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
