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
    <div className="bg-black text-white min-h-screen font-sans flex flex-col">
      <Navbar />

      <main className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">
          {state === "loading" && (
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-gray-700/50 text-center">
              <div className="w-12 h-12 mx-auto mb-5 border-4 border-t-transparent border-pink-400 rounded-full animate-spin" />
              <h1 className="text-xl font-bold mb-2">Verifying your payment</h1>
              <p className="text-gray-400 text-sm">
                Hang tight, this only takes a moment...
              </p>
            </div>
          )}

          {state === "success" && ticket && (
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-green-500/30 text-center relative overflow-hidden">
              <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(34,197,94,0.15),transparent_70%)]" />

              <div className="relative">
                <CheckCircle2 className="w-16 h-16 mx-auto mb-4 text-green-400" />
                <h1 className="text-2xl font-bold mb-2">You&apos;re going! 🎉</h1>
                <p className="text-gray-300 text-sm mb-6">
                  Your payment was successful and your ticket is confirmed.
                </p>

                <div className="bg-black/40 rounded-xl border border-gray-700/50 p-4 mb-6 text-left space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Ticket ID</span>
                    <span className="font-mono text-white">{ticket.ticketId}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Ticket Type</span>
                    <span className="text-white">{ticket.ticketType}</span>
                  </div>
                </div>

                <div className="flex items-start gap-2 bg-pink-400/10 border border-pink-400/30 rounded-lg p-3 mb-6 text-left">
                  <Mail className="w-4 h-4 text-pink-400 mt-0.5 shrink-0" />
                  <p className="text-xs text-gray-300">
                    Your ticket with a scannable QR code has been emailed to{" "}
                    <span className="text-white font-medium">
                      {ticket.buyerEmail}
                    </span>
                    . Show it at the entrance to be checked in.
                  </p>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                  <Link
                    href="/tickets"
                    className="flex-1 px-4 py-3 bg-gradient-to-r from-pink-400 to-cyan-400 text-white font-semibold rounded-lg flex items-center justify-center gap-2 hover:scale-105 transition-all"
                  >
                    <TicketIcon className="w-4 h-4" />
                    View My Tickets
                  </Link>
                  <Link
                    href="/"
                    className="flex-1 px-4 py-3 border border-gray-700 text-gray-300 font-semibold rounded-lg flex items-center justify-center gap-2 hover:bg-white/5 transition-all"
                  >
                    <Home className="w-4 h-4" />
                    Back Home
                  </Link>
                </div>
              </div>
            </div>
          )}

          {state === "error" && (
            <div className="bg-white/5 backdrop-blur-xl rounded-2xl p-8 border border-red-500/30 text-center">
              <XCircle className="w-16 h-16 mx-auto mb-4 text-red-400" />
              <h1 className="text-2xl font-bold mb-2">Payment Not Verified</h1>
              <p className="text-gray-400 text-sm mb-6">{message}</p>
              <Link
                href="/"
                className="inline-flex items-center gap-2 px-6 py-3 border border-gray-700 text-gray-300 font-semibold rounded-lg hover:bg-white/5 transition-all"
              >
                <Home className="w-4 h-4" />
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
        <div className="bg-black text-white min-h-screen flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-t-transparent border-pink-400 rounded-full animate-spin" />
        </div>
      }
    >
      <PaymentPageContent />
    </Suspense>
  );
}
