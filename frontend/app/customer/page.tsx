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
      <div className="min-h-screen flex items-center justify-center bg-black text-gray-400">
        Checking access...
      </div>
    );
  }

  return (
    <div className="bg-black text-white min-h-screen font-sans flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-3xl mx-auto w-full px-4 sm:px-6 py-16">
        <h1 className="text-2xl md:text-3xl font-bold mb-1">
          Welcome, {session.user.fullname?.split(" ")[0] || "there"} 👋
        </h1>
        <p className="text-gray-400 mb-10">
          What do you want to do today?
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-8">
          <Link
            href="/"
            className="group bg-white/5 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 hover:border-pink-400/50 transition-all"
          >
            <div className="w-11 h-11 rounded-xl bg-pink-400/10 text-pink-400 flex items-center justify-center mb-4">
              <Search className="w-5 h-5" />
            </div>
            <p className="font-semibold text-lg mb-1">Discover Events</p>
            <p className="text-sm text-gray-400">
              Browse and search parties happening around FUNAAB.
            </p>
          </Link>

          <Link
            href="/tickets"
            className="group bg-white/5 backdrop-blur-xl border border-gray-700/50 rounded-2xl p-6 hover:border-cyan-400/50 transition-all"
          >
            <div className="w-11 h-11 rounded-xl bg-cyan-400/10 text-cyan-400 flex items-center justify-center mb-4">
              <TicketIcon className="w-5 h-5" />
            </div>
            <p className="font-semibold text-lg mb-1">My Tickets</p>
            <p className="text-sm text-gray-400">
              Look up tickets you&apos;ve already bought by email.
            </p>
          </Link>
        </div>

        <div className="bg-gradient-to-r from-pink-400/10 to-cyan-400/10 border border-gray-700/50 rounded-2xl p-6 flex items-center justify-between gap-4 flex-col sm:flex-row text-center sm:text-left">
          <div className="flex items-center gap-3">
            <Sparkles className="w-6 h-6 text-pink-400 shrink-0" />
            <div>
              <p className="font-semibold">Hosting your own event?</p>
              <p className="text-sm text-gray-400">
                Create an event and start selling tickets in minutes.
              </p>
            </div>
          </div>
          <Link
            href="/organizer/manageEvents"
            className="shrink-0 px-5 py-2.5 bg-gradient-to-r from-pink-400 to-cyan-400 text-white font-semibold rounded-lg hover:scale-105 transition-all"
          >
            Become an Organizer
          </Link>
        </div>
      </main>

      <Footer />
    </div>
  );
}
