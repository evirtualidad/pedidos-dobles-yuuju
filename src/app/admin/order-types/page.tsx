
"use client";

import * as React from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreHorizontal, ArrowUp, ArrowDown } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CreateOrderTypeDialog } from "@/components/admin/create-order-type-dialog";
import { DeleteOrderTypeDialog } from "@/components/admin/delete-order-type-dialog";
import type { OrderType } from "@/lib/types";
import { useData } from "@/contexts/data-context";
import { useToast } from "@/hooks/use-toast";

export default function AdminOrderTypesPage() {
    const { user, role, orderTypes, orders, addOrderType, updateOrderType, deleteOrderType, addAuditLog, updateOrderTypesOrder } = useData();
    const { toast } = useToast();
    const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
    const [selectedOrderType, setSelectedOrderType] = React.useState<OrderType | null>(null);

    const handleAddOrderType = async (name: string) => {
        if (!user || !role) return;
        await addOrderType(name);
        await addAuditLog({
            user: user.name,
            role: role,
            action: 'Created Order Type',
            details: `Order Type "${name}" created`,
        });
    };

    const handleUpdateOrderType = async (id: string, name: string) => {
        if (!user || !role) return;
        await updateOrderType(id, name);
        await addAuditLog({
            user: user.name,
            role: role,
            action: 'Updated Order Type',
            details: `Order Type "${name}" (ID: ${id}) updated`,
        });
        setSelectedOrderType(null);
    };

    const handleDeleteOrderType = async () => {
        if (selectedOrderType && user && role) {
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
            await addAuditLog({
                user: user.name,
                role: role,
                action: 'Deleted Order Type',
                details: `Order Type "${selectedOrderType.name}" (ID: ${selectedOrderType.id}) deleted`,
            });
            setIsDeleteDialogOpen(false);
            setSelectedOrderType(null);
        }
    };
    
    const handleMove = async (index: number, direction: 'up' | 'down') => {
        if ((index === 0 && direction === 'up') || (index === orderTypes.length - 1 && direction === 'down')) {
            return;
        }

        const newOrderTypes = [...orderTypes];
        const targetIndex = direction === 'up' ? index - 1 : index + 1;

        [newOrderTypes[index], newOrderTypes[targetIndex]] = [newOrderTypes[targetIndex], newOrderTypes[index]];
        
        await updateOrderTypesOrder(newOrderTypes);
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
                                Gestiona y ordena los tipos de pedido. El primero de la lista será el predeterminado.
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
                                <TableHead className="w-[100px]">Orden</TableHead>
                                <TableHead className="w-[100px]">
                                    <span className="sr-only">Acciones</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {orderTypes.map((orderType, index) => (
                                <TableRow key={orderType.id}>
                                    <TableCell>{orderType.name}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-2">
                                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleMove(index, 'up')} disabled={index === 0}>
                                                <ArrowUp className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="h-6 w-6" onClick={() => handleMove(index, 'down')} disabled={index === orderTypes.length - 1}>
                                                <ArrowDown className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </TableCell>
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
                onSave={selectedOrderType ? (name) => handleUpdateOrderType(selectedOrderType.id, name) : handleAddOrderType}
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
