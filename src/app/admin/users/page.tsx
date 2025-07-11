
"use client";

import * as React from "react";
import { RoleProvider } from "@/contexts/role-context";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle, MoreHorizontal } from "lucide-react";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import type { User } from "@/lib/types";

const mockUsers: User[] = [
    { name: 'Admin User', role: 'Admin'},
    { name: 'Supervisor Sam', role: 'Fleet Supervisor', fleet: 'Fleet 1'},
    { name: 'Data Clerk', role: 'Data Entry'}
]


export default function AdminUsersPage() {

    return (
        <RoleProvider>
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
                            <Button size="sm" className="gap-1">
                                <PlusCircle className="h-3.5 w-3.5" />
                                Añadir Usuario
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="border rounded-lg">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nombre</TableHead>
                                        <TableHead>Rol</TableHead>
                                        <TableHead>Flota (si aplica)</TableHead>
                                        <TableHead>
                                            <span className="sr-only">Acciones</span>
                                        </TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {mockUsers.map(user => (
                                        <TableRow key={user.name}>
                                            <TableCell className="font-medium">{user.name}</TableCell>
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
