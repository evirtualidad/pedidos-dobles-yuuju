"use client";

import { useRole } from "@/contexts/role-context";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { Role } from "@/lib/types";

export function RoleSwitcher() {
  const { role, setRole } = useRole();

  return (
    <Select value={role} onValueChange={(value: Role) => setRole(value)}>
      <SelectTrigger className="w-[180px] h-8">
        <SelectValue placeholder="Select a role" />
      </SelectTrigger>
      <SelectContent>
        <SelectItem value="Admin">Admin</SelectItem>
        <SelectItem value="Fleet Supervisor">Fleet Supervisor</SelectItem>
        <SelectItem value="Data Entry">Data Entry</SelectItem>
      </SelectContent>
    </Select>
  );
}
