import { CheckCircle2, ArrowRight, BookOpen, Clock, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { getSuccessPageData } from "./action";
import Link from "next/link";
import Image from "next/image";
import { Suspense } from "react";
import { ConfettiWrapper } from "./confetti-wrapper";

interface SearchParams {
  session_id?: string;
  course?: string;
}

// Loading component for better UX
function SuccessPageSkeleton() {
  return (
    <div className="w-full min-h-screen flex flex-1 justify-center items-center">
      <Card className="w-[400px] animate-pulse">
        <CardHeader className="text-center">
          <div className="mx-auto w-16 h-16 bg-muted rounded-full mb-4"></div>
          <div className="h-6 bg-muted rounded mb-2"></div>
          <div className="h-4 bg-muted rounded"></div>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="h-4 bg-muted rounded"></div>
            <div className="h-4 bg-muted rounded w-3/4"></div>
            <div className="h-10 bg-muted rounded mt-6"></div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

// Optimized success content component
async function SuccessContent({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const resolvedSearchParams = await searchParams;
  const data = await getSuccessPageData(
    resolvedSearchParams.session_id,
    resolvedSearchParams.course
  );

  if (!data) {
    // Fallback for unauthenticated users
    return (
      <Card className="w-[400px]">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="relative bg-green-500/10 p-4 rounded-full border border-green-500/20">
              <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
            </div>
          </div>
          <CardTitle className="text-2xl">Payment Successful!</CardTitle>
          <CardDescription>
            Thank you for your purchase. You should receive a confirmation email
            shortly.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-muted-foreground text-center">
            Sign in to access your course and start learning immediately.
          </p>
          <Button asChild className="w-full">
            <Link href="/login">
              Sign In to Access Course
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    );
  }

  const { enrollment, course, user } = data;

  return (
    <Card className="w-[450px]">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          <div className="relative bg-green-500/10 p-4 rounded-full border border-green-500/20">
            <CheckCircle2 className="w-12 h-12 text-green-600 dark:text-green-400" />
          </div>
        </div>
        <CardTitle className="text-2xl">Welcome to Your Course!</CardTitle>
        <CardDescription>
          Payment successful. You're all set to start learning.
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Course Info */}
        <div className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg">
          {course.User?.image && (
            <Image
              src={course.User.image}
              alt={course.User.name || "Instructor"}
              width={40}
              height={40}
              className="rounded-full"
            />
          )}
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm truncate">{course.title}</h3>
            <p className="text-xs text-muted-foreground">
              by {course.User?.name}
            </p>
            <div className="flex items-center gap-2 mt-1">
              <Badge variant="secondary" className="text-xs">
                {course.level}
              </Badge>
              <span className="text-xs text-muted-foreground flex items-center gap-1">
                <Clock className="h-3 w-3" />
                {course.duration}
              </span>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 gap-3 text-center">
          <div className="p-3 bg-muted/30 rounded-lg">
            <BookOpen className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
            <p className="text-sm font-medium">{course.totalLessons} Lessons</p>
          </div>
          <div className="p-3 bg-muted/30 rounded-lg">
            <Users className="h-4 w-4 mx-auto mb-1 text-muted-foreground" />
            <p className="text-sm font-medium">Active</p>
          </div>
        </div>

        {/* Action Button */}
        <Button asChild className="w-full" size="lg">
          <Link href={`/course/${course.slug}`}>
            Start Learning Now
            <ArrowRight className="ml-2 h-4 w-4" />
          </Link>
        </Button>

        <p className="text-xs text-muted-foreground text-center">
          You can access your course anytime from your dashboard.
        </p>
      </CardContent>
    </Card>
  );
}

export default async function SuccessPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  return (
    <div className="w-full min-h-screen flex flex-1 justify-center items-center bg-gradient-to-br from-background to-muted/20">
      <ConfettiWrapper>
        <Suspense fallback={<SuccessPageSkeleton />}>
          <SuccessContent searchParams={searchParams} />
        </Suspense>
      </ConfettiWrapper>
    </div>
  );
}
