import React from "react";
import { adminGetCourse } from "@/app/data/admin/admin-get-course";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import EditCourseForm from "./_components/EditCourseForm";
import CourseStructure from "./_components/CourseStructure";

interface EditRouteProps {
  params: Promise<{
    courseId: string;
  }>;
}
const EditRoute = async ({ params }: EditRouteProps) => {
  const { courseId } = await params;
  const data = await adminGetCourse(courseId);
  return (
    <div>
      <h1 className="text-2xl font-bold mb-8 flex items-center gap-2">
        Edit Course:{" "}
        <span className="text-primary line-clamp-2 hover:underline">
          {data.title}
        </span>
      </h1>

      <Tabs defaultValue="basic-info" className="w-full">
        <TabsList className="grid grid-cols-2 w-full ">
          <TabsTrigger value="basic-info">Basic Info</TabsTrigger>
          <TabsTrigger value="course-structure">Course Structure</TabsTrigger>
        </TabsList>

        <TabsContent value="basic-info" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Info</CardTitle>
              <CardDescription>
                Provide basic Information about your course.
              </CardDescription>
              <CardContent>
                {/* Basic Info Form Goes Here */}
                <EditCourseForm data={data} />
              </CardContent>
            </CardHeader>
          </Card>
        </TabsContent>
        <TabsContent value="course-structure" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Course Structure</CardTitle>
              <CardDescription>
                Define the structure of your course including sections and
                lessons.
              </CardDescription>
              <CardContent>
                {/* Course Structure Form Goes Here */}
                <CourseStructure data={data} />
              </CardContent>
            </CardHeader>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default EditRoute;
