"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import axios from "axios";
import { Users, Mail, Phone } from "lucide-react";

const BACKENDURL = process.env.NEXT_PUBLIC_BACKEND_URL;

interface OrganizerRow {
  _id: string;
  fullname: string;
  email: string;
  phoneNumber: string;
}

const initialsOf = (name: string) =>
  name
    .split(" ")
    .map((n) => n[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

export default function AdminOrganizersPage() {
  const { data: session } = useSession();
  const [organizers, setOrganizers] = useState<OrganizerRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!session?.user?.accessToken) return;

    axios
      .get(`${BACKENDURL}/api/admin/organizers`, {
        headers: { Authorization: `Bearer ${session.user.accessToken}` },
      })
      .then((res) => setOrganizers(res.data.organizers))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [session]);

  return (
    <div>
      <h1
        className="text-2xl font-bold text-[var(--color-text)] mb-1"
        style={{ fontFamily: "var(--font-space-grotesk)" }}
      >
        Organizers
      </h1>
      <p className="text-[var(--color-text-muted)] text-sm mb-6">
        Everyone with permission to create and manage events.
      </p>

      {loading ? (
        <div className="card-surface p-4 space-y-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-[var(--color-surface-2)] rounded-lg animate-pulse" />
          ))}
        </div>
      ) : organizers.length === 0 ? (
        <div className="card-surface p-10 text-center">
          <Users className="w-10 h-10 mx-auto mb-3 text-[var(--color-text-muted)]" />
          <p className="text-[var(--color-text-muted)]">No organizers yet.</p>
        </div>
      ) : (
        <div className="card-surface overflow-hidden">
          <table className="w-full text-sm text-left">
            <thead className="bg-[var(--color-surface-2)] text-[var(--color-text-muted)] text-xs uppercase tracking-wide">
              <tr>
                <th className="p-4">Organizer</th>
                <th className="p-4">Email</th>
                <th className="p-4">Phone</th>
              </tr>
            </thead>
            <tbody>
              {organizers.map((org) => (
                <tr
                  key={org._id}
                  className="border-t border-[var(--color-border)] hover:bg-[var(--color-surface-2)]/60 transition"
                >
                  <td className="p-4">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full gradient-aurora text-white text-xs font-bold flex items-center justify-center shrink-0">
                        {initialsOf(org.fullname)}
                      </div>
                      <span className="font-medium text-[var(--color-text)]">
                        {org.fullname}
                      </span>
                    </div>
                  </td>
                  <td className="p-4 text-[var(--color-text-muted)]">
                    <span className="flex items-center gap-1.5">
                      <Mail className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                      {org.email}
                    </span>
                  </td>
                  <td className="p-4 text-[var(--color-text-muted)]">
                    <span className="flex items-center gap-1.5">
                      <Phone className="w-3.5 h-3.5 text-[var(--color-text-muted)]" />
                      {org.phoneNumber}
                    </span>
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
