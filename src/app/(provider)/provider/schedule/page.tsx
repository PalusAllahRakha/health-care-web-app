"use client";

import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { PageLayout } from "@/components/shared/page-layout";
import { DataTable } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { providerVisits, type ProviderVisit, type VisitStatus } from "@/lib/provider-work";

const nextStatus: Partial<Record<VisitStatus, { status: VisitStatus; label: string }>> = {
  scheduled: { status: "checked-in", label: "Check in" },
  "checked-in": { status: "in-visit", label: "Start visit" },
  "in-visit": { status: "completed", label: "Complete" },
};

export default function ProviderSchedulePage() {
  const [visits, setVisits] = useState(providerVisits);

  function update(id: string, status: VisitStatus, message: string) {
    setVisits((current) => current.map((visit) => (visit.id === id ? { ...visit, status } : visit)));
    toast.success(message);
  }

  return (
    <PageLayout>
      <PageHeader
        eyebrow="Clinic"
        title="Today's schedule"
        description="Check patients in, start the visit, and close the encounter when you are done."
      />
      <Card className="card-hover overflow-hidden">
        <CardHeader className="border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-muted)]/40">
          <CardTitle className="text-base">{visits.length} visits on the book</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            columns={[
              {
                key: "time",
                header: "Time",
                cell: (visit: ProviderVisit) => <span className="font-semibold tabular-nums">{visit.time}</span>,
              },
              {
                key: "patient",
                header: "Patient",
                cell: (visit: ProviderVisit) => (
                  <div>
                    <p className="font-semibold">{visit.patientName}</p>
                    <p className="font-mono text-xs text-[var(--color-text-disabled)]">{visit.mrn}</p>
                  </div>
                ),
              },
              { key: "reason", header: "Reason", cell: (visit: ProviderVisit) => visit.reason },
              { key: "where", header: "Where", cell: (visit: ProviderVisit) => <span className="text-[var(--color-text-secondary)]">{visit.mode} · {visit.location}</span> },
              {
                key: "status",
                header: "Status",
                cell: (visit: ProviderVisit) => <Badge variant={visit.status === "completed" ? "success" : visit.status === "no-show" ? "secondary" : "warning"} className="capitalize">{visit.status.replace("-", " ")}</Badge>,
              },
              {
                key: "actions",
                header: "Action",
                cell: (visit: ProviderVisit) => {
                  const step = nextStatus[visit.status];
                  if (!step) return <span className="text-[var(--color-text-disabled)]">—</span>;
                  return (
                    <div className="flex gap-2">
                      <Button size="sm" className="min-w-0" onClick={() => update(visit.id, step.status, `${visit.patientName}: ${step.label.toLowerCase()}`)}>
                        {step.label}
                      </Button>
                      {visit.status === "scheduled" && (
                        <Button size="sm" variant="outline" className="min-w-0" onClick={() => update(visit.id, "no-show", `${visit.patientName} marked as a no-show`)}>
                          No-show
                        </Button>
                      )}
                    </div>
                  );
                },
              },
            ]}
            data={visits}
            getRowKey={(visit) => visit.id}
          />
        </CardContent>
      </Card>
    </PageLayout>
  );
}
