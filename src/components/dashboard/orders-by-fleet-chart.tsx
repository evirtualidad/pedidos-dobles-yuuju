
"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart"
import type { Order } from "@/lib/types"
import { useData } from "@/contexts/data-context"

interface OrdersByFleetChartProps {
  orders: Order[]
}

const chartConfig = {
  total: {
    label: "Órdenes",
    color: "hsl(var(--chart-2))",
  },
} satisfies ChartConfig


export function OrdersByFleetChart({ orders }: OrdersByFleetChartProps) {
    const { fleets } = useData();

    const chartData = React.useMemo(() => {
        const fleetCounts = fleets.map(fleet => ({
            name: fleet.name,
            total: orders.filter(order => order.fleet === fleet.name).reduce((sum, order) => sum + order.quantity, 0),
        }));
        
        return fleetCounts
            .filter(f => f.total > 0)
            .sort((a, b) => b.total - a.total);
    }, [orders, fleets]);

  return (
    <ChartContainer config={chartConfig} className="w-full h-[300px]">
        <BarChart
            accessibilityLayer
            data={chartData}
            margin={{ top: 20, right: 20, left: 10, bottom: 5 }}
        >
            <CartesianGrid vertical={false} />
            <XAxis
                dataKey="name"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                className="text-xs"
            />
            <YAxis
                allowDecimals={false}
                tickLine={false}
                axisLine={false}
                tickMargin={10}
                className="text-xs"
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <Bar dataKey="total" fill="var(--color-total)" radius={4} />
        </BarChart>
    </ChartContainer>
  )
}
