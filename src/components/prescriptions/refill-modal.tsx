"use client";

import { useState } from "react";
import Link from "next/link";
import { MapPin, Package, Truck } from "lucide-react";
import type { Prescription, RefillPickupMethod, RefillRequestType } from "@/types";
import { getEstimatedReadyDate } from "@/lib/refill-utils";
import { formatDate } from "@/lib/utils";
import { RefillTimeline } from "@/components/prescriptions/refill-timeline";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export interface RefillModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  prescription: Prescription | null;
  pharmacy: string;
  type: RefillRequestType;
  onConfirm: (pickupMethod: RefillPickupMethod) => void;
}

const PICKUP_OPTIONS: {
  value: RefillPickupMethod;
  label: string;
  description: string;
  icon: typeof Package;
}[] = [
  {
    value: "pickup",
    label: "Pharmacy pickup",
    description: "Pick up in store when ready — usually 24–48 hours",
    icon: Package,
  },
  {
    value: "mail",
    label: "Mail delivery",
    description: "Shipped to your home — typically 3–5 business days",
    icon: Truck,
  },
];

export function RefillModal({
  open,
  onOpenChange,
  prescription,
  pharmacy,
  type,
  onConfirm,
}: RefillModalProps) {
  const [pickupMethod, setPickupMethod] = useState<RefillPickupMethod>("pickup");

  if (!prescription) return null;

  const isRenewal = type === "renewal";
  const estimatedReady = getEstimatedReadyDate(isRenewal ? 4 : 2);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg gap-0 overflow-hidden p-0">
        <div className="border-b border-[var(--color-border-subtle)] bg-[var(--color-brand-primary)]/5 px-6 pb-4 pt-6">
          <DialogHeader className="text-left">
            <div className="mb-3 flex h-11 w-11 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)]">
              <Package className="h-5 w-5" />
            </div>
            <DialogTitle>{isRenewal ? "Request prescription renewal" : "Confirm refill request"}</DialogTitle>
            <DialogDescription>
              {isRenewal
                ? "No refills remain. Your provider must approve a new prescription before the pharmacy can fill it."
                : "Review the details below. We'll send this to your pharmacy and track progress for you."}
            </DialogDescription>
          </DialogHeader>
        </div>

        <div className="space-y-5 overflow-auto px-6 py-5">
          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] bg-[var(--color-surface-muted)] p-4">
            <p className="text-lg font-bold text-[var(--color-text-primary)]">{prescription.name}</p>
            <p className="text-sm font-medium text-[var(--color-brand-primary)]">{prescription.dosage}</p>
            <div className="mt-3 space-y-1.5 text-sm text-[var(--color-text-secondary)]">
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-[var(--color-brand-primary)]" />
                {pharmacy}
              </p>
              {!isRenewal && (
                <p>
                  Refills after request:{" "}
                  <span className="font-semibold text-[var(--color-text-primary)]">
                    {Math.max(prescription.refillsRemaining - 1, 0)} remaining
                  </span>
                </p>
              )}
              <p>
                Estimated ready:{" "}
                <span className="font-semibold text-[var(--color-text-primary)]">
                  {formatDate(estimatedReady)}
                </span>
              </p>
            </div>
          </div>

          {!isRenewal && (
            <div className="space-y-2">
              <Label>How would you like to receive it?</Label>
              <div className="grid gap-2">
                {PICKUP_OPTIONS.map(({ value, label, description, icon: Icon }) => (
                  <button
                    key={value}
                    type="button"
                    onClick={() => setPickupMethod(value)}
                    className={cn(
                      "flex cursor-pointer items-start gap-3 rounded-[var(--radius-md)] border p-3 text-left transition-colors",
                      pickupMethod === value
                        ? "border-[var(--color-brand-primary)] bg-[var(--color-brand-primary)]/8"
                        : "border-[var(--color-border-subtle)] hover:bg-[var(--color-surface-muted)]"
                    )}
                  >
                    <Icon className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-brand-primary)]" />
                    <div>
                      <p className="text-sm font-semibold">{label}</p>
                      <p className="text-xs text-[var(--color-text-secondary)]">{description}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] p-4">
            <p className="text-sm font-semibold text-[var(--color-text-primary)]">What happens next</p>
            <div className="mt-3">
              <RefillTimeline
                request={{
                  id: "preview",
                  prescriptionId: prescription.id,
                  medicationName: prescription.name,
                  dosage: prescription.dosage,
                  pharmacy,
                  status: isRenewal ? "renewal_pending" : "submitted",
                  type,
                  pickupMethod,
                  requestedAt: new Date().toISOString(),
                  estimatedReadyAt: estimatedReady,
                }}
                compact
              />
            </div>
          </div>

          {isRenewal && (
            <p className="text-xs text-[var(--color-text-secondary)]">
              Need it sooner?{" "}
              <Link href="/messages" className="font-medium text-[var(--color-brand-primary)] hover:underline">
                Message your provider
              </Link>{" "}
              to expedite the review.
            </p>
          )}
        </div>

        <DialogFooter className="border-t border-[var(--color-border-subtle)] px-6 py-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button
            type="button"
            onClick={() => {
              onConfirm(isRenewal ? "pickup" : pickupMethod);
              onOpenChange(false);
            }}
          >
            {isRenewal ? "Submit renewal request" : "Submit refill request"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
