"use client";

import Link from "next/link";
import { use } from "react";
import { AlertTriangle, MessageSquare, Stethoscope } from "lucide-react";
import { PageHeader } from "@/components/shared/page-header";
import { PageLayout } from "@/components/shared/page-layout";
import { SectionLoader } from "@/components/shared/section-loader";
import { ErrorState } from "@/components/shared/error-state";
import { TrendChart } from "@/components/lab-results/trend-chart";
import { SeverityBadge } from "@/components/lab-results/severity-badge";
import { LabReportDownload } from "@/components/lab-results/lab-report-download";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useLabResult } from "@/lib/api/queries";
import { getLabInsight } from "@/lib/lab-insights";
import { formatDate } from "@/lib/utils";

export default function LabResultDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const { data: result, isLoading, isError } = useLabResult(id);

  if (isLoading) {
    return (
      <PageLayout>
        <SectionLoader label="Loading result" sublabel="Retrieving lab report" />
      </PageLayout>
    );
  }

  if (isError || !result) {
    return (
      <PageLayout>
        <ErrorState
          title="Result not found"
          description="This lab result may have been removed or the link is incorrect."
          backLabel="Back to lab results"
          backHref="/lab-results"
        />
      </PageLayout>
    );
  }

  const insight = getLabInsight(result);

  return (
    <PageLayout>
      <PageHeader
        eyebrow="Lab result"
        title={result.testName}
        description={`Collected ${formatDate(result.date)}`}
        breadcrumbs={[
          { label: "Lab results", href: "/lab-results" },
          { label: result.testName },
        ]}
      >
        <LabReportDownload results={[result]} compact />
        <Button asChild variant="outline">
          <Link href="/lab-results">Back</Link>
        </Button>
      </PageHeader>

      <Card className="card-hover overflow-hidden">
        <div className={`h-1 ${result.flag === "critical" ? "bg-[var(--color-status-critical)]" : result.flag === "borderline" ? "bg-[var(--color-status-borderline)]" : "bg-[var(--color-brand-primary)]"}`} aria-hidden />
        <CardContent className="flex flex-wrap items-end justify-between gap-6 p-6">
          <div>
            <p className="text-sm font-medium text-[var(--color-text-secondary)]">Your result</p>
            <p className="mt-1 text-4xl font-bold tracking-tight text-[var(--color-text-primary)]">
              {result.value}
              <span className="ml-2 text-lg font-normal text-[var(--color-text-secondary)]">{result.unit}</span>
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <div>
              <p className="text-xs font-medium uppercase tracking-wide text-[var(--color-text-disabled)]">Reference</p>
              <p className="mt-1 font-semibold">
                {result.referenceMin}–{result.referenceMax} {result.unit}
              </p>
            </div>
            <SeverityBadge flag={result.flag} />
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className={`card-hover ${result.flag === "critical" ? "border-[var(--color-status-critical-border)]" : ""}`}>
          <CardHeader className="flex flex-row items-center gap-2">
            {result.flag === "critical" ? (
              <AlertTriangle className="h-5 w-5 text-[var(--color-status-critical-icon)]" />
            ) : (
              <Stethoscope className="h-5 w-5 text-[var(--color-brand-primary)]" />
            )}
            <CardTitle className="text-base">What this means</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm leading-relaxed text-[var(--color-text-secondary)]">{insight.summary}</p>
            <div className="rounded-[var(--radius-md)] bg-[var(--color-surface-muted)] p-4">
              <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-text-disabled)]">Recommended action</p>
              <p className="mt-1 text-sm text-[var(--color-text-primary)]">{insight.action}</p>
            </div>
            <Button asChild variant="outline" size="sm">
              <Link href="/messages">
                <MessageSquare className="h-4 w-4" />
                Message your provider
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="card-hover">
          <CardHeader>
            <CardTitle className="text-base">Trend over time</CardTitle>
          </CardHeader>
          <CardContent>
            <TrendChart result={result} />
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
}
