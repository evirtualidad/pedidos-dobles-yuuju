
"use client";

import * as React from "react";
import { Header } from "@/components/header";
import { AdminNav } from "./admin-nav";


export function AdminLayout({ children }: { children: React.ReactNode }) {
  
  return (
    <div className="flex min-h-screen w-full flex-col bg-muted/40">
      <Header />
      <main className="flex-1 p-4 sm:px-6 sm:py-4">
        <div className="mx-auto grid w-full max-w-6xl gap-6">
          <div className="flex flex-col gap-4">
            <h1 className="text-3xl font-semibold">Gestión</h1>
            <AdminNav />
          </div>
          <div className="grid auto-rows-max items-start gap-4 lg:gap-8">
            {children}
          </div>
        </div>
      </main>
    </div>
  );
}
