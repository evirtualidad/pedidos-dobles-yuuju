
"use client";

import * as React from "react";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreHorizontal } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { CreateUserDialog } from "@/components/admin/create-user-dialog";
import { DeleteUserDialog } from "@/components/admin/delete-user-dialog";
import type { UserWithId } from "@/lib/types";
import { useData } from "@/contexts/data-context";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";

export default function AdminUsersPage() {
    const { users, addUser, updateUser, deleteUser, fleets } = useData();
    const { toast } = useToast();
    const [isCreateDialogOpen, setIsCreateDialogOpen] = React.useState(false);
    const [isDeleteDialogOpen, setIsDeleteDialogOpen] = React.useState(false);
    const [selectedUser, setSelectedUser] = React.useState<UserWithId | null>(null);

    const handleAddUser = async (userData: Omit<UserWithId, 'id'>) => {
        try {
            // Create user in Firebase Auth
            // For simplicity, we'll use a default password. 
            // In a real app, you'd have a more secure way of setting this.
            const userCredential = await createUserWithEmailAndPassword(auth, userData.email, "password");
            const newAuthUser = userCredential.user;

            // Add user profile to Firestore using the Auth UID as the document ID
            await addUser(newAuthUser.uid, userData);

            toast({
                title: "Usuario Creado",
                description: `El usuario "${userData.name}" ha sido creado. La contraseña temporal es "password".`,
            });
        } catch (error: any) {
            console.error("Error creating user:", error);
            if (error.code === 'auth/email-already-in-use') {
                 toast({
                    variant: "destructive",
                    title: "Error al crear usuario",
                    description: "El correo electrónico ya está en uso por otro usuario.",
                });
            } else {
                toast({
                    variant: "destructive",
                    title: "Error al crear usuario",
                    description: "No se pudo crear el usuario. Revisa la consola para más detalles.",
                });
            }
        }
    };

    const handleUpdateUser = async (id: string, user: Omit<UserWithId, 'id'>) => {
        // Note: Updating user email in Firebase Auth is a sensitive operation
        // and requires re-authentication. For this app, we'll only update the Firestore profile.
        await updateUser(id, user);
        setSelectedUser(null);
    };

    const handleDeleteUser = async () => {
        if (selectedUser) {
            // Deleting a user from Auth is a destructive operation and requires
            // server-side logic (Admin SDK) to do properly without re-authentication.
            // For this client-side app, we will only delete from Firestore.
            await deleteUser(selectedUser.id);
            setIsDeleteDialogOpen(false);
            setSelectedUser(null);
            toast({
                title: "Usuario Eliminado",
                description: `El perfil de "${selectedUser.name}" ha sido eliminado de Firestore. La cuenta de autenticación aún puede existir.`,
            });
        }
    };

    const openEditDialog = (user: UserWithId) => {
        setSelectedUser(user);
        setIsCreateDialogOpen(true);
    };

    const openDeleteDialog = (user: UserWithId) => {
        setSelectedUser(user);
        setIsDeleteDialogOpen(true);
    };

    const closeCreateDialog = () => {
        setSelectedUser(null);
        setIsCreateDialogOpen(false);
    }
    
    const fleetNames = fleets.map(f => f.name);

    return (
        <AdminLayout>
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Usuarios</CardTitle>
                            <CardDescription>
                                Gestiona los usuarios y sus roles.
                            </CardDescription>
                        </div>
                        <Button size="sm" className="gap-1" onClick={() => setIsCreateDialogOpen(true)}>
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
                                <TableHead>Flota (si aplica)</TableHead>
                                <TableHead>
                                    <span className="sr-only">Acciones</span>
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {users.map(user => (
                                <TableRow key={user.id}>
                                    <TableCell>{user.name}</TableCell>
                                    <TableCell>{user.email}</TableCell>
                                    <TableCell>{user.role}</TableCell>
                                    <TableCell>{user.fleet || 'N/A'}</TableCell>
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

             <CreateUserDialog
                isOpen={isCreateDialogOpen}
                setIsOpen={closeCreateDialog}
                onSave={selectedUser ? (data) => handleUpdateUser(selectedUser.id, data) : handleAddUser}
                user={selectedUser}
                fleets={fleetNames}
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
