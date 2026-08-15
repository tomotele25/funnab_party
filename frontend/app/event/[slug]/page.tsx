import type { Metadata } from "next";
import EventPageClient from "./EventPageClient";

const BACKENDURL = process.env.NEXT_PUBLIC_BACKEND_URL;
const SITE_URL = "https://funaabparty.com";

interface EventPageProps {
  params: Promise<{ slug: string }>;
}

interface EventTicket {
  type: string;
  price: number;
  quantity: number;
  sold: number;
}

interface EventMeta {
  slug: string;
  customSlug?: string;
  title: string;
  details: string;
  image: string;
  location: string;
  date: string;
  startTime?: string;
  tickets: EventTicket[];
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
  const canonicalPath = `/event/${event.customSlug || event.slug}`;

  return {
    title: `${event.title} | FUNAABParty`,
    description,
    alternates: {
      canonical: canonicalPath,
    },
    openGraph: {
      title: event.title,
      description,
      images: event.image ? [{ url: event.image }] : undefined,
      type: "website",
      url: canonicalPath,
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
  const event = await fetchEventForMeta(slug);

  const jsonLd = event
    ? {
        "@context": "https://schema.org",
        "@type": "Event",
        name: event.title,
        description: event.details,
        startDate: event.date,
        eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
        eventStatus: "https://schema.org/EventScheduled",
        image: event.image ? [event.image] : undefined,
        location: {
          "@type": "Place",
          name: event.location,
          address: event.location,
        },
        url: `${SITE_URL}/event/${event.customSlug || event.slug}`,
        offers: event.tickets?.map((ticket) => ({
          "@type": "Offer",
          name: ticket.type,
          price: ticket.price,
          priceCurrency: "NGN",
          availability:
            ticket.quantity - ticket.sold > 0
              ? "https://schema.org/InStock"
              : "https://schema.org/SoldOut",
          url: `${SITE_URL}/event/${event.customSlug || event.slug}`,
        })),
      }
    : null;

  return (
    <>
      {jsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
      )}
      <EventPageClient slug={slug} />
    </>
  );
}
