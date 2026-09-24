"use client";

import { PageTransition } from "@/components/motion/page-transition";

export default function ProviderTemplate({ children }: { children: React.ReactNode }) {
  return <PageTransition>{children}</PageTransition>;
}
