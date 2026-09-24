import type { Metadata } from "next";
import { ProviderShell } from "@/components/layout/provider-shell";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default function ProviderLayout({ children }: { children: React.ReactNode }) {
  return <ProviderShell>{children}</ProviderShell>;
}
