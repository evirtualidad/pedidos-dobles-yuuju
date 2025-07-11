
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
import { useData } from "@/contexts/data-context"

interface OrdersByFleetChartProps {
  orders: Order[]
}

export function OrdersByFleetChart({ orders }: OrdersByFleetChartProps) {
    const { role } = useRole();
    const { fleets } = useData();
    
    const chartConfig = React.useMemo(() => {
        const config: ChartConfig = {
             orders: {
                label: "Órdenes",
            },
        };
        fleets.forEach((fleet, index) => {
            const key = fleet.name.replace(/\s+/g, '');
             config[key] = {
                label: fleet.name,
                color: `hsl(var(--chart-${(index % 5) + 1}))`,
            };
        });
        return config;
    }, [fleets]);


    const chartData = React.useMemo(() => {
        const fleetCounts = fleets.map(fleet => {
            const key = fleet.name.replace(/\s+/g, ''); // Remove spaces
            return {
                name: fleet.name,
                key,
                total: orders.filter(order => order.fleet === fleet.name).length,
                fill: `var(--color-${key})`,
            }
        });
        return fleetCounts.filter(f => f.total > 0);
    }, [orders, fleets]);

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
