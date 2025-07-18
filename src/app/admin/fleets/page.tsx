
"use client";

import * as React from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreHorizontal } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CreateFleetDialog } from "@/components/admin/create-fleet-dialog";
import { DeleteFleetDialog } from "@/components/admin/delete-fleet-dialog";
import type { Fleet } from "@/lib/types";
import { useData } from "@/contexts/data-context";
import { useToast } from "@/hooks/use-toast";

export default function AdminFleetsPage() {
    const { fleets, orders, addFleet, updateFleet, deleteFleet } = useData();
    const { toast } = useToast();
    const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
    const [selectedFleet, setSelectedFleet] = React.useState<Fleet | null>(null);

    const handleAddFleet = async (name: string) => {
        await addFleet(name);
    };

    const handleUpdateFleet = async (id: string, name: string) => {
        await updateFleet(id, name);
        setSelectedFleet(null);
    };

    const handleDeleteFleet = async () => {
        if (selectedFleet) {
            const isFleetInUse = orders.some(order => order.fleet === selectedFleet.name);

            if (isFleetInUse) {
                toast({
                    variant: "destructive",
                    title: "Error al eliminar",
                    description: `La flota "${selectedFleet.name}" está en uso y no puede ser eliminada.`,
                });
                setIsDeleteDialogOpen(false);
                setSelectedFleet(null);
                return;
            }
            
            await deleteFleet(selectedFleet.id);
            setIsDeleteDialogOpen(false);
            setSelectedFleet(null);
        }
    };

    const openEditDialog = (fleet: Fleet) => {
        setSelectedFleet(fleet);
        setIsCreateDialogOpen(true);
    };

    const openDeleteDialog = (fleet: Fleet) => {
        setSelectedFleet(fleet);
        setIsDeleteDialogOpen(true);
    };

    const closeCreateDialog = () => {
        setSelectedFleet(null);
        setIsCreateDialogOpen(false);
    }

    return (
        <AdminLayout>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Flotas</CardTitle>
                            <CardDescription>
                                Gestiona las flotas de vehículos.
                            </CardDescription>
                        </div>
                        <Button size="sm" className="gap-1" onClick={() => setIsCreateDialogOpen(true)}>
                            <PlusCircle className="h-3.5 w-3.5" />
                            Añadir Flota
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Nombre de la Flota</TableHead>
                                <TableHead>
                                    <span className="sr-only">Acciones</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {fleets.map(fleet => (
                                <TableRow key={fleet.id}>
                                    <TableCell>{fleet.name}</TableCell>
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
                                                    <DropdownMenuItem onClick={() => openEditDialog(fleet)}>Editar</DropdownMenuItem>
                                                    <DropdownMenuItem className="text-destructive" onClick={() => openDeleteDialog(fleet)}>Eliminar</DropdownMenuItem>
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

            <CreateFleetDialog
                isOpen={isCreateDialogOpen}
                setIsOpen={closeCreateDialog}
                onSave={selectedFleet ? (name) => handleUpdateFleet(selectedFleet.id, name) : handleAddFleet}
                fleet={selectedFleet}
            />

            <DeleteFleetDialog
                isOpen={isDeleteDialogOpen}
                setIsOpen={setIsDeleteDialogOpen}
                onConfirm={handleDeleteFleet}
                fleetName={selectedFleet?.name}
            />
        </AdminLayout>
    )
}
