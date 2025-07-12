
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { useData } from "@/contexts/data-context"
import { SheetClose } from "./ui/sheet"

export function MainNav({ isMobile = false, onLinkClick }: { isMobile?: boolean, onLinkClick?: () => void }) {
  const pathname = usePathname()
  const { role } = useData()

  const routes = [
    { href: '/', label: 'Dashboard', active: pathname === '/' },
    { href: '/orders', label: 'Órdenes', active: pathname.startsWith('/orders') },
    { href: '/audit', label: 'Audit Log', active: pathname === '/audit', roles: ['Admin'] },
    { href: '/admin', label: 'Gestión', active: pathname.startsWith('/admin'), roles: ['Admin']}
  ].filter(route => !route.roles || (role && route.roles.includes(role)));

  const navLinkClasses = (active: boolean) => cn(
    "flex items-center justify-start whitespace-nowrap rounded-md text-sm font-medium transition-colors",
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
    isMobile 
      ? "py-3 px-6 text-base"
      : "px-3 py-2",
    active
      ? (isMobile ? "bg-primary/10 text-primary" : "bg-primary text-primary-foreground shadow-sm")
      : "text-muted-foreground hover:bg-accent hover:text-accent-foreground"
  );
  
  if (isMobile) {
    return (
        <>
            {routes.map((route) => (
                <SheetClose asChild key={route.href}>
                    <Link
                        href={route.href}
                        className={navLinkClasses(route.active)}
                        onClick={onLinkClick}
                    >
                        {route.label}
                    </Link>
                </SheetClose>
            ))}
       </>
    )
  }


  return (
    <nav className="flex items-center space-x-1 lg:space-x-2">
      {routes.map((route) => (
        <Link
          key={route.href}
          href={route.href}
          className={navLinkClasses(route.active)}
        >
          {route.label}
        </Link>
      ))}
    </nav>
  )
}
