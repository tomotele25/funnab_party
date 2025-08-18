"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Ticket,
  MapPin,
  ClipboardList,
  Crown,
  Camera,
  Mic2,
} from "lucide-react";
import Navbar from "@/component/Navbar";
import Footer from "@/component/Footer";
import axios from "axios";

// Constants
const images = ["/Hero (1).jpg", "/Hero (2).jpg", "/Hero (4).jpg"];
const texts = ["Explore parties", "Book · SECURE · FAST", "Join the fun"];
const BACKENDURL = "https://funnabparty-backend.vercel.app";

// Interfaces
interface Ticket {
  type: string;
  price: number;
  quantity: number;
  sold: number;
}

interface Event {
  _id: string;
  slug: string;
  title: string;
  details: string;
  location: string;
  image: string;
  date: string;
  tickets: Ticket[];
}

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

// Event card
const EventCard = ({ event }: { event?: Event }) => {
  if (!event) return null;

  const formattedDate = new Intl.DateTimeFormat("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  }).format(new Date(event.date));

  return (
    <Link
      href={`/event/${event.slug}`}
      aria-label={`View details for ${event.title}`}
      role="article"
    >
      <div className="relative rounded-xl overflow-hidden bg-white/3 border border-gray-700/50 backdrop-blur-xl transition-all duration-300 hover:scale-102 hover:border-pink-400/50 hover:shadow-[0_0_10px_rgba(255,0,128,0.3)] glow-effect group">
        {/* Event Image */}
        <div className="relative">
          <Image
            src={event.image}
            alt={event.title}
            width={500}
            height={300}
            className="object-cover w-full h-48 md:h-56"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            loading="lazy"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
        </div>

        {/* Event Info */}
        <div className="p-6 text-center bg-black/20 space-y-3 md:space-y-4">
          <h3 className="text-white font-bold text-lg md:text-2xl tracking-tight">
            {event.title}
          </h3>
          <h4 className="text-cyan-300 font-bold text-sm md:text-base tracking-tight">
            {event.location}
          </h4>

          {/* Make details more prominent */}
          <p className="text-gray-100 text-sm md:text-base max-h-36 overflow-y-auto break-words">
            {event.details}
          </p>

          <time
            dateTime={event.date}
            className="inline-flex text-purple-300 font-semibold text-sm md:text-base tracking-tight bg-purple-500/5 rounded px-2 py-1"
          >
            {formattedDate}
          </time>

          {/* Action Buttons */}
          <div className="flex justify-center gap-4 items-center flex-wrap">
            <span className="inline-flex items-center px-3 py-1 bg-gradient-to-r from-pink-400 to-cyan-400 text-white text-xs md:text-sm rounded-full font-semibold animate-pulse">
              Party
            </span>
            <button className="px-4 py-2 bg-transparent border border-pink-400 text-pink-400 font-semibold rounded-lg hover:bg-pink-400/20 hover:text-white transition-all duration-300 glow-button">
              Get Tickets
            </button>
          </div>
        </div>

        {/* Hover effect */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,0,128,0.1),transparent)] opacity-0 group-hover:opacity-50 transition-opacity duration-300" />
      </div>
    </Link>
  );
};

export default function Home() {
  const [currentImage, setCurrentImage] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);
  const [todaysEventList, setTodaysEventList] = useState<Event[]>([]);

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
          <Link href="/events">
            <button className="px-8 py-3 bg-gradient-to-r from-white to-gray-100 text-black font-semibold rounded-lg hover:from-gray-100 hover:to-white transition-all duration-300 shadow-lg glow-button">
              Hit the Dance Floor
            </button>
          </Link>
        </div>
      </div>

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
