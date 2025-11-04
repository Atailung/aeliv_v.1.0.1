import { AdminCoursesType } from "@/app/data/admin/admin-get-courses";
import { Button, buttonVariants } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card"; // Assuming this is a proper Card component
import { useConstructUrl } from "@/hooks/use-construct";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";
import { BookOpen, Coins, Edit, Eye, MoreVertical,  Pencil,  TimerIcon, Trash2 } from "lucide-react"; // Changed icons for clarity
import Image from "next/image";
import Link from "next/link";

interface iAppProps {
    data: AdminCoursesType;
   
}


export function AdminCoursesCard({ data }: iAppProps) {
    // Assuming data.filekey is available and useConstructUrl works
    const thumbnailUrl = useConstructUrl(data.filekey); 


    return (

       <Card className=" group relative py-0 gap-0 overflow-hidden">
        {/* dropdownmenu */}
         
           <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-3 right-3 p-2 rounded-lg border border-transparent transition-all duration-200 hover:border-border hover:bg-accent/50 dark:hover:bg-accent/30"
        >
          <MoreVertical className="h-4 w-4 text-muted-foreground transition-colors hover:text-foreground" />
          <span className="sr-only">Course menu</span>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent
        align="end"
        className="  mt-2 rounded-xl border border-border bg-popover shadow-lg backdrop-blur-sm dark:border-border/60 dark:bg-popover/95"
      >
        <DropdownMenuItem asChild className="cursor-pointer group">
          <Link
            href={`/admin/courses/${data.id}/edit`}
            className="flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-all duration-150 hover:bg-accent/50 dark:hover:bg-accent/20"
          >
            <Pencil className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            <span className="font-medium text-foreground">Edit Course</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuItem asChild className="cursor-pointer group">
          <Link
            href={`/courses/${data.slug}`}
            className="flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-all duration-150 hover:bg-accent/50 dark:hover:bg-accent/20"
          >
            <Eye className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            <span className="font-medium text-foreground">View Stats</span>
          </Link>
        </DropdownMenuItem>

        <DropdownMenuSeparator className="my-1 bg-border/50 dark:bg-border/30" />

        <DropdownMenuItem asChild className="cursor-pointer group">
          <Link
            href={`/admin/courses/${data.id}/delete`}
            className="flex items-center gap-3 px-3 py-2 text-sm rounded-md transition-all duration-150 hover:bg-destructive/10 dark:hover:bg-destructive/20"
          >
            <Trash2 className="h-4 w-4 text-destructive transition-colors" />
            <span className="font-medium text-destructive">Delete Course</span>
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>

        <Image
            src={thumbnailUrl || "/placeholder-image.png"}
            alt="Course Thumbnail"
            className="w-full rounded-t-lg aspect-video h-fit object-cover"
            width={400}
            height={225}
        />

        <CardContent className="p-4">
            <Link href={`/admin/courses/${data.id}/edit`} className=" line-clamp-2 text-lg  hover:underline group-hover:text-primary font-medium" >
                {data.title}
            </Link>

            <p className="line-clamp-2 text-sm text-muted-foreground leading-tight mt-2 ">{data.smallDescription}</p>

            <div className="mt-4 flex items-center gap-x-5 ">
                <div className="flex items-center gap-x-2">
                    <TimerIcon className="size-6 p-1 rounded-md text-primary bg-primary/10" />
                    <span className="text-sm text-muted-foreground">{data.duration}h</span>
                </div>
                <div className="flex items-center gap-x-2">
                    <BookOpen className="size-6 p-1 rounded-md text-primary bg-primary/10" />
                    <span className="text-sm text-muted-foreground">{data.level}</span>
                </div>
                 <div className="flex items-center gap-x-2">
                    <Coins className="size-6 p-1 rounded-md text-primary bg-primary/10" />
                    <span className="text-sm text-muted-foreground">{data.price}</span>
                </div>
            </div>
            <br />
            <div className="flex items-center gap-x-2 justify-between">
                <p className="flex items-center gap-x-2">
                    {data.User.image && (
                        <Image
                        src={data.User.image}
                        alt={data.User.name}
                        className="w-6 h-6 rounded-full"
                        width={24}
                        height={24}
                        />
                    )}
                    <span className="text-sm font-medium">{data.User.name}</span>
                </p>
                 <span className="text-sm text-muted-foreground">{data.createdAt.toLocaleDateString()} </span>
            </div>

            <Link href={`/admin/courses/${data.id}/edit`} className={buttonVariants({ variant: "outline" }) + " mt-6 w-full justify-center"}>
               Edit Course <Edit className="size-4" />
            </Link>
        </CardContent>
       </Card>
    )
}