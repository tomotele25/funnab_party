"use client";

import { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Ticket,
  MapPin,
  ClipboardList,
  Crown,
  Camera,
  Mic2,
  Search,
  Sparkles,
} from "lucide-react";
import Navbar from "@/component/Navbar";
import Footer from "@/component/Footer";
import EventCard, { EventCardData } from "@/component/EventCard";
import axios from "axios";

// Constants
const images = ["/28569778881858678.jpeg"];

const BACKENDURL = process.env.NEXT_PUBLIC_BACKEND_URL;

type Event = EventCardData;

// Features
const features = [
  {
    icon: <Ticket className="h-9 w-9 text-[var(--color-primary)]" />,
    title: "Easy Ticket Purchase",
    description:
      "Secure your spot at the hottest parties in seconds — no queues, no stress.",
  },
  {
    icon: <MapPin className="h-9 w-9 text-[var(--color-accent)]" />,
    title: "Discover Parties Near You",
    description:
      "Find trending events and secret raves happening right in your city or campus.",
  },
  {
    icon: <ClipboardList className="h-9 w-9 text-[var(--color-secondary)]" />,
    title: "RSVP & Guest List",
    description:
      "Get your name on the VIP list before the night begins — be the one they let in first.",
  },
  {
    icon: <Crown className="h-9 w-9 text-[var(--color-urgency)]" />,
    title: "VIP Access & Packages",
    description:
      "Upgrade to VIP for bottle service, private lounges, and front-row action.",
  },
  {
    icon: <Camera className="h-9 w-9 text-[var(--color-accent)]" />,
    title: "Event Highlights",
    description:
      "Relive epic moments with high-quality after-party photos and videos.",
  },
  {
    icon: <Mic2 className="h-9 w-9 text-[var(--color-primary)]" />,
    title: "Host Your Own Event",
    description:
      "Throw your own party and manage everything from tickets to guest lists.",
  },
];

