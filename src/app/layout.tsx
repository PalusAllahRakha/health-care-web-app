import type { Metadata } from "next";
import { Outfit } from "next/font/google";
import { Providers } from "@/providers";
import "./globals.css";

const sans = Outfit({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: {
    default: "HealthPortal — Secure Patient Portal",
    template: "%s | HealthPortal",
  },
  description:
    "Manage appointments, lab results, prescriptions, and secure messaging in one HIPAA-protected patient portal.",
  metadataBase: new URL("https://healthportal.example.com"),
  openGraph: {
    type: "website",
    locale: "en_US",
    siteName: "HealthPortal",
  },
  twitter: { card: "summary_large_image" },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning className={`${sans.variable} h-full`}>
      <body className="min-h-full antialiased">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:rounded-md focus:bg-[var(--color-brand-primary)] focus:px-4 focus:py-2 focus:text-white"
        >
          Skip to main content
        </a>
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
