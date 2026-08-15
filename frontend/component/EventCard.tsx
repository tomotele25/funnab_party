"use client";

import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin } from "lucide-react";
import { optimizedImage } from "@/lib/cloudinaryUrl";
import { getEventThemeStyle } from "@/lib/eventThemes";

interface TicketTier {
  type: string;
  price: number;
  quantity: number;
  sold: number;
}

export interface EventCardData {
  _id: string;
  slug: string;
  customSlug?: string;
  title: string;
  details: string;
  location: string;
  image: string;
  date: string;
  tickets: TicketTier[];
  startTime: string;
  theme?: string;
}

const EventCard = ({ event }: { event?: EventCardData }) => {
  if (!event) return null;

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
  }).format(new Date(event.date));

  const minPrice =
    event.tickets.length > 0
      ? Math.min(...event.tickets.map((t) => t.price))
      : null;

  const totalRemaining = event.tickets.reduce(
    (sum, t) => sum + Math.max(0, t.quantity - t.sold),
    0
  );
  const totalCapacity = event.tickets.reduce((sum, t) => sum + t.quantity, 0);
  const isLowStock =
    totalCapacity > 0 && totalRemaining / totalCapacity <= 0.15;
  const isSoldOut = totalCapacity > 0 && totalRemaining === 0;

  return (
    <Link
      href={`/event/${event.customSlug || event.slug}`}
      aria-label={`View details for ${event.title}`}
      role="article"
      className="group block h-full"
      style={getEventThemeStyle(event.theme)}
    >
      <div className="card-surface flex h-full flex-col overflow-hidden transition-all duration-300 ease-[var(--ease-standard)] hover:-translate-y-1 hover:border-[var(--color-primary)]/50 hover:shadow-[var(--shadow-glow-primary)]">
        <div className="relative overflow-hidden">
          <Image
            src={optimizedImage(event.image, "card")}
            alt={event.title}
            width={500}
            height={300}
            className="h-44 w-full object-cover transition-transform duration-500 ease-[var(--ease-standard)] group-hover:scale-110 md:h-52"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-bg)] via-transparent to-transparent" />

          <div className="absolute left-3 top-3 flex gap-2">
            <span className="rounded-[var(--radius-pill)] bg-black/60 px-2 py-1 text-xs font-semibold text-[var(--color-text)] backdrop-blur">
              {formattedDate}
            </span>
            {isSoldOut ? (
              <span className="rounded-[var(--radius-pill)] bg-[var(--color-error)]/90 px-2 py-1 text-xs font-semibold text-white backdrop-blur">
                Sold Out
              </span>
            ) : (
              isLowStock && (
                <span className="rounded-[var(--radius-pill)] bg-[var(--color-urgency)]/90 px-2 py-1 text-xs font-semibold text-black backdrop-blur">
                  Selling Fast
                </span>
              )
            )}
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-2 p-4 md:p-5">
          <h3 className="line-clamp-2 text-base font-bold leading-tight text-[var(--color-text)] md:text-lg">
            {event.title}
          </h3>
          <p className="flex items-center gap-1 text-xs text-[var(--color-text-muted)] md:text-sm">
            <MapPin className="h-3.5 w-3.5 shrink-0" />
            <span className="truncate">{event.location}</span>
          </p>
          {event.startTime && (
            <p className="flex items-center gap-1 text-xs text-[var(--color-text-muted)]">
              <Clock className="h-3.5 w-3.5 shrink-0" />
              {event.startTime}
            </p>
          )}

          <div className="mt-auto flex items-center justify-between pt-2">
            <span className="gradient-text-aurora text-sm font-bold md:text-base">
              {minPrice !== null
                ? `From ₦${minPrice.toLocaleString()}`
                : "Free"}
            </span>
            <span className="text-xs text-[var(--color-text-muted)]">
              {isSoldOut ? "0 left" : `${totalRemaining} left`}
            </span>
          </div>

          <span className="btn-aurora mt-3 w-full py-2 text-center text-sm font-semibold">
            Get Tickets
          </span>
        </div>
      </div>
    </Link>
  );
};

export default EventCard;
