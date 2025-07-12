
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

interface OrdersByBrandChartProps {
  orders: Order[]
}

export function OrdersByBrandChart({ orders }: OrdersByBrandChartProps) {
    const { brands } = useData();

    const chartConfig = React.useMemo(() => {
        const config: ChartConfig = {
            total: {
                label: "Órdenes",
                color: "hsl(var(--chart-1))",
            },
        };
        return config;
    }, []);


    const chartData = React.useMemo(() => {
        const brandCounts: { name: string; total: number }[] = brands.map(brand => {
            return {
                name: brand.name,
                total: orders.filter(order => order.brand === brand.name).reduce((sum, order) => sum + order.quantity, 0),
            }
        });
        // Sort by total descending and return only brands with orders
        return brandCounts.filter(b => b.total > 0).sort((a, b) => a.total - b.total);
    }, [orders, brands]);

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
