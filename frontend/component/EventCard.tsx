"use client";

import Image from "next/image";
import Link from "next/link";
import { optimizedImage } from "@/lib/cloudinaryUrl";

interface TicketTier {
  type: string;
  price: number;
  quantity: number;
  sold: number;
}

export interface EventCardData {
  _id: string;
  slug: string;
  title: string;
  details: string;
  location: string;
  image: string;
  date: string;
  tickets: TicketTier[];
  startTime: string;
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
      href={`/event/${event.slug}`}
      aria-label={`View details for ${event.title}`}
      role="article"
    >
      <div className="relative rounded-xl overflow-hidden bg-white/3 border border-gray-700/50 backdrop-blur-xl transition-all duration-300 hover:scale-102 hover:border-pink-400/50 hover:shadow-[0_0_10px_rgba(255,0,128,0.3)] group h-full flex flex-col">
        <div className="relative">
          <Image
            src={optimizedImage(event.image, "card")}
            alt={event.title}
            width={500}
            height={300}
            className="object-cover w-full h-44 md:h-52"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />

          <div className="absolute top-3 left-3 flex gap-2">
            <span className="px-2 py-1 bg-black/70 backdrop-blur rounded-full text-xs font-semibold text-cyan-300">
              {formattedDate}
            </span>
            {isSoldOut ? (
              <span className="px-2 py-1 bg-red-500/80 backdrop-blur rounded-full text-xs font-semibold text-white">
                Sold Out
              </span>
            ) : (
              isLowStock && (
                <span className="px-2 py-1 bg-yellow-500/80 backdrop-blur rounded-full text-xs font-semibold text-black">
                  Selling Fast
                </span>
              )
            )}
          </div>
        </div>

        <div className="p-4 md:p-5 flex-1 flex flex-col gap-2">
          <h3 className="text-white font-bold text-base md:text-lg leading-tight line-clamp-2">
            {event.title}
          </h3>
          <p className="text-cyan-300 text-xs md:text-sm">{event.location}</p>

          <div className="mt-auto pt-2 flex items-center justify-between">
            <span className="text-pink-400 font-semibold text-sm md:text-base">
              {minPrice !== null ? `From ₦${minPrice.toLocaleString()}` : "Free"}
            </span>
            <span className="text-xs text-gray-400">
              {isSoldOut ? "0 left" : `${totalRemaining} left`}
            </span>
          </div>
        </div>

        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,128,0.1),transparent)] opacity-0 group-hover:opacity-50 transition-opacity duration-300 pointer-events-none" />
      </div>
    </Link>
  );
};

export default EventCard;
