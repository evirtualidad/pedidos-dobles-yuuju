
"use client";

import * as React from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreHorizontal, UserPlus } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CreateUserDialog } from "@/components/admin/create-user-dialog";
import { DeleteUserDialog } from "@/components/admin/delete-user-dialog";
import type { UserWithId, Driver } from "@/lib/types";
import { useData } from "@/contexts/data-context";
import { CreateDriverDialog } from "@/components/admin/create-driver-dialog";


export default function AdminUsersPage() {
    const { users, user: currentUser, role: currentRole, updateUser, deleteUser, fleets, addAuditLog, createUser, toast, addDriver, drivers } = useData();
    const [isCreateUserDialogOpen, setIsCreateUserDialogOpen] = React.useState(false);
    const [isCreateDriverDialogOpen, setIsCreateDriverDialogOpen] = React.useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
    const [selectedUser, setSelectedUser] = React.useState<UserWithId | null>(null);

    const handleAddUser = async (userData: Omit<UserWithId, 'id'>) => {
        if (!currentUser || !currentRole) return;
        try {
            await createUser(userData.email, "password", userData.role, userData.name, userData.fleet);
            
            await addAuditLog({
                user: currentUser.name,
                role: currentRole,
                action: 'Created User',
                details: `User "${userData.name}" (${userData.email}) created with role ${userData.role}`,
            });

            toast({
                title: "Usuario Creado",
                description: `El usuario "${userData.name}" ha sido creado. La contraseña inicial es "password".`,
            });

        } catch (error: any) {
             toast({
                variant: "destructive",
                title: "Error al crear usuario",
                description: error.code === 'auth/email-already-in-use' 
                    ? "El correo electrónico ya está en uso."
                    : error.message,
            });
        }
    };

    const handleUpdateUser = async (id: string, user: Omit<UserWithId, 'id'>) => {
        if (!currentUser || !currentRole) return;
        await updateUser(id, user);
        await addAuditLog({
            user: currentUser.name,
            role: currentRole,
            action: 'Updated User',
            details: `User "${user.name}" (ID: ${id}) updated`,
        });
        setSelectedUser(null);
    };

    const handleDeleteUser = async () => {
        if (selectedUser && currentUser && currentRole) {
            await deleteUser(selectedUser.id);
            await addAuditLog({
                user: currentUser.name,
                role: currentRole,
                action: 'Deleted User',
                details: `User "${selectedUser.name}" (ID: ${selectedUser.id}) profile deleted from Firestore`,
            });
            setIsDeleteDialogOpen(false);
            setSelectedUser(null);
            toast({
                title: "Usuario Eliminado",
                description: `El perfil de "${selectedUser.name}" ha sido eliminado de Firestore. La cuenta de autenticación aún existe.`,
            });
        }
    };
    
    const handleAddDriver = async (driverData: Omit<Driver, 'id'>) => {
        if (!currentUser || !currentRole) return;
        const driverId = await addDriver(driverData);
        if (driverId) {
            toast({
                title: "Motorista Creado",
                description: `El motorista "${driverData.name}" ha sido creado exitosamente.`,
            });
            await addAuditLog({
                user: currentUser.name,
                role: currentRole,
                action: 'Created Driver',
                details: `Driver "${driverData.name}" created`,
            });
            setIsCreateDriverDialogOpen(false);
        } else {
            toast({
                variant: "destructive",
                title: "Error",
                description: "No se pudo crear el motorista.",
            });
        }
    };


    const openEditDialog = (user: UserWithId) => {
        setSelectedUser(user);
        setIsCreateUserDialogOpen(true);
    };

    const openDeleteDialog = (user: UserWithId) => {
        setSelectedUser(user);
        setIsDeleteDialogOpen(true);
    };

    const closeCreateUserDialog = () => {
        setSelectedUser(null);
        setIsCreateUserDialogOpen(false);
    }
    
    const fleetNames = fleets.map(f => f.name);

    return (
        <AdminLayout>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Usuarios</CardTitle>
                                <CardDescription>
                                    Gestiona los usuarios y sus roles de acceso.
                                </CardDescription>
                            </div>
                            <Button size="sm" className="gap-1" onClick={() => setIsCreateUserDialogOpen(true)}>
                                <PlusCircle className="h-3.5 w-3.5" />
                                Añadir Usuario
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nombre</TableHead>
                                    <TableHead>Correo</TableHead>
                                    <TableHead>Rol</TableHead>
                                    <TableHead>Flota</TableHead>
                                    <TableHead>
                                        <span className="sr-only">Acciones</span>
                                    </TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {users.map(user => (
                                    <TableRow key={user.id}>
                                        <TableCell>{user.name}</TableCell>
                                        <TableCell className="text-muted-foreground">{user.email}</TableCell>
                                        <TableCell>{user.role}</TableCell>
                                        <TableCell className="text-muted-foreground">{user.fleet || 'N/A'}</TableCell>
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
                                                        <DropdownMenuItem onClick={() => openEditDialog(user)}>Editar</DropdownMenuItem>
                                                        <DropdownMenuItem className="text-destructive" onClick={() => openDeleteDialog(user)}>Eliminar</DropdownMenuItem>
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
                 <Card>
                    <CardHeader>
                        <div className="flex items-center justify-between">
                            <div>
                                <CardTitle>Motoristas</CardTitle>
                                <CardDescription>
                                    Gestiona los motoristas y sus flotas.
                                </CardDescription>
                            </div>
                            <Button size="sm" className="gap-1" onClick={() => setIsCreateDriverDialogOpen(true)}>
                                <UserPlus className="h-3.5 w-3.5" />
                                Añadir Motorista
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Nombre del Motorista</TableHead>
                                    <TableHead>Flota Asignada</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {drivers.map(driver => (
                                    <TableRow key={driver.id}>
                                        <TableCell>{driver.name}</TableCell>
                                        <TableCell className="text-muted-foreground">{driver.fleet}</TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </div>

             <CreateUserDialog
                isOpen={isCreateUserDialogOpen}
                setIsOpen={closeCreateUserDialog}
                onSave={selectedUser ? (data) => handleUpdateUser(selectedUser.id, data) : handleAddUser}
                user={selectedUser}
                fleets={fleetNames}
            />
            
             <CreateDriverDialog
                isOpen={isCreateDriverDialogOpen}
                setIsOpen={setIsCreateDriverDialogOpen}
                onSave={handleAddDriver}
            />

            <DeleteUserDialog
                isOpen={isDeleteDialogOpen}
                setIsOpen={setIsDeleteDialogOpen}
                onConfirm={handleDeleteUser}
                userName={selectedUser?.name}
            />
        </AdminLayout>
    )
}
