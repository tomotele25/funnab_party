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
  valid: "bg-[var(--color-success)]/20 text-[var(--color-success)]",
  used: "bg-white/10 text-[var(--color-text-muted)]",
  cancelled: "bg-[var(--color-error)]/20 text-[var(--color-error)]",
};

export default function TicketsPageClient() {
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
    <div className="flex min-h-screen flex-col bg-[var(--color-bg)] font-sans text-[var(--color-text)]">
      <Navbar />

      <main className="mx-auto w-full max-w-2xl flex-1 px-4 py-12 sm:px-6">
        <h1 className="mb-2 flex items-center gap-2 text-2xl font-bold md:text-3xl">
          <TicketIcon className="h-7 w-7 text-[var(--color-accent)]" />
          My Tickets
        </h1>
        <p className="mb-6 text-sm text-[var(--color-text-muted)]">
          Enter the email you used at checkout to find your tickets.
        </p>

        <form onSubmit={handleSearch} className="mb-8 flex gap-2">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            className="flex-1 rounded-[var(--radius-btn)] border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-3 text-[var(--color-text)] placeholder-[var(--color-text-muted)] focus:border-[var(--color-primary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40"
          />
          <button
            type="submit"
            disabled={loading}
            className="btn-aurora flex items-center gap-2 px-5 py-3 font-semibold disabled:opacity-50"
          >
            <Search className="h-5 w-5" />
            {loading ? "Searching..." : "Find"}
          </button>
        </form>

        {error && (
          <p className="mb-4 text-sm text-[var(--color-error)]">{error}</p>
        )}

        {tickets && tickets.length === 0 && (
          <p className="text-sm text-[var(--color-text-muted)]">
            No tickets found for that email.
          </p>
        )}

        {tickets && tickets.length > 0 && (
          <ul className="space-y-4">
            {tickets.map((ticket) => (
              <li key={ticket._id} className="card-surface flex items-center gap-4 p-4">
                {ticket.event?.image && (
                  <Image
                    src={optimizedImage(ticket.event.image, "thumb")}
                    alt={ticket.event.title}
                    width={64}
                    height={64}
                    className="h-16 w-16 rounded-[var(--radius-btn)] object-cover"
                  />
                )}
                <div className="min-w-0 flex-1">
                  <p className="truncate font-semibold">
                    {ticket.event?.title || "Unknown event"}
                  </p>
                  <p className="text-sm text-[var(--color-text-muted)]">
                    {ticket.ticketType} · {ticket.ticketId}
                  </p>
                  <span
                    className={`mt-1 inline-block rounded-[var(--radius-pill)] px-2 py-0.5 text-xs font-medium ${statusStyles[ticket.status]}`}
                  >
                    {ticket.status}
                  </span>
                </div>
                <button
                  onClick={() => viewQR(ticket.ticketId)}
                  className="rounded-[var(--radius-btn)] border border-[var(--color-primary)] px-3 py-2 text-sm text-[var(--color-primary)] transition hover:bg-[var(--color-primary)]/20"
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
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
          onClick={() => setQrImage(null)}
        >
          <div
            className="relative w-full max-w-xs rounded-[var(--radius-card)] bg-white p-6 text-center"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setQrImage(null)}
              className="absolute right-3 top-3 text-gray-500 hover:text-black"
              aria-label="Close"
            >
              <X className="h-5 w-5" />
            </button>
            {qrLoading ? (
              <p className="py-10 text-black">Loading QR...</p>
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
