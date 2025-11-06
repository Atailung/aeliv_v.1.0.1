import { AdminCoursesType } from "@/app/data/admin/admin-get-courses";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useConstructUrl } from "@/hooks/use-construct";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { 
  BadgeDollarSign, 
  ChartNoAxesColumnIncreasing, 
  Edit, 
  Eye, 
  MoreVertical, 
  Pencil, 
  TimerIcon, 
  Trash2, 
  Star,
  Users,
  Calendar
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { cn } from "@/lib/utils";

interface iAppProps {
    data: AdminCoursesType;
}

// Status color mapping
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case 'published':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    case 'draft':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
    case 'archived':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    default:
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
  }
};

export function AdminCoursesCard({ data }: iAppProps) {
    const thumbnailUrl = useConstructUrl(data.filekey);

    return (
        <Card className="group relative overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-card/50 backdrop-blur-sm hover:bg-card/80">
            {/* Status Badge */}
            <Badge 
              className={cn(
                "absolute top-3 left-3 z-10 text-xs font-medium px-2 py-1 rounded-full border-0",
                getStatusColor(data.status)
              )}
            >
              {data.status}
            </Badge>

            {/* Action Menu */}
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="absolute top-3 right-3 z-10 h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm border border-border/50 opacity-0 group-hover:opacity-100 transition-all duration-200 hover:bg-background hover:border-border hover:scale-105"
                    >
                        <MoreVertical className="h-4 w-4" />
                        <span className="sr-only">Course menu</span>
                    </Button>
                </DropdownMenuTrigger>

                <DropdownMenuContent
                    align="end"
                    className="w-48 mt-2 rounded-xl border border-border/80 bg-popover/95 shadow-xl backdrop-blur-md"
                >
                    <DropdownMenuItem asChild className="cursor-pointer group/item">
                        <Link
                            href={`/admin/courses/${data.id}/edit`}
                            className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all duration-150 hover:bg-accent/60 focus:bg-accent/60"
                        >
                            <Pencil className="h-4 w-4 text-muted-foreground group-hover/item:text-primary transition-colors" />
                            <span className="font-medium">Edit Course</span>
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuItem asChild className="cursor-pointer group/item">
                        <Link
                            href={`/courses/${data.slug}`}
                            className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all duration-150 hover:bg-accent/60 focus:bg-accent/60"
                        >
                            <Eye className="h-4 w-4 text-muted-foreground group-hover/item:text-blue-500 transition-colors" />
                            <span className="font-medium">View Course</span>
                        </Link>
                    </DropdownMenuItem>

                    <DropdownMenuSeparator className="my-1 bg-border/60" />

                    <DropdownMenuItem asChild className="cursor-pointer group/item">
                        <Link
                            href={`/admin/courses/${data.id}/delete`}
                            className="flex items-center gap-3 px-3 py-2.5 text-sm rounded-lg transition-all duration-150 hover:bg-destructive/10 focus:bg-destructive/10"
                        >
                            <Trash2 className="h-4 w-4 text-destructive" />
                            <span className="font-medium text-destructive">Delete Course</span>
                        </Link>
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            {/* Course Thumbnail */}
            <div className="relative overflow-hidden">
                <Image
                    src={thumbnailUrl || "/placeholder-image.png"}
                    alt={`${data.title} thumbnail`}
                    className="w-full aspect-video object-cover transition-transform duration-300 group-hover:scale-105"
                    width={400}
                    height={225}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </div>

            <CardContent className="p-6 space-y-4">
                {/* Course Title */}
                <div className="space-y-2">
                    <Link 
                        href={`/admin/courses/${data.id}/edit`} 
                        className="block text-lg font-semibold text-foreground hover:text-primary transition-colors duration-200 line-clamp-2 leading-tight"
                    >
                        {data.title}
                    </Link>
                    <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        {data.smallDescription}
                    </p>
                </div>

                {/* Course Stats */}
                <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                            <div className="p-1.5 rounded-md bg-primary/10">
                                <TimerIcon className="h-3.5 w-3.5 text-primary" />
                            </div>
                            <span className="font-medium">{data.duration}h</span>
                        </div>
                        
                        <div className="flex items-center gap-1.5">
                            <div className="p-1.5 rounded-md bg-blue-500/10">
                                <ChartNoAxesColumnIncreasing className="h-3.5 w-3.5 text-blue-500" />
                            </div>
                            <span className="font-medium capitalize">{data.level.toLowerCase()}</span>
                        </div>
                        
                        <div className="flex items-center gap-1.5">
                            <div className="p-1.5 rounded-md bg-emerald-500/10">
                                <BadgeDollarSign className="h-3.5 w-3.5 text-emerald-500" />
                            </div>
                            <span className="font-medium">NRs.{data.price}</span>
                        </div>
                    </div>
                </div>

                {/* Instructor Info */}
                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <div className="flex items-center gap-3">
                        {data.User.image ? (
                            <Image
                                src={data.User.image}
                                alt={data.User.name}
                                className="w-8 h-8 rounded-full border-2 border-border/50"
                                width={32}
                                height={32}
                            />
                        ) : (
                            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                                <span className="text-sm font-medium text-primary">
                                    {data.User.name.charAt(0).toUpperCase()}
                                </span>
                            </div>
                        )}
                        <div className="flex flex-col">
                            <span className="text-sm font-medium text-foreground">{data.User.name}</span>
                            <span className="text-xs text-muted-foreground">Instructor</span>
                        </div>
                    </div>
                    
                    <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                        <Calendar className="h-3.5 w-3.5" />
                        <span>{data.createdAt.toLocaleDateString()}</span>
                    </div>
                </div>

                {/* Action Button */}
                <Link 
                    href={`/admin/courses/${data.id}/edit`} 
                    className={cn(
                        buttonVariants({ variant: "outline" }),
                        "w-full justify-center gap-2 mt-6 transition-all duration-200 hover:bg-primary hover:text-primary-foreground hover:border-primary group-hover:shadow-md"
                    )}
                >
                    <Edit className="h-4 w-4" />
                    Edit Course
                </Link>
            </CardContent>
        </Card>
    );
}



