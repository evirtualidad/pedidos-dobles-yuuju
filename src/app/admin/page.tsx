
import { RoleProvider } from "@/contexts/role-context";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlusCircle } from "lucide-react";

// For now, we will use mock data
const fleets = [
    { id: '1', name: 'Fleet 1' },
    { id: '2', name: 'Fleet 2' },
    { id: '3', name: 'Fleet 3' },
];

export default function AdminPage() {
    return (
        <RoleProvider>
            <AdminLayout>
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">Bienvenido, Admin</h2>
                        <p className="text-muted-foreground">
                            Aquí puedes gestionar la configuración de tu aplicación.
                        </p>
                    </div>
                </div>
            </AdminLayout>
        </RoleProvider>
    )
}