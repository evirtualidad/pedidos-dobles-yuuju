
"use client";

import { useRole } from "@/contexts/role-context";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Terminal } from "lucide-react";
import { ClientDate } from "./client-date";
import { useData } from "@/contexts/data-context";

export function AuditTable() {
    const { role } = useRole();
    const { auditLogs } = useData();

    if (role !== 'Admin') {
        return (
            <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Acceso Denegado</AlertTitle>
                <AlertDescription>
                    No tienes permiso para ver el registro de auditoría.
                </AlertDescription>
            </Alert>
        );
    }
    
    // Sort logs by timestamp descending
    const sortedLogs = [...auditLogs].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
    
    return (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Usuario</TableHead>
                    <TableHead>Rol</TableHead>
                    <TableHead>Acción</TableHead>
                    <TableHead>Detalles</TableHead>
                    <TableHead>Fecha y Hora</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {sortedLogs.map(log => (
                    <TableRow key={log.id}>
                        <TableCell className="font-medium">{log.user}</TableCell>
                        <TableCell>{log.role}</TableCell>
                        <TableCell>{log.action}</TableCell>
                        <TableCell className="text-muted-foreground">{log.details}</TableCell>
                        <TableCell>
                          <ClientDate date={log.timestamp} formatString="Pp" />
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );
}
