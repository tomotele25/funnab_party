"use client";

import { useEffect, useState, type ReactNode } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import toast from "react-hot-toast";
import { Settings as SettingsIcon, Percent, Banknote, AlertTriangle } from "lucide-react";

const BACKENDURL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface Settings {
  feeType: "flat" | "percentage" | "hybrid";
  percentageValue: number;
  flatValue: number;
}

const FEE_TYPES: { value: Settings["feeType"]; label: string; icon: ReactNode }[] = [
  { value: "percentage", label: "Percentage", icon: <Percent className="w-4 h-4" /> },
  { value: "flat", label: "Flat", icon: <Banknote className="w-4 h-4" /> },
  { value: "hybrid", label: "Hybrid", icon: <SettingsIcon className="w-4 h-4" /> },
];

export default function AdminSettingsPage() {
  const { data: session } = useSession();
  const [settings, setSettings] = useState<Settings | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!session?.user?.accessToken) return;

    axios
      .get(`${BACKENDURL}/api/admin/settings`, {
        headers: { Authorization: `Bearer ${session.user.accessToken}` },
      })
      .then((res) => setSettings(res.data.settings))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [session]);

  const handleSave = async () => {
    if (!settings || !session?.user?.accessToken) return;
    setSaving(true);
    try {
      const res = await axios.put(
        `${BACKENDURL}/api/admin/settings`,
        settings,
        {
          headers: { Authorization: `Bearer ${session.user.accessToken}` },
        }
      );
      setSettings(res.data.settings);
      toast.success("Platform fee settings updated");
    } catch (err) {
      console.error(err);
      toast.error("Failed to update settings");
    } finally {
      setSaving(false);
    }
  };

  if (loading || !settings) {
    return (
      <div className="max-w-lg">
        <div className="card-surface h-80 animate-pulse" />
      </div>
    );
  }

  return (
    <div className="max-w-lg">
      <h1
        className="text-2xl font-bold text-[var(--color-text)] mb-1"
        style={{ fontFamily: "var(--font-space-grotesk)" }}
      >
        Platform Fee Settings
      </h1>
      <p className="text-[var(--color-text-muted)] text-sm mb-6">
        Configure how much FUNAABParty takes from each ticket sale.
      </p>

      <div className="card-surface p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-[var(--color-text)] mb-2">
            Fee Type
          </label>
          <div className="grid grid-cols-3 gap-2 bg-[var(--color-surface-2)] p-1 rounded-[var(--radius-btn)]">
            {FEE_TYPES.map((ft) => (
              <button
                key={ft.value}
                type="button"
                onClick={() => setSettings({ ...settings, feeType: ft.value })}
                className={`flex flex-col items-center gap-1 py-2.5 rounded-lg text-xs font-medium transition ${
                  settings.feeType === ft.value
                    ? "bg-[var(--color-surface)] text-[var(--color-text)] shadow-sm"
                    : "text-[var(--color-text-muted)] hover:text-[var(--color-text)]"
                }`}
              >
                {ft.icon}
                {ft.label}
              </button>
            ))}
          </div>
        </div>

        {(settings.feeType === "percentage" || settings.feeType === "hybrid") && (
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Percentage (%)
            </label>
            <div className="relative">
              <input
                type="number"
                value={settings.percentageValue}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    percentageValue: Number(e.target.value),
                  })
                }
                className="w-full border border-[var(--color-border)] bg-[var(--color-surface-2)] p-2.5 pr-9 rounded-[var(--radius-btn)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 focus:border-[var(--color-primary)]"
              />
              <Percent className="w-4 h-4 text-[var(--color-text-muted)] absolute right-3 top-1/2 -translate-y-1/2" />
            </div>
          </div>
        )}

        {(settings.feeType === "flat" || settings.feeType === "hybrid") && (
          <div>
            <label className="block text-sm font-medium text-[var(--color-text)] mb-1">
              Flat Fee (₦)
            </label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[var(--color-text-muted)] text-sm">₦</span>
              <input
                type="number"
                value={settings.flatValue}
                onChange={(e) =>
                  setSettings({ ...settings, flatValue: Number(e.target.value) })
                }
                className="w-full border border-[var(--color-border)] bg-[var(--color-surface-2)] p-2.5 pl-8 rounded-[var(--radius-btn)] text-[var(--color-text)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]/40 focus:border-[var(--color-primary)]"
              />
            </div>
          </div>
        )}

        <div className="flex gap-2 bg-[var(--color-warning)]/10 border border-[var(--color-warning)]/30 text-[var(--color-warning)] text-xs rounded-[var(--radius-card)] p-3">
          <AlertTriangle className="w-4 h-4 shrink-0 mt-0.5" />
          <p>
            Paystack subaccounts only natively enforce a percentage-based fee
            at settlement (applied automatically to new events created after
            this change). Flat/hybrid fee values are recorded for reporting
            on the Transactions page, but are not automatically deducted by
            Paystack.
          </p>
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full btn-aurora py-2.5 font-medium disabled:opacity-50"
        >
          {saving ? "Saving..." : "Save Settings"}
        </button>
      </div>
    </div>
  );
}
