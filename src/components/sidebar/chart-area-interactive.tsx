"use client";

import * as React from "react";
import { Bar, BarChart, CartesianGrid, XAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";

export const description = "An interactive bar chart";


const chartConfig = {
  enrollments: {
    label: "Enrollments",
    color: "var(--chart-1)",
  },
} satisfies ChartConfig;

interface ChartBarInteractiveProps {
  data: { date: string; enrollments: number }[];
}

export function ChartBarInteractive({ data }: ChartBarInteractiveProps) {
  const total = React.useMemo(() => {
    return data.reduce((sum, item) => sum + item.enrollments, 0);
  }, [data]);
  return (
    <Card className="@container/card">
      <CardHeader>
        <CardTitle>Total Enrollment</CardTitle>
        <CardDescription>
          <span className="hidden @[540px]/card:block">
            Total Enrollments for the last 30 days: {total}
          </span>
          <span className="@[540px]/card:hidden"> Last 30 Days: {total}</span>
        </CardDescription>
      </CardHeader>
      <CardContent className="px-2  pt-4 sm:px-6 sm:pt-6">
        <ChartContainer className="aspect-auto h-[250px]" config={chartConfig}>
          <BarChart
            data={data}
            margin={{ top: 0, right: 12, left: 12, bottom: 0 }}
          >
            <CartesianGrid vertical={false} strokeDasharray="3 3" />
            <XAxis
              dataKey="date"
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => {
                const date = new Date(value);
                return date.toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                });
              }}
              stroke="var(--muted-foreground)"
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  className="w-[150px] "
                  labelFormatter={(value) => {
                    const date = new Date(value);
                    return date.toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                    });
                  }}
                />
              }
            />
            <Bar dataKey={"enrollments"} fill="var(--color-enrollments)" />
          </BarChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}
