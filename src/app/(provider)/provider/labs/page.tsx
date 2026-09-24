"use client";

import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { PageLayout } from "@/components/shared/page-layout";
import { DataTable } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { providerLabs, type LabReviewStatus, type ProviderLabReview } from "@/lib/provider-work";

const flagVariant = { normal: "success", borderline: "warning", critical: "destructive" } as const;

export default function ProviderLabsPage() {
  const [labs, setLabs] = useState(providerLabs);

  function setStatus(id: string, status: LabReviewStatus, patientName: string) {
    setLabs((current) => current.map((lab) => (lab.id === id ? { ...lab, status } : lab)));
    toast.success(status === "released" ? `Released to ${patientName}` : `Held result for ${patientName}`);
  }

  const pending = labs.filter((lab) => lab.status === "needs-review").length;

  return (
    <PageLayout>
      <PageHeader
        eyebrow="Clinical"
        title="Lab review"
        description="Read new results, release them to the patient, or hold anything that needs a call first."
      />
      <Card className="card-hover overflow-hidden">
        <CardHeader className="border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-muted)]/40">
          <CardTitle className="text-base">{pending} results waiting for sign-off</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            columns={[
              { key: "patient", header: "Patient", cell: (lab: ProviderLabReview) => <span className="font-semibold">{lab.patientName}</span> },
              { key: "test", header: "Test", cell: (lab: ProviderLabReview) => lab.testName },
              { key: "value", header: "Result", cell: (lab: ProviderLabReview) => lab.value },
              { key: "flag", header: "Flag", cell: (lab: ProviderLabReview) => <Badge variant={flagVariant[lab.flag]} className="capitalize">{lab.flag}</Badge> },
              { key: "date", header: "Collected", cell: (lab: ProviderLabReview) => <span className="text-[var(--color-text-secondary)]">{lab.collectedOn}</span> },
              { key: "status", header: "Review", cell: (lab: ProviderLabReview) => <Badge variant="secondary" className="capitalize">{lab.status.replace("-", " ")}</Badge> },
              {
                key: "actions",
                header: "Action",
                cell: (lab: ProviderLabReview) =>
                  lab.status === "needs-review" ? (
                    <div className="flex gap-2">
                      <Button size="sm" className="min-w-0" onClick={() => setStatus(lab.id, "released", lab.patientName)}>Release</Button>
                      <Button size="sm" variant="outline" className="min-w-0" onClick={() => setStatus(lab.id, "held", lab.patientName)}>Hold</Button>
                    </div>
                  ) : (
                    <span className="text-[var(--color-text-disabled)]">—</span>
                  ),
              },
            ]}
            data={labs}
            getRowKey={(lab) => lab.id}
          />
        </CardContent>
      </Card>
    </PageLayout>
  );
}
