"use client";
import type { Role, User } from "@/lib/types";
import { createContext, useContext, useState, ReactNode } from "react";

// Mock user data based on role
const users: Record<Role, User> = {
    'Admin': { name: 'Admin User', role: 'Admin'},
    'Fleet Supervisor': { name: 'Supervisor Sam', role: 'Fleet Supervisor', fleet: 'Fleet 1'},
    'Data Entry': { name: 'Data Clerk', role: 'Data Entry'}
}

type RoleContextType = {
  role: Role;
  setRole: (role: Role) => void;
  user: User;
};

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export function RoleProvider({ children }: { children: ReactNode }) {
  const [role, setRole] = useState<Role>("Admin");

  const user = users[role];

  return (
    <RoleContext.Provider value={{ role, setRole, user }}>
      {children}
    </RoleContext.Provider>
  );
}

export function useRole() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRole must be used within a RoleProvider");
  }
  return context;
}
