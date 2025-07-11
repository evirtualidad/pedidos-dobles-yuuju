
"use client";

import * as React from "react";
import { RoleProvider } from "@/contexts/role-context";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreHorizontal } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CreateFleetDialog } from "@/components/admin/create-fleet-dialog";
import { DeleteFleetDialog } from "@/components/admin/delete-fleet-dialog";
import type { Fleet } from "@/lib/types";
import { fleets as mockFleets } from "@/lib/data";

// Initialize fleets from mock data for now
const initialFleets: Fleet[] = mockFleets.map((name, index) => ({ id: (index + 1).toString(), name }));

export default function AdminFleetsPage() {
    const [fleets, setFleets] = React.useState<Fleet[]>(initialFleets);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
    const [selectedFleet, setSelectedFleet] = React.useState<Fleet | null>(null);

    const handleAddFleet = (name: string) => {
        const newFleet: Fleet = {
            id: (fleets.length + 1).toString(),
            name,
        };
        setFleets(prev => [...prev, newFleet]);
    };

    const handleUpdateFleet = (id: string, name: string) => {
        setFleets(prev => prev.map(f => f.id === id ? { ...f, name } : f));
        setSelectedFleet(null);
    };

    const handleDeleteFleet = () => {
        if (selectedFleet) {
            setFleets(prev => prev.filter(f => f.id !== selectedFleet.id));
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
        <RoleProvider>
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
                        <div className="border rounded-lg">
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
                                            <TableCell className="font-medium">{fleet.name}</TableCell>
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
                        </div>
                    </CardContent>
                </Card>
            </AdminLayout>

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
        </RoleProvider>
    )
}
