"use client";

import { Button } from "@/components/ui/button";
import { tryCatch } from "@/hooks/try-catch";
import React, { useTransition } from "react";
import { toast } from "sonner";
import { enrollInCourseAction } from "../action";
import { Loader2 } from "lucide-react";

function EnrollmentButton({ courseId }: { courseId: string }) {
  const [isPending, startTransition] = useTransition();

  function onSubmit() {
    startTransition(async () => {
      const { data: result, error } = await tryCatch(
        enrollInCourseAction(courseId)
      );
      if (error) {
        console.error("Error enrolling in course:", error);
        toast.error("Failed to enroll in course. Please try again.");
        return;
      }
      if (result.status === "success") {
        toast.success("Course enrolled successfully!");
      } else if (result?.status === "error") {
        toast.error(result.message);
      }
    });
  }
  return (
    <Button
      onClick={onSubmit}
      disabled={isPending}
      className="w-full h-12 text-base font-semibold rounded-lg"
    >
      {isPending ? (
        <>
          <Loader2 className="animate-spin size-4" /> Loading....
        </>
      ) : (
        "Enroll Now"
      )}
    </Button>
  );
}

export default EnrollmentButton;
