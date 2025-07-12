
"use client"

import * as React from "react"
import { Pie, PieChart, Cell } from "recharts"

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

const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }: any) => {
  if (!percent || percent === 0) {
    return null;
  }
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor="middle"
      dominantBaseline="central"
      className="text-xs font-bold"
    >
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};

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
        const orderTypeCounts = orderTypes.map(orderType => {
            const key = orderType.name.replace(/\s+/g, '');
            return {
                name: orderType.name,
                key,
                total: orders.filter(order => order.type === orderType.name).reduce((sum, order) => sum + order.quantity, 0),
                fill: `var(--color-${key})`,
            }
        });
        return orderTypeCounts.filter(b => b.total > 0);
    }, [orders, orderTypes]);

  return (
    <ChartContainer
        config={chartConfig}
        className="mx-auto aspect-square max-h-[250px]"
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
            labelLine={false}
            label={renderCustomizedLabel}
        >
           {chartData.map((entry) => (
              <Cell key={`cell-${entry.key}`} fill={chartConfig[entry.key]?.color} />
            ))}
        </Pie>
        <ChartLegend
            content={<ChartLegendContent nameKey="name" />}
            className="-translate-y-[2px] flex-wrap gap-2 [&>*]:basis-1/4 [&>*]:justify-end"
        />
        </PieChart>
    </ChartContainer>
  )
}
