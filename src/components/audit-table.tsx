
"use client";

import { useRole } from "@/contexts/role-context";
import { mockAuditLogs } from "@/lib/data";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Terminal } from "lucide-react";
import { format } from "date-fns";

export function AuditTable() {
    const { role } = useRole();

    if (role === 'Data Entry') {
        return (
            <Alert variant="destructive">
                <Terminal className="h-4 w-4" />
                <AlertTitle>Access Denied</AlertTitle>
                <AlertDescription>
                    You do not have permission to view the audit log.
                </AlertDescription>
            </Alert>
        );
    }
    
    return (
        <div className="border rounded-lg">
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>User</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Details</TableHead>
                    <TableHead>Timestamp</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {mockAuditLogs.map(log => (
                    <TableRow key={log.id}>
                        <TableCell className="font-medium">{log.user}</TableCell>
                        <TableCell>{log.role}</TableCell>
                        <TableCell>{log.action}</TableCell>
                        <TableCell className="text-muted-foreground">{log.details}</TableCell>
                        <TableCell>{format(log.timestamp, "Pp")}</TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
        </div>
    );
}
