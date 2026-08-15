"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import toast from "react-hot-toast";
import { Wallet, CheckCircle2 } from "lucide-react";

const BACKENDURL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface PayoutSummaryRow {
  organizerId: string;
  organizer: { fullname: string; email: string } | null;
  amountOwed: number;
  transactionCount: number;
}

interface PayoutRecord {
  _id: string;
  organizer: { fullname: string; email: string } | null;
  amount: number;
  transactions: string[];
  note: string;
  paidBy: { fullname: string; email: string } | null;
  createdAt: string;
}

export default function AdminPayoutsPage() {
  const { data: session } = useSession();
  const [summary, setSummary] = useState<PayoutSummaryRow[]>([]);
  const [payouts, setPayouts] = useState<PayoutRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [payingOut, setPayingOut] = useState<string | null>(null);

  const authHeaders = useCallback(
    () => ({
      headers: { Authorization: `Bearer ${session?.user?.accessToken}` },
    }),
    [session]
  );

  const fetchData = useCallback(async () => {
    if (!session?.user?.accessToken) return;
    setLoading(true);
    try {
      const [summaryRes, payoutsRes] = await Promise.all([
        axios.get(`${BACKENDURL}/api/admin/payouts/summary`, authHeaders()),
        axios.get(`${BACKENDURL}/api/admin/payouts`, authHeaders()),
      ]);
      setSummary(summaryRes.data.summary);
      setPayouts(payoutsRes.data.payouts);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [session, authHeaders]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handlePayout = async (organizerId: string) => {
    setPayingOut(organizerId);
    try {
      await axios.post(
        `${BACKENDURL}/api/admin/payouts`,
        { organizerId },
        authHeaders()
      );
      toast.success("Payout recorded — remember to send the actual bank transfer.");
      fetchData();
    } catch (err) {
      console.error(err);
      toast.error(
        axios.isAxiosError(err)
          ? err.response?.data?.message || "Failed to record payout"
          : "Failed to record payout"
      );
    } finally {
      setPayingOut(null);
    }
  };

  return (
    <div>
      <h1
        className="text-2xl font-bold text-[var(--color-text)] mb-1"
        style={{ fontFamily: "var(--font-space-grotesk)" }}
      >
        Payouts
      </h1>
      <p className="text-[var(--color-text-muted)] text-sm mb-6">
        Organizers keep the full ticket price. Marking a payout here records
        it as paid — it does not move money; send the bank transfer yourself
        first.
      </p>

      <section className="mb-10">
        <h2 className="text-lg font-semibold text-[var(--color-text)] mb-3">
          Outstanding Balances
        </h2>
        {loading ? (
          <div className="card-surface h-32 animate-pulse" />
        ) : summary.length === 0 ? (
          <div className="card-surface p-8 text-center text-[var(--color-text-muted)]">
            <Wallet className="w-8 h-8 mx-auto mb-2 opacity-60" />
            No outstanding balances.
          </div>
        ) : (
          <div className="card-surface overflow-x-auto">
            <table className="w-full min-w-[600px] text-sm">
              <thead>
                <tr className="text-left text-[var(--color-text-muted)] border-b border-[var(--color-border)]">
                  <th className="p-4 font-medium">Organizer</th>
                  <th className="p-4 font-medium">Transactions</th>
                  <th className="p-4 font-medium">Amount Owed</th>
                  <th className="p-4 font-medium"></th>
                </tr>
              </thead>
              <tbody>
                {summary.map((row) => (
                  <tr
                    key={row.organizerId}
                    className="border-b border-[var(--color-border)] last:border-0"
                  >
                    <td className="p-4">
                      <p className="font-medium text-[var(--color-text)]">
                        {row.organizer?.fullname || "Unknown organizer"}
                      </p>
                      <p className="text-xs text-[var(--color-text-muted)]">
                        {row.organizer?.email}
                      </p>
                    </td>
                    <td className="p-4 text-[var(--color-text-muted)]">
                      {row.transactionCount}
                    </td>
                    <td className="p-4 font-semibold text-[var(--color-text)]">
                      ₦{row.amountOwed.toLocaleString()}
                    </td>
                    <td className="p-4 text-right">
                      <button
                        onClick={() => handlePayout(row.organizerId)}
                        disabled={payingOut === row.organizerId}
                        className="btn-aurora px-4 py-2 text-xs font-medium disabled:opacity-50"
                      >
                        {payingOut === row.organizerId
                          ? "Recording..."
                          : "Mark as Paid"}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <section>
        <h2 className="text-lg font-semibold text-[var(--color-text)] mb-3">
          Payout History
        </h2>
        {loading ? (
          <div className="card-surface h-32 animate-pulse" />
        ) : payouts.length === 0 ? (
          <div className="card-surface p-8 text-center text-[var(--color-text-muted)]">
            No payouts recorded yet.
          </div>
        ) : (
          <div className="card-surface overflow-x-auto">
            <table className="w-full min-w-[600px] text-sm">
              <thead>
                <tr className="text-left text-[var(--color-text-muted)] border-b border-[var(--color-border)]">
                  <th className="p-4 font-medium">Organizer</th>
                  <th className="p-4 font-medium">Amount</th>
                  <th className="p-4 font-medium">Paid By</th>
                  <th className="p-4 font-medium">Date</th>
                </tr>
              </thead>
              <tbody>
                {payouts.map((p) => (
                  <tr
                    key={p._id}
                    className="border-b border-[var(--color-border)] last:border-0"
                  >
                    <td className="p-4 text-[var(--color-text)]">
                      {p.organizer?.fullname || "Unknown organizer"}
                    </td>
                    <td className="p-4 flex items-center gap-1.5 font-semibold text-[var(--color-success)]">
                      <CheckCircle2 className="w-4 h-4" />₦
                      {p.amount.toLocaleString()}
                    </td>
                    <td className="p-4 text-[var(--color-text-muted)]">
                      {p.paidBy?.fullname || "—"}
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
    </div>
  );
}
