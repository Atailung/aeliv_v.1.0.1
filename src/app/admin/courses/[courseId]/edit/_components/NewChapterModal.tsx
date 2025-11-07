"use client";

import { Button } from "@/components/ui/button";
import { DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTrigger } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { ChapterSchemaType, ChapterSchema } from "@/lib/ZodSchemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Dialog, DialogTitle } from "@radix-ui/react-dialog";
import { Plus, Save } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { CreateChapter } from "../action";
import { toast } from "sonner";
import { tryCatch } from "@/hooks/try-catch";

export default function NewChapterModal({courseId}: {courseId: string}) {
    const [isOpen, setIsOpen] = useState(false);

    const [isPending, startTransition] = useTransition();
    
    const form = useForm<ChapterSchemaType>({
        resolver: zodResolver(ChapterSchema),
        defaultValues: {
          name: '',
         CourseId: courseId
        }
    })
    async function onSubmit(values: ChapterSchemaType) {
        startTransition(async () => {
            const {data: result, error } = await tryCatch(CreateChapter(values))

            if(error){
                toast.error("An unexpected error occured. please try again later.");
                return;
            }
            if (result.status === "success") {
                toast.success("Chapter created successfully");
                form.reset();
                setIsOpen(false);
            }else if (result.status === "error") {
                toast.error(result.message);
            }
        })
    }
        


    function handleOpenChange(open: boolean) {
        setIsOpen(open);
    }
    return(
        <Dialog open={isOpen} onOpenChange={handleOpenChange}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                    <Plus className='size-4 mr-2' />
                    New Chapter
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                   <DialogTitle>Create New Chapter</DialogTitle>
                   <DialogDescription>Fill in the details for the new chapter.</DialogDescription>
               </DialogHeader>
               <Form {...form}>
                <form className="space-y-8" onSubmit={form.handleSubmit(onSubmit)}>
                    <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Chapter Name</FormLabel>
                                <FormControl>
                                    <Input placeholder="Chapter Name" {...field} />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <DialogFooter>
                        <Button type="submit"  disabled={isPending}>
                            <Save className="size-4 mr-2" />
                           { isPending ? "Saving..." : "Save to Change"}
                        </Button>
                    </DialogFooter>
                </form>
               </Form>
            </DialogContent>
        </Dialog>
    )
}