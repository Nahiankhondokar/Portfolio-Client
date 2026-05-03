"use client"

import React from 'react'
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts'
import { ChartContainer, ChartLegend, ChartLegendContent, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"

import { type ChartConfig } from "@/components/ui/chart"
 
const chartConfig = {
  desktop: {
    label: "Success",
    color: "#eab308", // yellow-500
  },
  mobile: {
    label: "Pending",
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


const AppChartBar = () => {
  return (
    <div className="w-full h-full min-h-[300px]">
    <ChartContainer config={chartConfig} className="h-full w-full">
      <BarChart accessibilityLayer data={chartData} margin={{ top: 20, right: 0, left: -20, bottom: 0 }}>
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
         <ChartTooltip cursor={{ fill: '#27272a', opacity: 0.4 }} content={<ChartTooltipContent hideLabel />} />
         <ChartLegend content={<ChartLegendContent />} className="mt-4" />
         <Bar 
            dataKey="desktop" 
            fill="var(--color-desktop)" 
            radius={[4, 4, 0, 0]} 
            barSize={30}
        />
         <Bar 
            dataKey="mobile" 
            fill="var(--color-mobile)" 
            radius={[4, 4, 0, 0]} 
            barSize={30}
        />
      </BarChart>
    </ChartContainer>
    </div>
  )

}

export default AppChartBar