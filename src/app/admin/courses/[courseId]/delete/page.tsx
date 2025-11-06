"use client";


import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { tryCatch } from "@/hooks/try-catch";
import Link from "next/link";
import { useTransition } from "react";
import { toast } from "sonner";
import { DeleteCourse } from "./action";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";
import { Loader2, Trash2 } from "lucide-react";

export default function DeleteCourseRoute() {
    const [isPending, startTransition] = useTransition();
    const { courseId } = useParams<{ courseId: string }>();
    const router = useRouter();
      function onSubmit() {
        startTransition(async () => {
          const { data: result, error } = await tryCatch(DeleteCourse(courseId));
          if (error) {
            console.error("Error deleting course:", error);
            toast.error("Failed to delete course. Please try again.");
            return;
          }
          if (result?.status === "success") {
            toast.success("Course created successfully!");
            router.push("/admin/courses");
          } else if (result?.status === "error") {
            toast.error(result.message);
          }
        });
      }
    return (
    <div className="max-w-xl mx-auto w-full">
        <Card className="mt-32 ">
            <CardHeader>
                <CardTitle>
                    Are you sure you want to delete this course?
                </CardTitle>
                <CardDescription>
                    This action cannot be undone. This will permanently delete the course and all its chapters and lessons.
                </CardDescription>
            </CardHeader>
            <CardContent className="flex justify-end">
                <Link href={`/admin/courses/`} className={buttonVariants({ variant: "outline" })}>
                    Cancel
                </Link>
             <Button variant="destructive" onClick={onSubmit} disabled={isPending} className="ml-2">
                {isPending ? <Loader2 className="animate-spin size-4" /> : <><Trash2 className="size-4" />Yes, Delete Course</>}
             </Button>
            </CardContent>

        </Card>
    </div>

    )
}