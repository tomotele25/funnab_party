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
      <h1 className="text-2xl font-bold text-black mb-1">Analytics</h1>
      <p className="text-gray-500 text-sm mb-6">
        Ticket sales performance across your events.
      </p>

      {loading ? (
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 h-32 animate-pulse" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-10 text-center">
          <BarChart3 className="w-10 h-10 mx-auto mb-3 text-gray-300" />
          <p className="text-gray-500">
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
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5"
              >
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="font-semibold text-black">{ev.title}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(ev.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-black">
                      ₦{revenue.toLocaleString()}
                    </p>
                    <p className="text-xs text-gray-500">revenue</p>
                  </div>
                </div>

                <div className="w-full h-2 bg-gray-100 rounded-full overflow-hidden mb-4">
                  <div
                    className="h-full bg-gradient-to-r from-pink-400 to-cyan-400"
                    style={{ width: `${Math.min(pct, 100)}%` }}
                  />
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                  {ev.tickets.map((t) => (
                    <div
                      key={t.type}
                      className="bg-gray-50 rounded-lg p-3 border border-gray-100"
                    >
                      <p className="text-xs text-gray-500">{t.type}</p>
                      <p className="text-sm font-semibold text-black">
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
