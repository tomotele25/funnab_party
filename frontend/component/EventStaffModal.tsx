"use client";

import { useEffect, useState, useCallback } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import toast from "react-hot-toast";
import { UserPlus, Trash2, ScanLine } from "lucide-react";
import Loader from "@/component/Loader";

const BACKENDURL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface StaffRow {
  _id: string;
  user: { fullname: string; email: string } | null;
}

export default function EventStaffModal({
  eventId,
  eventTitle,
  onClose,
}: {
  eventId: string;
  eventTitle: string;
  onClose: () => void;
}) {
  const { data: session } = useSession();
  const [staff, setStaff] = useState<StaffRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState("");
  const [adding, setAdding] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);

  const authHeaders = useCallback(
    () => ({ headers: { Authorization: `Bearer ${session?.user?.accessToken}` } }),
    [session]
  );

  const fetchStaff = useCallback(() => {
    if (!session?.user?.accessToken) return;
    setLoading(true);
    axios
      .get(`${BACKENDURL}/api/event-staff/${eventId}`, authHeaders())
      .then((res) => setStaff(res.data.staff || []))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [eventId, session, authHeaders]);

  useEffect(() => {
    fetchStaff();
  }, [fetchStaff]);

  const handleAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    setAdding(true);
    try {
      await axios.post(
        `${BACKENDURL}/api/event-staff`,
        { eventId, email: email.trim() },
        authHeaders()
      );
      toast.success("Staff added — they can now scan tickets for this event.");
      setEmail("");
      fetchStaff();
    } catch (err) {
      toast.error(
        axios.isAxiosError(err)
          ? err.response?.data?.message || "Failed to add staff"
          : "Failed to add staff"
      );
    } finally {
      setAdding(false);
    }
  };

  const handleRemove = async (staffId: string) => {
    setRemovingId(staffId);
    try {
      await axios.delete(`${BACKENDURL}/api/event-staff/${staffId}`, authHeaders());
      setStaff((prev) => prev.filter((s) => s._id !== staffId));
      toast.success("Staff removed");
    } catch (err) {
      toast.error(
        axios.isAxiosError(err)
          ? err.response?.data?.message || "Failed to remove staff"
          : "Failed to remove staff"
      );
    } finally {
      setRemovingId(null);
    }
  };

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/50 backdrop-blur-md z-50 p-4"
      onClick={onClose}
    >
      <div
        className="card-surface w-full max-w-md p-6 relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
          aria-label="Close"
        >
          ✕
        </button>

        <h2
          className="text-lg font-bold mb-1 flex items-center gap-2"
          style={{ fontFamily: "var(--font-space-grotesk)" }}
        >
          <ScanLine className="w-5 h-5 text-[var(--color-accent)]" />
          Scan Staff
        </h2>
        <p className="text-xs text-[var(--color-text-muted)] mb-4 truncate">
          People who can check in tickets for &ldquo;{eventTitle}&rdquo;.
        </p>

        <form onSubmit={handleAdd} className="flex gap-2 mb-4">
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="staff@example.com"
            className="flex-1 min-w-0 border border-[var(--color-border)] bg-[var(--color-surface-2)] p-2.5 rounded-[var(--radius-btn)] text-[var(--color-text)] text-sm focus:ring-2 focus:ring-[var(--color-primary)] focus:outline-none"
          />
          <button
            type="submit"
            disabled={adding}
            className="btn-aurora px-3 py-2 flex items-center gap-1.5 text-sm font-medium disabled:opacity-50 shrink-0"
          >
            {adding ? <Loader /> : <UserPlus className="w-4 h-4" />}
            Add
          </button>
        </form>
        <p className="text-xs text-[var(--color-text-muted)] mb-4">
          They need an existing FUNAAB Party account with this email.
        </p>

        {loading ? (
          <div className="space-y-2">
            {[1, 2].map((i) => (
              <div key={i} className="h-12 bg-[var(--color-surface-2)] rounded-lg animate-pulse" />
            ))}
          </div>
        ) : staff.length === 0 ? (
          <p className="text-sm text-[var(--color-text-muted)] text-center py-6">
            No scan staff added yet — just you.
          </p>
        ) : (
          <ul className="space-y-2 max-h-64 overflow-y-auto">
            {staff.map((s) => (
              <li
                key={s._id}
                className="flex items-center justify-between gap-2 p-3 rounded-[var(--radius-btn)] border border-[var(--color-border)] bg-[var(--color-surface-2)]"
              >
                <div className="min-w-0">
                  <p className="text-sm font-medium truncate">
                    {s.user?.fullname || "Unknown user"}
                  </p>
                  <p className="text-xs text-[var(--color-text-muted)] truncate">
                    {s.user?.email}
                  </p>
                </div>
                <button
                  onClick={() => handleRemove(s._id)}
                  disabled={removingId === s._id}
                  className="shrink-0 rounded-[var(--radius-btn)] p-2 text-[var(--color-error)] hover:bg-[var(--color-error)]/15 transition disabled:opacity-50"
                  aria-label="Remove staff"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
