"use client";

import { useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { Search, Ticket as TicketIcon, Sparkles } from "lucide-react";
import Navbar from "@/component/Navbar";
import Footer from "@/component/Footer";

export default function CustomerDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session) router.push("/login");
  }, [session, status, router]);

  if (status === "loading" || !session) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] text-[var(--color-text-muted)]">
        Checking access...
      </div>
    );
  }

  return (
    <div className="bg-[var(--color-bg)] text-[var(--color-text)] min-h-screen font-sans flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-16">
        <h1
          className="text-2xl md:text-3xl font-bold mb-1"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          Welcome, {session.user.fullname?.split(" ")[0] || "there"} 👋
        </h1>
        <p className="text-[var(--color-text-muted)] mb-10">
          What do you want to do today?
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
          <Link
            href="/"
            className="group card-surface p-6 hover:border-[var(--color-accent)]/50 transition-all"
          >
            <div className="w-11 h-11 rounded-[var(--radius-btn)] bg-[var(--color-accent)]/10 text-[var(--color-accent)] flex items-center justify-center mb-4">
              <Search className="w-5 h-5" />
            </div>
            <p className="font-semibold text-lg mb-1">Discover Events</p>
            <p className="text-sm text-[var(--color-text-muted)]">
              Browse and search parties happening around FUNAAB.
            </p>
          </Link>

          <Link
            href="/tickets"
            className="group card-surface p-6 hover:border-[var(--color-secondary)]/50 transition-all"
          >
            <div className="w-11 h-11 rounded-[var(--radius-btn)] bg-[var(--color-secondary)]/10 text-[var(--color-secondary)] flex items-center justify-center mb-4">
              <TicketIcon className="w-5 h-5" />
            </div>
            <p className="font-semibold text-lg mb-1">My Tickets</p>
            <p className="text-sm text-[var(--color-text-muted)]">
              Look up tickets you&apos;ve already bought by email.
            </p>
          </Link>
        </div>

        <div className="bg-[var(--gradient-aurora-soft)] border border-[var(--color-border)] rounded-[var(--radius-card)] p-6 flex items-center justify-between gap-4 flex-col sm:flex-row text-center sm:text-left">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-[var(--color-accent)] shrink-0" />
            <div>
              <p className="font-semibold">Hosting your own event?</p>
              <p className="text-sm text-[var(--color-text-muted)]">
                Create an event and start selling tickets in minutes.
              </p>
            </div>
          </div>
          <Link
            href="/organizer/manageEvents"
            className="shrink-0 px-5 py-2.5 btn-aurora font-semibold hover:scale-105 transition-all"
          >
            Become an Organizer
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
