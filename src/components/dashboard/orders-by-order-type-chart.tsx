
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
import { useData } from "@/contexts/data-context"

interface OrdersByOrderTypeChartProps {
  orders: Order[]
}


export function OrdersByOrderTypeChart({ orders }: OrdersByOrderTypeChartProps) {
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
        return orderTypes.map(orderType => {
            const key = orderType.name.replace(/\s+/g, '');
            return {
                name: orderType.name,
                key,
                total: orders.filter(order => order.type === orderType.name).reduce((sum, order) => sum + order.quantity, 0),
                fill: `var(--color-${key})`,
            }
        }).filter(b => b.total > 0);
    }, [orders, orderTypes]);
    
    const totalOrders = React.useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.total, 0)
    }, [chartData])

  return (
    <ChartContainer
        config={chartConfig}
        className="mx-auto flex aspect-square h-[300px] w-full flex-col items-center justify-center"
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
            innerRadius="60%"
            strokeWidth={5}
        >
        </Pie>
        </PieChart>
        {chartData.length > 0 && (
             <div
                className="flex flex-col text-center"
                style={{
                    marginTop: "-150px"
                }}
            >
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{totalOrders}</p>
            </div>
        )}
    </ChartContainer>
  )
}
