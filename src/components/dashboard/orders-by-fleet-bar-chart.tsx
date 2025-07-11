
"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis, Tooltip } from "recharts"

import {
  ChartContainer,
  ChartTooltipContent,
  ChartConfig,
} from "@/components/ui/chart"
import type { Order } from "@/lib/types"
import { useData } from "@/contexts/data-context"

interface OrdersByFleetBarChartProps {
  orders: Order[]
}

export function OrdersByFleetBarChart({ orders }: OrdersByFleetBarChartProps) {
    const { fleets } = useData();
    
    const chartConfig = React.useMemo(() => {
        const config: ChartConfig = {};
        fleets.forEach((fleet, index) => {
            config[fleet.name] = {
                label: fleet.name,
                color: `hsl(var(--chart-${(index % 5) + 1}))`,
            };
        });
        return config;
    }, [fleets]);

    const chartData = React.useMemo(() => {
        const fleetCounts: { [key: string]: number } = {};
        
        orders.forEach(order => {
            fleetCounts[order.fleet] = (fleetCounts[order.fleet] || 0) + 1;
        });

        return Object.entries(fleetCounts).map(([name, total]) => ({
            name,
            total,
            fill: `var(--color-${name})`
        })).sort((a,b) => a.total - b.total);
    }, [orders]);


  return (
    <ChartContainer config={chartConfig} className="min-h-[250px] w-full">
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
            <Tooltip
                cursor={{ fill: 'hsl(var(--muted))' }}
                content={<ChartTooltipContent hideLabel />}
            />
            <Bar dataKey="total" radius={5}>
                {chartData.map((entry) => (
                    <div key={entry.name} style={{ backgroundColor: chartConfig[entry.name]?.color }} />
                ))}
            </Bar>
        </BarChart>
    </ChartContainer>
  )
}
