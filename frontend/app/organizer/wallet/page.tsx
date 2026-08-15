"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import {
  Wallet,
  CheckCircle2,
  Clock,
  Info,
  Ticket as TicketIcon,
} from "lucide-react";

const BACKENDURL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface RecentTransaction {
  _id: string;
  eventTitle: string;
  ticketType: string;
  quantity: number;
  amount: number;
  payoutStatus: "unpaid" | "paid";
  createdAt: string;
}

interface PayoutRecord {
  _id: string;
  amount: number;
  note: string;
  createdAt: string;
}

interface WalletData {
  totalEarned: number;
  paidOut: number;
  pending: number;
  recentTransactions: RecentTransaction[];
  payoutHistory: PayoutRecord[];
}

export default function OrganizerWalletPage() {
  const { data: session } = useSession();
  const [wallet, setWallet] = useState<WalletData | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchWallet = useCallback(() => {
    if (!session?.user?.accessToken) return;
    setLoading(true);
    axios
      .get(`${BACKENDURL}/api/my-wallet`, {
        headers: { Authorization: `Bearer ${session.user.accessToken}` },
      })
      .then((res) => setWallet(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [session]);

  useEffect(() => {
    fetchWallet();
  }, [fetchWallet]);

  if (loading || !wallet) {
    return (
      <div className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="card-surface h-28 animate-pulse" />
          ))}
        </div>
        <div className="card-surface h-64 animate-pulse" />
      </div>
    );
  }

  return (
    <div>
      <h1
        className="text-2xl font-bold text-[var(--color-text)] mb-1 flex items-center gap-2"
        style={{ fontFamily: "var(--font-space-grotesk)" }}
      >
        <Wallet className="w-6 h-6 text-[var(--color-accent)]" />
        Wallet
      </h1>
      <p className="text-[var(--color-text-muted)] text-sm mb-6">
        What you&apos;ve earned from ticket sales, and what&apos;s still
        owed to you.
      </p>

      {/* Stat cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <div className="card-surface p-5">
          <p className="text-xs text-[var(--color-text-muted)] mb-1">
            Total Earned
          </p>
          <p className="text-2xl font-bold text-[var(--color-text)]">
            ₦{wallet.totalEarned.toLocaleString()}
          </p>
        </div>
        <div className="card-surface p-5">
          <p className="text-xs text-[var(--color-text-muted)] mb-1 flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-[var(--color-success)]" />
            Already Paid Out
          </p>
          <p className="text-2xl font-bold text-[var(--color-success)]">
            ₦{wallet.paidOut.toLocaleString()}
          </p>
        </div>
        <div className="card-surface p-5">
          <p className="text-xs text-[var(--color-text-muted)] mb-1 flex items-center gap-1">
            <Clock className="w-3.5 h-3.5 text-[var(--color-urgency)]" />
            Pending Payout
          </p>
          <p className="text-2xl font-bold text-[var(--color-urgency)]">
            ₦{wallet.pending.toLocaleString()}
          </p>
        </div>
      </div>

      {/* Explainer */}
      <div className="flex gap-2 bg-[var(--color-secondary)]/10 border border-[var(--color-secondary)]/30 text-[var(--color-text-muted)] text-xs rounded-[var(--radius-card)] p-3 mb-8">
        <Info className="w-4 h-4 shrink-0 mt-0.5 text-[var(--color-secondary)]" />
        <p>
          Payouts are sent manually by the FUNAAB Party team — there&apos;s
          no fixed payout date yet. The pending amount above is what you&apos;re
          currently owed; it moves to &ldquo;Paid Out&rdquo; once a transfer
          is sent and recorded, and shows up in your Payout History below.
        </p>
      </div>

      {/* Payout history */}
      <section className="mb-8">
        <h2 className="text-lg font-semibold text-[var(--color-text)] mb-3">
          Payout History
        </h2>
        {wallet.payoutHistory.length === 0 ? (
          <div className="card-surface p-8 text-center text-[var(--color-text-muted)]">
            No payouts recorded yet.
          </div>
        ) : (
          <div className="card-surface overflow-x-auto">
            <table className="w-full min-w-[500px] text-sm">
              <thead>
                <tr className="text-left text-[var(--color-text-muted)] border-b border-[var(--color-border)]">
                  <th className="p-4 font-medium">Amount</th>
                  <th className="p-4 font-medium">Note</th>
                  <th className="p-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {wallet.payoutHistory.map((p) => (
                  <tr
                    key={p._id}
                    className="border-b border-[var(--color-border)] last:border-0"
                  >
                    <td className="p-4 font-semibold text-[var(--color-success)]">
                      ₦{p.amount.toLocaleString()}
                    </td>
                    <td className="p-4 text-[var(--color-text-muted)]">
                      {p.note || "—"}
                    </td>
                    <td className="p-4 text-[var(--color-text-muted)]">
                      {new Date(p.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      {/* Recent sales */}
      <section>
        <h2 className="text-lg font-semibold text-[var(--color-text)] mb-3">
          Recent Sales
        </h2>
        {wallet.recentTransactions.length === 0 ? (
          <div className="card-surface p-8 text-center text-[var(--color-text-muted)]">
            <TicketIcon className="w-8 h-8 mx-auto mb-2 opacity-60" />
            No ticket sales yet.
          </div>
        ) : (
          <div className="card-surface overflow-x-auto">
            <table className="w-full min-w-[600px] text-sm">
              <thead>
                <tr className="text-left text-[var(--color-text-muted)] border-b border-[var(--color-border)]">
                  <th className="p-4 font-medium">Event</th>
                  <th className="p-4 font-medium">Ticket</th>
                  <th className="p-4 font-medium">Qty</th>
                  <th className="p-4 font-medium">You Earned</th>
                  <th className="p-4 font-medium">Status</th>
                  <th className="p-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {wallet.recentTransactions.map((t) => (
                  <tr
                    key={t._id}
                    className="border-b border-[var(--color-border)] last:border-0"
                  >
                    <td className="p-4 text-[var(--color-text)]">
                      {t.eventTitle}
                    </td>
                    <td className="p-4 text-[var(--color-text-muted)]">
                      {t.ticketType}
                    </td>
                    <td className="p-4 text-[var(--color-text-muted)]">
                      {t.quantity}
                    </td>
                    <td className="p-4 font-semibold text-[var(--color-text)]">
                      ₦{t.amount.toLocaleString()}
                    </td>
                    <td className="p-4">
                      <span
                        className={`inline-block px-2 py-0.5 rounded-[var(--radius-pill)] text-xs font-medium ${
                          t.payoutStatus === "paid"
                            ? "bg-[var(--color-success)]/15 text-[var(--color-success)]"
                            : "bg-[var(--color-urgency)]/15 text-[var(--color-urgency)]"
                        }`}
                      >
                        {t.payoutStatus === "paid" ? "Paid" : "Pending"}
                      </span>
                    </td>
                    <td className="p-4 text-[var(--color-text-muted)]">
                      {new Date(t.createdAt).toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
}
