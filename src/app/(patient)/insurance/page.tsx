"use client";

import { Shield } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { PageLayout } from "@/components/shared/page-layout";
import { SectionLoader } from "@/components/shared/section-loader";
import { CoverageSummary } from "@/components/insurance/coverage-summary";
import { InsuranceUploadCard } from "@/components/insurance/insurance-upload-card";
import { useInsurance } from "@/lib/api/queries";

export default function InsurancePage() {
  const { data: plan, isLoading } = useInsurance();

  return (
    <PageLayout>
      <PageHeader
        eyebrow="Coverage"
        title="Insurance"
        description="View your plan details, deductible progress, and update your insurance card."
      />

      {isLoading ? (
        <SectionLoader label="Loading insurance" sublabel="Retrieving your coverage details" />
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {plan && <CoverageSummary plan={plan} />}
          <div className="space-y-4">
            <InsuranceUploadCard />
            <div className="flex items-start gap-3 rounded-[var(--radius-lg)] border border-[var(--color-border-subtle)] bg-[var(--color-brand-primary)]/5 p-4">
              <Shield className="mt-0.5 h-5 w-5 shrink-0 text-[var(--color-brand-primary)]" />
              <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">
                Uploaded insurance images are encrypted and stored securely. Only your care team can access this information.
              </p>
            </div>
          </div>
        </div>
      )}
    </PageLayout>
  );
}
