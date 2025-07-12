
"use client";

import * as React from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreHorizontal } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CreateOrderTypeDialog } from "@/components/admin/create-order-type-dialog";
import { DeleteOrderTypeDialog } from "@/components/admin/delete-order-type-dialog";
import type { OrderType } from "@/lib/types";
import { useData } from "@/contexts/data-context";
import { useToast } from "@/hooks/use-toast";

export default function AdminOrderTypesPage() {
    const { orderTypes, orders, addOrderType, updateOrderType, deleteOrderType } = useData();
    const { toast } = useToast();
    const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
    const [selectedOrderType, setSelectedOrderType] = React.useState<OrderType | null>(null);

    const handleUpdateOrderType = async (id: string, name: string) => {
        await updateOrderType(id, name);
        setSelectedOrderType(null);
    };

    const handleDeleteOrderType = async () => {
        if (selectedOrderType) {
            const isOrderTypeInUse = orders.some(order => order.type === selectedOrderType.name);

            if (isOrderTypeInUse) {
                toast({
                    variant: "destructive",
                    title: "Error al eliminar",
                    description: `El tipo de pedido "${selectedOrderType.name}" está en uso y no puede ser eliminado.`,
                });
                setIsDeleteDialogOpen(false);
                setSelectedOrderType(null);
                return;
            }

            await deleteOrderType(selectedOrderType.id);
            setIsDeleteDialogOpen(false);
            setSelectedOrderType(null);
        }
    };

    const openEditDialog = (orderType: OrderType) => {
        setSelectedOrderType(orderType);
        setIsCreateDialogOpen(true);
    };

    const openDeleteDialog = (orderType: OrderType) => {
        setSelectedOrderType(orderType);
        setIsDeleteDialogOpen(true);
    };

    const closeCreateDialog = () => {
        setSelectedOrderType(null);
        setIsCreateDialogOpen(false);
    }

    return (
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
                        <Button size="sm" className="gap-1" onClick={() => setIsCreateDialogOpen(true)}>
                            <PlusCircle className="h-3.5 w-3.5" />
                            Añadir Tipo
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
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
                                    <TableCell>{orderType.name}</TableCell>
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
                                                    <DropdownMenuItem onClick={() => openEditDialog(orderType)}>Editar</DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive" onClick={() => openDeleteDialog(orderType)}>Eliminar</DropdownMenuItem>
                                                </DropdownMenuContent>
                                            </DropdownMenu>
                                        </div>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <CreateOrderTypeDialog
                isOpen={isCreateDialogOpen}
                setIsOpen={closeCreateDialog}
                onSave={selectedOrderType ? (name) => handleUpdateOrderType(selectedOrderType.id, name) : addOrderType}
                orderType={selectedOrderType}
            />

            <DeleteOrderTypeDialog
                isOpen={isDeleteDialogOpen}
                setIsOpen={setIsDeleteDialogOpen}
                onConfirm={handleDeleteOrderType}
                orderTypeName={selectedOrderType?.name}
            />
        </AdminLayout>
    )
}
