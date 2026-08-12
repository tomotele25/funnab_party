"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import {
  Wallet,
  PiggyBank,
  Ticket as TicketIcon,
  Calendar,
} from "lucide-react";

const BACKENDURL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface Totals {
  totalRevenue: number;
  totalPlatformFee: number;
  successfulTransactions: number;
  totalEvents: number;
  totalTickets: number;
}

export default function AdminDashboard() {
  const { data: session } = useSession();
  const [totals, setTotals] = useState<Totals | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!session?.user?.accessToken) return;

    const fetchTotals = async () => {
      try {
        const res = await axios.get(`${BACKENDURL}/api/admin/totals`, {
          headers: { Authorization: `Bearer ${session.user.accessToken}` },
        });
        setTotals(res.data);
      } catch (err) {
        console.error(err);
        setError("Failed to load platform totals.");
      } finally {
        setLoading(false);
      }
    };

    fetchTotals();
  }, [session]);

  const cards = totals
    ? [
        {
          label: "Total Revenue",
          value: `₦${totals.totalRevenue.toLocaleString()}`,
          icon: <Wallet className="w-5 h-5" />,
          accent: "text-pink-600 bg-pink-50",
        },
        {
          label: "Platform Fees Collected",
          value: `₦${totals.totalPlatformFee.toLocaleString()}`,
          icon: <PiggyBank className="w-5 h-5" />,
          accent: "text-green-600 bg-green-50",
        },
        {
          label: "Tickets Issued",
          value: totals.totalTickets.toLocaleString(),
          icon: <TicketIcon className="w-5 h-5" />,
          accent: "text-cyan-600 bg-cyan-50",
        },
        {
          label: "Total Events",
          value: totals.totalEvents.toLocaleString(),
          icon: <Calendar className="w-5 h-5" />,
          accent: "text-purple-600 bg-purple-50",
        },
      ]
    : [];

  return (
    <div>
      <h1 className="text-2xl font-bold text-black mb-1">Dashboard</h1>
      <p className="text-gray-500 text-sm mb-6">
        Platform-wide performance at a glance.
      </p>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 text-sm rounded-xl p-4 mb-6">
          {error}
        </div>
      )}

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 h-24 animate-pulse"
            />
          ))}
        </div>
      ) : (
        !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {cards.map((card) => (
              <div
                key={card.label}
                className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center gap-4"
              >
                <div
                  className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${card.accent}`}
                >
                  {card.icon}
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-gray-500 truncate">{card.label}</p>
                  <p className="text-lg font-bold text-black">{card.value}</p>
                </div>
              </div>
            ))}
          </div>
        )
      )}
    </div>
  );
}
