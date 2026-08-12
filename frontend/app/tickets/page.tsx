"use client";

import { useState } from "react";
import Image from "next/image";
import axios from "axios";
import { Search, Ticket as TicketIcon, X } from "lucide-react";
import Navbar from "@/component/Navbar";
import Footer from "@/component/Footer";
import { optimizedImage } from "@/lib/cloudinaryUrl";

const BACKENDURL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface TicketRow {
  _id: string;
  ticketId: string;
  ticketType: string;
  status: "valid" | "used" | "cancelled";
  event: {
    title: string;
    slug: string;
    date: string;
    location: string;
    image: string;
  } | null;
}

const statusStyles: Record<TicketRow["status"], string> = {
  valid: "bg-green-500/20 text-green-400",
  used: "bg-gray-500/20 text-gray-400",
  cancelled: "bg-red-500/20 text-red-400",
};

export default function MyTicketsPage() {
  const [email, setEmail] = useState("");
  const [tickets, setTickets] = useState<TicketRow[] | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [qrImage, setQrImage] = useState<string | null>(null);
  const [qrLoading, setQrLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setTickets(null);
    try {
      const res = await axios.get(`${BACKENDURL}/api/tickets/lookup`, {
        params: { email },
      });
      setTickets(res.data.tickets || []);
    } catch (err) {
      console.error(err);
      setError("Failed to look up tickets. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const viewQR = async (ticketId: string) => {
    setQrLoading(true);
    setQrImage(null);
    try {
      const res = await axios.get(
        `${BACKENDURL}/api/tickets/${ticketId}/qr`
      );
      setQrImage(res.data.qrImage);
    } catch (err) {
      console.error(err);
    } finally {
      setQrLoading(false);
    }
  };

  return (
    <div className="bg-black text-white min-h-screen font-sans flex flex-col">
      <Navbar />

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 sm:px-6 py-12">
        <h1 className="text-2xl md:text-3xl font-bold mb-2 flex items-center gap-2">
          <TicketIcon className="w-7 h-7 text-pink-400" />
          My Tickets
        </h1>
        <p className="text-gray-400 mb-6 text-sm">
          Enter the email you used at checkout to find your tickets.
        </p>

        <form onSubmit={handleSearch} className="flex gap-2 mb-8">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="flex-1 px-4 py-3 rounded-lg bg-white/5 border border-gray-700/50 text-white placeholder-gray-500 focus:outline-none focus:border-pink-400 focus:ring-2 focus:ring-pink-400/40"
          />
          <button
            type="submit"
            disabled={loading}
            className="px-5 py-3 bg-gradient-to-r from-pink-400 to-cyan-400 text-white font-semibold rounded-lg flex items-center gap-2 disabled:opacity-50"
          >
            <Search className="w-5 h-5" />
            {loading ? "Searching..." : "Find"}
          </button>
        </form>

        {error && <p className="text-red-400 text-sm mb-4">{error}</p>}

        {tickets && tickets.length === 0 && (
          <p className="text-gray-400 text-sm">
            No tickets found for that email.
          </p>
        )}

        {tickets && tickets.length > 0 && (
          <ul className="space-y-4">
            {tickets.map((ticket) => (
              <li
                key={ticket._id}
                className="bg-white/5 border border-gray-700/50 rounded-xl p-4 flex items-center gap-4"
              >
                {ticket.event?.image && (
                  <Image
                    src={optimizedImage(ticket.event.image, "thumb")}
                    alt={ticket.event.title}
                    width={64}
                    height={64}
                    className="rounded-lg object-cover w-16 h-16"
                  />
                )}
                <div className="flex-1 min-w-0">
                  <p className="font-semibold truncate">
                    {ticket.event?.title || "Unknown event"}
                  </p>
                  <p className="text-sm text-gray-400">
                    {ticket.ticketType} · {ticket.ticketId}
                  </p>
                  <span
                    className={`inline-block mt-1 px-2 py-0.5 rounded-full text-xs font-medium ${statusStyles[ticket.status]}`}
                  >
                    {ticket.status}
                  </span>
                </div>
                <button
                  onClick={() => viewQR(ticket.ticketId)}
                  className="px-3 py-2 text-sm border border-pink-400 text-pink-400 rounded-lg hover:bg-pink-400/20 transition"
                >
                  View QR
                </button>
              </li>
            ))}
          </ul>
        )}
      </main>

      {(qrLoading || qrImage) && (
        <div
          className="fixed inset-0 bg-black/80 flex items-center justify-center z-50 p-4"
          onClick={() => setQrImage(null)}
        >
          <div
            className="bg-white rounded-xl p-6 relative max-w-xs w-full text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setQrImage(null)}
              className="absolute top-3 right-3 text-gray-500 hover:text-black"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            {qrLoading ? (
              <p className="text-black py-10">Loading QR...</p>
            ) : (
              qrImage && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={qrImage}
                  alt="Ticket QR code"
                  width={240}
                  height={240}
                  className="mx-auto"
                />
              )
            )}
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
