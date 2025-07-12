
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
import { useRole } from "@/contexts/role-context"
import { useData } from "@/contexts/data-context"

interface OrdersByFleetChartProps {
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
