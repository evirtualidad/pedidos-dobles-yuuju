
"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PanelLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Header } from "@/components/header";
import { AdminNav } from "./admin-nav";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";


const adminRoutes = [
    { href: '/admin', label: 'General' },
    { href: '/admin/fleets', label: 'Flotas' },
    { href: '/admin/brands', label: 'Marcas' },
    { href: '/admin/order-types', label: 'Tipos de Pedido' },
    { href: '/admin/users', label: 'Usuarios' },
];

export function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Header />
      <div className="flex flex-col sm:gap-4 sm:py-4">
        <main className="grid flex-1 items-start gap-4 p-4 sm:px-6 sm:py-0 md:gap-8">
          <div className="mx-auto grid w-full max-w-6xl gap-2">
            <div className="flex items-center gap-4">
                <Sheet>
                    <SheetTrigger asChild>
                        <Button size="icon" variant="outline" className="sm:hidden">
                            <PanelLeft className="h-5 w-5" />
                            <span className="sr-only">Toggle Menu</span>
                        </Button>
                    </SheetTrigger>
                    <SheetContent side="left" className="sm:max-w-xs">
                        <nav className="grid gap-6 text-lg font-medium">
                        {adminRoutes.map(route => (
                            <Link
                                key={route.href}
                                href={route.href}
                                className={cn(
                                    "flex items-center gap-4 px-2.5 text-muted-foreground hover:text-foreground",
                                    pathname === route.href && "text-foreground"
                                )}
                            >
                            {route.label}
                            </Link>
                        ))}
                        </nav>
                    </SheetContent>
                </Sheet>
                <h1 className="flex-1 shrink-0 whitespace-nowrap text-xl font-semibold tracking-tight sm:grow-0">
                    Gestión
                </h1>
            </div>
            <div className="grid gap-4 md:grid-cols-[200px_1fr] lg:grid-cols-[250px_1fr]">
              <aside className="hidden w-full md:flex">
                  <AdminNav />
              </aside>
              <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
                {children}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
