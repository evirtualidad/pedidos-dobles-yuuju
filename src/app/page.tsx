
"use client";

import * as React from "react";
import { Header } from '@/components/header';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { OrdersChart } from '@/components/dashboard/orders-chart';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { DashboardFilters } from "@/components/dashboard/dashboard-filters";
import { Order } from "@/lib/types";
import { OrdersByBrandChart } from "@/components/dashboard/orders-by-brand-chart";
import { DateRange } from "react-day-picker";
import { useData } from "@/contexts/data-context";
import { OrdersByOrderTypeChart } from "@/components/dashboard/orders-by-order-type-chart";
import { OrdersByFleetChart } from "@/components/dashboard/orders-by-fleet-chart";

export interface DashboardFiltersState {
  dateRange: DateRange;
  brand: string;
  fleet: string;
  type: string;
}

function DashboardPageContent() {
  const { role, user, orders } = useData();
  const [filters, setFilters] = React.useState<DashboardFiltersState>({
    dateRange: { from: undefined, to: undefined },
    brand: '',
    fleet: '',
    type: '',
  });

  const filteredOrders = React.useMemo(() => {
    let ordersToFilter = orders;
    // Apply role-based filtering first
    if (role === 'Fleet Supervisor' && user?.fleet) {
      ordersToFilter = orders.filter(order => order.fleet === user.fleet);
    }
    
    return ordersToFilter.filter(order => {
      const { dateRange, brand, fleet, type } = filters;
      const orderDate = order.date;

      const dateMatch =
        (!dateRange.from || orderDate >= dateRange.from) &&
        (!dateRange.to || orderDate <= dateRange.to);
      
      const brandMatch = !brand || order.brand === brand;
      // Fleet filter should only apply if not a supervisor, as data is pre-filtered
      const fleetMatch = role === 'Fleet Supervisor' || !fleet || order.fleet === fleet;
      const typeMatch = !type || order.type === type;

      return dateMatch && brandMatch && fleetMatch && typeMatch;
    });
  }, [filters, role, user?.fleet, orders]);

  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Header />
      <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
        <DashboardFilters filters={filters} onFiltersChange={setFilters} />
        
        <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
          <StatsCards orders={filteredOrders} />
        </div>

        <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
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
                  <CardTitle>Órdenes por Tipo de Pedido</CardTitle>
                  <CardDescription>Distribución de órdenes por tipo.</CardDescription>
              </CardHeader>
              <CardContent>
                  <OrdersByOrderTypeChart orders={filteredOrders} />
              </CardContent>
            </Card>
        </div>
        
        <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
            {role === 'Admin' && (
                <Card>
                    <CardHeader>
                        <CardTitle>Órdenes por Flota</CardTitle>
                        <CardDescription>Comparación de órdenes entre flotas.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <OrdersByFleetChart orders={filteredOrders} />
                    </CardContent>
                </Card>
            )}

            <Card className={role !== 'Admin' ? 'lg:col-span-2' : ''}>
                 <CardHeader>
                    <CardTitle>Resumen Semanal de Órdenes</CardTitle>
                    <CardDescription>Un resumen de las órdenes filtradas por semana.</CardDescription>
                </CardHeader>
                <CardContent className="px-2 pt-0 sm:p-6 sm:pt-0">
                    <OrdersChart orders={filteredOrders} />
                </CardContent>
            </Card>
        </div>
      </main>
    </div>
  );
}


export default function DashboardPage() {
  return (
      <DashboardPageContent />
  );
}
