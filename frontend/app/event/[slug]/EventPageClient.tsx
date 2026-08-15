"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import axios from "axios";

import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Minus,
  Plus,
  ShoppingCart,
} from "lucide-react";
import SkeletonLoader from "@/component/SkeletonLoader";
import { useCart } from "@/context/CartContext";
import { optimizedImage } from "@/lib/cloudinaryUrl";
import { getEventThemeStyle } from "@/lib/eventThemes";

interface Ticket {
  type: string;
  price: number;
  quantity: number;
  sold: number;
}

interface Event {
  slug: string;
  title: string;
  details: string;
  location: string;
  image: string;
  date: string;
  tickets: Ticket[];
  organizer: string;
  theme?: string;
}

interface EventPageClientProps {
  slug: string;
}

const BACKENDURL = process.env.NEXT_PUBLIC_BACKEND_URL;

const EventPageClient = ({ slug }: EventPageClientProps) => {
  const [event, setEvent] = useState<Event | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [quantity, setQuantity] = useState(1);

  const { addToCart } = useCart();
  const router = useRouter();

  useEffect(() => {
    const fetchEvent = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${BACKENDURL}/api/events/${slug}`);
        setEvent(res.data.event);
      } catch (err) {
        console.error(err);
        setError("Event not found or failed to load.");
      } finally {
        setLoading(false);
      }
    };
    fetchEvent();
  }, [slug]);

  const handleSelectTicket = (ticket: Ticket) => {
    if (ticket.quantity - ticket.sold <= 0) return;
    setSelectedTicket(ticket);
    setQuantity(1);
  };

  const handleQuantityChange = (delta: number) => {
    if (!selectedTicket) return;
    const maxQty = selectedTicket.quantity - selectedTicket.sold;
    if (maxQty <= 0) return;
    setQuantity(Math.max(1, Math.min(quantity + delta, maxQty)));
  };

  const handleCheckout = () => {
    if (!event || !selectedTicket) return;

    addToCart({
      id: `${event.slug}-${selectedTicket.type}`,
      name: `${event.title} - ${selectedTicket.type}`,
      price: selectedTicket.price,
      quantity,
      image: event.image,
      eventId: event.slug,
      organizer: event.organizer,
      ticketType: selectedTicket.type,
    });

    router.push("/event/checkout");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)] transition-opacity duration-500">
        <SkeletonLoader />
      </div>
    );
  }

  if (error || !event) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)] text-[var(--color-text)]">
        {error || "Event not found."}
      </div>
    );
  }

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(event.date));

  return (
    <div
      className="min-h-screen bg-[var(--color-bg)] font-sans text-[var(--color-text)]"
      style={getEventThemeStyle(event.theme)}
    >
      <section className="relative mx-auto px-4 py-1 pb-24 sm:px-6 lg:px-8">
        <button
          onClick={() => router.back()}
          className="mb-6 flex items-center pt-5 text-[var(--color-accent)] transition-colors duration-300 hover:text-[var(--color-primary)]"
        >
          <ArrowLeft className="mr-1 h-5 w-5" />
          <span className="font-medium">Back</span>
        </button>

        <div className="relative z-10 flex flex-col md:grid md:grid-cols-3 md:gap-8">
          <div className="mb-8 md:col-span-1 md:mb-0">
            <div className="relative overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-border)]">
              <Image
                src={optimizedImage(event.image, "hero") || "/fallback-party.jpg"}
                alt={event.title}
                width={800}
                height={400}
                className="h-64 w-full object-cover sm:h-80 md:h-96"
              />
            </div>
          </div>

          <article className="card-surface p-6 md:col-span-2">
            <h1 className="mb-4 text-3xl font-bold">{event.title}</h1>
            <div className="mb-6 space-y-2">
              <p className="flex items-center text-[var(--color-accent)]">
                <MapPin className="mr-2 h-5 w-5" />
                {event.location}
              </p>
              <time
                dateTime={event.date}
                className="flex items-center text-[var(--color-secondary)]"
              >
                <Calendar className="mr-2 h-5 w-5" />
                {formattedDate}
              </time>
              <p className="text-[var(--color-text)]/90">{event.details}</p>
            </div>

            <h2 className="mb-4 text-xl font-semibold">Select Your Ticket</h2>
            <ul className="mb-6 space-y-4">
              {event.tickets.map((ticket, idx) => {
                const remaining = ticket.quantity - ticket.sold;
                const soldOut = remaining <= 0;
                return (
                <li
                  key={idx}
                  className={`flex items-center justify-between rounded-[var(--radius-card)] border p-4 transition-colors duration-200 ${
                    soldOut
                      ? "cursor-not-allowed border-[var(--color-border)] opacity-50"
                      : "cursor-pointer " +
                        (selectedTicket?.type === ticket.type
                          ? "border-[var(--color-primary)] bg-[var(--color-surface-2)]"
                          : "border-[var(--color-border)] hover:border-[var(--color-primary)]/50 hover:bg-[var(--color-surface-2)]")
                  }`}
                  onClick={() => handleSelectTicket(ticket)}
                  aria-disabled={soldOut}
                >
                  <div>
                    <span className="font-semibold">{ticket.type}</span>
                    <p className="text-sm text-[var(--color-text-muted)]">
                      {soldOut ? "Sold out" : `${remaining} tickets left`}
                    </p>
                  </div>
                  <div className="flex flex-col items-end">
                    <span className="font-semibold text-[var(--color-accent)]">
                      ₦{ticket.price.toLocaleString()}
                    </span>
                    {selectedTicket?.type === ticket.type && (
                      <div className="mt-2 flex items-center">
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuantityChange(-1);
                          }}
                          className="rounded-l-[var(--radius-btn)] bg-[var(--color-surface)] px-3 py-1 hover:bg-white/10"
                        >
                          <Minus className="h-4 w-4" />
                        </button>
                        <span className="bg-[var(--color-surface-2)] px-4 py-1">
                          {quantity}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            handleQuantityChange(1);
                          }}
                          className="rounded-r-[var(--radius-btn)] bg-[var(--color-surface)] px-3 py-1 hover:bg-white/10"
                        >
                          <Plus className="h-4 w-4" />
                        </button>
                      </div>
                    )}
                  </div>
                </li>
                );
              })}
            </ul>
          </article>
        </div>

        {selectedTicket && (
          <div className="card-surface mt-8 w-full p-6">
            <h3 className="mb-4 flex items-center text-xl font-semibold">
              <ShoppingCart className="mr-2 h-5 w-5" />
              Order Summary
            </h3>
            <p className="mb-2 text-[var(--color-text)]/90">
              <strong>Ticket:</strong> {selectedTicket.type}
            </p>
            <p className="mb-2 text-[var(--color-text)]/90">
              <strong>Quantity:</strong> {quantity}
            </p>
            <p className="mb-1 text-[var(--color-text)]/90">
              <strong>Ticket subtotal:</strong> ₦
              {(selectedTicket.price * quantity).toLocaleString()}
            </p>
            <p className="mb-4 text-xs text-[var(--color-text-muted)]">
              A payment processing fee is calculated at checkout.
            </p>

            <button
              onClick={handleCheckout}
              className="btn-aurora hidden w-full items-center justify-center px-6 py-3 font-semibold md:flex"
            >
              <ShoppingCart className="mr-2 h-5 w-5" />
              Proceed to Checkout
            </button>
          </div>
        )}
      </section>

      {selectedTicket && (
        <div className="fixed bottom-0 left-0 right-0 z-20 flex items-center justify-between gap-4 border-t border-[var(--color-border)] bg-[var(--color-bg)]/95 p-4 backdrop-blur-xl md:hidden">
          <div>
            <p className="text-xs text-[var(--color-text-muted)]">
              {selectedTicket.type} × {quantity}
            </p>
            <p className="text-lg font-bold text-[var(--color-accent)]">
              ₦{(selectedTicket.price * quantity).toLocaleString()}
            </p>
          </div>
          <button
            onClick={handleCheckout}
            className="btn-aurora flex flex-1 items-center justify-center px-6 py-3 font-semibold"
          >
            <ShoppingCart className="mr-2 h-5 w-5" />
            Checkout
          </button>
        </div>
      )}
    </div>
  );
};

export default EventPageClient;
