"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useSession } from "next-auth/react";
import axios from "axios";
import {
  Calendar,
  Ticket as TicketIcon,
  Wallet,
  Plus,
  MapPin,
} from "lucide-react";
import { optimizedImage } from "@/lib/cloudinaryUrl";

const BACKENDURL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface TicketTier {
  type: string;
  price: number;
  quantity: number;
  sold: number;
}

interface EventRow {
  _id: string;
  title: string;
  slug: string;
  location: string;
  date: string;
  image: string;
  status: string;
  tickets: TicketTier[];
}

interface Totals {
  totalEvents: number;
  totalTicketsSold: number;
  totalRevenue: number;
}

export default function OrganizerDashboard() {
  const { data: session } = useSession();
  const [events, setEvents] = useState<EventRow[]>([]);
  const [totals, setTotals] = useState<Totals | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.accessToken) return;

    axios
      .get(`${BACKENDURL}/api/my-events`, {
        headers: { Authorization: `Bearer ${session.user.accessToken}` },
      })
      .then((res) => {
        setEvents(res.data.events);
        setTotals(res.data.totals);
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [session]);

  const statCards = totals
    ? [
        {
          label: "Total Events",
          value: totals.totalEvents,
          icon: <Calendar className="w-5 h-5" />,
          accent: "text-[var(--color-accent)] bg-[var(--color-accent)]/10",
        },
        {
          label: "Tickets Sold",
          value: totals.totalTicketsSold,
          icon: <TicketIcon className="w-5 h-5" />,
          accent: "text-[var(--color-secondary)] bg-[var(--color-secondary)]/10",
        },
        {
          label: "Revenue",
          value: `₦${totals.totalRevenue.toLocaleString()}`,
          icon: <Wallet className="w-5 h-5" />,
          accent: "text-[var(--color-success)] bg-[var(--color-success)]/10",
        },
      ]
    : [];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1
            className="text-2xl font-bold text-[var(--color-text)]"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Welcome back{session?.user?.fullname ? `, ${session.user.fullname.split(" ")[0]}` : ""}
          </h1>
          <p className="text-[var(--color-text-muted)] text-sm mt-1">
            Here&apos;s how your events are doing.
          </p>
        </div>
        <Link
          href="/organizer/manageEvents"
          className="hidden sm:flex items-center gap-2 px-4 py-2.5 btn-aurora font-medium"
        >
          <Plus className="w-4 h-4" />
          New Event
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card-surface p-5 h-24 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {statCards.map((card) => (
            <div
              key={card.label}
              className="card-surface p-5 flex items-center gap-4"
            >
              <div className={`w-11 h-11 rounded-xl flex items-center justify-center ${card.accent}`}>
                {card.icon}
              </div>
              <div>
                <p className="text-sm text-[var(--color-text-muted)]">{card.label}</p>
                <p className="text-xl font-bold text-[var(--color-text)]">{card.value}</p>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-bold text-[var(--color-text)]">Your Events</h2>
        <Link
          href="/organizer/manageEvents"
          className="text-sm text-[var(--color-accent)] hover:underline"
        >
          View all
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card-surface h-64 animate-pulse" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="card-surface p-10 text-center">
          <Calendar className="w-10 h-10 mx-auto mb-3 text-[var(--color-text-muted)]" />
          <p className="text-[var(--color-text-muted)] mb-4">You haven&apos;t created any events yet.</p>
          <Link
            href="/organizer/manageEvents"
            className="inline-flex items-center gap-2 px-5 py-2.5 btn-aurora font-medium"
          >
            <Plus className="w-4 h-4" />
            Create your first event
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {events.slice(0, 6).map((ev) => {
            const sold = ev.tickets.reduce((s, t) => s + t.sold, 0);
            const capacity = ev.tickets.reduce((s, t) => s + t.quantity, 0);
            const pct = capacity > 0 ? Math.round((sold / capacity) * 100) : 0;

            return (
              <div
                key={ev._id}
                className="card-surface overflow-hidden hover:shadow-md transition"
              >
                <div className="relative h-32 w-full">
                  <Image
                    src={optimizedImage(ev.image, "card")}
                    alt={ev.title}
                    fill
                    className="object-cover"
                  />
                  <span
                    className={`absolute top-2 right-2 px-2 py-0.5 rounded-[var(--radius-pill)] text-xs font-medium ${
                      ev.status === "published"
                        ? "bg-[var(--color-success)]/15 text-[var(--color-success)]"
                        : ev.status === "draft"
                        ? "bg-[var(--color-surface-2)] text-[var(--color-text-muted)]"
                        : ev.status === "cancelled"
                        ? "bg-[var(--color-error)]/15 text-[var(--color-error)]"
                        : "bg-[var(--color-secondary)]/15 text-[var(--color-secondary)]"
                    }`}
                  >
                    {ev.status}
                  </span>
                </div>
                <div className="p-4">
                  <p className="font-semibold text-[var(--color-text)] truncate">{ev.title}</p>
                  <p className="text-xs text-[var(--color-text-muted)] flex items-center gap-1 mt-1">
                    <MapPin className="w-3 h-3" />
                    {ev.location}
                  </p>
                  <div className="mt-3">
                    <div className="flex justify-between text-xs text-[var(--color-text-muted)] mb-1">
                      <span>{sold} / {capacity} sold</span>
                      <span>{pct}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-[var(--color-surface-2)] rounded-full overflow-hidden">
                      <div
                        className="h-full gradient-aurora"
                        style={{ width: `${Math.min(pct, 100)}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
