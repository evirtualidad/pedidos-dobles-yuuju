
"use client"

import * as React from "react"
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from "recharts"

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


export function OrdersByFleetChart({ orders }: OrdersByFleetChartProps) {
    const { fleets } = useData();
    
    const chartConfig = React.useMemo(() => {
        const config: ChartConfig = {
             total: {
                label: "Órdenes",
                color: "hsl(var(--chart-2))",
            },
        };
        return config;
    }, [fleets]);


    const chartData = React.useMemo(() => {
        const fleetCounts: { name: string; total: number }[] = fleets.map(fleet => {
            return {
                name: fleet.name,
                total: orders.filter(order => order.fleet === fleet.name).reduce((sum, order) => sum + order.quantity, 0),
            }
        });
        return fleetCounts.filter(f => f.total > 0).sort((a, b) => a.total - b.total);
    }, [orders, fleets]);

  return (
    <ChartContainer
        config={chartConfig}
        className="w-full h-[250px]"
    >
        <BarChart
          accessibilityLayer
          data={chartData}
          layout="vertical"
          margin={{
            left: 10,
            right: 10,
          }}
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
          <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
          />
          <Bar dataKey="total" fill="var(--color-total)" radius={4}>
          </Bar>
        </BarChart>
    </ChartContainer>
  )
}
