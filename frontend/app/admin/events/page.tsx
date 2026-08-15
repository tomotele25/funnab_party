"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import toast from "react-hot-toast";
import { Calendar, MapPin } from "lucide-react";

const BACKENDURL = process.env.NEXT_PUBLIC_BACKEND_URL;

type EventStatus = "draft" | "published" | "cancelled" | "completed";

interface EventRow {
  _id: string;
  title: string;
  slug: string;
  location: string;
  date: string;
  status: EventStatus;
  organizer?: { fullname?: string; email?: string };
  tickets: { type: string; price: number; quantity: number; sold: number }[];
}

const statusStyles: Record<EventStatus, string> = {
  draft: "bg-[var(--color-surface-2)] text-[var(--color-text-muted)]",
  published: "bg-[var(--color-success)]/15 text-[var(--color-success)]",
  cancelled: "bg-[var(--color-error)]/15 text-[var(--color-error)]",
  completed: "bg-[var(--color-secondary)]/15 text-[var(--color-secondary)]",
};

export default function AdminEventsPage() {
  const { data: session } = useSession();
  const [events, setEvents] = useState<EventRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const fetchEvents = () => {
    if (!session?.user?.accessToken) return;

    axios
      .get(`${BACKENDURL}/api/admin/events`, {
        headers: { Authorization: `Bearer ${session.user.accessToken}` },
      })
      .then((res) => setEvents(res.data.events))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  };

  useEffect(fetchEvents, [session]);

  const updateStatus = async (id: string, status: EventStatus) => {
    if (!session?.user?.accessToken) return;
    setUpdatingId(id);
    try {
      await axios.patch(
        `${BACKENDURL}/api/admin/events/${id}/status`,
        { status },
        { headers: { Authorization: `Bearer ${session.user.accessToken}` } }
      );
      setEvents((prev) =>
        prev.map((ev) => (ev._id === id ? { ...ev, status } : ev))
      );
      toast.success("Event status updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update event status");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div>
      <h1
        className="text-2xl font-bold text-[var(--color-text)] mb-1"
        style={{ fontFamily: "var(--font-space-grotesk)" }}
      >
        Events
      </h1>
      <p className="text-[var(--color-text-muted)] text-sm mb-6">
        Every event created on the platform.
      </p>

      {loading ? (
        <div className="card-surface p-4 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 bg-[var(--color-surface-2)] rounded-lg animate-pulse" />
          ))}
        </div>
      ) : events.length === 0 ? (
        <div className="card-surface p-10 text-center">
          <Calendar className="w-10 h-10 mx-auto mb-3 text-[var(--color-text-muted)]" />
          <p className="text-[var(--color-text-muted)]">No events yet.</p>
        </div>
      ) : (
        <div className="card-surface overflow-x-auto">
          <table className="w-full min-w-[680px] text-sm text-left">
            <thead className="bg-[var(--color-surface-2)] text-[var(--color-text-muted)] text-xs uppercase tracking-wide">
              <tr>
                <th className="p-4">Event</th>
                <th className="p-4">Organizer</th>
                <th className="p-4">Date</th>
                <th className="p-4">Tickets Sold</th>
                <th className="p-4">Status</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {events.map((ev) => {
                const sold = ev.tickets.reduce((s, t) => s + t.sold, 0);
                const total = ev.tickets.reduce((s, t) => s + t.quantity, 0);
                const pct = total > 0 ? Math.round((sold / total) * 100) : 0;
                return (
                  <tr
                    key={ev._id}
                    className="border-t border-[var(--color-border)] hover:bg-[var(--color-surface-2)]/60 transition"
                  >
                    <td className="p-4">
                      <p className="font-medium text-[var(--color-text)]">{ev.title}</p>
                      <p className="text-xs text-[var(--color-text-muted)] flex items-center gap-1 mt-0.5">
                        <MapPin className="w-3 h-3" />
                        {ev.location}
                      </p>
                    </td>
                    <td className="p-4 text-[var(--color-text-muted)]">
                      {ev.organizer?.fullname || "—"}
                    </td>
                    <td className="p-4 text-[var(--color-text-muted)]">
                      {new Date(ev.date).toLocaleDateString()}
                    </td>
                    <td className="p-4">
                      <div className="w-24">
                        <p className="text-xs text-[var(--color-text-muted)] mb-1">
                          {sold} / {total}
                        </p>
                        <div className="w-full h-1.5 bg-[var(--color-surface-2)] rounded-full overflow-hidden">
                          <div
                            className="h-full gradient-aurora"
                            style={{ width: `${Math.min(pct, 100)}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="p-4">
                      <span
                        className={`px-2 py-1 rounded-[var(--radius-pill)] text-xs font-medium ${
                          statusStyles[ev.status] || statusStyles.published
                        }`}
                      >
                        {ev.status}
                      </span>
                    </td>
                    <td className="p-4">
                      {ev.status !== "cancelled" && (
                        <button
                          onClick={() => updateStatus(ev._id, "cancelled")}
                          disabled={updatingId === ev._id}
                          className="text-xs text-[var(--color-error)] hover:underline disabled:opacity-50"
                        >
                          {updatingId === ev._id ? "..." : "Cancel"}
                        </button>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
