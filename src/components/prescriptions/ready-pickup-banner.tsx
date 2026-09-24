"use client";

import { MapPin, Package } from "lucide-react";
import type { RefillRequest } from "@/types";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ReadyPickupBannerProps {
  requests: RefillRequest[];
  onMarkPickedUp: (requestId: string) => void;
  className?: string;
}

export function ReadyPickupBanner({ requests, onMarkPickedUp, className }: ReadyPickupBannerProps) {
  if (requests.length === 0) return null;

  return (
    <div className={cn("space-y-3", className)}>
      {requests.map((request) => (
        <div
          key={request.id}
          className="overflow-hidden rounded-[var(--radius-xl)] border border-[var(--color-status-normal-border)] bg-gradient-to-r from-[var(--color-status-normal-bg)] to-[var(--color-surface-elevated)] p-5 shadow-[var(--shadow-subtle)]"
        >
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-start gap-4">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[var(--color-status-normal-icon)] text-white shadow-[var(--shadow-glow-soft)]">
                <Package className="h-6 w-6" />
              </div>
              <div>
                <p className="text-sm font-semibold uppercase tracking-wide text-[var(--color-status-normal-text)]">
                  Ready for {request.pickupMethod === "mail" ? "delivery" : "pickup"}
                </p>
                <p className="mt-1 text-lg font-bold text-[var(--color-text-primary)]">
                  {request.medicationName}
                </p>
                <p className="text-sm text-[var(--color-text-secondary)]">{request.dosage}</p>
                <p className="mt-2 flex items-center gap-1.5 text-sm text-[var(--color-text-secondary)]">
                  <MapPin className="h-4 w-4 text-[var(--color-brand-primary)]" />
                  {request.pharmacy}
                  {request.completedAt && (
                    <span className="text-[var(--color-text-disabled)]">
                      · Ready since {formatDate(request.completedAt)}
                    </span>
                  )}
                </p>
              </div>
            </div>
            <Button
              className="shrink-0 shadow-[var(--shadow-glow)]"
              onClick={() => onMarkPickedUp(request.id)}
            >
              {request.pickupMethod === "mail" ? "Mark as received" : "Mark as picked up"}
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
