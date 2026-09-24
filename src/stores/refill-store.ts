import { create } from "zustand";
import { getEstimatedReadyDate } from "@/lib/refill-utils";
import type {
  Prescription,
  RefillPickupMethod,
  RefillRequest,
  RefillRequestStatus,
  RefillRequestType,
} from "@/types";

interface SubmitRefillInput {
  prescription: Prescription;
  pharmacy: string;
  pickupMethod: RefillPickupMethod;
  type: RefillRequestType;
}

interface RefillState {
  requests: RefillRequest[];
  prescriptionOverrides: Record<string, Pick<Prescription, "refillsRemaining" | "nextRefillDate">>;
  pickedUpIds: string[];
  submitRequest: (input: SubmitRefillInput) => RefillRequest;
  getRequestForPrescription: (prescriptionId: string) => RefillRequest | undefined;
  getInProgressRequests: () => RefillRequest[];
  getReadyRequests: () => RefillRequest[];
  getHistory: () => RefillRequest[];
  markPickedUp: (requestId: string) => void;
}

const REFILL_FLOW: RefillRequestStatus[] = [
  "submitted",
  "sent_to_pharmacy",
  "processing",
  "ready_for_pickup",
];

const RENEWAL_FLOW: RefillRequestStatus[] = [
  "renewal_pending",
  "renewal_approved",
  "sent_to_pharmacy",
  "ready_for_pickup",
];

function getInitialStatus(type: RefillRequestType): RefillRequestStatus {
  return type === "renewal" ? "renewal_pending" : "sent_to_pharmacy";
}

function isOpenRequest(request: RefillRequest, pickedUpIds: string[]) {
  return !pickedUpIds.includes(request.id);
}

function scheduleAdvance(
  requestId: string,
  flow: RefillRequestStatus[],
  fromIndex: number,
  delayMs: number
) {
  if (fromIndex >= flow.length - 1) return;
  window.setTimeout(() => {
    useRefillStore.setState((state) => ({
      requests: state.requests.map((request) => {
        if (request.id !== requestId) return request;
        const nextStatus = flow[fromIndex + 1];
        return {
          ...request,
          status: nextStatus,
          completedAt: nextStatus === "ready_for_pickup" ? new Date().toISOString() : request.completedAt,
        };
      }),
    }));
    scheduleAdvance(requestId, flow, fromIndex + 1, delayMs);
  }, delayMs);
}

export const useRefillStore = create<RefillState>((set, get) => ({
  requests: [],
  prescriptionOverrides: {},
  pickedUpIds: [],

  submitRequest: ({ prescription, pharmacy, pickupMethod, type }) => {
    const existing = get().requests.find(
      (request) =>
        request.prescriptionId === prescription.id && isOpenRequest(request, get().pickedUpIds)
    );
    if (existing && existing.status !== "ready_for_pickup") return existing;

    const request: RefillRequest = {
      id: `refill-${prescription.id}-${Date.now()}`,
      prescriptionId: prescription.id,
      medicationName: prescription.name,
      dosage: prescription.dosage,
      pharmacy,
      status: getInitialStatus(type),
      type,
      pickupMethod,
      requestedAt: new Date().toISOString(),
      estimatedReadyAt: getEstimatedReadyDate(type === "renewal" ? 4 : 2),
      refillsAfter:
        type === "refill" ? Math.max(prescription.refillsRemaining - 1, 0) : prescription.refillsRemaining,
    };

    set((state) => ({
      requests: [request, ...state.requests],
      prescriptionOverrides:
        type === "refill"
          ? {
              ...state.prescriptionOverrides,
              [prescription.id]: {
                refillsRemaining: Math.max(prescription.refillsRemaining - 1, 0),
                nextRefillDate: getEstimatedReadyDate(30),
              },
            }
          : state.prescriptionOverrides,
    }));

    const flow = type === "renewal" ? RENEWAL_FLOW : REFILL_FLOW;
    const startIndex = flow.indexOf(request.status);
    scheduleAdvance(request.id, flow, startIndex, 4500);

    return request;
  },

  getRequestForPrescription: (prescriptionId) =>
    get().requests.find(
      (request) =>
        request.prescriptionId === prescriptionId && isOpenRequest(request, get().pickedUpIds)
    ),

  getInProgressRequests: () =>
    get().requests.filter(
      (request) =>
        isOpenRequest(request, get().pickedUpIds) && request.status !== "ready_for_pickup"
    ),

  getReadyRequests: () =>
    get().requests.filter(
      (request) =>
        request.status === "ready_for_pickup" && isOpenRequest(request, get().pickedUpIds)
    ),

  getHistory: () =>
    get().requests.filter((request) => get().pickedUpIds.includes(request.id)),

  markPickedUp: (requestId) => {
    set((state) => ({
      pickedUpIds: state.pickedUpIds.includes(requestId)
        ? state.pickedUpIds
        : [...state.pickedUpIds, requestId],
    }));
  },
}));
