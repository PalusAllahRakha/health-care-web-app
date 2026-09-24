"use client";

import Link from "next/link";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { PageLayout } from "@/components/shared/page-layout";
import { SectionLoader } from "@/components/shared/section-loader";
import { DataTable } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePatients } from "@/lib/api/queries";
import type { Patient } from "@/types";

const columns = [
  {
    key: "name",
    header: "Patient",
    cell: (p: Patient) => (
      <div>
        <p className="font-semibold text-[var(--color-text-primary)]">{p.name}</p>
        <p className="text-xs text-[var(--color-text-secondary)]">Age {p.age}</p>
      </div>
    ),
  },
  {
    key: "mrn",
    header: "MRN",
    cell: (p: Patient) => <span className="font-mono text-xs">{p.mrn}</span>,
  },
  {
    key: "conditions",
    header: "Conditions",
    cell: (p: Patient) => (
      <div className="flex flex-wrap gap-1">
        {p.conditions.map((c) => (
          <Badge key={c} variant="secondary" className="text-xs">{c}</Badge>
        ))}
      </div>
    ),
  },
  {
    key: "lastVisit",
    header: "Last visit",
    cell: (p: Patient) => <span className="text-[var(--color-text-secondary)]">{p.lastVisit}</span>,
  },
  {
    key: "nextAppointment",
    header: "Next appointment",
    cell: (p: Patient) => <span>{p.nextAppointment ?? "—"}</span>,
  },
  {
    key: "status",
    header: "Status",
    cell: (p: Patient) => (
      <Badge variant={p.status === "active" ? "success" : "secondary"} className="capitalize">
        {p.status}
      </Badge>
    ),
  },
  {
    key: "actions",
    header: "Action",
    cell: (p: Patient) => (
      <div className="flex gap-2">
        <Button asChild size="sm" variant="outline" className="min-w-0">
          <Link href="/provider/messages/thread-001">Message</Link>
        </Button>
        <Button size="sm" className="min-w-0" onClick={() => toast.success("Chart note saved", { description: `Added to ${p.name}'s chart.` })}>
          Add note
        </Button>
      </div>
    ),
  },
];

export default function ProviderPatientsPage() {
  const { data: patients, isLoading } = usePatients();
  const activeCount = patients?.filter((p) => p.status === "active").length ?? 0;

  return (
    <PageLayout>
      <PageHeader
        eyebrow="Provider"
        title="Patient queue"
        description="Review active patients, conditions, and upcoming visits."
      />

      {isLoading ? (
        <SectionLoader label="Loading patients" sublabel="Fetching patient queue" />
      ) : (
        <Card className="card-hover overflow-hidden">
          <CardHeader className="border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-muted)]/40">
            <CardTitle className="text-base">{activeCount} active patients</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <DataTable
              columns={columns}
              data={patients ?? []}
              getRowKey={(p) => p.id}
              emptyMessage="No patients in queue"
            />
          </CardContent>
        </Card>
      )}
    </PageLayout>
  );
}
