import type { Metadata } from "next";
import { HomeRedirect } from "@/components/auth/home-redirect";
import { LandingBody } from "@/components/landing/landing-body";

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: "HealthPortal — Your Health, One Secure Place",
    description:
      "Book appointments, view lab results, manage prescriptions, and message your care team through our HIPAA-aligned patient portal.",
    openGraph: {
      title: "HealthPortal — Your Health, One Secure Place",
      description:
        "A secure, patient-centered healthcare portal for appointments, records, and care coordination.",
      url: "https://healthportal.example.com",
    },
  };
}

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "MedicalOrganization",
  name: "HealthPortal",
  url: "https://healthportal.example.com",
  description:
    "HIPAA-aligned digital health platform connecting patients with providers for appointments, lab results, and secure messaging.",
};

export default function HomePage() {
  return (
    <>
      <HomeRedirect />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <LandingBody />
    </>
  );
}
