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
} from "lucide-react";
import Navbar from "@/component/Navbar";
import Footer from "@/component/Footer";
import EventCard, { EventCardData } from "@/component/EventCard";
import axios from "axios";

// Constants
const images = ["/28569778881858678.jpeg"];
const texts = ["Explore parties", "Book · SECURE · FAST", "Join the fun"];

const BACKENDURL = process.env.NEXT_PUBLIC_BACKEND_URL;

type Event = EventCardData;

// Example fallback today event (can be removed if fetching always)
const todayEvent: Event = {
  _id: "today-party-2025-08-17",
  slug: "neon-nights-bash",
  title: "Neon Nights Bash",
  details:
    "Join us for an electrifying night of music, lights, and dance at FUNAAB’s biggest party of the year!",
  location: "FUNAAB Main Hall",
  image: "/Hero (1).jpg",
  date: "2025-08-17",
  tickets: [
    { type: "General Admission", price: 5000, quantity: 100, sold: 20 },
    { type: "VIP", price: 10000, quantity: 20, sold: 5 },
  ],
  startTime: "No time",
};

// Features
const features = [
  {
    icon: <Ticket className="w-10 h-10 text-pink-400 animate-bounce-slow" />,
    title: "Easy Ticket Purchase",
    description:
      "Secure your spot at the hottest parties in seconds — no queues, no stress.",
  },
  {
    icon: (
      <MapPin className="w-10 h-10 text-cyan-400 animate-bounce-slow delay-100" />
    ),
    title: "Discover Parties Near You",
    description:
      "Find trending events and secret raves happening right in your city or campus.",
  },
  {
    icon: (
      <ClipboardList className="w-10 h-10 text-purple-400 animate-bounce-slow delay-200" />
    ),
    title: "RSVP & Guest List",
    description:
      "Get your name on the VIP list before the night begins — be the one they let in first.",
  },
  {
    icon: (
      <Crown className="w-10 h-10 text-yellow-400 animate-bounce-slow delay-300" />
    ),
    title: "VIP Access & Packages",
    description:
      "Upgrade to VIP for bottle service, private lounges, and front-row action.",
  },
  {
    icon: (
      <Camera className="w-10 h-10 text-fuchsia-400 animate-bounce-slow delay-400" />
    ),
    title: "Event Highlights",
    description:
      "Relive epic moments with high-quality after-party photos and videos.",
  },
  {
    icon: (
      <Mic2 className="w-10 h-10 text-green-400 animate-bounce-slow delay-500" />
    ),
    title: "Host Your Own Event",
    description:
      "Throw your own party and manage everything from tickets to guest lists.",
  },
];

// Disco ball effect component
const DiscoBall = ({
  position,
  delay,
}: {
  position: string;
  delay?: string;
}) => (
  <div
    className={`absolute w-32 h-32 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-silver to-gray-300 opacity-70 animate-pulse-slow ${position} ${delay}`}
    style={{
      boxShadow:
        "0 0 20px rgba(255, 215, 0, 0.5), 0 0 40px rgba(255, 105, 180, 0.3)",
    }}
  />
);

