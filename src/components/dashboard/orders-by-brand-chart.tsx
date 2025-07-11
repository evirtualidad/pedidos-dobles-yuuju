
"use client"

import * as React from "react"
import { Pie, PieChart } from "recharts"

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
  ChartConfig,
  ChartLegend,
  ChartLegendContent,
} from "@/components/ui/chart"
import type { Order } from "@/lib/types"
import { useRole } from "@/contexts/role-context"
import { brands } from "@/lib/data"

interface OrdersByBrandChartProps {
  orders: Order[]
}

const chartConfig = {
  orders: {
    label: "Órdenes",
  },
  ...brands.reduce((acc, brand, index) => {
    acc[brand] = {
      label: brand,
      color: `hsl(var(--chart-${index + 1}))`,
    };
    return acc;
  }, {} as Record<string, { label: string; color: string }>),
} satisfies ChartConfig

export function OrdersByBrandChart({ orders }: OrdersByBrandChartProps) {
    const { role } = useRole();

    const chartData = React.useMemo(() => {
        const brandCounts = brands.map(brand => ({
            name: brand,
            total: orders.filter(order => order.brand === brand).length,
            fill: `var(--color-${brand})`,
        }));
        return brandCounts.filter(b => b.total > 0);
    }, [orders]);

    if (role === 'Data Entry') {
        return null;
    }

  return (
    <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square h-[250px]"
    >
        <PieChart>
        <ChartTooltip
            cursor={false}
            content={<ChartTooltipContent hideLabel />}
        />
        <Pie
            data={chartData}
            dataKey="total"
            nameKey="name"
            innerRadius={60}
            strokeWidth={5}
        />
        <ChartLegend
            content={<ChartLegendContent nameKey="name" />}
            className="-translate-y-[2px] flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-center"
        />
        </PieChart>
    </ChartContainer>
  )
}
