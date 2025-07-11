"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"
import { format, subMonths, startOfMonth } from "date-fns"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart"
import { useRole } from "@/contexts/role-context"
import { mockOrders } from "@/lib/data"
import type { Order } from "@/lib/types"

export function OrdersChart() {
    const { role } = useRole();

    const chartData = React.useMemo(() => {
        const twelveMonthsAgo = subMonths(new Date(), 11);
        const startOfPeriod = startOfMonth(twelveMonthsAgo);

        const monthlyData = Array.from({ length: 12 }).map((_, i) => {
            const monthDate = subMonths(new Date(), i);
            return {
                month: format(monthDate, "MMM"),
                year: format(monthDate, "yyyy"),
                total: 0
            };
        }).reverse();

        mockOrders.forEach(order => {
            if (order.date >= startOfPeriod) {
                const monthStr = format(order.date, "MMM");
                const yearStr = format(order.date, "yyyy");
                const monthEntry = monthlyData.find(m => m.month === monthStr && m.year === yearStr);
                if (monthEntry) {
                    monthEntry.total += 1;
                }
            }
        });
        return monthlyData;
    }, [mockOrders]);

    if (role === 'Data Entry') {
        return null;
    }
    
    return (
        <ChartContainer config={{}} className="min-h-[200px] w-full">
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
