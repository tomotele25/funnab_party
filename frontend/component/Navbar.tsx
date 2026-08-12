"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import crownLogo from "../public/crown-icon.png";
import { useSession } from "next-auth/react";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const toggleMenu = () => setIsOpen(!isOpen);

  const menuItems = [
    { name: "Home", href: "/" },
    { name: "Events", href: "/events" },
    { name: "Tickets", href: "/tickets" },
    { name: "Contact", href: "/contact" },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg)]/90 backdrop-blur-xl">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.18),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_right,rgba(236,72,153,0.15),transparent_60%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-10">
        <div className="flex h-16 items-center justify-between sm:h-18">
          {/* Logo */}
          <Link
            href="/"
            aria-label="FUNAAB Party Homepage"
            className="flex items-center gap-2"
          >
            <div className="relative h-10 w-10 rounded-full border border-[var(--color-primary)]/40 bg-white p-0.5 shadow-[var(--shadow-glow-primary)] sm:h-12 sm:w-12">
              <Image
                src={crownLogo}
                alt="FUNAAB Party crown logo"
                fill
                className="object-contain"
                priority
                sizes="48px"
              />
            </div>
            <span
              className="text-base font-bold tracking-tight text-[var(--color-text)] sm:text-lg"
              style={{ fontFamily: "var(--font-space-grotesk)" }}
            >
              FUNAAB<span className="gradient-text-aurora">PARTY</span>
            </span>
          </Link>

          {/* Desktop Menu */}
          <div className="hidden items-center space-x-8 text-sm font-semibold md:flex">
            {menuItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-[var(--color-text)]/90 transition-colors duration-200 hover:text-[var(--color-accent)]"
              >
                {item.name}
              </Link>
            ))}

            <div className="ml-4 flex items-center space-x-3">
              {session ? (
                <Link
                  href="/customer"
                  className="rounded-[var(--radius-btn)] border border-[var(--color-border)] px-4 py-2 font-semibold text-[var(--color-text)] transition-colors duration-200 hover:border-[var(--color-primary)]"
                >
                  My Account
                </Link>
              ) : (
                <>
                  <Link
                    href="/login"
                    className="rounded-[var(--radius-btn)] border border-[var(--color-border)] px-4 py-2 font-semibold text-[var(--color-text)] transition-colors duration-200 hover:border-[var(--color-primary)]"
                  >
                    Login
                  </Link>
                  <Link
                    href="/signup"
                    className="btn-aurora px-4 py-2 text-sm font-semibold"
                  >
                    Sign Up
                  </Link>
                </>
              )}
            </div>
          </div>

          {/* Mobile Hamburger */}
          <button
            onClick={toggleMenu}
            className="flex flex-col items-center justify-center gap-1.5 p-2 md:hidden"
            aria-label="Toggle navigation menu"
            aria-expanded={isOpen}
          >
            <span
              className={`block h-0.5 w-6 bg-[var(--color-text)] transition-transform duration-300 ${
                isOpen ? "translate-y-2 rotate-45" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-[var(--color-text)] transition-opacity duration-300 ${
                isOpen ? "opacity-0" : ""
              }`}
            />
            <span
              className={`block h-0.5 w-6 bg-[var(--color-text)] transition-transform duration-300 ${
                isOpen ? "-translate-y-2 -rotate-45" : ""
              }`}
            />
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`relative z-10 overflow-hidden border-t border-[var(--color-border)] bg-[var(--color-surface)]/95 backdrop-blur-xl transition-all duration-300 md:hidden ${
          isOpen ? "max-h-96 translate-y-0 opacity-100" : "max-h-0 -translate-y-2 opacity-0"
        }`}
      >
        {menuItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="block px-4 py-3 text-sm font-medium text-[var(--color-text)] transition-colors duration-200 hover:bg-white/5 hover:text-[var(--color-accent)]"
            onClick={() => setIsOpen(false)}
          >
            {item.name}
          </Link>
        ))}

        <div className="flex flex-col gap-3 px-4 py-4">
          {session ? (
            <Link
              href="/customer"
              className="w-full rounded-[var(--radius-btn)] border border-[var(--color-border)] px-4 py-2 text-center font-semibold text-[var(--color-text)]"
              onClick={() => setIsOpen(false)}
            >
              My Account
            </Link>
          ) : (
            <>
              <Link
                href="/login"
                className="w-full rounded-[var(--radius-btn)] border border-[var(--color-border)] px-4 py-2 text-center font-semibold text-[var(--color-text)]"
                onClick={() => setIsOpen(false)}
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="btn-aurora w-full px-4 py-2 text-center text-sm font-semibold"
                onClick={() => setIsOpen(false)}
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