export function AdminCoursesSkeleton() {
    return (
        <Card className="group relative overflow-hidden border-0 shadow-md bg-card/50 backdrop-blur-sm">
            {/* Status Badge Skeleton */}
            <div className="absolute top-3 left-3 z-10">
                <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            
            {/* Action Menu Skeleton */}
            <div className="absolute top-3 right-3 z-10">
                <Skeleton className="h-8 w-8 rounded-full" />
            </div>

            {/* Thumbnail Skeleton */}
            <div className="relative overflow-hidden">
                <Skeleton className="w-full aspect-video" />
            </div>

            <CardContent className="p-6 space-y-4">
                {/* Title and Description Skeleton */}
                <div className="space-y-2">
                    <Skeleton className="h-6 w-4/5" />
                    <Skeleton className="h-4 w-full" />
                    <Skeleton className="h-4 w-3/4" />
                </div>

                {/* Stats Skeleton */}
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                            <Skeleton className="h-6 w-6 rounded-md" />
                            <Skeleton className="h-4 w-8" />
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Skeleton className="h-6 w-6 rounded-md" />
                            <Skeleton className="h-4 w-12" />
                        </div>
                        <div className="flex items-center gap-1.5">
                            <Skeleton className="h-6 w-6 rounded-md" />
                            <Skeleton className="h-4 w-16" />
                        </div>
                    </div>
                </div>

                {/* Instructor Info Skeleton */}
                <div className="flex items-center justify-between pt-4 border-t border-border/50">
                    <div className="flex items-center gap-3">
                        <Skeleton className="w-8 h-8 rounded-full" />
                        <div className="flex flex-col gap-1">
                            <Skeleton className="h-4 w-20" />
                            <Skeleton className="h-3 w-16" />
                        </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                        <Skeleton className="h-3.5 w-3.5" />
                        <Skeleton className="h-3 w-16" />
                    </div>
                </div>

                {/* Action Button Skeleton */}
                <Skeleton className="h-10 w-full rounded-md mt-6" />
            </CardContent>
        </Card>
    );
}