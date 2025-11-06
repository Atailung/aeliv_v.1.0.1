"use client"

import { CirclePlusIcon, BotOff as InboxOff, } from "lucide-react"
import Link from "next/link"
import type React from "react"
import { buttonVariants } from "../ui/button"

interface EmptyStateProps {
  title?: string
  description?: string
  actionLabel?: string
  onAction?: () => void
  icon?: React.ReactNode
}

export default function EmptyState({
  title = "No data yet",
  description = "Start by creating your first course to see it appear here",
  icon,
}: EmptyStateProps) {
  return (
    <div className="mt-32 flex flex-col flex-1 h-full items-center justify-center rounded-lg border border-dashed border-primary p-8 text-center">
      {/* Icon */}
      <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
        {icon || <InboxOff className="size-8 text-primary" />}
      </div>

      {/* Title */}
      <h3 className="mb-2 text-lg font-semibold text-primary">{title}</h3>

      {/* Description */}
      <p className="mb-6 max-w-sm text-sm ">{description}</p>

      {/* Action Button */} 
      <Link href="/admin/courses/create" className={buttonVariants({ variant: "default" })}>
        <CirclePlusIcon className="size-4 " />
        Create your first course
      </Link>
    </div>
  )
}
