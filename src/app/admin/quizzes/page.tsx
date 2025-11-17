import { adminGetQuizzes } from "@/app/data/admin/admin-get-quizzes";
import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";
import React, { Suspense } from "react";

import EmptyState from "@/components/general/EmptyState";
import { Plus } from "lucide-react";
import {
  AdminQuizzesCard,
  AdminQuizzesCardSkeleton,
} from "./_components/AdminQuizzesCard";

export default function AdminQuizzesPage() {
  return (
    <>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Quizzes</h1>

        <Link
          href="/admin/quizzes/create"
          className={buttonVariants({ variant: "default" })}
        >
          <Plus className="size-4" />
          Create a Quiz
        </Link>
      </div>
      <Suspense fallback={<AdminQuizzesSkeletonLayout />}>
        <RenderQuizzes />
      </Suspense>
    </>
  );
}

async function RenderQuizzes() {
  const data = await adminGetQuizzes();

  return (
    <>
      {data.length === 0 ? (
        <EmptyState buttonText="Create a Quiz" />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {data.map((quiz) => (
            <AdminQuizzesCard key={quiz.id} data={quiz} />
          ))}
        </div>
      )}
    </>
  );
}

function AdminQuizzesSkeletonLayout() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <AdminQuizzesCardSkeleton key={index} />
      ))}
    </div>
  );
}
