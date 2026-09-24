"use client";

import { useCallback, useMemo, useState } from "react";
import { Pill } from "lucide-react";
import { MotionGrid } from "@/components/motion/motion-grid";
import { MotionSection } from "@/components/motion/motion-section";
import { PageHeader } from "@/components/shared/page-header";
import { PageLayout } from "@/components/shared/page-layout";
import { EmptyState } from "@/components/shared/empty-state";
import { SectionLoader } from "@/components/shared/section-loader";
import { MedicationCard } from "@/components/prescriptions/medication-card";
import { PharmacySelector } from "@/components/prescriptions/pharmacy-selector";
import { PrescriptionSummary } from "@/components/prescriptions/prescription-summary";
import { ReadyPickupBanner } from "@/components/prescriptions/ready-pickup-banner";
import { RefillHistory } from "@/components/prescriptions/refill-history";
import { RefillModal } from "@/components/prescriptions/refill-modal";
import { RefillRequestsPanel } from "@/components/prescriptions/refill-requests-panel";
import { AnimatedTabs } from "@/components/ui/animated-tabs";
import { toast } from "@/components/ui/toaster";
import { usePrescriptions } from "@/lib/api/queries";
import { isAttentionPrescription } from "@/lib/refill-utils";
import { formatDate } from "@/lib/utils";
import { useRefillStore } from "@/stores/refill-store";
import type { Prescription, RefillPickupMethod, RefillRequestType } from "@/types";

type FilterTab = "all" | "attention" | "in_progress";

const FILTER_OPTIONS: { value: FilterTab; label: string }[] = [
  { value: "all", label: "All" },
  { value: "attention", label: "Needs attention" },
  { value: "in_progress", label: "In progress" },
];

