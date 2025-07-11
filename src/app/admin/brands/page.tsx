
"use client";

import * as React from "react";
import { RoleProvider } from "@/contexts/role-context";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreHorizontal } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CreateBrandDialog } from "@/components/admin/create-brand-dialog";
import { DeleteBrandDialog } from "@/components/admin/delete-brand-dialog";
import type { Brand } from "@/lib/types";
import { brands as mockBrands } from "@/lib/data";

const initialBrands: Brand[] = mockBrands.map((name, index) => ({ id: (index + 1).toString(), name }));

export default function AdminBrandsPage() {
    const [brands, setBrands] = React.useState<Brand[]>(initialBrands);
    const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
    const [selectedBrand, setSelectedBrand] = React.useState<Brand | null>(null);

    const handleAddBrand = (name: string) => {
        const newBrand: Brand = {
            id: (brands.length + 1).toString(),
            name,
        };
        setBrands(prev => [...prev, newBrand]);
    };

    const handleUpdateBrand = (id: string, name: string) => {
        setBrands(prev => prev.map(b => b.id === id ? { ...b, name } : b));
        setSelectedBrand(null);
    };

    const handleDeleteBrand = () => {
        if (selectedBrand) {
            setBrands(prev => prev.filter(b => b.id !== selectedBrand.id));
            setIsDeleteDialogOpen(false);
            setSelectedBrand(null);
        }
    };

    const openEditDialog = (brand: Brand) => {
        setSelectedBrand(brand);
        setIsCreateDialogOpen(true);
    };

    const openDeleteDialog = (brand: Brand) => {
        setSelectedBrand(brand);
        setIsDeleteDialogOpen(true);
    };

    const closeCreateDialog = () => {
        setSelectedBrand(null);
        setIsCreateDialogOpen(false);
    }

    return (
        <RoleProvider>
            <AdminLayout>
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Marcas</CardTitle>
                                <CardDescription>
                                    Gestiona las marcas de los pedidos.
                                </CardDescription>
                            </div>
                            <Button size="sm" className="gap-1" onClick={() => setIsCreateDialogOpen(true)}>
                                <PlusCircle className="h-3.5 w-3.5" />
                                Añadir Marca
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="border rounded-lg">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nombre de la Marca</TableHead>
                                        <TableHead>
                                            <span className="sr-only">Acciones</span>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {brands.map(brand => (
                                        <TableRow key={brand.id}>
                                            <TableCell className="font-medium">{brand.name}</TableCell>
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
                                                            <DropdownMenuItem onClick={() => openEditDialog(brand)}>Editar</DropdownMenuItem>
                                                            <DropdownMenuItem className="text-destructive" onClick={() => openDeleteDialog(brand)}>Eliminar</DropdownMenuItem>
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

            <CreateBrandDialog
                isOpen={isCreateDialogOpen}
                setIsOpen={closeCreateDialog}
                onSave={selectedBrand ? (name) => handleUpdateBrand(selectedBrand.id, name) : handleAddBrand}
                brand={selectedBrand}
            />

            <DeleteBrandDialog
                isOpen={isDeleteDialogOpen}
                setIsOpen={setIsDeleteDialogOpen}
                onConfirm={handleDeleteBrand}
                brandName={selectedBrand?.name}
            />
        </RoleProvider>
    )
}
