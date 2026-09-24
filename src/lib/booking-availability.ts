import { TIME_SLOTS } from "@/lib/api/queries";

function hash(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) h = (h << 5) - h + str.charCodeAt(i);
  return Math.abs(h);
}

export function isWeekendDate(date: string): boolean {
  const day = new Date(`${date}T12:00:00`).getDay();
  return day === 0 || day === 6;
}

export function getAvailableSlots(doctorId: string, date: string): string[] {
  if (!doctorId || !date || isWeekendDate(date)) return [];

  return TIME_SLOTS.filter((slot) => {
    const seed = hash(`${doctorId}-${date}-${slot}`);
    return seed % 5 !== 0;
  });
}

export function groupSlotsByPeriod(slots: string[]) {
  const morning = slots.filter((s) => Number(s.split(":")[0]) < 12);
  const afternoon = slots.filter((s) => Number(s.split(":")[0]) >= 12);
  return { morning, afternoon };
}

export const VISIT_TYPES = [
  { value: "in-person", label: "In-person visit", location: "Main Clinic — 1200 Medical Center Dr" },
  { value: "video", label: "Video visit", location: "Secure video call — link sent before visit" },
] as const;

export type VisitType = (typeof VISIT_TYPES)[number]["value"];

export function getVisitLocation(visitType: VisitType): string {
  return VISIT_TYPES.find((v) => v.value === visitType)?.location ?? VISIT_TYPES[0].location;
}
