import { getIndividualCourse } from "@/app/data/course/get-course";
import Image from "next/image";
import { env } from "@/lib/env";
import {
  IconBook,
  IconCategory,
  IconChartBar,
  IconChevronDown,
  IconClock,
  IconPlayerPlay,
} from "@tabler/icons-react";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { RenderDescription } from "@/components/rich-text-editor/RenderDescription";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Card, CardContent } from "@/components/ui/card";
import { CheckIcon } from "lucide-react";
import { checkIfCourseBought } from "@/app/data/user/user-is-enrolled";
import Link from "next/link";
import EnrollmentButton from "./_components/EnrollmentButton";
import { buttonVariants } from "@/components/ui/button";

type Params = Promise<{ slug: string }>;

export default async function SlugPage({ params }: { params: Params }) {
  const { slug } = await params;
  const course = await getIndividualCourse(slug);
  const isEnrolled = await checkIfCourseBought(course.id);

  return (
    <div className="min-h-screen bg-gradient-to-b from-background via-background to-muted/30">
      {/* Hero Section */}
      <div className="relative h-96 w-full overflow-hidden bg-muted">
        <Image
          src={`https://${env.NEXT_PUBLIC_S3_BUCKET_NAME_IMAGES}.t3.storage.dev/${course.filekey}`}
          alt="Course Thumbnail"
          fill
          priority
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-black/30 to-transparent" />
      </div>

      <div className="mx-auto max-w-6xl px-6 py-12">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-12">
            {/* Course Header */}
            <div className="space-y-6">
              <div className="space-y-3">
                <h1 className="text-4xl font-bold text-foreground text-balance">
                  {course.title}
                </h1>
                <p className="text-lg text-muted-foreground text-balance">
                  {course.smallDescription}
                </p>
              </div>

              <div className="flex flex-wrap gap-3">
                <Badge
                  variant="secondary"
                  className="flex items-center gap-2 px-4 py-2"
                >
                  <div className="flex-shrink-0 rounded-full p-1 bg-green-500/20">
                    <IconChartBar className="size-6" />
                  </div>
                  <span className="text-sm">{course.level}</span>
                </Badge>

                <Badge
                  variant="secondary"
                  className="flex items-center gap-2 px-4 py-2"
                >
                  <div className="flex-shrink-0 rounded-full p-1 bg-blue-500/20">
                    <IconCategory className="size-6" />
                  </div>
                  <span className="text-sm">{course.category}</span>
                </Badge>

                <Badge
                  variant="secondary"
                  className="flex items-center gap-2 px-4 py-2"
                >
                  <div className="flex-shrink-0 rounded-full p-1 bg-yellow-500/20">
                    <IconClock className="size-6" />
                  </div>
                  <span className="text-sm">{course.duration} Hours</span>
                </Badge>
              </div>

              <div className="flex items-center gap-4 pt-2">
                {course.User.image ? (
                  <Image
                    src={course.User.image || "/placeholder.svg"}
                    alt={course.User.name}
                    className="w-12 h-12 rounded-full border-2 border-primary/20"
                    width={48}
                    height={48}
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                    <span className="text-sm font-semibold text-primary">
                      {course.User.name.charAt(0).toUpperCase()}
                    </span>
                  </div>
                )}
                <div className="flex flex-col">
                  <span className="font-semibold text-foreground">
                    {course.User.name}
                  </span>
                  <span className="text-sm text-muted-foreground">
                    Course Instructor
                  </span>
                </div>
              </div>
            </div>

            <Separator className="bg-border/40" />

            {/* Course Description */}
            <div className="space-y-6">
              <h2 className="text-2xl font-bold text-foreground">
                About this course
              </h2>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <RenderDescription json={JSON.parse(course.description)} />
              </div>
            </div>

            <Separator className="bg-border/40" />

            {/* Course Content */}
            <div className="space-y-8">
              <div className="space-y-2">
                <h2 className="text-2xl font-bold text-foreground">
                  Course Content
                </h2>
                <p className="text-muted-foreground">
                  {course.chapter.length} Chapters •{" "}
                  {course.chapter.reduce(
                    (total, chapter) => total + chapter.Lesson.length,
                    0
                  ) || 0}{" "}
                  Lessons
                </p>
              </div>

              <div className="space-y-3">
                {course.chapter.map((chapter, index) => (
                  <Collapsible key={chapter.id} defaultOpen={index === 0}>
                    <Card className="border-border/50 hover:border-border transition-colors duration-200 overflow-hidden">
                      <CollapsibleTrigger className="w-full">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between gap-4">
                            <div className="flex items-center gap-4 flex-1 min-w-0">
                              <div className="flex-shrink-0 w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center ring-1 ring-primary/20">
                                <span className="font-bold text-lg text-primary">
                                  {index + 1}
                                </span>
                              </div>
                              <div className="min-w-0">
                                <h3 className="text-base font-semibold text-foreground text-left">
                                  {chapter.title}
                                </h3>
                                <p className="text-sm text-muted-foreground text-left">
                                  {chapter.Lesson.length} lesson
                                  {chapter.Lesson.length !== 1 ? "s" : ""}
                                </p>
                              </div>
                            </div>
                            <IconChevronDown className="w-5 h-5 text-muted-foreground transition-transform duration-300 data-[state=open]:rotate-180 flex-shrink-0" />
                          </div>
                        </CardContent>
                      </CollapsibleTrigger>

                      <CollapsibleContent>
                        <div className="border-t border-border/40 bg-muted/40 px-0">
                          <div className="space-y-2 p-6">
                            {chapter.Lesson.map((lesson, lessonIndex) => (
                              <div
                                key={lesson.id}
                                className="flex items-center gap-4 rounded-lg p-4 hover:bg-accent/50 transition-colors duration-200 cursor-pointer group bg-background/50"
                              >
                                <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors duration-200">
                                  <IconPlayerPlay className="w-5 h-5 text-primary fill-primary" />
                                </div>
                                <div className="min-w-0 flex-1">
                                  <h4 className="text-sm font-medium text-foreground">
                                    {lesson.title}
                                  </h4>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    Lessons hora change {lessonIndex + 1}
                                  </p>
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Card>
                  </Collapsible>
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="sticky top-20 space-y-4">
              {/* Price Card */}
              <Card className="border-border/50">
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-muted-foreground">
                      Course Price
                    </p>
                    <p className="text-4xl font-bold text-primary">
                      {new Intl.NumberFormat("en-US", {
                        style: "currency",
                        currency: "NPR",
                      }).format(course.price)}
                    </p>
                  </div>

                  {isEnrolled ? (
                    <Link href="/dashboard" className={buttonVariants({ variant: "outline", className: "w-full" })}> Watch Course</Link>
                  ) : (
                    <EnrollmentButton courseId={course.id} />
                  )}

                  <p className="text-xs text-center text-muted-foreground">
                    30-Day Money-Back Guarantee
                  </p>
                </CardContent>
              </Card>

              {/* Course Benefits */}
              <Card className="border-border/50">
                <CardContent className="p-6 space-y-6">
                  <h3 className="font-semibold text-foreground">
                    What you&apos;ll get
                  </h3>

                  <div className="space-y-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mt-0.5">
                        <IconClock className="w-5 h-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm text-foreground">
                          {course.duration} Hours of Content
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Lifetime access to all materials
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mt-0.5">
                        <IconBook className="w-5 h-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm text-foreground">
                          {course.chapter.reduce(
                            (total, chapter) => total + chapter.Lesson.length,
                            0
                          ) || 0}{" "}
                          Lessons
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Across {course.chapter.length} chapters
                        </p>
                      </div>
                    </div>

                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mt-0.5">
                        <IconChartBar className="w-5 h-5 text-primary" />
                      </div>
                      <div className="min-w-0">
                        <p className="font-medium text-sm text-foreground">
                          {course.level} Level
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Designed for your skill level
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Includes */}
              <Card className="border-border/50">
                <CardContent className="p-6 space-y-4">
                  <h3 className="font-semibold text-foreground">
                    This course includes
                  </h3>
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-sm">
                      <div className="flex-shrink-0 rounded-full p-1 bg-green-500/10 text-green-600">
                        <CheckIcon className="w-4 h-4" />
                      </div>
                      <span className="text-foreground">
                        Full lifetime access
                      </span>
                    </li>
                    <li className="flex items-center gap-3 text-sm">
                      <div className="flex-shrink-0 rounded-full p-1 bg-green-500/10 text-green-600">
                        <CheckIcon className="w-4 h-4" />
                      </div>
                      <span className="text-foreground">
                        Access on Mobile & Desktop
                      </span>
                    </li>
                    <li className="flex items-center gap-3 text-sm">
                      <div className="flex-shrink-0 rounded-full p-1 bg-green-500/10 text-green-600">
                        <CheckIcon className="w-4 h-4" />
                      </div>
                      <span className="text-foreground">
                        Certificate of Completion
                      </span>
                    </li>
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
