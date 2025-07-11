
import { RoleProvider } from "@/contexts/role-context";
import { AdminLayout } from "@/components/admin/admin-layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminPage() {
    return (
        <RoleProvider>
            <AdminLayout>
                 <Card>
                    <CardHeader>
                        <CardTitle>Bienvenido, Admin</CardTitle>
                        <CardDescription>
                            Usa la navegación superior para gestionar tu aplicación.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <p>Aquí puedes gestionar flotas, marcas, tipos de pedido y usuarios.</p>
                    </CardContent>
                </Card>
            </AdminLayout>
        </RoleProvider>
    )
}
