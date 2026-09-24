"use client";

import { useCallback, useState } from "react";
import { RefreshCw } from "lucide-react";
import { HealthSpinner } from "@/components/shared/health-spinner";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface RefillButtonProps {
  prescriptionId: string;
  refillsRemaining: number;
  onRefill: (id: string) => Promise<void> | void;
  className?: string;
}

export function RefillButton({
  prescriptionId,
  refillsRemaining,
  onRefill,
  className,
}: RefillButtonProps) {
  const [loading, setLoading] = useState(false);
  const disabled = refillsRemaining <= 0 || loading;

  const handleClick = useCallback(async () => {
    setLoading(true);
    try {
      await onRefill(prescriptionId);
    } finally {
      setLoading(false);
    }
  }, [onRefill, prescriptionId]);

  return (
    <Button
      variant="outline"
      size="sm"
      disabled={disabled}
      onClick={handleClick}
      className={cn(className)}
    >
      {loading ? (
        <HealthSpinner size={16} aria-hidden />
      ) : (
        <RefreshCw className="h-4 w-4" aria-hidden />
      )}
      {refillsRemaining > 0 ? "Request Refill" : "No Refills Left"}
    </Button>
  );
}
