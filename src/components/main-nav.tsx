
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useData } from "@/contexts/data-context"

export function MainNav() {
  const pathname = usePathname()
  const { role } = useData()

  const routes = [
    { href: '/', label: 'Dashboard', active: pathname === '/' },
    { href: '/orders', label: 'Órdenes', active: pathname.startsWith('/orders') },
    { href: '/audit', label: 'Audit Log', active: pathname === '/audit', roles: ['Admin'] },
    { href: '/admin', label: 'Gestión', active: pathname.startsWith('/admin'), roles: ['Admin']}
  ].filter(route => !route.roles || (role && route.roles.includes(role)));

  return (
    <nav className="flex items-center space-x-2 lg:space-x-4">
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-2 text-sm font-medium transition-colors",
            "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
            route.active
              ? "bg-primary text-primary-foreground shadow-sm"
              : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  )
}
