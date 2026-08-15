import React from "react";
import Image from "next/image";
import Link from "next/link";
import logo from "../public/2.png";
import { Facebook, Instagram, Twitter } from "lucide-react";

const Footer = () => {
  return (
    <footer className="relative overflow-hidden border-t border-[var(--color-border)] bg-[var(--color-bg)] py-16 text-[var(--color-text)] sm:py-20">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(124,58,237,0.15),transparent_60%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_bottom_right,rgba(236,72,153,0.12),transparent_60%)]" />

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-between gap-10 md:flex-row md:items-start md:gap-12">
          {/* Logo & Description */}
          <div className="flex flex-col items-center md:items-start">
            <div className="relative mb-4 h-24 w-24 rounded-[var(--radius-card)] bg-white p-2 shadow-[var(--shadow-glow-primary)]">
              <Image
                src={logo}
                alt="FUNAAB Party logo"
                fill
                className="object-contain grayscale"
              />
            </div>
            <p className="max-w-xs text-center text-sm text-[var(--color-text-muted)] md:text-left">
              Discover the hottest parties and events. Get your tickets in
              seconds, and show up.
            </p>
          </div>

          {/* Quick Links */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="mb-3 text-lg font-bold text-[var(--color-accent)]">
              Quick Links
            </h3>
            <ul className="space-y-2 text-[var(--color-text-muted)]">
              <li>
                <Link
                  href="/"
                  className="text-sm transition-colors duration-200 hover:text-[var(--color-accent)]"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/events"
                  className="text-sm transition-colors duration-200 hover:text-[var(--color-accent)]"
                >
                  Events
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="text-sm transition-colors duration-200 hover:text-[var(--color-accent)]"
                >
                  Contact
                </Link>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div className="flex flex-col items-center md:items-start">
            <h3 className="mb-3 text-lg font-bold text-[var(--color-primary)]">
              Follow Us
            </h3>
            <div className="flex space-x-4">
              <a
                href="#"
                className="text-[var(--color-text-muted)] transition-colors duration-200 hover:text-[var(--color-accent)]"
                aria-label="Follow us on Facebook"
              >
                <Facebook size={20} />
              </a>
              <a
                href="#"
                className="text-[var(--color-text-muted)] transition-colors duration-200 hover:text-[var(--color-accent)]"
                aria-label="Follow us on Instagram"
              >
                <Instagram size={20} />
              </a>
              <a
                href="#"
                className="text-[var(--color-text-muted)] transition-colors duration-200 hover:text-[var(--color-accent)]"
                aria-label="Follow us on Twitter"
              >
                <Twitter size={20} />
              </a>
            </div>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center gap-2 border-t border-[var(--color-border)] pt-6 text-center text-sm text-[var(--color-text-muted)] sm:flex-row sm:justify-between">
          <span>
            &copy; {new Date().getFullYear()} FUNAAB Party. All rights reserved.
          </span>
          <span>
            Powered by{" "}
            <span className="font-semibold text-[var(--color-text)]">
              Chowspace
            </span>
          </span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
