
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"

export function AdminNav() {
  const pathname = usePathname()

  const routes = [
    { href: '/admin', label: 'General' },
    { href: '/admin/fleets', label: 'Flotas' },
    { href: '/admin/brands', label: 'Marcas' },
    { href: '/admin/order-types', label: 'Tipos de Pedido' },
    { href: '/admin/users', label: 'Usuarios' },
  ]

  return (
    <div className="border-b">
        <nav className="flex items-center gap-2 text-sm text-muted-foreground -mb-px">
        {routes.map((route) => (
            <Link
            key={route.href}
            href={route.href}
            className={cn(
                "px-3 py-2 border-b-2 border-transparent hover:text-primary",
                pathname === route.href && "text-primary font-semibold border-primary"
            )}
            >
            {route.label}
            </Link>
        ))}
        </nav>
    </div>
  )
}
