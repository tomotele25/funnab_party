"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { Calendar } from "lucide-react";
import Navbar from "@/component/Navbar";
import Footer from "@/component/Footer";
import EventCard, { EventCardData } from "@/component/EventCard";

const BACKENDURL = process.env.NEXT_PUBLIC_BACKEND_URL;

export default function EventsPage() {
  const [events, setEvents] = useState<EventCardData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios
      .get(`${BACKENDURL}/api/upcoming-event`)
      .then((res) => setEvents(res.data.events || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-bg)] font-sans text-[var(--color-text)]">
      <Navbar />

      <main className="mx-auto w-full max-w-7xl flex-1 px-4 py-12 sm:px-6 lg:px-8">
        <h1
          className="mb-2 text-3xl font-bold md:text-4xl"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          <span className="gradient-text-aurora">All Events</span>
        </h1>
        <p className="mb-8 text-[var(--color-text-muted)]">
          Every upcoming party happening around FUNAAB.
        </p>

        {loading ? (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="h-72 animate-pulse rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface)]"
              />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="py-20 text-center">
            <Calendar className="mx-auto mb-4 h-12 w-12 text-[var(--color-text-muted)]" />
            <p className="text-[var(--color-text-muted)]">
              No upcoming events right now — check back soon.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {events.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
