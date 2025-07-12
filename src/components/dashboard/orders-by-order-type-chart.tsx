
"use client"

import * as React from "react"
import { Pie, PieChart, Cell } from "recharts"

import {
  ChartConfig,
} from "@/components/ui/chart"
import type { Order } from "@/lib/types"
import { useData } from "@/contexts/data-context"

interface OrdersByOrderTypeChartProps {
  orders: Order[]
}

export function OrdersByOrderTypeChart({ orders }: OrdersByOrderTypeChartProps) {
    const { orderTypes } = useData();

    const chartColors = [
        "hsl(var(--chart-1))",
        "hsl(var(--chart-2))",
        "hsl(var(--chart-3))",
        "hsl(var(--chart-4))",
        "hsl(var(--chart-5))",
        "hsl(var(--chart-1) / 0.7)",
        "hsl(var(--chart-2) / 0.7)",
    ];

    const chartData = React.useMemo(() => {
        const filteredData = orderTypes.map((orderType, index) => {
            return {
                name: orderType.name,
                total: orders.filter(order => order.type === orderType.name).reduce((sum, order) => sum + order.quantity, 0),
                fill: chartColors[index % chartColors.length],
            }
        }).filter(b => b.total > 0);

        const totalOrders = filteredData.reduce((acc, curr) => acc + curr.total, 0);

        return filteredData.map(item => ({
            ...item,
            percentage: totalOrders > 0 ? ((item.total / totalOrders) * 100).toFixed(1) : 0,
        }));
    }, [orders, orderTypes]);
    
    const totalOrders = React.useMemo(() => {
        return chartData.reduce((acc, curr) => acc + curr.total, 0)
    }, [chartData])

    if (chartData.length === 0) {
        return (
          <div className="flex items-center justify-center h-[300px] text-muted-foreground">
            No hay datos para mostrar.
          </div>
        );
    }

  return (
    <div className="w-full h-[300px] flex items-center justify-between gap-6">
        <div className="relative w-1/2 h-full flex items-center justify-center">
            <PieChart width={200} height={200}>
                <Pie
                    data={chartData}
                    dataKey="total"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={2}
                    labelLine={false}
                >
                    {chartData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                </Pie>
            </PieChart>
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <p className="text-xs text-muted-foreground">Total</p>
                <p className="text-2xl font-bold">{totalOrders}</p>
            </div>
        </div>
        <div className="w-1/2 flex flex-col gap-2 text-sm overflow-y-auto h-full pr-2">
            {chartData.map(entry => (
                <div key={entry.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                        <span className="h-3 w-3 rounded-full" style={{ backgroundColor: entry.fill }} />
                        <span>{entry.name}</span>
                    </div>
                    <span className="font-semibold">{entry.percentage}%</span>
                </div>
            ))}
        </div>
    </div>
  )
}

