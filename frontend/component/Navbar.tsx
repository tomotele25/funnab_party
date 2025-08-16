"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logo from "../public/logo.png";
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
    <nav className="bg-white text-black shadow-md sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-20 items-center">
          {/* Logo */}
          <Link href="/">
            <div className="w-32 h-18 relative">
              <Image
                src={logo}
                alt="Funaab Party Logo"
                fill
                className="object-cover"
                priority
              />
            </div>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden md:flex space-x-6 font-medium items-center">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-purple-600 transition-colors duration-200"
              >
                {item.name}
              </Link>
            ))}

            {/* Buttons */}
            <div className="flex space-x-2 ml-6">
              <Link href="/login" className="px-2 py-2 border   transition">
                Login
              </Link>
              <Link href="/signup" className="px-2 py-2 transition">
                Signup
              </Link>
            </div>
          </div>

          {/* Mobile Hamburger */}
          <div className="md:hidden flex items-center">
            <button
              onClick={toggleMenu}
              className="flex flex-col justify-center items-center gap-1 p-2"
            >
              <span
                className={`block w-6 h-0.5 bg-black transition-transform duration-300 ${
                  isOpen ? "rotate-45 translate-y-1" : ""
                }`}
              />
              <span
                className={`block h-0.5 bg-black transition-all duration-300 ${
                  isOpen ? "w-3 opacity-0" : "w-4"
                }`}
              />
              <span
                className={`block w-6 h-0.5 bg-black transition-transform duration-300 ${
                  isOpen ? "-rotate-45 -translate-y-1" : ""
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-white overflow-hidden transition-max-height duration-300 ${
          isOpen ? "max-h-64" : "max-h-0"
        }`}
      >
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block px-4 py-3 hover:bg-gray-200 transition-colors duration-200"
            onClick={() => setIsOpen(false)}
          >
            {item.name}
          </Link>
        ))}

        {/* Mobile Buttons */}
        <div className="px-4 py-3 flex flex-col gap-2">
          <Link
            href="/login"
            className="w-full text-center px-4 py-2 border border-purple-600 text-purple-600 rounded-md hover:bg-purple-600 hover:text-white transition"
            onClick={() => setIsOpen(false)}
          >
            Login
          </Link>
          <Link
            href="/signup"
            className="w-full text-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
            onClick={() => setIsOpen(false)}
          >
            Signup
          </Link>
        </div>
      </div>
    </nav>
  );
}
