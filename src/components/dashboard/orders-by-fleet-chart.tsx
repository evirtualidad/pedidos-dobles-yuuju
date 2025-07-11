
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
import { fleets } from "@/lib/data"

interface OrdersByFleetChartProps {
  orders: Order[]
}

const chartConfig = {
  orders: {
    label: "Órdenes",
  },
  ...fleets.reduce((acc, fleet, index) => {
    acc[fleet] = {
      label: fleet,
      color: `hsl(var(--chart-${index + 1}))`,
    };
    return acc;
  }, {} as Record<string, { label: string; color: string }>),
} satisfies ChartConfig

export function OrdersByFleetChart({ orders }: OrdersByFleetChartProps) {
    const { role } = useRole();

    const chartData = React.useMemo(() => {
        const fleetCounts = fleets.map(fleet => ({
            name: fleet,
            total: orders.filter(order => order.fleet === fleet).length,
            fill: `var(--color-${fleet})`,
        }));
        return fleetCounts.filter(f => f.total > 0);
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
