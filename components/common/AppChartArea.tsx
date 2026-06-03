"use client"

import React from 'react'
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent, type ChartConfig } from "@/components/ui/chart"
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from 'recharts';

const chartConfig = {
  desktop: {
    label: "Growth",
    color: "var(--theme-primary)",
  },
  mobile: {
    label: "Base",
    color: "#3f3f46", // zinc-700
  },
} satisfies ChartConfig;

const chartData = [
  { month: "Jan", desktop: 186, mobile: 80 },
  { month: "Feb", desktop: 305, mobile: 200 },
  { month: "Mar", desktop: 237, mobile: 120 },
  { month: "Apr", desktop: 73, mobile: 190 },
  { month: "May", desktop: 209, mobile: 130 },
  { month: "Jun", desktop: 214, mobile: 140 },
]


const AppChartArea = () => {
  return (
    <div className="w-full h-full min-h-[300px]">
    <ChartContainer config={chartConfig} className="h-full w-full">
      <AreaChart accessibilityLayer data={chartData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
         <CartesianGrid vertical={false} strokeDasharray="3 3" stroke="#27272a" />
         
         <XAxis
            dataKey="month"
            tickLine={false}
            tickMargin={10}
            axisLine={false}
            tick={{ fill: '#71717a', fontSize: 12, fontWeight: 600 }}
            />
         <YAxis
            tickLine={false}
            axisLine={false}
            tick={{ fill: '#71717a', fontSize: 12, fontWeight: 600 }}
            />
         <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
         <ChartLegend content={<ChartLegendContent />} className="mt-4" />

      <defs>
              <linearGradient id="fillDesktop" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0.3}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-desktop)"
                  stopOpacity={0}
                />
              </linearGradient>
              <linearGradient id="fillMobile" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0.2}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-mobile)"
                  stopOpacity={0}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="mobile"
              type="monotone"
              fill="url(#fillMobile)"
              stroke="var(--color-mobile)"
              strokeWidth={2}
              stackId="a"
            />
            <Area
              dataKey="desktop"
              type="monotone"
              fill="url(#fillDesktop)"
              stroke="var(--color-desktop)"
              strokeWidth={2}
              stackId="a"
            />

      </AreaChart>
    </ChartContainer>
    </div>
  )

}

export default AppChartArea