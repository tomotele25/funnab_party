"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import hero1 from "../public/Hero (1).jpg";
import hero2 from "../public/Hero (2).jpg";
import hero3 from "../public/Hero (4).jpg";
import Features from "@/component/Features";
import Gallery from "@/component/Gallery";
import Navbar from "@/component/Navbar";
import Footer from "@/component/Footer";
import axios from "axios";
import Link from "next/link";

const images = [hero1, hero2, hero3];
const texts = ["Explore parties", "Book · SECURE · FAST", "Join the fun"];
const BACKENDURL = process.env.NEXT_PUBLIC_BACKEND_URL
  ? process.env.NEXT_PUBLIC_BACKEND_URL
  : "http://localhost:2005";

interface Ticket {
  type: string;
  price: number;
  quantity: number;
  sold: number;
  deadline?: string;
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

export default function Home() {
  const [currentImage, setCurrentImage] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  const [upcomingEvents, setUpcomingEvents] = useState<Event[]>([]);

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

  // Typewriter effect
  useEffect(() => {
    if (charIndex < texts[textIndex].length) {
      const timeout = setTimeout(() => {
        setCurrentText((prev) => prev + texts[textIndex][charIndex]);
        setCharIndex((prev) => prev + 1);
      }, 100);
      return () => clearTimeout(timeout);
    }
  }, [charIndex, textIndex]);

  // Fetch upcoming events
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

  return (
    <div className="bg-black text-white font-sans">
      <Navbar />

      {/* Hero Section */}
      <div className="relative w-full h-[calc(100vh-5rem)] bg-gradient-to-b from-black to-gray-900 overflow-hidden">
        {/* Disco Ball Effects */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_rgba(255,255,255,0.15)_0%,_transparent_70%)] animate-rotate-slow"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,_rgba(255,255,255,0.15)_0%,_transparent_70%)] animate-rotate-slow delay-1000"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,_rgba(255,255,255,0.15)_0%,_transparent_70%)] animate-rotate-slow delay-2000"></div>

        {/* Visible Disco Balls */}
        {Array.from({ length: 3 }).map((_, idx) => (
          <div
            key={idx}
            className={`absolute w-32 h-32 md:w-48 md:h-48 rounded-full bg-gradient-to-br from-silver to-gray-300 opacity-70 animate-pulse-slow ${
              idx === 0
                ? "top-10 left-10"
                : idx === 1
                ? "top-20 right-10"
                : "bottom-10 left-1/2 transform -translate-x-1/2"
            }`}
            style={{
              boxShadow:
                "0 0 20px rgba(255, 215, 0, 0.5), 0 0 40px rgba(255, 105, 180, 0.3)",
            }}
          ></div>
        ))}

        {/* Background Image Slider */}
        {images.map((img, idx) => (
          <div
            key={idx}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
              idx === currentImage ? "opacity-90" : "opacity-20"
            }`}
          >
            <Image
              src={img}
              alt={`Hero ${idx}`}
              fill
              className="object-cover mix-blend-overlay"
              priority
            />
          </div>
        ))}

        <div className="absolute inset-0 bg-black/30 z-10 flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            {currentText}
            <span className="blinking-cursor">|</span>
          </h1>
          <p className="text-base md:text-xl text-gray-100 mb-8">
            Get ready to dance and book your next party night!
          </p>
          <Link href="/events">
            <button className="px-8 py-3 bg-gradient-to-r from-white to-gray-100 text-black font-semibold rounded-lg hover:from-gray-100 hover:to-white transition-all duration-300 shadow-lg glow-button">
              Hit the Dance Floor
            </button>
          </Link>
        </div>

        <style jsx>{`
          .blinking-cursor {
            animation: blink 0.8s step-end infinite;
          }
          @keyframes blink {
            50% {
              opacity: 0;
            }
          }
          .animate-rotate-slow {
            animation: rotate 20s linear infinite;
          }
          @keyframes rotate {
            from {
              transform: rotate(0deg);
            }
            to {
              transform: rotate(360deg);
            }
          }
          .animate-pulse-slow {
            animation: pulse 4s infinite;
          }
          @keyframes pulse {
            0%,
            100% {
              transform: scale(1);
            }
            50% {
              transform: scale(1.05);
            }
          }
          .drop-shadow-2xl {
            filter: drop-shadow(0 4px 6px rgba(0, 0, 0, 0.5));
          }
          .glow-button {
            box-shadow: 0 0 10px rgba(255, 255, 255, 0.3),
              0 0 20px rgba(255, 105, 180, 0.2);
          }
          .glow-button:hover {
            box-shadow: 0 0 15px rgba(255, 255, 255, 0.5),
              0 0 25px rgba(255, 105, 180, 0.4);
          }
        `}</style>
      </div>

      {/* Upcoming Events */}
      <section className="max-w-7xl mx-auto py-12 px-20 bg-gradient-to-b from-gray-900 via-black to-gray-900 text-white">
        {/* background neon blur */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,_rgba(255,0,128,0.3),_transparent)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,_rgba(0,255,255,0.3),_transparent)]" />

        <h2 className="text-2xl md:text-3xl font-semibold text-center mb-8 drop-shadow-md text-pink-300">
          Upcoming Parties
        </h2>

        {upcomingEvents.length === 0 ? (
          <p className="text-center text-gray-400 text-sm">
            No upcoming events.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {upcomingEvents.map((event) => (
              <div
                key={event._id}
                className="relative rounded-lg overflow-hidden shadow-md bg-gray-800/50 border border-gray-700/50 hover:shadow-lg transition-shadow duration-300 glow-effect"
              >
                <Image
                  src={event.image}
                  alt={event.title}
                  width={500}
                  height={300}
                  className="object-cover w-full h-48 md:h-56"
                />

                <div className="p-4 text-center">
                  <h3 className="text-white font-medium text-base md:text-lg mb-1">
                    {event.title}
                  </h3>
                  <p className="text-gray-400 text-xs md:text-sm mb-2">
                    {event.date}
                  </p>
                  <span className="inline-block px-2 py-1 bg-gradient-to-r from-pink-500 to-cyan-500 text-white text-xs rounded font-semibold">
                    Party
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
      <Gallery />
      <Features />

      <Footer />
    </div>
  );
}
