
"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { format, subWeeks, startOfWeek, eachWeekOfInterval, endOfWeek, endOfDay } from "date-fns"
import { es } from "date-fns/locale"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart"
import type { Order } from "@/lib/types"

interface OrdersChartProps {
    orders: Order[];
}

const chartConfig = {
  total: {
    label: "Órdenes",
    color: "hsl(var(--chart-1))",
  },
} satisfies ChartConfig

export function OrdersChart({ orders }: OrdersChartProps) {
    const chartData = React.useMemo(() => {
        const twelveWeeksAgo = subWeeks(new Date(), 11);
        const today = new Date();
        const interval = { start: startOfWeek(twelveWeeksAgo, { locale: es }), end: endOfWeek(today, { locale: es }) };
        const weeksInInterval = eachWeekOfInterval(interval, { locale: es });

        const weeklyData = weeksInInterval.map(weekDate => ({
            week: format(weekDate, "d MMM", { locale: es }),
            total: 0
        }));

        orders.forEach(order => {
            if (order.date < interval.start || order.date > interval.end) return;

            const weekStart = startOfWeek(order.date, { locale: es });
            const weekKey = format(weekStart, "d MMM", { locale: es });
            
            const weekEntry = weeklyData.find(w => w.week === weekKey);
            if (weekEntry) {
                weekEntry.total += 1;
            }
        });
        
        return weeklyData;
    }, [orders]);

    return (
        <ChartContainer config={chartConfig} className="min-h-[300px] w-full">
            <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="week"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
                    className="text-xs"
                />
                 <YAxis 
                    tickLine={false}
                    axisLine={false}
                    tickMargin={10}
                    allowDecimals={false}
                 />
                <ChartTooltip
                    cursor={false}
                    content={<ChartTooltipContent hideLabel />}
                />
                <Bar dataKey="total" fill="var(--color-total)" radius={8} />
            </BarChart>
        </ChartContainer>
    )
}
