export type ProviderApprovalStatus = "pending" | "approved" | "rejected" | "expired";

export interface ProviderRecord {
  id: string;
  name: string;
  email: string;
  specialty: string;
  licenseNumber: string;
  phone: string;
  submittedAt: string;
  status: Exclude<ProviderApprovalStatus, "expired">;
  reviewedAt?: string;
}

export const PROVIDER_REVIEW_WORKING_DAYS = 5;

const STORAGE_KEY = "hp-provider-approvals";
const CHANGE_EVENT = "hp-provider-approvals";

const SEEDED_PROVIDERS: ProviderRecord[] = [
  {
    id: "user-002",
    name: "Dr. James Wilson",
    email: "j.wilson@healthcare.org",
    specialty: "Internal Medicine",
    licenseNumber: "OR-MD-48291",
    phone: "(555) 876-4400",
    submittedAt: "2026-08-04T09:00:00",
    status: "approved",
    reviewedAt: "2026-08-04T15:20:00",
  },
  {
    id: "prov-emily-hart",
    name: "Dr. Emily Hart",
    email: "e.hart@healthcare.org",
    specialty: "Cardiology",
    licenseNumber: "OR-MD-19022",
    phone: "(555) 410-2201",
    submittedAt: "2026-07-14T11:15:00",
    status: "approved",
    reviewedAt: "2026-07-15T10:00:00",
  },
  {
    id: "prov-marcus-lee",
    name: "Dr. Marcus Lee",
    email: "m.lee@healthcare.org",
    specialty: "Dermatology",
    licenseNumber: "OR-MD-22810",
    phone: "(555) 410-2288",
    submittedAt: "2026-06-22T08:40:00",
    status: "approved",
    reviewedAt: "2026-06-23T13:10:00",
  },
  {
    id: "prov-priya-sharma",
    name: "Dr. Priya Sharma",
    email: "p.sharma@healthcare.org",
    specialty: "Pediatrics",
    licenseNumber: "OR-MD-33104",
    phone: "(555) 410-3310",
    submittedAt: "2026-05-18T14:05:00",
    status: "approved",
    reviewedAt: "2026-05-19T09:30:00",
  },
  {
    id: "prov-elena-vasquez",
    name: "Dr. Elena Vasquez",
    email: "e.vasquez@healthcare.org",
    specialty: "Family Medicine",
    licenseNumber: "OR-MD-55201",
    phone: "(555) 410-5520",
    submittedAt: "2026-09-24T08:30:00",
    status: "pending",
  },
  {
    id: "prov-omar-haddad",
    name: "Dr. Omar Haddad",
    email: "o.haddad@healthcare.org",
    specialty: "Endocrinology",
    licenseNumber: "OR-MD-61844",
    phone: "(555) 410-6184",
    submittedAt: "2026-09-22T10:00:00",
    status: "pending",
  },
  {
    id: "prov-nina-patel",
    name: "Dr. Nina Patel",
    email: "n.patel@healthcare.org",
    specialty: "Rheumatology",
    licenseNumber: "OR-MD-70411",
    phone: "(555) 410-7041",
    submittedAt: "2026-09-15T09:00:00",
    status: "pending",
  },
];

function isWeekend(date: Date) {
  const day = date.getDay();
  return day === 0 || day === 6; // Sunday or Saturday
}

export function addWorkingDays(from: Date, workingDays: number) {
  const result = new Date(from);
  let added = 0;
  while (added < workingDays) {
    result.setDate(result.getDate() + 1);
    if (!isWeekend(result)) added += 1;
  }
  return result;
}

export function reviewDeadline(submittedAt: string) {
  return addWorkingDays(new Date(submittedAt), PROVIDER_REVIEW_WORKING_DAYS);
}

export function resolveStatus(record: ProviderRecord, now = new Date()): ProviderApprovalStatus {
  if (record.status === "pending" && now.getTime() >= reviewDeadline(record.submittedAt).getTime()) {
    return "expired";
  }
  return record.status;
}

