"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "../public/logo.jpg";
import { useSession } from "next-auth/react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session, status } = useSession();
  const toggleMenu = () => setIsOpen(!isOpen);

  const menuItems = [
    { name: "Home", href: "/" },
    { name: "Events", href: "/events" },
    { name: "Tickets", href: "/tickets" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="bg-gradient-to-b from-black to-gray-900 text-white sticky top-0 z-50 shadow-[0_4px_10px_rgba(255,0,128,0.2)]">
      {/* Background Neon Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,0,128,0.2),transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(0,255,255,0.2),transparent)]" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-10 relative z-10">
        <div className="flex justify-between h-18 items-center py-4">
          {/* Logo */}
          <Link href="/" aria-label="Funaab Party Homepage">
            <div className="w-24 h-12 relative border border-pink-500/50 rounded-md p-1 bg-white glow-logo">
              <Image
                src={logo}
                alt="Funaab Party Logo"
                fill
                className="object-cover"
                priority
                sizes="(max-width: 640px) 20vw, 24vw"
              />
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-8 text-base items-center">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="font-extrabold text-white hover:text-pink-500 transition-all duration-300 hover:scale-105 glow-effect"
              >
                {item.name}
              </Link>
            ))}

            {/* Buttons */}
            <div className="flex space-x-3 ml-6">
              <Link
                href="/login"
                className="px-4 py-2 border border-pink-500 text-pink-500 font-semibold rounded-lg hover:bg-pink-500 hover:text-white transition-all duration-300 glow-button"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-4 py-2 bg-gradient-to-r from-pink-500 to-cyan-500 text-white font-semibold rounded-lg hover:bg-gradient-to-r hover:from-cyan-500 hover:to-pink-500 transition-all duration-300 glow-button"
              >
                Signup
              </Link>
            </div>
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="flex flex-col justify-center items-center gap-1.5 p-2"
              aria-label="Toggle navigation menu"
              aria-expanded={isOpen}
            >
              <span
                className={`block w-6 h-0.5 bg-pink-500 transition-transform duration-300 ${
                  isOpen ? "rotate-45 translate-y-2" : ""
                }`}
              />
              <span
                className={`block w-6 h-0.5 bg-pink-500 transition-opacity duration-300 ${
                  isOpen ? "opacity-0" : ""
                }`}
              />
              <span
                className={`block w-6 h-0.5 bg-pink-500 transition-transform duration-300 ${
                  isOpen ? "-rotate-45 -translate-y-2" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-white/5 backdrop-blur-xl overflow-hidden transition-all duration-300 ${
          isOpen ? "max-h-96 translate-y-0" : "max-h-0 -translate-y-4"
        }`}
      >
        <div className="relative bg-gradient-to-b from-black/80 to-gray-900/80">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(255,0,128,0.2),transparent)]" />
          {menuItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block px-4 py-3 text-sm text-white hover:text-pink-500 hover:bg-gray-800/50 transition-all duration-200 glow-effect"
              onClick={() => setIsOpen(false)}
            >
              {item.name}
            </Link>
          ))}

          {/* Mobile Buttons */}
          <div className="px-4 py-4 flex flex-col gap-3">
            <Link
              href="/login"
              className="w-full text-center px-4 py-2 border border-pink-500 text-pink-500 font-semibold rounded-lg hover:bg-pink-500 hover:text-white transition-all duration-300 glow-button"
              onClick={() => setIsOpen(false)}
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="w-full text-center px-4 py-2 bg-gradient-to-r from-pink-500 to-cyan-500 text-white font-semibold rounded-lg hover:bg-gradient-to-r hover:from-cyan-500 hover:to-pink-500 transition-all duration-300 glow-button"
              onClick={() => setIsOpen(false)}
            >
              Signup
            </Link>
          </div>
        </div>
      </div>

      {/* Styles */}
      <style jsx>{`
        .glow-effect:hover {
          box-shadow: 0 0 15px rgba(255, 0, 128, 0.5);
        }
        .glow-button {
          box-shadow: 0 0 10px rgba(255, 105, 180, 0.2);
        }
        .glow-button:hover {
          box-shadow: 0 0 15px rgba(255, 105, 180, 0.4);
        }
        .glow-logo {
          box-shadow: 0 0 8px rgba(255, 0, 128, 0.3);
        }
        .glow-logo:hover {
          box-shadow: 0 0 12px rgba(255, 0, 128, 0.5);
        }
      `}</style>
    </nav>
  );
}
