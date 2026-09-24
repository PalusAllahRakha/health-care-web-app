import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const base = "https://healthportal.example.com";
  return [
    { url: base, lastModified: new Date(), changeFrequency: "monthly", priority: 1 },
    { url: `${base}/login`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${base}/signup`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${base}/forgot-password`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];
}
