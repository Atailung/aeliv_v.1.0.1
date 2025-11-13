"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DndContext,
  DragEndEvent,
  DraggableSyntheticListeners,
  KeyboardSensor,
  PointerSensor,
  rectIntersection,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import React, { ReactNode, useEffect, useState } from "react";
import { CSS } from "@dnd-kit/utilities";
import { AdminCourseSingularType } from "@/app/data/admin/admin-get-course";
import { cn } from "@/lib/utils";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  ChevronDown,
  ChevronRight,
  FileText,
  GripVertical,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { reorderChapters, reorderLessons } from "../action";
import NewChapterModal from "./NewChapterModal";
import NewLessonModal from "./NewLessonModal";
import DeleteLesson from "./DeleteLesson";
import DeleteChapter from "./DeleteChapter";

interface iAppProps {
  data: AdminCourseSingularType;
}

interface SortableItemProps {
  id: string;
  children: (listeners: DraggableSyntheticListeners) => ReactNode;
  className?: string;
  data?: {
    type: "chapter" | "lesson";
    chapterId?: string; // only relevant for lesson
  };
}

function CourseStructure({ data }: iAppProps) {
  const initialItems =
    data.chapter.map((chapter) => ({
      id: chapter.id,
      title: chapter.title,
      position: chapter.position,
      isOpen: true, //default chapter to be open
      lesson: chapter.Lesson.map((lesson) => ({
        id: lesson.id,
        title: lesson.title,
        position: lesson.position,
      })),
    })) || [];
  // const [items, setItems] = useState(initialItems.map(item => item.id));

  const [items, setItems] = useState(initialItems);

  console.log("Course Structure Items:", items);

  function SortableItem({ children, ...props }: SortableItemProps) {
    const {
      attributes,
      listeners,
      setNodeRef,
      transform,
      transition,
      isDragging,
    } = useSortable({
      id: props.id,
      data: props.data, // fix: make data accessible in drag events
    });

    const style = {
      transform: CSS.Transform.toString(transform),
      transition,
    };

    return (
      <div
        ref={setNodeRef}
        style={style}
        {...attributes}
        className={cn("touch-none", props.className, isDragging ? "z-10" : "")}
      >
        {children(listeners)}
      </div>
    );
  }

  useEffect(() => {
    setItems((prevItems) => {
      const updatedItems = data.chapter.map((chapter) => ({
        id: chapter.id,
        title: chapter.title,
        position: chapter.position,
        isOpen:
          prevItems.find((item) => item.id === chapter.id)?.isOpen ?? true, // preserve isOpen state
        lesson:
          chapter.Lesson.map((lesson) => ({
            id: lesson.id,
            title: lesson.title,
            position: lesson.position,
          })) || [],
      }));
      return updatedItems;
    });
  }, [data.chapter]);

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;

    if (!over || active.id == over.id) {
      return;
    }

    const activeId = active.id;
    const overId = over.id;
    const activeType = active.data.current?.type as "chapter" | "lesson";
    const overType = over.data.current?.type as "chapter" | "lesson";
    const courseId = data.id;

    if (activeType === "chapter") {
      let targetChapterId = null;
      if (overType === "chapter") {
        targetChapterId = overId;
      } else if (overType === "lesson") {
        targetChapterId = over.data.current?.chapterId ?? null;
      }

      if (!targetChapterId) {
        toast.error("Invalid target for chapter move");
        return;
      }

      const oldIndex = items.findIndex((item) => item.id === activeId);
      const newIndex = items.findIndex((item) => item.id === targetChapterId);

      const reorderLocalChapters = arrayMove(items, oldIndex, newIndex);
      const updateChapterForState = reorderLocalChapters.map(
        (chapter, index) => ({
          ...chapter,
          position: index + 1,
        })
      );
      const PreviousItems = [...items];
      setItems(updateChapterForState);

      if (courseId) {
        const chapterToUpdate = updateChapterForState.map((chapter) => ({
          id: chapter.id,
          position: chapter.position,
        }));
        const reorderChapterPromise = () =>
          reorderChapters(chapterToUpdate, courseId);
        toast.promise(reorderChapterPromise(), {
          loading: "Reordering chapters...",
          success: (result) => {
            if (result.status === "success") {
              return result.message;
            }
          },
          error: () => {
            setItems(PreviousItems);
            return "Failed to reorder chapters";
          },
        });
      }
      return;
    }

    //lesson reordering
    if (activeType === "lesson" && overType === "lesson") {
      const chapterId = over.data.current?.chapterId;
      const overChapterId = active.data.current?.chapterId;

      if (!chapterId || chapterId !== overChapterId) {
        toast.error("Cannot move lessons between chapters");
        return;
      }

      const chapterIndex = items.findIndex(
        (chapter) => chapter.id === chapterId
      );

      if (chapterIndex === -1) {
        toast.error("Chapter not found for lesson move");
        return;
      }

      const chapterToUpdate = items[chapterIndex];
      const oldLessonIndex = chapterToUpdate.lesson.findIndex(
        (lesson) => lesson.id === activeId
      );
      const newLessonIndex = chapterToUpdate.lesson.findIndex(
        (lesson) => lesson.id === overId
      );

      if (oldLessonIndex === -1 || newLessonIndex === -1) {
        toast.error("Cannot find lesson to move");
        return;
      }

      const reorderedLessons = arrayMove(
        chapterToUpdate.lesson,
        oldLessonIndex,
        newLessonIndex
      );

      const updatedLessonForState = reorderedLessons.map((lesson, index) => ({
        ...lesson,
        position: index + 1,
      }));

      const newItems = [...items];

      newItems[chapterIndex] = {
        ...chapterToUpdate,
        lesson: updatedLessonForState,
      };

      const PreviousItems = [...items];
      setItems(newItems);

      if (courseId) {
        const lessonToUpdate = updatedLessonForState.map((lesson) => ({
          id: lesson.id,
          position: lesson.position,
        }));

        const reorderLessonsPromise = () =>
          reorderLessons(chapterId, lessonToUpdate, courseId);
        toast.promise(reorderLessonsPromise(), {
          loading: "Reordering lessons...",
          success: (result) => {
            if (result.status === "success") {
              return result.message;
            }
          },
          error: () => {
            setItems(PreviousItems);
            return "Failed to reorder lessons";
          },
        });
      }
    }
  }

  function toggleChapter(chapterId: string) {
    setItems(
      items.map((chapter) =>
        chapter.id === chapterId
          ? { ...chapter, isOpen: !chapter.isOpen }
          : chapter
      )
    );
  }

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <DndContext
      collisionDetection={rectIntersection}
      onDragEnd={handleDragEnd}
      sensors={sensors}
    >
      <Card>
        <CardHeader className="flex flex-row items-center justify-between boder-b border-border">
          <CardTitle>Chapters</CardTitle>
          <NewChapterModal courseId={data.id} />
        </CardHeader>
        <CardContent className="space-y-8">
          <SortableContext items={items} strategy={verticalListSortingStrategy}>
            {/* Add your sortable items here */}
            {items.map((item) => (
              <SortableItem
                key={item.id}
                id={item.id}
                data={{ type: "chapter" }}
              >
                {(listeners) => (
                  <Card>
                    <Collapsible
                      open={item.isOpen}
                      onOpenChange={() => toggleChapter(item.id)}
                    >
                      <div className="flex items-center justify-between p-3 border-b border-border cursor-pointer">
                        <div className="flex items-center gap-1">
                          <Button
                            variant={"ghost"}
                            size={"icon"}
                            className="cursor-grab opacity-60 hover:opacity-100"
                            {...listeners}
                          >
                            <GripVertical className="size-4" />
                          </Button>
                          <CollapsibleTrigger asChild>
                            <Button
                              variant={"ghost"}
                              size={"icon"}
                              className="flex items-center"
                            >
                              {item.isOpen ? (
                                <ChevronDown className="size-4" />
                              ) : (
                                <ChevronRight className="size-4" />
                              )}
                            </Button>
                          </CollapsibleTrigger>
                          <p className="cursor-pointer hover:text-primary pl-2">
                            {item.title}
                          </p>
                        </div>
                        <DeleteChapter chapterId={item.id} courseId={data.id} />
                      </div>
                      <CollapsibleContent>
                        <div className="p-1 ">
                          <SortableContext
                            items={item.lesson.map((lesson) => lesson.id)}
                            strategy={verticalListSortingStrategy}
                          >
                            {item.lesson.map((lesson) => (
                              <SortableItem
                                key={lesson.id}
                                id={lesson.id}
                                data={{ type: "lesson", chapterId: item.id }}
                              >
                                {(lessonListeners) => (
                                  <div className="flex items-center justify-between p-2 hover:bg:accent hover:accent-hover rounded-md">
                                    <div className="flex items-center gap-2">
                                      <Button
                                        variant={"ghost"}
                                        size={"icon"}
                                        className="cursor-grab opacity-60 hover:opacity-100"
                                        {...lessonListeners}
                                      >
                                        <GripVertical className="size-4" />
                                      </Button>
                                      <FileText className="size-4" />
                                      <Link
                                        href={`/admin/courses/${data.id}/${item.id}/${lesson.id}`}
                                        className="hover:text-primary"
                                      >
                                        {lesson.title}
                                      </Link>
                                    </div>
                                    <DeleteLesson
                                      lessonId={lesson.id}
                                      chapterId={item.id}
                                      courseId={data.id}
                                    />
                                  </div>
                                )}
                              </SortableItem>
                            ))}
                          </SortableContext>
                          <div className="p-2">
                            <NewLessonModal
                              courseId={data.id}
                              chapterId={item.id}
                            />
                          </div>
                        </div>
                      </CollapsibleContent>
                    </Collapsible>
                  </Card>
                )}
              </SortableItem>
            ))}
          </SortableContext>
        </CardContent>
      </Card>
    </DndContext>
  );
}

export default CourseStructure;
