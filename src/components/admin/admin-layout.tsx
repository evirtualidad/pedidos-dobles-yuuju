
import { Header } from "@/components/header";
import { AdminNav } from "./admin-nav";

export function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Header />
      <div className="flex flex-col sm:gap-4 sm:py-4">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
            <div className="max-w-5xl mx-auto w-full space-y-6">
                <div className="space-y-0.5">
                    <h1 className="text-2xl font-bold md:text-3xl">Gestión</h1>
                    <p className="text-muted-foreground">
                        Gestiona flotas, marcas, tipos de pedido y usuarios.
                    </p>
                </div>
                <div className="grid gap-6 md:grid-cols-[180px_1fr]">
                    <aside className="hidden w-full md:flex">
                        <AdminNav />
                    </aside>
                    <div className="flex-1">
                        {children}
                    </div>
                </div>
            </div>
        </main>
      </div>
    </div>
  );
}
