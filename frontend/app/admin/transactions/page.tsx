"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import toast from "react-hot-toast";
import { Receipt } from "lucide-react";

const BACKENDURL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface TransactionRow {
  _id: string;
  eventId: string;
  ticketType: string;
  amount: number;
  status: string;
  userName: string;
  userEmail: string;
  paystackReference: string;
  splitDetails?: { organizerAmount?: number; platformFee?: number };
  createdAt: string;
}

export default function AdminTransactionsPage() {
  const { data: session } = useSession();
  const [transactions, setTransactions] = useState<TransactionRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [refundingId, setRefundingId] = useState<string | null>(null);

  useEffect(() => {
    if (!session?.user?.accessToken) return;

    axios
      .get(`${BACKENDURL}/api/admin/transactions`, {
        headers: { Authorization: `Bearer ${session.user.accessToken}` },
      })
      .then((res) => setTransactions(res.data.transactions))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [session]);

  const handleRefund = async (tx: TransactionRow) => {
    if (!session?.user?.accessToken) return;
    if (
      !confirm(
        `Refund ₦${tx.amount.toLocaleString()} to ${tx.userEmail}? This cannot be undone.`
      )
    ) {
      return;
    }

    setRefundingId(tx._id);
    try {
      await axios.post(
        `${BACKENDURL}/api/admin/transactions/${tx._id}/refund`,
        {},
        { headers: { Authorization: `Bearer ${session.user.accessToken}` } }
      );
      setTransactions((prev) =>
        prev.map((t) => (t._id === tx._id ? { ...t, status: "refunded" } : t))
      );
      toast.success("Refund initiated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to initiate refund");
    } finally {
      setRefundingId(null);
    }
  };

  return (
    <div>
      <h1
        className="text-2xl font-bold text-[var(--color-text)] mb-1"
        style={{ fontFamily: "var(--font-space-grotesk)" }}
      >
        Transactions
      </h1>
      <p className="text-[var(--color-text-muted)] text-sm mb-6">
        All ticket purchases processed on the platform.
      </p>

      {loading ? (
        <div className="card-surface p-4 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-14 bg-[var(--color-surface-2)] rounded-lg animate-pulse" />
          ))}
        </div>
      ) : transactions.length === 0 ? (
        <div className="card-surface p-10 text-center">
          <Receipt className="w-10 h-10 mx-auto mb-3 text-[var(--color-text-muted)]" />
          <p className="text-[var(--color-text-muted)]">No transactions yet.</p>
        </div>
      ) : (
        <div className="card-surface overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-[var(--color-surface-2)] text-[var(--color-text-muted)] text-xs uppercase tracking-wide">
              <tr>
                <th className="p-4">Reference</th>
                <th className="p-4">Buyer</th>
                <th className="p-4">Amount</th>
                <th className="p-4">Platform Fee</th>
                <th className="p-4">Status</th>
                <th className="p-4">Date</th>
                <th className="p-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx) => (
                <tr
                  key={tx._id}
                  className="border-t border-[var(--color-border)] hover:bg-[var(--color-surface-2)]/60 transition"
                >
                  <td className="p-4 text-[var(--color-text-muted)] font-mono text-xs">
                    {tx.paystackReference}
                  </td>
                  <td className="p-4 text-[var(--color-text-muted)]">
                    <p className="text-[var(--color-text)] font-medium">{tx.userName}</p>
                    <span className="text-xs text-[var(--color-text-muted)]">
                      {tx.userEmail}
                    </span>
                  </td>
                  <td className="p-4 text-[var(--color-text)] font-semibold">
                    ₦{tx.amount.toLocaleString()}
                  </td>
                  <td className="p-4 text-[var(--color-text-muted)]">
                    {tx.splitDetails?.platformFee
                      ? `₦${tx.splitDetails.platformFee.toLocaleString()}`
                      : "—"}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-2 py-1 rounded-[var(--radius-pill)] text-xs font-medium ${
                        tx.status === "success"
                          ? "bg-[var(--color-success)]/15 text-[var(--color-success)]"
                          : tx.status === "failed"
                          ? "bg-[var(--color-error)]/15 text-[var(--color-error)]"
                          : tx.status === "refunded"
                          ? "bg-[var(--color-primary)]/15 text-[var(--color-primary)]"
                          : "bg-[var(--color-warning)]/15 text-[var(--color-warning)]"
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td className="p-4 text-[var(--color-text-muted)]">
                    {new Date(tx.createdAt).toLocaleDateString()}
                  </td>
                  <td className="p-4">
                    {tx.status === "success" && (
                      <button
                        onClick={() => handleRefund(tx)}
                        disabled={refundingId === tx._id}
                        className="text-xs text-[var(--color-error)] hover:underline disabled:opacity-50"
                      >
                        {refundingId === tx._id ? "Refunding..." : "Refund"}
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
