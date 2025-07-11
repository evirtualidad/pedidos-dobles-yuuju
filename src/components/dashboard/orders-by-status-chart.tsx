
"use client"

import * as React from "react"
import { Pie, PieChart } from "recharts"

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

interface OrdersByStatusChartProps {
  orders: Order[]
}

const statuses: Order['status'][] = ['Completed', 'Pending', 'Cancelled'];

const chartConfig = {
  orders: {
    label: "Órdenes",
  },
  Completed: { label: "Completadas", color: "hsl(var(--chart-1))" },
  Pending: { label: "Pendientes", color: "hsl(var(--chart-2))" },
  Cancelled: { label: "Canceladas", color: "hsl(var(--chart-3))" },
} satisfies ChartConfig

export function OrdersByStatusChart({ orders }: OrdersByStatusChartProps) {
    const { role } = useRole();

    const chartData = React.useMemo(() => {
        const statusCounts = statuses.map(status => ({
            name: status,
            total: orders.filter(order => order.status === status).length,
            fill: `var(--color-${status})`,
        }));
        return statusCounts.filter(s => s.total > 0);
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
