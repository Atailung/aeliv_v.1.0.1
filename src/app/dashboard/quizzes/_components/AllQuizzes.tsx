import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  IconBrandCucumber,
  IconBrandJavascript,
  IconBrandPython,
} from "@tabler/icons-react";
import React from "react";
import AllQuizzesPageCard from "./AllQuizzesPageCard";

function AllQuizzes() {
  const iconColors = {
    javascript: "bg-yellow-500/10 text-yellow-500",
    python: "bg-blue-500/10 text-blue-500",
    ruby: "bg-red-500/10 text-red-500",
    java: "bg-green-500/10 text-green-500",
    default: "bg-gray-500/10 text-gray-500",
  };
  return (
    <Card>
      <Tabs
        defaultValue="javascript"
        className="max-w-full bg-transparent shadow-sm p-2"
      >
        <TabsList className="grid w-full grid-cols-2 gap-4 ">
          <TabsTrigger value="javascript" className="h-8 rounded-md mr-2">
            <IconBrandJavascript
              className={`size-5 p-1 rounded-md ${iconColors.javascript}`}
            />
            <span>JavaScript</span>
          </TabsTrigger>
          <TabsTrigger value="python" className="h-8 rounded-md">
            <IconBrandPython
              className={`size-5 p-1 rounded-md ${iconColors.python}`}
            />
            <span>Python</span>
          </TabsTrigger>
          <TabsTrigger value="ruby" className="h-8 rounded-md">
            <IconBrandCucumber
              className={`size-5 mr-2 rounded-md ${iconColors.ruby}`}
            />
            <span>Ruby</span>
          </TabsTrigger>
          <TabsTrigger value="java" className="h-8 rounded-md">
            <IconBrandJavascript
              className={`size-5 p-1 rounded-md ${iconColors.java}`}
            />
            <span>Java</span>
          </TabsTrigger>
        </TabsList>
        <TabsContent value="javascript" className="mt-11">
          <AllQuizzesPageCard category="JavaScript" />
        </TabsContent>
        <TabsContent value="python" className="mt-11">
          <AllQuizzesPageCard category="Python" />
        </TabsContent>
        <TabsContent value="ruby" className="mt-11">
          <AllQuizzesPageCard category="Ruby" />
        </TabsContent>
        <TabsContent value="java" className="mt-11">
          <AllQuizzesPageCard category="Java" />
        </TabsContent>
      </Tabs>
    </Card>
  );
}

export default AllQuizzes;
