
"use client";

import * as React from "react";
import { Header } from '@/components/header';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { RoleProvider } from '@/contexts/role-context';
import { OrdersChart } from '@/components/dashboard/orders-chart';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DashboardFilters } from "@/components/dashboard/dashboard-filters";
import { mockOrders } from "@/lib/data";
import type { Order } from "@/lib/types";
import { OrdersByBrandChart } from "@/components/dashboard/orders-by-brand-chart";
import { OrdersByFleetChart } from "@/components/dashboard/orders-by-fleet-chart";
import { OrdersByStatusChart } from "@/components/dashboard/orders-by-status-chart";

export interface DashboardFiltersState {
  dateRange: { from?: Date; to?: Date };
  brand: string;
  fleet: string;
  type: string;
}

export default function DashboardPage() {
  const [filters, setFilters] = React.useState<DashboardFiltersState>({
    dateRange: {},
    brand: '',
    fleet: '',
    type: '',
  });

  const filteredOrders = React.useMemo(() => {
    return mockOrders.filter(order => {
      const { dateRange, brand, fleet, type } = filters;
      const orderDate = order.date;

      const dateMatch =
        (!dateRange.from || orderDate >= dateRange.from) &&
        (!dateRange.to || orderDate <= dateRange.to);
      
      const brandMatch = !brand || order.brand === brand;
      const fleetMatch = !fleet || order.fleet === fleet;
      const typeMatch = !type || order.type === type;

      return dateMatch && brandMatch && fleetMatch && typeMatch;
    });
  }, [filters]);

  return (
    <RoleProvider>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <DashboardFilters filters={filters} onFiltersChange={setFilters} />
          
          <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            <StatsCards orders={filteredOrders} />
          </div>

          <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
             <Card>
                <CardHeader>
                    <CardTitle>Órdenes por Marca</CardTitle>
                    <CardDescription>Distribución de órdenes por marca.</CardDescription>
                </CardHeader>
                <CardContent>
                    <OrdersByBrandChart orders={filteredOrders} />
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Órdenes por Flota</CardTitle>
                    <CardDescription>Distribución de órdenes por flota.</CardDescription>
                </CardHeader>
                <CardContent>
                    <OrdersByFleetChart orders={filteredOrders} />
                </CardContent>
            </Card>
             <Card>
                <CardHeader>
                    <CardTitle>Órdenes por Estado</CardTitle>
                    <CardDescription>Distribución de órdenes por estado.</CardDescription>
                </CardHeader>
                <CardContent>
                    <OrdersByStatusChart orders={filteredOrders} />
                </CardContent>
            </Card>
          </div>

          <div className="grid gap-4 md:gap-8 lg:grid-cols-1">
            <Card>
                 <CardHeader>
                    <CardTitle>Resumen Mensual de Órdenes</CardTitle>
                    <CardDescription>Un resumen de las órdenes filtradas por mes.</CardDescription>
                </CardHeader>
                <CardContent>
                    <OrdersChart orders={filteredOrders} />
                </CardContent>
            </Card>
          </div>
        </main>
      </div>
    </RoleProvider>
  );
}
