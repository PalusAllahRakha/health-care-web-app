"use client";

import type { ReactNode } from "react";
import { Stethoscope, UserRound } from "lucide-react";
import type { SignupRole } from "@/lib/auth/registered-accounts";
import { AnimatedTabs } from "@/components/ui/animated-tabs";

export interface AuthRoleTabsProps {
  value: SignupRole;
  onValueChange: (role: SignupRole) => void;
  className?: string;
  patientLabel?: ReactNode;
  providerLabel?: ReactNode;
  layoutId?: string;
}

export function AuthRoleTabs({
  value,
  onValueChange,
  className,
  patientLabel = "Patient",
  providerLabel = "Provider",
  layoutId = "auth-role-pill",
}: AuthRoleTabsProps) {
  return (
    <AnimatedTabs
      value={value}
      onValueChange={onValueChange}
      layoutId={layoutId}
      className={className}
      ariaLabel="Account type"
      fit="equal"
      size="md"
      options={[
        { value: "patient", label: patientLabel, icon: UserRound },
        { value: "provider", label: providerLabel, icon: Stethoscope },
      ]}
    />
  );
}
