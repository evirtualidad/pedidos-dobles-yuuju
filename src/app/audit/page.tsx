
import { Header } from '@/components/header';
import { AuditTable } from '@/components/audit-table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function AuditLogPage() {
  return (
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="max-w-5xl mx-auto w-full">
                <Card>
                    <CardHeader>
                        <CardTitle>Registro de Auditoría</CardTitle>
                        <CardDescription>
                        Rastrea todas las actividades relacionadas con los pedidos y las acciones de los usuarios.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <AuditTable />
                    </CardContent>
                </Card>
            </div>
        </main>
      </div>
  );
}
