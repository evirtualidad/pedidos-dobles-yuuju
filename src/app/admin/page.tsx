
import { RoleProvider } from "@/contexts/role-context";
import { AdminLayout } from "@/components/admin/admin-layout";

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