export default function Home() {
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [todaysEventList, setTodaysEventList] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    const fetchUpcomingEvents = async () => {
      try {
        const res = await axios.get(`${BACKENDURL}/api/upcoming-event`);
        setUpcomingEvents(res.data.events || []);
      } catch (error) {
        console.error("Error fetching upcoming events:", error);
        setUpcomingEvents([]);
      }
    };
    fetchUpcomingEvents();
  }, []);

  useEffect(() => {
    const fetchTodaysEvents = async () => {
      try {
        const res = await axios.get(`${BACKENDURL}/api/todays-event`);
        setTodaysEventList(res.data.events || []);
      } catch (error) {
        console.error("Error fetching today's events:", error);
        setTodaysEventList([]);
      }
    };
    fetchTodaysEvents();
  }, []);

  const allEvents = useMemo(() => {
    const map = new Map<string, Event>();
    [...todaysEventList, ...upcomingEvents].forEach((ev) =>
      map.set(ev._id, ev)
    );
    return Array.from(map.values());
  }, [todaysEventList, upcomingEvents]);

  const searchResults = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (!query) return [];
    return allEvents.filter(
      (ev) =>
        ev.title.toLowerCase().includes(query) ||
        ev.location.toLowerCase().includes(query)
    );
  }, [allEvents, searchQuery]);

  const featuredEvents = useMemo(() => {
    return [...allEvents]
      .sort((a, b) => {
        const soldA = a.tickets.reduce((s, t) => s + t.sold, 0);
        const soldB = b.tickets.reduce((s, t) => s + t.sold, 0);
        return soldB - soldA;
      })
      .slice(0, 3);
  }, [allEvents]);

  return (
    <div className="bg-[var(--color-bg)] font-sans text-[var(--color-text)]">
      <Navbar />

      {/* Hero Section */}
      <div className="relative h-[calc(100vh-4rem)] w-full min-h-[560px] overflow-hidden sm:h-[calc(100vh-4.5rem)]">
        <Image
          src={images[0]}
          alt="FUNAAB Party crowd"
          fill
          className="object-cover opacity-40"
          priority
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[var(--color-bg)]/40 via-[var(--color-bg)]/70 to-[var(--color-bg)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(124,58,237,0.35),transparent_55%)]" />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_70%_60%,rgba(236,72,153,0.3),transparent_55%)]" />

        <div className="relative z-10 flex h-full flex-col items-center justify-center px-4 text-center">
          <span className="hero-fade-up mb-4 inline-flex items-center gap-2 rounded-[var(--radius-pill)] border border-[var(--color-border)] bg-white/5 px-4 py-1.5 text-xs font-semibold uppercase tracking-wide text-[var(--color-text-muted)] backdrop-blur">
            <Sparkles className="h-3.5 w-3.5 text-[var(--color-accent)]" />
            Nigeria&apos;s campus party network
          </span>

          <h1
            className="hero-fade-up mb-4 text-4xl font-bold leading-tight sm:text-5xl md:text-7xl"
            style={{
              fontFamily: "var(--font-space-grotesk)",
              animationDelay: "0.1s",
            }}
          >
            <span className="gradient-text-aurora">Discover.</span>{" "}
            <span className="text-[var(--color-text)]">Get Tickets.</span>{" "}
            <span className="gradient-text-aurora">Show Up.</span>
          </h1>
          <p
            className="hero-fade-up mb-8 max-w-xl text-base text-[var(--color-text-muted)] md:text-xl"
            style={{ animationDelay: "0.2s" }}
          >
            The hottest parties, raves and campus events — find yours and
            lock in your ticket in seconds.
          </p>

          <div
            className="hero-fade-up relative mb-2 w-full max-w-md"
            style={{ animationDelay: "0.3s" }}
          >
            <Search className="absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-[var(--color-text-muted)]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events by name or location..."
              className="w-full rounded-[var(--radius-pill)] border border-[var(--color-border)] bg-white/10 py-3 pl-11 pr-4 text-[var(--color-text)] placeholder-[var(--color-text-muted)] backdrop-blur-xl focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40"
            />
          </div>

          {!searchQuery && (
            <div
              className="hero-fade-up mt-6 flex flex-col gap-3 sm:flex-row"
              style={{ animationDelay: "0.4s" }}
            >
              <Link href="/events">
                <button className="btn-aurora px-8 py-3 font-semibold">
                  Hit the Dance Floor
                </button>
              </Link>
              <Link href="/organizer">
                <button className="rounded-[var(--radius-btn)] border border-[var(--color-border)] bg-white/5 px-8 py-3 font-semibold text-[var(--color-text)] backdrop-blur transition-colors duration-200 hover:border-[var(--color-primary)]">
                  Host Your Event
                </button>
              </Link>
            </div>
          )}
        </div>
      </div>

      {/* Search Results */}
      {searchQuery && (
        <section className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-20">
          <h2 className="mb-6 text-xl font-semibold md:text-2xl">
            {searchResults.length > 0
              ? `Results for "${searchQuery}"`
              : `No events found for "${searchQuery}"`}
          </h2>
          {searchResults.length > 0 && (
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {searchResults.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          )}
        </section>
      )}

      {!searchQuery && (
        <>
          {/* Featured Section */}
          {featuredEvents.length > 0 && (
            <section className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-20">
              <h2 className="mb-8 text-2xl font-bold md:text-3xl">
                🔥 Trending Now
              </h2>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {featuredEvents.map((event) => (
                  <EventCard key={event._id} event={event} />
                ))}
              </div>
            </section>
          )}

          {/* Today's Party Section */}
          <section className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-20">
            <h2
              className="mb-8 text-center text-3xl font-bold sm:text-4xl md:text-5xl"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              <span className="gradient-text-aurora">Today&apos;s Party!</span>
            </h2>

            {todaysEventList.length === 0 ? (
              <div className="py-12 text-center text-[var(--color-text-muted)]">
                <p className="mb-4 text-xl sm:text-2xl">
                  No events scheduled for today.
                </p>
                <Link href="/events" className="btn-aurora inline-block px-6 py-3 font-semibold">
                  Browse Upcoming Events
                </Link>
              </div>
            ) : (
              <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {todaysEventList.map((event) => (
                  <EventCard key={event._id} event={event} />
                ))}
              </div>
            )}
          </section>

          {/* Upcoming Events Section */}
          <section className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-20">
            <h2 className="mb-8 text-center text-2xl font-bold text-[var(--color-text)] md:text-3xl">
              Upcoming Parties
            </h2>
            {upcomingEvents.length === 0 ? (
              <p className="text-center text-sm text-[var(--color-text-muted)]">
                No upcoming events.
              </p>
            ) : (
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {upcomingEvents.map((event) => (
                  <EventCard key={event._id} event={event} />
                ))}
              </div>
            )}
          </section>

          {/* Features */}
          <section className="relative mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-20">
            <h2 className="mb-10 text-center text-2xl font-bold md:text-3xl">
              Why FUNAAB Party
            </h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((f) => (
                <div key={f.title} className="card-surface p-6">
                  <div className="mb-4">{f.icon}</div>
                  <h3 className="mb-2 text-lg font-bold">{f.title}</h3>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    {f.description}
                  </p>
                </div>
              ))}
            </div>
          </section>

          {/* Organizer CTA */}
          <section className="relative mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-20">
            <div className="relative overflow-hidden rounded-[var(--radius-card)] p-10 text-center gradient-aurora sm:p-16">
              <h2
                className="mb-3 text-2xl font-bold text-white md:text-4xl"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                Got an event to throw?
              </h2>
              <p className="mx-auto mb-8 max-w-xl text-white/90">
                Create your event, sell tickets, and manage your guest list
                — all from one dashboard.
              </p>
              <Link href="/signup">
                <button className="rounded-[var(--radius-btn)] bg-white px-8 py-3 font-semibold text-[var(--color-primary-dark)] transition-transform duration-200 hover:scale-105">
                  Start Selling Tickets
                </button>
              </Link>
            </div>
          </section>
        </>
      )}

      <Footer />
    </div>
  );
}
