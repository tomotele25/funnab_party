"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { BarChart3 } from "lucide-react";

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
  date: string;
  status: string;
  tickets: TicketTier[];
}

export default function OrganizerAnalyticsPage() {
  const { data: session } = useSession();
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.accessToken) return;

    axios
      .get(`${BACKENDURL}/api/my-events`, {
        headers: { Authorization: `Bearer ${session.user.accessToken}` },
      })
      .then((res) => setEvents(res.data.events))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [session]);

  return (
    <div>
      <h1
        className="text-2xl font-bold text-[var(--color-text)] mb-1"
        style={{ fontFamily: "var(--font-space-grotesk)" }}
      >
        Analytics
      </h1>
      <p className="text-[var(--color-text-muted)] text-sm mb-6">
        Ticket sales performance across your events.
      </p>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card-surface h-32 animate-pulse" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="card-surface p-10 text-center">
          <BarChart3 className="w-10 h-10 mx-auto mb-3 text-[var(--color-text-muted)]" />
          <p className="text-[var(--color-text-muted)]">
            No events yet — create one to start tracking sales.
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {events.map((ev) => {
            const sold = ev.tickets.reduce((s, t) => s + t.sold, 0);
            const capacity = ev.tickets.reduce((s, t) => s + t.quantity, 0);
            const revenue = ev.tickets.reduce((s, t) => s + t.sold * t.price, 0);
            const pct = capacity > 0 ? Math.round((sold / capacity) * 100) : 0;

            return (
              <div
                key={ev._id}
                className="card-surface p-5"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-semibold text-[var(--color-text)]">{ev.title}</p>
                    <p className="text-xs text-[var(--color-text-muted)]">
                      {new Date(ev.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-[var(--color-text)]">
                      ₦{revenue.toLocaleString()}
                    </p>
                    <p className="text-xs text-[var(--color-text-muted)]">revenue</p>
                  </div>
                </div>

                <div className="w-full h-2 bg-[var(--color-surface-2)] rounded-full overflow-hidden mb-4">
                  <div
                    className="h-full gradient-aurora"
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {ev.tickets.map((t) => (
                    <div
                      key={t.type}
                      className="bg-[var(--color-surface-2)] rounded-lg p-3 border border-[var(--color-border)]"
                    >
                      <p className="text-xs text-[var(--color-text-muted)]">{t.type}</p>
                      <p className="text-sm font-semibold text-[var(--color-text)]">
                        {t.sold}/{t.quantity}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
