import type { Metadata } from "next";
import { PatientShell } from "@/components/layout/patient-shell";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function PatientLayout({ children }: { children: React.ReactNode }) {
  return <PatientShell>{children}</PatientShell>;
}