export default function PrescriptionsPage() {
  const { data: prescriptions, isLoading } = usePrescriptions();
  const [pharmacy, setPharmacy] = useState("CVS Pharmacy - Main St");
  const [filter, setFilter] = useState<FilterTab>("all");
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPrescription, setSelectedPrescription] = useState<Prescription | null>(null);
  const [modalType, setModalType] = useState<RefillRequestType>("refill");

  const {
    requests,
    pickedUpIds,
    prescriptionOverrides,
    submitRequest,
    getRequestForPrescription,
    getInProgressRequests,
    getReadyRequests,
    getHistory,
    markPickedUp,
  } = useRefillStore();

  const inProgressRequests = getInProgressRequests();
  const readyRequests = getReadyRequests();
  const history = getHistory();

  const mergedPrescriptions = useMemo(() => {
    if (!prescriptions) return [];
    return prescriptions.map((rx) => ({
      ...rx,
      ...prescriptionOverrides[rx.id],
    }));
  }, [prescriptions, prescriptionOverrides]);

  const pharmacyPrescriptions = useMemo(
    () => mergedPrescriptions.filter((rx) => rx.pharmacy === pharmacy),
    [mergedPrescriptions, pharmacy]
  );

  const summary = useMemo(() => {
    const refillsDue = pharmacyPrescriptions.filter(
      (rx) => rx.refillsRemaining <= 1 || rx.refillsRemaining === 0
    ).length;
    return {
      total: pharmacyPrescriptions.length,
      refillsDue,
      inProgress: inProgressRequests.filter((r) => r.pharmacy === pharmacy).length,
      ready: readyRequests.filter((r) => r.pharmacy === pharmacy).length,
    };
  }, [pharmacyPrescriptions, inProgressRequests, readyRequests, pharmacy]);

  const filteredPrescriptions = useMemo(() => {
    return pharmacyPrescriptions.filter((rx) => {
      const request = requests.find(
        (r) => r.prescriptionId === rx.id && !pickedUpIds.includes(r.id)
      );
      if (filter === "in_progress") return request && request.status !== "ready_for_pickup";
      if (filter === "attention") {
        return isAttentionPrescription(rx.refillsRemaining, Boolean(request));
      }
      return true;
    });
  }, [pharmacyPrescriptions, filter, requests, pickedUpIds]);

  const openModal = useCallback(
    (id: string, type: RefillRequestType) => {
      const prescription = mergedPrescriptions.find((rx) => rx.id === id);
      if (!prescription) return;
      setSelectedPrescription(prescription);
      setModalType(type);
      setModalOpen(true);
    },
    [mergedPrescriptions]
  );

  const handleConfirm = useCallback(
    (pickupMethod: RefillPickupMethod) => {
      if (!selectedPrescription) return;

      const request = submitRequest({
        prescription: selectedPrescription,
        pharmacy,
        pickupMethod,
        type: modalType,
      });

      toast.success(
        modalType === "renewal" ? "Renewal request submitted" : "Refill request submitted",
        {
          description:
            modalType === "renewal"
              ? `${selectedPrescription.name} — your provider will review within 1–2 business days.`
              : `${selectedPrescription.name} — estimated ready ${formatDate(request.estimatedReadyAt)}.`,
        }
      );
      setSelectedPrescription(null);
      setFilter("in_progress");
    },
    [selectedPrescription, pharmacy, modalType, submitRequest]
  );

  const handlePickedUp = useCallback(
    (requestId: string) => {
      const request = readyRequests.find((r) => r.id === requestId);
      markPickedUp(requestId);
      if (request) {
        toast.success("Marked as picked up", {
          description: `${request.medicationName} added to your refill history.`,
        });
      }
    },
    [markPickedUp, readyRequests]
  );

  const pharmacyInProgress = inProgressRequests.filter((r) => r.pharmacy === pharmacy);
  const pharmacyReady = readyRequests.filter((r) => r.pharmacy === pharmacy);

  return (
    <PageLayout>
      <PageHeader
        eyebrow="Medications"
        title="Prescriptions"
        description="Manage refills, track pharmacy progress, and request renewals — all in one place."
      />

      {!isLoading && mergedPrescriptions.length > 0 && (
        <MotionSection>
          <PrescriptionSummary
            total={summary.total}
            refillsDue={summary.refillsDue}
            inProgress={summary.inProgress}
            ready={summary.ready}
          />
        </MotionSection>
      )}

      <ReadyPickupBanner requests={pharmacyReady} onMarkPickedUp={handlePickedUp} />

      <RefillRequestsPanel requests={pharmacyInProgress} />

      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div className="max-w-md flex-1">
          <PharmacySelector value={pharmacy} onChange={setPharmacy} />
        </div>
        <AnimatedTabs
          value={filter}
          onValueChange={setFilter}
          options={FILTER_OPTIONS}
          layoutId="prescriptions-filter-tabs"
          ariaLabel="Filter prescriptions"
          fit="hug"
          size="sm"
        />
      </div>

      {isLoading ? (
        <SectionLoader label="Loading prescriptions" sublabel="Syncing your medications" />
      ) : filteredPrescriptions.length > 0 ? (
        <MotionGrid className="grid gap-4 md:grid-cols-2">
          {filteredPrescriptions.map((rx) => (
            <MedicationCard
              key={rx.id}
              prescription={rx}
              activeRequest={getRequestForPrescription(rx.id)}
              onRefill={(id) => openModal(id, "refill")}
              onRenewal={(id) => openModal(id, "renewal")}
            />
          ))}
        </MotionGrid>
      ) : pharmacyPrescriptions.length > 0 ? (
        <EmptyState
          icon={Pill}
          title="No medications match this filter"
          description="Try switching tabs or select a different pharmacy to see more prescriptions."
          actionLabel="Show all"
          onAction={() => setFilter("all")}
        />
      ) : mergedPrescriptions.length > 0 ? (
        <EmptyState
          icon={Pill}
          title="No medications at this pharmacy"
          description="Switch your preferred pharmacy to see prescriptions available there."
        />
      ) : (
        <EmptyState
          icon={Pill}
          title="No active prescriptions"
          description="When your provider prescribes medication, it will show up here with refill details."
        />
      )}

      <RefillHistory history={history} />

      <RefillModal
        open={modalOpen}
        onOpenChange={setModalOpen}
        prescription={selectedPrescription}
        pharmacy={pharmacy}
        type={modalType}
        onConfirm={handleConfirm}
      />
    </PageLayout>
  );
}