export default function Home() {
  const [currentImage, setCurrentImage] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [todaysEventList, setTodaysEventList] = useState<Event[]>([]);
  const [searchQuery, setSearchQuery] = useState("");

  // Hero carousel
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
      setTextIndex((prev) => (prev + 1) % texts.length);
      setCurrentText("");
      setCharIndex(0);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    if (charIndex < texts[textIndex].length) {
      const timeout = setTimeout(() => {
        setCurrentText((prev) => prev + texts[textIndex][charIndex]);
        setCharIndex((prev) => prev + 1);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [charIndex, textIndex]);

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
    [...todaysEventList, ...upcomingEvents].forEach((ev) => map.set(ev._id, ev));
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
    <div className="bg-black text-white font-sans">
      <Navbar />

      {/* Hero Section */}
      <div className="relative w-full h-[calc(100vh-5rem)] overflow-hidden">
        {images.map((img, idx) => (
          <div
            key={idx}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              idx === currentImage ? "opacity-90" : "opacity-20"
            }`}
          >
            <Image
              src={img}
              alt={`Hero ${idx}`}
              fill
              className="object-cover mix-blend-overlay"
              priority={idx === 0}
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          </div>
        ))}
        <div className="absolute inset-0 bg-black/30 z-10 flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            {currentText}
            <span className="blinking-cursor">|</span>
          </h1>
          <p className="text-base md:text-xl text-gray-300 mb-8">
            Get ready to dance and book your next party night!
          </p>

          <div className="relative w-full max-w-md mb-2">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search events by name or location..."
              className="w-full pl-11 pr-4 py-3 rounded-full bg-white/10 backdrop-blur-xl border border-gray-600/50 text-white placeholder-gray-400 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400/40"
            />
          </div>

          {!searchQuery && (
            <Link href="/events">
              <button className="mt-6 px-8 py-3 bg-gradient-to-r from-white to-gray-100 text-black font-semibold rounded-lg hover:from-gray-100 hover:to-white transition-all duration-300 shadow-lg glow-button">
                Hit the Dance Floor
              </button>
            </Link>
          )}
        </div>
      </div>

      {/* Search Results */}
      {searchQuery && (
        <section className="relative max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-20 bg-black">
          <h2 className="text-xl md:text-2xl font-semibold mb-6 text-white">
            {searchResults.length > 0
              ? `Results for "${searchQuery}"`
              : `No events found for "${searchQuery}"`}
          </h2>
          {searchResults.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map((event) => (
                <EventCard key={event._id} event={event} />
              ))}
            </div>
          )}
        </section>
      )}

      {/* Featured Section */}
      {!searchQuery && featuredEvents.length > 0 && (
        <section className="relative max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-20 bg-black">
          <h2 className="text-2xl md:text-3xl font-semibold mb-8 text-white">
            🔥 Trending Now
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {featuredEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        </section>
      )}

      {!searchQuery && (
        <>
      {/* Today's Party Section */}
      <section className="relative max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-20 bg-gradient-to-b from-gray-900 to-black">
        <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-center mb-8 bg-gradient-to-r from-pink-400 to-cyan-400 bg-clip-text text-transparent drop-shadow-md">
          Today’s Party!
        </h2>

        {todaysEventList.length === 0 ? (
          <div className="text-center text-gray-400 py-12">
            <p className="text-xl sm:text-2xl mb-4">
              No events scheduled for today.
            </p>
            <Link
              href="/events"
              className="inline-block px-6 py-3 bg-pink-400 text-white rounded-lg hover:bg-pink-500 transition"
            >
              Browse Upcoming Events
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {todaysEventList.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </section>

      {/* Upcoming Events Section */}
      <section className="relative max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-20 bg-gradient-to-b from-gray-900 via-black to-gray-900">
        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8 text-pink-300 drop-shadow-md">
          Upcoming Parties
        </h2>
        {upcomingEvents.length === 0 ? (
          <p className="text-center text-gray-400 text-sm">
            No upcoming events.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <EventCard key={event._id} event={event} />
            ))}
          </div>
        )}
      </section>
        </>
      )}

      <Footer />

      <style jsx global>{`
        .blinking-cursor {
          animation: blink 1s ease-in-out infinite;
        }
        @keyframes blink {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0;
          }
        }
        .animate-pulse-slow {
          animation: pulse-slow 3s infinite;
        }
        @keyframes pulse-slow {
          0%,
          100% {
            opacity: 1;
          }
          50% {
            opacity: 0.8;
          }
        }
        .animate-bounce-slow {
          animation: bounce 3s infinite;
        }
        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-6px);
          }
        }
        .glow-button {
          box-shadow: 0 0 10px rgba(255, 105, 180, 0.3);
        }
        .glow-button:hover {
          box-shadow: 0 0 15px rgba(255, 105, 180, 0.5);
        }
        .glow-effect:hover {
          box-shadow: 0 0 10px rgba(255, 0, 128, 0.3);
        }
      `}</style>
    </div>
  );
}
