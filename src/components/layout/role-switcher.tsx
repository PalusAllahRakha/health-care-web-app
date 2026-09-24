"use client";

import { memo, useCallback } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useAuth } from "@/providers/auth-provider";
import type { UserRole } from "@/types";

const roleLabels: Record<UserRole, string> = {
  patient: "Patient",
  provider: "Provider",
  admin: "Admin",
};

export const RoleSwitcher = memo(function RoleSwitcher({
  className,
}: {
  className?: string;
}) {
  const { user, setRole } = useAuth();

  const handleRoleChange = useCallback(
    (value: string) => {
      setRole(value as UserRole);
    },
    [setRole]
  );

  if (!user) return null;

  return (
    <Select value={user.role} onValueChange={handleRoleChange}>
      <SelectTrigger
        className={cn(
          "h-11 min-h-11 w-[118px] rounded-xl border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] text-xs font-medium text-[var(--color-text-secondary)] shadow-none",
          className
        )}
        aria-label="Switch role"
      >
          <SelectValue placeholder="Role" />
        </SelectTrigger>
        <SelectContent>
          {(Object.keys(roleLabels) as UserRole[]).map((role) => (
            <SelectItem key={role} value={role}>
              {roleLabels[role]}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
  );
});
