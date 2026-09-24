"use client";

import { memo } from "react";
import { AlertCircle, MessageSquare, Pill, RefreshCw, Truck } from "lucide-react";
import type { Prescription, RefillRequest } from "@/types";
import { getProgressPercent, getStatusLabel } from "@/lib/refill-utils";
import { RefillProgressBar } from "@/components/prescriptions/refill-progress-bar";
import { RefillTimeline } from "@/components/prescriptions/refill-timeline";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn, formatDate } from "@/lib/utils";

export interface MedicationCardProps {
  prescription: Prescription;
  activeRequest?: RefillRequest;
  onRefill?: (id: string) => void;
  onRenewal?: (id: string) => void;
  className?: string;
}

export const MedicationCard = memo(function MedicationCard({
  prescription,
  activeRequest,
  onRefill,
  onRenewal,
  className,
}: MedicationCardProps) {
  const canRefill = prescription.refillsRemaining > 0;
  const needsRenewal = prescription.refillsRemaining <= 0;
  const lowRefills = prescription.refillsRemaining === 1;
  const isReady = activeRequest?.status === "ready_for_pickup";
  const isInProgress = activeRequest && !isReady;

  return (
    <Card
      className={cn(
        "card-hover flex flex-col overflow-hidden",
        isReady && "ring-2 ring-[var(--color-status-normal-border)]",
        isInProgress && "ring-1 ring-[var(--color-brand-primary)]/25",
        className
      )}
    >
      {isReady ? (
        <div className="h-1 bg-[var(--color-status-normal-icon)]" aria-hidden />
      ) : isInProgress ? (
        <div className="h-1 bg-[var(--color-brand-primary)]" aria-hidden />
      ) : needsRenewal ? (
        <div className="h-1 bg-[var(--color-status-borderline)]" aria-hidden />
      ) : null}

      <CardHeader className="flex flex-row items-start gap-3 space-y-0 pb-2">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[var(--radius-md)] bg-[var(--color-brand-primary)]/10 text-[var(--color-brand-primary)]">
          <Pill className="h-5 w-5" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-start justify-between gap-3">
            <CardTitle className="text-base leading-snug">{prescription.name}</CardTitle>
            {activeRequest ? (
              <Badge variant={isReady ? "success" : "secondary"} className="shrink-0">
                {getStatusLabel(activeRequest.status)}
              </Badge>
            ) : (
              <Badge
                variant={canRefill ? (lowRefills ? "warning" : "success") : "warning"}
                className="shrink-0"
              >
                {canRefill ? `${prescription.refillsRemaining} left` : "Renewal needed"}
              </Badge>
            )}
          </div>
          <p className="mt-1 text-sm font-medium text-[var(--color-brand-primary)]">{prescription.dosage}</p>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-3 text-sm text-[var(--color-text-secondary)]">
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--color-text-disabled)]">
              Pharmacy
            </p>
            <p className="mt-1 text-xs font-medium text-[var(--color-text-primary)] leading-snug">
              {prescription.pharmacy}
            </p>
          </div>
          <div className="rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] p-3">
            <p className="text-[10px] font-semibold uppercase tracking-wide text-[var(--color-text-disabled)]">
              Next refill
            </p>
            <p className="mt-1 text-xs font-medium text-[var(--color-text-primary)]">
              {formatDate(prescription.nextRefillDate)}
            </p>
          </div>
        </div>

        {activeRequest && (
          <div className="space-y-3 rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] p-3">
            <RefillProgressBar request={activeRequest} />
            {!isReady && (
              <div className="pt-1">
                <RefillTimeline request={activeRequest} compact />
              </div>
            )}
            {activeRequest.pickupMethod === "mail" && (
              <p className="flex items-center gap-1.5 text-xs text-[var(--color-text-secondary)]">
                <Truck className="h-3.5 w-3.5 text-[var(--color-brand-primary)]" />
                Mail delivery · {getProgressPercent(activeRequest.status, activeRequest.type)}% complete
              </p>
            )}
            {isReady && (
              <p className="rounded-[var(--radius-sm)] bg-[var(--color-status-normal-bg)] px-3 py-2 text-xs font-medium text-[var(--color-status-normal-text)]">
                Your medication is ready — see the banner above to confirm pickup.
              </p>
            )}
          </div>
        )}

        {!activeRequest && needsRenewal && (
          <div className="rounded-[var(--radius-md)] border border-[var(--color-status-borderline-border)] bg-[var(--color-status-borderline-bg)]/50 p-3">
            <p className="flex items-start gap-2 text-xs text-[var(--color-status-borderline-text)]">
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
              No refills left. Request a renewal — your provider will review and send a new prescription to the pharmacy.
            </p>
          </div>
        )}

        {!activeRequest && lowRefills && (
          <p className="rounded-[var(--radius-sm)] bg-[var(--color-status-borderline-bg)]/60 px-3 py-2 text-xs text-[var(--color-status-borderline-text)]">
            Last refill remaining — request now or start a renewal with your provider.
          </p>
        )}

        {onRefill && canRefill && !activeRequest && (
          <Button className="mt-auto w-full shadow-[var(--shadow-glow-soft)]" size="sm" onClick={() => onRefill(prescription.id)}>
            <RefreshCw className="h-3.5 w-3.5" />
            Request refill
          </Button>
        )}

        {onRenewal && needsRenewal && !activeRequest && (
          <Button variant="outline" size="sm" className="mt-auto w-full" onClick={() => onRenewal(prescription.id)}>
            <MessageSquare className="h-3.5 w-3.5" />
            Request renewal from provider
          </Button>
        )}
      </CardContent>
    </Card>
  );
});
