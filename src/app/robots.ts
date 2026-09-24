import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/dashboard", "/appointments", "/lab-results", "/prescriptions", "/messages", "/insurance", "/notifications", "/doctors", "/provider", "/admin", "/mfa"] },
    ],
    sitemap: "https://healthportal.example.com/sitemap.xml",
  };
}
