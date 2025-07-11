
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

interface OrdersByBrandChartProps {
  orders: Order[]
}

export function OrdersByBrandChart({ orders }: OrdersByBrandChartProps) {
    const { role } = useRole();
    const { brands } = useData();

    const chartConfig = React.useMemo(() => {
        const config: ChartConfig = {
            orders: {
                label: "Órdenes",
            },
        };
        brands.forEach((brand, index) => {
            const key = brand.name.replace(/\s+/g, '');
            config[key] = {
                label: brand.name,
                color: `hsl(var(--chart-${(index % 5) + 1}))`,
            };
        });
        return config;
    }, [brands]);


    const chartData = React.useMemo(() => {
        const brandCounts = brands.map(brand => {
            const key = brand.name.replace(/\s+/g, '');
            return {
                name: brand.name,
                key,
                total: orders.filter(order => order.brand === brand.name).length,
                fill: `var(--color-${key})`,
            }
        });
        return brandCounts.filter(b => b.total > 0);
    }, [orders, brands]);

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
