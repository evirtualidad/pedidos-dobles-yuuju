
import { Header } from '@/components/header';
import { RoleProvider } from '@/contexts/role-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { mockOrders } from '@/lib/data';
import { notFound } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';


export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const order = mockOrders.find(o => o.id === params.id);

  if (!order) {
    notFound();
  }

  const getStatusVariant = (status: 'Pending' | 'Completed' | 'Cancelled') => {
    switch (status) {
      case 'Completed':
        return 'default';
      case 'Pending':
        return 'secondary';
      case 'Cancelled':
        return 'destructive';
      default:
        return 'outline';
    }
  };


  return (
    <RoleProvider>
      <div className="flex min-h-screen w-full flex-col bg-muted/40">
        <Header />
        <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
            <div className="max-w-4xl mx-auto w-full">
                <div className="mb-4">
                    <Button asChild variant="outline" size="sm" className="gap-1">
                        <Link href="/orders">
                            <ArrowLeft className="h-4 w-4" />
                            Volver a Órdenes
                        </Link>
                    </Button>
                </div>
                <Card>
                    <CardHeader className="flex flex-row items-start justify-between">
                        <div>
                            <CardTitle>Orden {order.orderNumber}</CardTitle>
                            <CardDescription>
                                Detalles completos de la orden.
                            </CardDescription>
                        </div>
                        <Badge variant={getStatusVariant(order.status)}>{order.status}</Badge>
                    </CardHeader>
                    <CardContent>
                        <div className="grid gap-6">
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Motorista</p>
                                    <p>{order.driver}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Fecha de Ingreso</p>
                                    <p>{format(order.date, "PPP")}</p>
                                </div>
                            </div>
                            <Separator />
                             <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Marca</p>
                                    <p>{order.brand}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Tipo</p>
                                    <p>{order.type}</p>
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-muted-foreground">Flota</p>
                                    <p>{order.fleet}</p>
                                </div>
                                 <div>
                                    <p className="text-sm font-medium text-muted-foreground">Cantidad</p>
                                    <p>{order.quantity}</p>
                                </div>
                            </div>
                            <Separator />
                            <div>
                                <p className="text-sm font-medium text-muted-foreground">Observaciones</p>
                                <p className="mt-1 text-sm">
                                    {order.observations || 'Sin observaciones.'}
                                </p>
                            </div>
                             <Separator />
                             <div>
                                <p className="text-sm font-medium text-muted-foreground">Ingresado por</p>
                                <p className="mt-1 text-sm">{order.enteredBy}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </main>
      </div>
    </RoleProvider>
  );
}
