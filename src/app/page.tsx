import { Header } from '@/components/header';
import { StatsCards } from '@/components/dashboard/stats-cards';
import { OrdersTable } from '@/components/dashboard/orders-table';
import { RoleProvider } from '@/contexts/role-context';

export default function DashboardPage() {
  return (
    <RoleProvider>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
          <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
            <StatsCards />
          </div>
          <div className="grid gap-4 md:gap-8 lg:grid-cols-1">
             <OrdersTable />
          </div>
        </main>
      </div>
    </RoleProvider>
  );
}
