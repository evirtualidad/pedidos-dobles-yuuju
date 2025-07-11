
"use client";

import * as React from "react";
import { RoleProvider } from "@/contexts/role-context";
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

export default function AdminOrderTypesPage() {
    const { orderTypes, addOrderType, updateOrderType, deleteOrderType } = useData();
    const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
    const [selectedOrderType, setSelectedOrderType] = React.useState<OrderType | null>(null);

    const handleAddOrderType = (name: string) => {
        addOrderType(name);
    };

    const handleUpdateOrderType = (id: string, name: string) => {
        updateOrderType(id, name);
        setSelectedOrderType(null);
    };

    const handleDeleteOrderType = () => {
        if (selectedOrderType) {
            deleteOrderType(selectedOrderType.id);
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
            </AdminLayout>

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
        </RoleProvider>
    )
}
