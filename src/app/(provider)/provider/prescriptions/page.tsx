"use client";

import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/shared/page-header";
import { PageLayout } from "@/components/shared/page-layout";
import { DataTable } from "@/components/shared/data-table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { providerRefills, type ProviderRefill, type RefillDecision } from "@/lib/provider-work";

const decisionVariant = { pending: "warning", approved: "success", denied: "destructive" } as const;

export default function ProviderPrescriptionsPage() {
  const [refills, setRefills] = useState(providerRefills);

  function decide(id: string, decision: RefillDecision, label: string) {
    setRefills((current) => current.map((refill) => (refill.id === id ? { ...refill, decision } : refill)));
    toast.success(label);
  }

  const pending = refills.filter((refill) => refill.decision === "pending").length;

  return (
    <PageLayout>
      <PageHeader
        eyebrow="Clinical"
        title="Prescriptions"
        description="Patients asked for refills. Approve the ones that are still appropriate, or deny and send them back."
      />
      <Card className="card-hover overflow-hidden">
        <CardHeader className="border-b border-[var(--color-border-subtle)] bg-[var(--color-surface-muted)]/40">
          <CardTitle className="text-base">{pending} refill requests waiting</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <DataTable
            columns={[
              { key: "patient", header: "Patient", cell: (refill: ProviderRefill) => <span className="font-semibold">{refill.patientName}</span> },
              {
                key: "med",
                header: "Medication",
                cell: (refill: ProviderRefill) => (
                  <div>
                    <p>{refill.medication}</p>
                    <p className="text-xs text-[var(--color-text-secondary)]">{refill.dosage}</p>
                  </div>
                ),
              },
              { key: "pharmacy", header: "Pharmacy", cell: (refill: ProviderRefill) => <span className="text-[var(--color-text-secondary)]">{refill.pharmacy}</span> },
              { key: "requested", header: "Requested", cell: (refill: ProviderRefill) => refill.requestedAt },
              { key: "decision", header: "Decision", cell: (refill: ProviderRefill) => <Badge variant={decisionVariant[refill.decision]} className="capitalize">{refill.decision}</Badge> },
              {
                key: "actions",
                header: "Action",
                cell: (refill: ProviderRefill) =>
                  refill.decision === "pending" ? (
                    <div className="flex gap-2">
                      <Button size="sm" className="min-w-0" onClick={() => decide(refill.id, "approved", `${refill.medication} refill approved`)}>Approve</Button>
                      <Button size="sm" variant="outline" className="min-w-0" onClick={() => decide(refill.id, "denied", `${refill.medication} refill denied`)}>Deny</Button>
                    </div>
                  ) : (
                    <span className="text-[var(--color-text-disabled)]">—</span>
                  ),
              },
            ]}
            data={refills}
            getRowKey={(refill) => refill.id}
          />
        </CardContent>
      </Card>
    </PageLayout>
  );
}
