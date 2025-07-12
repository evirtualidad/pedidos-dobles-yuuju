
"use client"

import * as React from "react"
import type { Order } from "@/lib/types"
import { useData } from "@/contexts/data-context"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart"

interface OrdersByBrandChartProps {
  orders: Order[]
}

const chartConfig = {
    total: {
        label: "Órdenes",
        color: "hsl(var(--chart-1))",
    },
} satisfies ChartConfig


export function OrdersByBrandChart({ orders }: OrdersByBrandChartProps) {
    const { brands } = useData();

    const chartData = React.useMemo(() => {
        const brandCounts = brands.map(brand => ({
            name: brand.name,
            total: orders.filter(order => order.brand === brand.name).reduce((sum, order) => sum + order.quantity, 0),
        }));
        
        return brandCounts
            .filter(b => b.total > 0)
            .sort((a, b) => a.total - b.total);
    }, [orders, brands]);

  return (
    <ChartContainer config={chartConfig} className="w-full h-[300px]">
        <BarChart
            accessibilityLayer
            data={chartData}
            layout="vertical"
            margin={{ left: 10, right: 10 }}
        >
            <CartesianGrid horizontal={false} />
            <YAxis
                dataKey="name"
                type="category"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                className="text-xs"
                interval={0}
            />
            <XAxis dataKey="total" type="number" hide />
            <ChartTooltip cursor={false} content={<ChartTooltipContent hideLabel />} />
            <Bar dataKey="total" fill="var(--color-total)" radius={4} />
        </BarChart>
    </ChartContainer>
  )
}
