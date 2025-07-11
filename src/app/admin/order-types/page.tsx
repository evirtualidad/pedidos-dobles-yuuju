
"use client";

import * as React from "react";
import { RoleProvider } from "@/contexts/role-context";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreHorizontal } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { OrderType } from "@/lib/types";
import { orderTypes as mockOrderTypes } from "@/lib/data";

const initialOrderTypes: OrderType[] = mockOrderTypes.map((name, index) => ({ id: (index + 1).toString(), name }));

export default function AdminOrderTypesPage() {
    const [orderTypes, setOrderTypes] = React.useState<OrderType[]>(initialOrderTypes);

    return (
        <RoleProvider>
            <AdminLayout>
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Tipos de Pedido</CardTitle>
                                <CardDescription>
                                    Gestiona los tipos de pedido.
                                </CardDescription>
                            </div>
                            <Button size="sm" className="gap-1">
                                <PlusCircle className="h-3.5 w-3.5" />
                                Añadir Tipo
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="border rounded-lg">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nombre del Tipo de Pedido</TableHead>
                                        <TableHead>
                                            <span className="sr-only">Acciones</span>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {orderTypes.map(orderType => (
                                        <TableRow key={orderType.id}>
                                            <TableCell className="font-medium">{orderType.name}</TableCell>
                                            <TableCell>
                                                <div className="flex justify-end">
                                                    <DropdownMenu>
                                                        <DropdownMenuTrigger asChild>
                                                            <Button aria-haspopup="true" size="icon" variant="ghost">
                                                                <MoreHorizontal className="h-4 w-4" />
                                                                <span className="sr-only">Toggle menu</span>
                                                            </Button>
                                                        </DropdownMenuTrigger>
                                                        <DropdownMenuContent align="end">
                                                            <DropdownMenuItem>Editar</DropdownMenuItem>
                                                            <DropdownMenuItem className="text-destructive">Eliminar</DropdownMenuItem>
                                                        </DropdownMenuContent>
                                                    </DropdownMenu>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    </CardContent>
                </Card>
            </AdminLayout>
        </RoleProvider>
    )
}
