
"use client"

import * as React from "react"
import type { Order } from "@/lib/types"
import { useData } from "@/contexts/data-context"
import { Progress } from "@/components/ui/progress"

interface OrdersByBrandChartProps {
  orders: Order[]
}

export function OrdersByBrandChart({ orders }: OrdersByBrandChartProps) {
    const { brands } = useData();

    const chartData = React.useMemo(() => {
        const brandCounts = brands.map(brand => ({
            name: brand.name,
            total: orders.filter(order => order.brand === brand.name).reduce((sum, order) => sum + order.quantity, 0),
        }));

        const totalOrders = brandCounts.reduce((acc, curr) => acc + curr.total, 0)
        
        return brandCounts
            .filter(b => b.total > 0)
            .sort((a, b) => b.total - a.total)
            .map(item => ({...item, percentage: totalOrders > 0 ? (item.total / totalOrders) * 100 : 0 }));

    }, [orders, brands]);

  if (chartData.length === 0) {
    return (
      <div className="flex items-center justify-center h-[300px] text-muted-foreground">
        No hay datos para mostrar.
      </div>
    );
  }

  return (
    <div className="w-full h-[300px] space-y-4 overflow-y-auto pr-4">
      {chartData.map((brand) => (
        <div key={brand.name} className="space-y-1">
          <div className="flex justify-between items-center text-sm">
            <span className="font-medium">{brand.name}</span>
            <span className="text-muted-foreground">{brand.total} órdenes</span>
          </div>
          <Progress value={brand.percentage} className="h-2" />
        </div>
      ))}
    </div>
  )
}
