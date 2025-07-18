
"use client";

import { Bike, LogOut, Menu } from "lucide-react";
import { MainNav } from "@/components/main-nav";
import { ThemeToggle } from "@/components/theme-toggle";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import Link from "next/link";
import { useData } from "@/contexts/data-context";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "./ui/button";
import { Sheet, SheetContent, SheetTrigger, SheetClose, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import * as React from "react";

export function Header() {
  const data = useData();
  const [open, setOpen] = React.useState(false);

  if (!data || !data.user) return null; // Render nothing if context is not yet available or no user

  const { user, logout } = data;

  const handleLogout = () => {
    logout();
  };
  
  const getInitials = (name: string | undefined) => {
    if (!name) return 'U';
    const names = name.split(' ');
    if (names.length > 1) {
      return `${names[0][0]}${names[1][0]}`.toUpperCase();
    }
    return name.substring(0, 2).toUpperCase();
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
         <div className="mr-4 md:hidden">
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="md:hidden"
                    >
                        <Menu className="h-6 w-6" />
                        <span className="sr-only">Toggle Menu</span>
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="pr-0 pt-12">
                    <SheetHeader>
                        <SheetTitle className="sr-only">Navegación Principal</SheetTitle>
                    </SheetHeader>
                    <SheetClose asChild>
                        <Link
                            href="/"
                            className="flex items-center gap-2 text-lg font-semibold mb-4 pl-6"
                        >
                            <Bike className="h-6 w-6 text-primary" />
                            <span>Pedidos Dobles Yuuju!</span>
                        </Link>
                    </SheetClose>
                     <nav className="grid gap-2 text-lg font-medium">
                        <MainNav isMobile={true} onLinkClick={() => setOpen(false)} />
                    </nav>
                </SheetContent>
            </Sheet>
        </div>
        <div className="mr-4 hidden md:flex items-center">
            <Link href="/" className="mr-6 flex items-center space-x-2">
                <Bike className="h-6 w-6 text-primary" />
                <span className="hidden font-bold sm:inline-block font-headline">
                Pedidos Dobles Yuuju!
                </span>
            </Link>
            <nav className="flex items-center gap-2 text-sm">
                <MainNav />
            </nav>
        </div>

        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
          <Link href="/" className="md:hidden">
              <Bike className="h-6 w-6 text-primary" />
              <span className="sr-only">Pedidos Dobles Yuuju!</span>
          </Link>
          <div className="w-full flex-1 md:w-auto md:flex-none">
            {/* Can add a search bar here if needed */}
          </div>
          <nav className="flex items-center gap-4">
            <ThemeToggle />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>{getInitials(user?.name)}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">{user?.name}</p>
                     <p className="text-xs leading-none text-muted-foreground">
                      {user?.email}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground pt-1">
                      Rol: {user?.role}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Cerrar Sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </nav>
        </div>
      </div>
    </header>
  );
}
