"use client";

import { useSearchParams } from "next/navigation";
import { useEffect, useState, Suspense } from "react";
import Link from "next/link";
import axios from "axios";
import {
  CheckCircle2,
  XCircle,
  Mail,
  Ticket as TicketIcon,
  Home,
} from "lucide-react";
import Navbar from "@/component/Navbar";
import Footer from "@/component/Footer";

const BACKENDURL = process.env.NEXT_PUBLIC_BACKEND_URL;

type VerifyState = "loading" | "success" | "error";

interface TicketInfo {
  ticketId: string;
  ticketType: string;
  buyerEmail: string;
}

function PaymentPageContent() {
  const searchParams = useSearchParams();
  const reference = searchParams.get("reference");
  const [state, setState] = useState<VerifyState>("loading");
  const [message, setMessage] = useState("");
  const [ticket, setTicket] = useState<TicketInfo | null>(null);

  useEffect(() => {
    const verifyPayment = async () => {
      if (!reference) {
        setState("error");
        setMessage("No payment reference found in the URL.");
        return;
      }

      try {
        const res = await axios.get(`${BACKENDURL}/api/payment/verify`, {
          params: { reference },
        });

        if (res.data?.ticket) {
          setState("success");
          setTicket(res.data.ticket);
        } else {
          setState("error");
          setMessage(res.data?.message || "Payment verification failed.");
        }
      } catch (error) {
        console.error(error);
        setState("error");
        setMessage(
          axios.isAxiosError(error) && error.response?.data?.message
            ? error.response.data.message
            : "Something went wrong while verifying your payment."
        );
      }
    };

    verifyPayment();
  }, [reference]);

  return (
    <div className="flex min-h-screen flex-col bg-[var(--color-bg)] font-sans text-[var(--color-text)]">
      <Navbar />

      <main className="flex flex-1 items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          {state === "loading" && (
            <div className="card-surface p-8 text-center">
              <div className="mx-auto mb-5 h-12 w-12 animate-spin rounded-full border-4 border-[var(--color-primary)] border-t-transparent" />
              <h1 className="mb-2 text-xl font-bold">Verifying your payment</h1>
              <p className="text-sm text-[var(--color-text-muted)]">
                Hang tight, this only takes a moment...
              </p>
            </div>
          )}

          {state === "success" && ticket && (
            <div className="relative overflow-hidden rounded-[var(--radius-card)] border border-[var(--color-success)]/30 bg-[var(--color-surface)] p-8 text-center">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.15),transparent_70%)]" />

              <div className="relative">
                <CheckCircle2 className="mx-auto mb-4 h-16 w-16 text-[var(--color-success)]" />
                <h1 className="mb-2 text-2xl font-bold">You&apos;re going! 🎉</h1>
                <p className="mb-6 text-sm text-[var(--color-text-muted)]">
                  Your payment was successful and your ticket is confirmed.
                </p>

                <div className="mb-6 space-y-2 rounded-[var(--radius-card)] border border-[var(--color-border)] bg-[var(--color-surface-2)] p-4 text-left">
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--color-text-muted)]">Ticket ID</span>
                    <span className="font-mono">{ticket.ticketId}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-[var(--color-text-muted)]">Ticket Type</span>
                    <span>{ticket.ticketType}</span>
                  </div>
                </div>

                <div className="mb-6 flex items-start gap-2 rounded-[var(--radius-btn)] border border-[var(--color-accent)]/30 bg-[var(--color-accent)]/10 p-3 text-left">
                  <Mail className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-accent)]" />
                  <p className="text-xs text-[var(--color-text-muted)]">
                    Your ticket with a scannable QR code has been emailed to{" "}
                    <span className="font-medium text-[var(--color-text)]">
                      {ticket.buyerEmail}
                    </span>
                    . Show it at the entrance to be checked in.
                  </p>
                </div>

                <div className="flex flex-col gap-3 sm:flex-row">
                  <Link
                    href="/tickets"
                    className="btn-aurora flex flex-1 items-center justify-center gap-2 px-4 py-3 font-semibold"
                  >
                    <TicketIcon className="h-4 w-4" />
                    View My Tickets
                  </Link>
                  <Link
                    href="/"
                    className="flex flex-1 items-center justify-center gap-2 rounded-[var(--radius-btn)] border border-[var(--color-border)] px-4 py-3 font-semibold text-[var(--color-text)] transition-colors duration-300 hover:bg-white/5"
                  >
                    <Home className="h-4 w-4" />
                    Back Home
                  </Link>
                </div>
              </div>
            </div>
          )}

          {state === "error" && (
            <div className="card-surface border-[var(--color-error)]/30 p-8 text-center">
              <XCircle className="mx-auto mb-4 h-16 w-16 text-[var(--color-error)]" />
              <h1 className="mb-2 text-2xl font-bold">Payment Not Verified</h1>
              <p className="mb-6 text-sm text-[var(--color-text-muted)]">{message}</p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 rounded-[var(--radius-btn)] border border-[var(--color-border)] px-6 py-3 font-semibold text-[var(--color-text)] transition-colors duration-300 hover:bg-white/5"
              >
                <Home className="h-4 w-4" />
                Back Home
              </Link>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}

export default function PaymentPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-screen items-center justify-center bg-[var(--color-bg)]">
          <div className="h-12 w-12 animate-spin rounded-full border-4 border-[var(--color-primary)] border-t-transparent" />
        </div>
      }
    >
      <PaymentPageContent />
    </Suspense>
  );
}
