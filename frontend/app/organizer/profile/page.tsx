"use client";

import { useSession, signOut } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Mail, Shield, LogOut, User } from "lucide-react";

export default function OrganizerProfilePage() {
  const { data: session } = useSession();
  const router = useRouter();

  const initials = session?.user?.fullname
    ?.split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

  return (
    <div className="max-w-lg">
      <h1
        className="text-2xl font-bold text-[var(--color-text)] mb-6"
        style={{ fontFamily: "var(--font-space-grotesk)" }}
      >
        Profile
      </h1>

      <div className="card-surface overflow-hidden">
        <div className="gradient-aurora p-6 flex items-center gap-4">
          <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur flex items-center justify-center text-white text-xl font-bold border-2 border-white/40">
            {initials || <User className="w-7 h-7" />}
          </div>
          <div>
            <p className="text-white font-bold text-lg">
              {session?.user?.fullname || "—"}
            </p>
            <span className="inline-block mt-1 px-2 py-0.5 bg-white/20 text-white text-xs rounded-full">
              Organizer
            </span>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[var(--color-surface-2)] flex items-center justify-center text-[var(--color-text-muted)]">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-muted)]">Email</p>
              <p className="text-sm font-medium text-[var(--color-text)]">
                {session?.user?.email || "—"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-[var(--color-surface-2)] flex items-center justify-center text-[var(--color-text-muted)]">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-[var(--color-text-muted)]">Account Type</p>
              <p className="text-sm font-medium text-[var(--color-text)]">Organizer</p>
            </div>
          </div>
        </div>

        <div className="p-6 pt-0">
          <button
            onClick={async () => {
              await signOut({ redirect: false });
              router.push("/login");
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-[var(--color-error)]/30 text-[var(--color-error)] rounded-[var(--radius-btn)] font-medium hover:bg-[var(--color-error)]/10 transition"
          >
            <LogOut className="w-4 h-4" />
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
