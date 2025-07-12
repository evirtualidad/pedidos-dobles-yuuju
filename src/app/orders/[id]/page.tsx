
"use client";

import { Header } from '@/components/header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useData } from '@/contexts/data-context';
import { notFound } from 'next/navigation';
import { Separator } from '@/components/ui/separator';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';

// Note: This component is client-side because useData hook needs to be.
// For a fully server-rendered page, you would fetch data differently.
export default function OrderDetailsPage({ params }: { params: { id: string } }) {
  const { orders } = useData();
  const order = orders.find(o => o.id === params.id);

  if (!order) {
    // In a real app, you might want a more sophisticated loading/not-found state
    // For now, if the context is not loaded yet, it might briefly show notFound.
    // To fix this, you'd implement a loading state in your DataProvider.
    return notFound();
  }

  return (
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
  );
}
