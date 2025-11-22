"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { toast } from "sonner";

export default function DeleteQuizPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const id = searchParams.get("id");

  useEffect(() => {
    if (!id) {
      toast.error("No quiz ID provided");
      router.push("/admin/quizzes");
      return;
    }

    // Redirect to admin quizzes page since deletion should be handled via actions
    router.push("/admin/quizzes");
  }, [id, router]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-4">Redirecting...</h1>
        <p className="text-muted-foreground">
          Please wait while we redirect you.
        </p>
      </div>
    </div>
  );
}