/** Milliseconds between two dates that fall on weekdays only (weekends skipped). */
export function workingMillisecondsBetween(from: Date, to: Date) {
  if (to.getTime() <= from.getTime()) return 0;

  let total = 0;
  const cursor = new Date(from);

  while (cursor.getTime() < to.getTime()) {
    if (isWeekend(cursor)) {
      // Jump to Monday 00:00
      const day = cursor.getDay();
      const daysUntilMonday = day === 0 ? 1 : 8 - day;
      cursor.setDate(cursor.getDate() + daysUntilMonday);
      cursor.setHours(0, 0, 0, 0);
      continue;
    }

    const endOfDay = new Date(cursor);
    endOfDay.setHours(24, 0, 0, 0);
    const segmentEnd = endOfDay.getTime() < to.getTime() ? endOfDay : to;
    total += segmentEnd.getTime() - cursor.getTime();
    cursor.setTime(segmentEnd.getTime());
  }

  return total;
}

/**
 * Countdown for the provider review window using working time only.
 * Right after signup this is exactly 5d 0h 0m 0s (not 5d + 23h).
 */
export function timeUntilReview(submittedAt: string, now = new Date()) {
  const submitted = new Date(submittedAt);
  const deadline = reviewDeadline(submittedAt);
  const fullWindowMs = workingMillisecondsBetween(submitted, deadline);
  const remainingMs = Math.min(fullWindowMs, workingMillisecondsBetween(now, deadline));
  const totalSeconds = Math.floor(remainingMs / 1000);
  const daySecs = 24 * 60 * 60;

  return {
    days: Math.min(PROVIDER_REVIEW_WORKING_DAYS, Math.floor(totalSeconds / daySecs)),
    hours: Math.floor((totalSeconds % daySecs) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    ms: remainingMs,
    deadline,
  };
}

export function workingDaysElapsed(from: Date, to: Date) {
  if (to.getTime() <= from.getTime()) return 0;

  const cursor = new Date(from);
  cursor.setHours(0, 0, 0, 0);
  const end = new Date(to);
  end.setHours(0, 0, 0, 0);

  let days = 0;
  cursor.setDate(cursor.getDate() + 1);
  while (cursor.getTime() <= end.getTime()) {
    if (!isWeekend(cursor)) days += 1;
    cursor.setDate(cursor.getDate() + 1);
  }
  return days;
}

export function workingDaysRemaining(deadline: Date, now = new Date()) {
  const totalSeconds = Math.floor(workingMillisecondsBetween(now, deadline) / 1000);
  return Math.min(PROVIDER_REVIEW_WORKING_DAYS, Math.floor(totalSeconds / 86400));
}

export function timeUntil(deadline: Date, now = new Date()) {
  const remainingMs = workingMillisecondsBetween(now, deadline);
  const totalSeconds = Math.floor(remainingMs / 1000);
  const daySecs = 24 * 60 * 60;
  return {
    days: Math.min(PROVIDER_REVIEW_WORKING_DAYS, Math.floor(totalSeconds / daySecs)),
    hours: Math.floor((totalSeconds % daySecs) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
    ms: remainingMs,
  };
}

function loadOverrides(): ProviderRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as ProviderRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveOverrides(records: ProviderRecord[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  window.dispatchEvent(new Event(CHANGE_EVENT));
}

export function listProviders(): ProviderRecord[] {
  const byEmail = new Map(SEEDED_PROVIDERS.map((provider) => [provider.email.toLowerCase(), provider]));
  for (const provider of loadOverrides()) {
    byEmail.set(provider.email.toLowerCase(), provider);
  }
  return [...byEmail.values()].sort(
    (a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime()
  );
}

export function findProvider(email: string) {
  const normalized = email.trim().toLowerCase();
  return listProviders().find((provider) => provider.email.toLowerCase() === normalized);
}

export function upsertProvider(record: ProviderRecord) {
  const overrides = loadOverrides().filter(
    (provider) => provider.email.toLowerCase() !== record.email.toLowerCase()
  );
  saveOverrides([...overrides, record]);
}

export function reviewProvider(email: string, decision: "approved" | "rejected") {
  const current = findProvider(email);
  if (!current || resolveStatus(current) !== "pending") return;
  upsertProvider({
    ...current,
    status: decision,
    reviewedAt: new Date().toISOString(),
  });
}

export function subscribeProviderApprovals(onChange: () => void) {
  const onStorage = (event: StorageEvent) => {
    if (event.key === STORAGE_KEY) onChange();
  };
  window.addEventListener("storage", onStorage);
  window.addEventListener(CHANGE_EVENT, onChange);
  return () => {
    window.removeEventListener("storage", onStorage);
    window.removeEventListener(CHANGE_EVENT, onChange);
  };
}
