import type { MetadataRoute } from "next";

const SITE_URL = "https://funaabparty.com";
const BACKENDURL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface PublishedEvent {
  slug: string;
  customSlug?: string;
  updatedAt?: string;
}

async function fetchPublishedEvents(): Promise<PublishedEvent[]> {
  try {
    const res = await fetch(`${BACKENDURL}/api/events`, {
      next: { revalidate: 3600 },
    });
    if (!res.ok) return [];
    const data = await res.json();
    return data.events || [];
  } catch {
    return [];
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const events = await fetchPublishedEvents();

  const eventEntries: MetadataRoute.Sitemap = events.map((event) => ({
    url: `${SITE_URL}/event/${event.customSlug || event.slug}`,
    lastModified: event.updatedAt ? new Date(event.updatedAt) : new Date(),
    changeFrequency: "daily",
    priority: 0.8,
  }));

  const staticEntries: MetadataRoute.Sitemap = [
    { url: `${SITE_URL}/`, changeFrequency: "daily", priority: 1 },
    { url: `${SITE_URL}/events`, changeFrequency: "daily", priority: 0.9 },
    { url: `${SITE_URL}/tickets`, changeFrequency: "monthly", priority: 0.3 },
    { url: `${SITE_URL}/login`, changeFrequency: "yearly", priority: 0.2 },
    { url: `${SITE_URL}/signup`, changeFrequency: "yearly", priority: 0.2 },
  ];

  return [...staticEntries, ...eventEntries];
}
