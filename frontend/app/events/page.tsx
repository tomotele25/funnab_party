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
    <div className="bg-black text-white min-h-screen font-sans flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-12">
        <h1 className="text-3xl md:text-4xl font-extrabold mb-2 bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent">
          All Events
        </h1>
        <p className="text-gray-400 mb-8">
          Every upcoming party happening around FUNAAB.
        </p>

        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div
                key={i}
                className="bg-white/5 rounded-xl h-72 animate-pulse border border-gray-700/50"
              />
            ))}
          </div>
        ) : events.length === 0 ? (
          <div className="text-center py-20">
            <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-600" />
            <p className="text-gray-400">No upcoming events right now — check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
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
