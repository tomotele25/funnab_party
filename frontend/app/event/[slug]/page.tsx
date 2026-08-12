import type { Metadata } from "next";
import EventPageClient from "./EventPageClient";

const BACKENDURL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface EventPageProps {
  params: Promise<{ slug: string }>;
}

interface EventMeta {
  title: string;
  details: string;
  image: string;
  location: string;
}

async function fetchEventForMeta(slug: string): Promise<EventMeta | null> {
  try {
    const res = await fetch(`${BACKENDURL}/api/events/${slug}`, {
      next: { revalidate: 60 },
    });
    if (!res.ok) return null;
    const data = await res.json();
    return data.event;
  } catch {
    return null;
  }
}

export async function generateMetadata({
  params,
}: EventPageProps): Promise<Metadata> {
  const { slug } = await params;
  const event = await fetchEventForMeta(slug);

  if (!event) {
    return {
      title: "Event not found | FUNAABParty",
      description: "This event could not be found on FUNAABParty.",
    };
  }

  const description = event.details?.slice(0, 160) || `${event.title} at ${event.location}`;

  return {
    title: `${event.title} | FUNAABParty`,
    description,
    openGraph: {
      title: event.title,
      description,
      images: event.image ? [{ url: event.image }] : undefined,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: event.title,
      description,
      images: event.image ? [event.image] : undefined,
    },
  };
}

export default async function EventPage({ params }: EventPageProps) {
  const { slug } = await params;
  return <EventPageClient slug={slug} />;
}
