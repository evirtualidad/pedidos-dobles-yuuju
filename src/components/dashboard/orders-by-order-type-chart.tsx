
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

interface OrdersByOrderTypeChartProps {
  orders: Order[]
}

export function OrdersByOrderTypeChart({ orders }: OrdersByOrderTypeChartProps) {
    const { role } = useRole();
    const { orderTypes } = useData();

    const chartConfig = React.useMemo(() => {
        const config: ChartConfig = {
            orders: {
                label: "Órdenes",
            },
        };
        orderTypes.forEach((orderType, index) => {
            const key = orderType.name.replace(/\s+/g, '');
            config[key] = {
                label: orderType.name,
                color: `hsl(var(--chart-${(index % 5) + 1}))`,
            };
        });
        return config;
    }, [orderTypes]);


    const chartData = React.useMemo(() => {
        const orderTypeCounts = orderTypes.map(orderType => {
            const key = orderType.name.replace(/\s+/g, '');
            return {
                name: orderType.name,
                key,
                total: orders.filter(order => order.type === orderType.name).length,
                fill: `var(--color-${key})`,
            }
        });
        return orderTypeCounts.filter(b => b.total > 0);
    }, [orders, orderTypes]);

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
