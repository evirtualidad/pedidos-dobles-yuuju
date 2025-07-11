import { Header } from '@/components/header';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { OrdersTable } from '@/components/dashboard/orders-table';
import { RoleProvider } from '@/contexts/role-context';
import { OrdersChart } from '@/components/dashboard/orders-chart';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

export default function DashboardPage() {
  return (
    <RoleProvider>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            <StatsCards />
          </div>
          <div className="grid gap-4 md:gap-8 lg:grid-cols-2">
            <Card className="col-span-2 lg:col-span-1">
                 <CardHeader>
                    <CardTitle>Resumen de Órdenes</CardTitle>
                    <CardDescription>Un resumen de las órdenes del último año.</CardDescription>
                </CardHeader>
                <CardContent>
                    <OrdersChart />
                </CardContent>
            </Card>
            <div className="col-span-2 lg:col-span-1">
              {/* Could add another chart here in the future */}
            </div>
          </div>
          <div className="grid gap-4 md:gap-8 lg:grid-cols-1">
             <OrdersTable />
          </div>
        </main>
      </div>
    </RoleProvider>
  );
}
