
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useRole } from "@/contexts/role-context"

export function MainNav() {
  const pathname = usePathname()
  const { role } = useRole()

  const routes = [
    { href: '/', label: 'Dashboard', active: pathname === '/' || pathname.startsWith('/orders') },
    { href: '/audit', label: 'Audit Log', active: pathname === '/audit', roles: ['Admin', 'Fleet Supervisor'] }
  ].filter(route => !route.roles || route.roles.includes(role));

  return (
    <nav className="flex items-center space-x-4 lg:space-x-6">
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={cn(
            "text-sm font-medium transition-colors hover:text-primary",
            route.active ? "text-primary" : "text-muted-foreground"
          )}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  )
}
