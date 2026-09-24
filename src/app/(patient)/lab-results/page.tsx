"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { FlaskConical, ListFilter } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { PageLayout } from "@/components/shared/page-layout";
import { EmptyState } from "@/components/shared/empty-state";
import { SectionLoader } from "@/components/shared/section-loader";
import { ResultsTable } from "@/components/lab-results/results-table";
import { LabReportDownload } from "@/components/lab-results/lab-report-download";
import { useLabResults } from "@/lib/api/queries";
import { cn } from "@/lib/utils";
import type { LabResult } from "@/types";

export default function LabResultsPage() {
  const router = useRouter();
  const { data: results, isLoading } = useLabResults();
  const [filter, setFilter] = useState<"all" | LabResult["flag"]>("all");
  const filteredResults = results?.filter((result) => filter === "all" || result.flag === filter) ?? [];
  const filters = [
    { key: "all", label: "All results" },
    { key: "normal", label: "Normal" },
    { key: "borderline", label: "Borderline" },
    { key: "critical", label: "Critical" },
  ] as const;

  function handleRowClick(result: LabResult) {
    router.push(`/lab-results/${result.id}`);
  }

  return (
    <PageLayout>
      <PageHeader
        eyebrow="Diagnostics"
        title="Lab results"
        description="View test results, track trends, and understand what they mean for your care."
      >
        {results && results.length > 0 ? <LabReportDownload results={results} compact /> : null}
      </PageHeader>

      {isLoading ? (
        <SectionLoader label="Loading results" sublabel="Retrieving your lab reports" />
      ) : results && results.length > 0 ? (
        <div className="space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex flex-wrap gap-1 rounded-xl border border-[var(--color-border-subtle)] bg-[var(--color-surface-elevated)] p-1" role="group" aria-label="Filter lab results by status">
              {filters.map(({ key, label }) => <button key={key} type="button" onClick={() => setFilter(key)} aria-pressed={filter === key} className={cn("inline-flex min-h-10 items-center gap-2 rounded-lg px-3 text-xs font-medium transition-colors", filter === key ? "bg-[var(--color-brand-tint)] text-[var(--color-brand-strong)]" : "text-[var(--color-text-secondary)] hover:bg-[var(--color-surface-muted)]")}>
                {label}<span className="rounded-md bg-[var(--color-surface-muted)] px-1.5 py-0.5 tabular-nums">{key === "all" ? results.length : results.filter((result) => result.flag === key).length}</span>
              </button>)}
            </div>
            <p aria-live="polite" className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]"><ListFilter className="h-3.5 w-3.5" aria-hidden />{filteredResults.length} results</p>
          </div>
          {filteredResults.length > 0 ? <ResultsTable results={filteredResults} onRowClick={handleRowClick} /> : <EmptyState icon={FlaskConical} title="No results in this category" description="Choose another status to view your lab results." actionLabel="Show all results" onAction={() => setFilter("all")} />}
          <p className="text-xs leading-relaxed text-[var(--color-text-secondary)]">Reference ranges are shown alongside each result. Open a test to see its history and your provider’s notes.</p>
        </div>
      ) : (
        <EmptyState
          icon={FlaskConical}
          title="No lab results yet"
          description="When your provider orders tests, results will appear here with clear status indicators."
        />
      )}
    </PageLayout>
  );
}
