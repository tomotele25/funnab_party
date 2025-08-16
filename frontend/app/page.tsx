"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import hero1 from "../public/Hero.png";
import hero2 from "../public/logo.png";
import hero3 from "../public/Hero.png";
import party1 from "../public/Hero.png";
import party2 from "../public/Hero.png";
import party3 from "../public/Hero.png";
import Features from "@/component/Features";
import Gallery from "@/component/Gallery";
import Navbar from "@/component/Navbar";
import Footer from "@/component/Footer";

const images = [hero1, hero2, hero3];
const texts = ["Explore parties", "Book . SECURE . FAST", "Join the fun"];

const parties = [
  { name: "Beach Bash", img: party1 },
  { name: "Club Night", img: party2 },
  { name: "Festival Vibes", img: party3 },
];

export default function Home() {
  const [currentImage, setCurrentImage] = useState(0);
  const [currentText, setCurrentText] = useState("");
  const [textIndex, setTextIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  // Image carousel
  useEffect(() => {
    const imgInterval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % images.length);
      setTextIndex((prev) => (prev + 1) % texts.length);
      setCurrentText("");
      setCharIndex(0);
    }, 5000);
    return () => clearInterval(imgInterval);
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

  return (
    <div>
      <Navbar />
      {/* Hero Section */}
      <div className="relative w-full" style={{ height: "calc(100vh - 5rem)" }}>
        {images.map((img, index) => (
          <div
            key={index}
            className={`absolute top-0 left-0 w-full h-full transition-opacity duration-1000 ${
              index === currentImage ? "opacity-100" : "opacity-0"
            }`}
          >
            <Image
              src={img}
              alt={`Hero ${index + 1}`}
              fill
              className="object-cover"
              priority
            />
          </div>
        ))}

        <div className="absolute inset-0 bg-black/30 flex flex-col justify-center items-center text-center px-4">
          <h1 className="text-4xl md:text-6xl font-bold text-white mb-4">
            {currentText}
            <span className="blinking-cursor">|</span>
          </h1>
          <p className="text-lg md:text-2xl text-white/90">
            Your ultimate party guide
          </p>
        </div>

        <style jsx>{`
          .blinking-cursor {
            animation: blink 1s step-start infinite;
          }
          @keyframes blink {
            50% {
              opacity: 0;
            }
          }
        `}</style>
      </div>

      {/* Custom Parties Section */}
      <section className="max-w-7xl mx-auto py-16 px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-10">
          Available Parties
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {parties.map((party, idx) => (
            <div
              key={idx}
              className="relative border-2 border-white rounded-xl overflow-hidden shadow-lg hover:scale-105 transition-transform duration-300"
            >
              <Image
                src={party.img}
                alt={party.name}
                width={500}
                height={300}
                className="object-cover w-full h-64 md:h-72"
              />
              <div className="absolute bottom-0 left-0 w-full bg-black/50 text-white p-4 text-center font-semibold">
                {party.name}
              </div>
            </div>
          ))}
        </div>
      </section>
      <section>
        <Gallery />
      </section>
      <section>
        <Features />
      </section>
      <Footer />
    </div>
  );
}
