import { addDays, format } from "date-fns";
import type { RefillRequestStatus, RefillRequestType } from "@/types";

export const REFILL_STEPS: { key: RefillRequestStatus; label: string }[] = [
  { key: "submitted", label: "Request submitted" },
  { key: "sent_to_pharmacy", label: "Sent to pharmacy" },
  { key: "processing", label: "Pharmacy processing" },
  { key: "ready_for_pickup", label: "Ready for pickup" },
];

export const RENEWAL_STEPS: { key: RefillRequestStatus; label: string }[] = [
  { key: "renewal_pending", label: "Provider review" },
  { key: "renewal_approved", label: "Prescription renewed" },
  { key: "sent_to_pharmacy", label: "Sent to pharmacy" },
  { key: "ready_for_pickup", label: "Ready for pickup" },
];

export function getRefillSteps(type: RefillRequestType) {
  return type === "renewal" ? RENEWAL_STEPS : REFILL_STEPS;
}

export function getStatusIndex(status: RefillRequestStatus, type: RefillRequestType) {
  const steps = getRefillSteps(type);
  const index = steps.findIndex((step) => step.key === status);
  return index === -1 ? 0 : index;
}

export function getEstimatedReadyDate(daysFromNow = 2) {
  return format(addDays(new Date(), daysFromNow), "yyyy-MM-dd");
}

export function getStatusMessage(
  status: RefillRequestStatus,
  type: RefillRequestType,
  estimatedReadyAt: string,
  pickupMethod: "pickup" | "mail"
) {
  const pickupLabel = pickupMethod === "mail" ? "mailed to you" : "available for pickup";

  switch (status) {
    case "submitted":
      return "Your request was received. We'll send it to your pharmacy shortly.";
    case "sent_to_pharmacy":
      return type === "renewal"
        ? "Your provider approved the renewal. The pharmacy has been notified."
        : "Your pharmacy received the refill request and will begin processing it.";
    case "processing":
      return `The pharmacy is preparing your medication. Estimated ready date: ${estimatedReadyAt}.`;
    case "ready_for_pickup":
      return pickupMethod === "mail"
        ? "Your medication has been shipped. Check your email for tracking details."
        : "Your prescription is ready at the pharmacy. You can pick it up today.";
    case "renewal_pending":
      return "Your provider is reviewing the renewal request. This usually takes 1–2 business days.";
    case "renewal_approved":
      return "Renewal approved. Your updated prescription is being sent to the pharmacy.";
    default:
      return `Estimated ready: ${estimatedReadyAt}. You'll be notified when it's ${pickupLabel}.`;
  }
}

export function getStatusLabel(status: RefillRequestStatus) {
  switch (status) {
    case "submitted":
      return "Submitted";
    case "sent_to_pharmacy":
      return "At pharmacy";
    case "processing":
      return "Processing";
    case "ready_for_pickup":
      return "Ready";
    case "renewal_pending":
      return "Awaiting provider";
    case "renewal_approved":
      return "Renewal approved";
    default:
      return "In progress";
  }
}

export function getStatusBadgeVariant(status: RefillRequestStatus) {
  if (status === "ready_for_pickup") return "success" as const;
  if (status === "renewal_pending") return "warning" as const;
  return "secondary" as const;
}

export function getProgressPercent(status: RefillRequestStatus, type: RefillRequestType) {
  const steps = getRefillSteps(type);
  const index = getStatusIndex(status, type);
  if (status === "ready_for_pickup") return 100;
  return Math.round(((index + 0.5) / steps.length) * 100);
}

export function isAttentionPrescription(refillsRemaining: number, hasActiveRequest: boolean) {
  return refillsRemaining <= 0 || refillsRemaining === 1 || hasActiveRequest;
}

export function getNextAction(
  status: RefillRequestStatus,
  type: RefillRequestType
): { label: string; hint: string } {
  if (status === "ready_for_pickup") {
    return {
      label: "Pick up your medication",
      hint: "Bring a photo ID. Copay may apply at the pharmacy counter.",
    };
  }
  if (status === "renewal_pending") {
    return {
      label: "Wait for provider approval",
      hint: "You'll get a notification when your provider responds. Message them if urgent.",
    };
  }
  if (status === "processing" || status === "sent_to_pharmacy") {
    return {
      label: "We'll notify you when it's ready",
      hint: "No action needed. Check notifications or return here to track progress.",
    };
  }
  return {
    label: type === "renewal" ? "Renewal in progress" : "Refill in progress",
    hint: "Track status below. Most refills are ready within 24–48 hours.",
  };
}
