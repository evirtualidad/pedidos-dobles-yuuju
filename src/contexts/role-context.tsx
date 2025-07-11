
"use client";
import type { Role, User } from "@/lib/types";
import { createContext, useContext, useState, ReactNode } from "react";
import { useData } from "./data-context";

// Mock user data based on role
const users: Record<Role, User> = {
    'Admin': { name: 'Admin User', role: 'Admin'},
    'Fleet Supervisor': { name: 'Supervisor Sam', role: 'Fleet Supervisor', fleet: 'RAPI RAPI' },
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
  
  // This is a bit of a hack to make sure our mock user is in sync with the data
  const data = useData();
  const supervisorUser = data.users.find(u => u.role === 'Fleet Supervisor');

  const users: Record<Role, User> = {
    'Admin': data.users.find(u => u.role === 'Admin') || { name: 'Admin User', role: 'Admin'},
    'Fleet Supervisor': supervisorUser || { name: 'Supervisor Sam', role: 'Fleet Supervisor', fleet: 'RAPI RAPI' },
    'Data Entry': data.users.find(u => u.role === 'Data Entry') || { name: 'Data Clerk', role: 'Data Entry'}
  }

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
