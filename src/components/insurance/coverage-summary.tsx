"use client";

import { useMemo } from "react";
import { Shield, Stethoscope } from "lucide-react";
import type { InsurancePlan } from "@/types";
import { insurancePlan } from "@/lib/mock-data";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";

export interface CoverageSummaryProps {
  plan?: InsurancePlan;
  className?: string;
}

export function CoverageSummary({ plan = insurancePlan, className }: CoverageSummaryProps) {
  const deductibleProgress = useMemo(() => {
    if (plan.deductible <= 0) return 0;
    return Math.min(100, Math.round((plan.deductibleMet / plan.deductible) * 100));
  }, [plan.deductible, plan.deductibleMet]);

  const deductibleRemaining = useMemo(
    () => Math.max(0, plan.deductible - plan.deductibleMet),
    [plan.deductible, plan.deductibleMet]
  );

  return (
    <Card className={cn("card-hover overflow-hidden", className)}>
      <div className="h-1 bg-[var(--color-brand-primary)]" aria-hidden />
      <CardHeader className="border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-muted)]/40">
        <CardTitle className="flex items-center gap-2 text-base">
          <Shield className="h-5 w-5 text-[var(--color-brand-primary)]" aria-hidden />
          Coverage summary
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 p-6">
        <div className="grid gap-4 sm:grid-cols-3">
          {[
            { label: "Plan", value: plan.planName },
            { label: "Member ID", value: plan.memberId },
            { label: "Group", value: plan.groupNumber },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] p-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-disabled)]">{label}</p>
              <p className="mt-1 font-semibold text-[var(--color-text-primary)]">{value}</p>
            </div>
          ))}
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium text-[var(--color-text-secondary)]">Annual deductible</span>
            <span className="font-bold text-[var(--color-text-primary)]">
              ${plan.deductibleMet.toLocaleString()} / ${plan.deductible.toLocaleString()}
            </span>
          </div>
          <Progress value={deductibleProgress} className="h-2" />
          <p className="mt-2 text-xs text-[var(--color-text-disabled)]">
            ${deductibleRemaining.toLocaleString()} remaining this year
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {[
            { label: "Primary care", copay: plan.copayPrimary, color: "text-[var(--color-brand-primary)]" },
            { label: "Specialist", copay: plan.copaySpecialist, color: "text-[var(--color-brand-secondary)]" },
          ].map(({ label, copay, color }) => (
            <div key={label} className="flex items-center gap-3 rounded-[var(--radius-md)] border border-[var(--color-border-subtle)] p-4">
              <Stethoscope className={cn("h-5 w-5", color)} aria-hidden />
              <div>
                <p className="text-xs text-[var(--color-text-secondary)]">{label}</p>
                <p className="text-lg font-bold text-[var(--color-text-primary)]">${copay}</p>
                <p className="text-[11px] text-[var(--color-text-disabled)]">copay</p>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
