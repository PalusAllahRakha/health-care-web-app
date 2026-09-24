"use client";

import { memo } from "react";
import { Calendar, Clock, XCircle } from "lucide-react";
import type { Doctor } from "@/types";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const CONFIG: Record<
  Doctor["availability"],
  { label: string; variant: "success" | "warning" | "secondary"; icon: typeof Calendar }
> = {
  today: { label: "Available today", variant: "success", icon: Calendar },
  soon: { label: "Available soon", variant: "warning", icon: Clock },
  unavailable: { label: "Unavailable", variant: "secondary", icon: XCircle },
};

export interface AvailabilityBadgeProps {
  availability: Doctor["availability"];
  className?: string;
}

export const AvailabilityBadge = memo(function AvailabilityBadge({
  availability,
  className,
}: AvailabilityBadgeProps) {
  const { label, variant, icon: Icon } = CONFIG[availability];

  return (
    <Badge variant={variant} className={cn("gap-1", className)}>
      <Icon className="h-3 w-3" aria-hidden />
      {label}
    </Badge>
  );
});
