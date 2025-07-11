
"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { format, subMonths, startOfMonth, eachMonthOfInterval, endOfMonth } from "date-fns"

import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useRole } from "@/contexts/role-context"
import type { Order } from "@/lib/types"

interface OrdersChartProps {
    orders: Order[];
}

export function OrdersChart({ orders }: OrdersChartProps) {
    const { role } = useRole();

    const chartData = React.useMemo(() => {
        const twelveMonthsAgo = subMonths(new Date(), 11);
        const today = new Date();
        const interval = { start: startOfMonth(twelveMonthsAgo), end: endOfMonth(today) };
        const monthsInInterval = eachMonthOfInterval(interval);

        const monthlyData = monthsInInterval.map(monthDate => ({
            month: format(monthDate, "MMM"),
            year: format(monthDate, "yyyy"),
            total: 0
        }));

        orders.forEach(order => {
            const monthStr = format(order.date, "MMM");
            const yearStr = format(order.date, "yyyy");
            const monthEntry = monthlyData.find(m => m.month === monthStr && m.year === yearStr);
            if (monthEntry) {
                monthEntry.total += 1;
            }
        });
        return monthlyData;
    }, [orders]);

    if (role === 'Data Entry') {
        return null;
    }
    
    return (
        <ChartContainer config={{}} className="min-h-[300px] w-full">
            <BarChart accessibilityLayer data={chartData}>
                <CartesianGrid vertical={false} />
                <XAxis
                    dataKey="month"
                    tickLine={false}
                    tickMargin={10}
                    axisLine={false}
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
                <Bar dataKey="total" fill="var(--color-primary)" radius={8} />
            </BarChart>
        </ChartContainer>
    )
}
