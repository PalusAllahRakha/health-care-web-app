"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState } from "react";
import { FlaskConical, ListFilter } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { PageLayout } from "@/components/shared/page-layout";
import { EmptyState } from "@/components/shared/empty-state";
import { SectionLoader } from "@/components/shared/section-loader";
import { ResultsTable } from "@/components/lab-results/results-table";
import { LabReportDownload } from "@/components/lab-results/lab-report-download";
import { AnimatedTabs } from "@/components/ui/animated-tabs";
import { useLabResults } from "@/lib/api/queries";
import type { LabResult } from "@/types";

type LabFilter = "all" | LabResult["flag"];

export default function LabResultsPage() {
  const router = useRouter();
  const { data: results, isLoading } = useLabResults();
  const [filter, setFilter] = useState<LabFilter>("all");
  const filteredResults = results?.filter((result) => filter === "all" || result.flag === filter) ?? [];

  const filterOptions = useMemo(() => {
    const counts = {
      all: results?.length ?? 0,
      normal: results?.filter((result) => result.flag === "normal").length ?? 0,
      borderline: results?.filter((result) => result.flag === "borderline").length ?? 0,
      critical: results?.filter((result) => result.flag === "critical").length ?? 0,
    };
    return [
      { value: "all" as const, label: "All results", badge: counts.all },
      { value: "normal" as const, label: "Normal", badge: counts.normal },
      { value: "borderline" as const, label: "Borderline", badge: counts.borderline },
      { value: "critical" as const, label: "Critical", badge: counts.critical },
    ];
  }, [results]);

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
            <AnimatedTabs
              value={filter}
              onValueChange={setFilter}
              options={filterOptions}
              layoutId="lab-results-filter-tabs"
              ariaLabel="Filter lab results by status"
              fit="hug"
              size="sm"
            />
            <p aria-live="polite" className="flex items-center gap-2 text-xs text-[var(--color-text-secondary)]">
              <ListFilter className="h-3.5 w-3.5" aria-hidden />
              {filteredResults.length} results
            </p>
          </div>
          {filteredResults.length > 0 ? (
            <ResultsTable results={filteredResults} onRowClick={handleRowClick} />
          ) : (
            <EmptyState
              icon={FlaskConical}
              title="No results in this category"
              description="Choose another status to view your lab results."
              actionLabel="Show all results"
              onAction={() => setFilter("all")}
            />
          )}
          <p className="text-xs leading-relaxed text-[var(--color-text-secondary)]">
            Reference ranges are shown alongside each result. Open a test to see its history and your
            provider’s notes.
          </p>
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
