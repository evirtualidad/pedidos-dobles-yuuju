
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
    <nav className="grid gap-2 text-sm text-muted-foreground">
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "px-2 py-1 rounded-md hover:bg-accent hover:text-accent-foreground",
            pathname === route.href && "bg-accent text-accent-foreground font-semibold"
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  )
}
