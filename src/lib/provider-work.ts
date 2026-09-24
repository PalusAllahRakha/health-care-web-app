import type { Notification } from "@/types";

export type VisitStatus = "scheduled" | "checked-in" | "in-visit" | "completed" | "no-show";
export type RefillDecision = "pending" | "approved" | "denied";
export type LabReviewStatus = "needs-review" | "released" | "held";

export interface ProviderVisit {
  id: string;
  patientName: string;
  mrn: string;
  time: string;
  reason: string;
  location: string;
  mode: "In person" | "Video";
  status: VisitStatus;
}

export interface ProviderRefill {
  id: string;
  patientName: string;
  medication: string;
  dosage: string;
  pharmacy: string;
  requestedAt: string;
  decision: RefillDecision;
}

export interface ProviderLabReview {
  id: string;
  patientName: string;
  testName: string;
  value: string;
  flag: "normal" | "borderline" | "critical";
  collectedOn: string;
  status: LabReviewStatus;
}

export interface ProviderThread {
  id: string;
  patientName: string;
  preview: string;
  sentAt: string;
  unread: number;
  topic: string;
}

export const providerVisits: ProviderVisit[] = [
  { id: "vis-001", patientName: "Sarah Chen", mrn: "MRN-100234", time: "08:30", reason: "Hypertension follow-up", location: "Room 112", mode: "In person", status: "scheduled" },
  { id: "vis-002", patientName: "Michael Johnson", mrn: "MRN-100235", time: "09:15", reason: "Diabetes check", location: "Room 114", mode: "In person", status: "checked-in" },
  { id: "vis-003", patientName: "Emily Rodriguez", mrn: "MRN-100236", time: "10:00", reason: "Asthma review", location: "Video", mode: "Video", status: "scheduled" },
  { id: "vis-004", patientName: "James Williams", mrn: "MRN-100237", time: "11:00", reason: "Atrial fibrillation", location: "Room 118", mode: "In person", status: "in-visit" },
  { id: "vis-005", patientName: "Lisa Thompson", mrn: "MRN-100238", time: "13:30", reason: "Migraine consult", location: "Video", mode: "Video", status: "scheduled" },
  { id: "vis-006", patientName: "Jennifer Martinez", mrn: "MRN-100240", time: "15:00", reason: "Thyroid labs review", location: "Room 109", mode: "In person", status: "completed" },
];

export const providerRefills: ProviderRefill[] = [
  { id: "ref-001", patientName: "Sarah Chen", medication: "Lisinopril", dosage: "10mg daily", pharmacy: "CVS Pharmacy — Downtown", requestedAt: "2026-09-23", decision: "pending" },
  { id: "ref-002", patientName: "Michael Johnson", medication: "Metformin", dosage: "500mg twice daily", pharmacy: "Walgreens — Oak Ave", requestedAt: "2026-09-23", decision: "pending" },
  { id: "ref-003", patientName: "Jennifer Martinez", medication: "Levothyroxine", dosage: "50mcg daily", pharmacy: "CVS Pharmacy — Downtown", requestedAt: "2026-09-22", decision: "pending" },
  { id: "ref-004", patientName: "Robert Davis", medication: "Omeprazole", dosage: "20mg before breakfast", pharmacy: "CVS Pharmacy — Downtown", requestedAt: "2026-09-21", decision: "pending" },
  { id: "ref-005", patientName: "Lisa Thompson", medication: "Sertraline", dosage: "50mg daily", pharmacy: "Walgreens — Oak Ave", requestedAt: "2026-09-18", decision: "approved" },
];

export const providerLabs: ProviderLabReview[] = [
  { id: "prev-001", patientName: "Sarah Chen", testName: "LDL Cholesterol", value: "118 mg/dL", flag: "borderline", collectedOn: "2026-09-22", status: "needs-review" },
  { id: "prev-002", patientName: "Michael Johnson", testName: "HbA1c", value: "7.4%", flag: "borderline", collectedOn: "2026-09-22", status: "needs-review" },
  { id: "prev-003", patientName: "James Williams", testName: "Potassium", value: "5.8 mmol/L", flag: "critical", collectedOn: "2026-09-23", status: "needs-review" },
  { id: "prev-004", patientName: "Emily Rodriguez", testName: "CBC", value: "Within range", flag: "normal", collectedOn: "2026-09-20", status: "released" },
  { id: "prev-005", patientName: "David Anderson", testName: "Creatinine", value: "1.4 mg/dL", flag: "borderline", collectedOn: "2026-09-19", status: "held" },
];

export const providerThreads: ProviderThread[] = [
  { id: "thread-001", patientName: "Sarah Chen", topic: "Blood pressure log", preview: "My home readings have been higher this week.", sentAt: "2026-09-24T08:10:00", unread: 1 },
  { id: "thread-002", patientName: "Michael Johnson", topic: "Refill question", preview: "Can the metformin refill go to Walgreens?", sentAt: "2026-09-23T16:40:00", unread: 1 },
  { id: "thread-003", patientName: "Emily Rodriguez", topic: "Inhaler use", preview: "The new inhaler is helping at night.", sentAt: "2026-09-22T11:05:00", unread: 0 },
  { id: "thread-004", patientName: "James Williams", topic: "Lab follow-up", preview: "Should I come in sooner for the potassium result?", sentAt: "2026-09-23T19:20:00", unread: 2 },
];

export const providerNotifications: Notification[] = [
  { id: "pn-1", type: "result", title: "Critical potassium result", body: "James Williams — 5.8 mmol/L needs review before release.", createdAt: "2026-09-24T07:40:00", read: false, href: "/provider/labs" },
  { id: "pn-2", type: "prescription", title: "Refill waiting", body: "Sarah Chen requested a Lisinopril refill.", createdAt: "2026-09-23T15:12:00", read: false, href: "/provider/prescriptions" },
  { id: "pn-3", type: "message", title: "New patient message", body: "Sarah Chen sent a note about home blood pressure readings.", createdAt: "2026-09-24T08:10:00", read: false, href: "/provider/messages/thread-001" },
  { id: "pn-4", type: "appointment", title: "Patient checked in", body: "Michael Johnson is checked in for the 9:15 diabetes visit.", createdAt: "2026-09-24T09:02:00", read: false, href: "/provider/schedule" },
];
