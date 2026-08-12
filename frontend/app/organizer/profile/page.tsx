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
      <h1 className="text-2xl font-bold text-black mb-6">Profile</h1>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="bg-gradient-to-r from-pink-400 to-cyan-400 p-6 flex items-center gap-4">
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
            <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500">
              <Mail className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Email</p>
              <p className="text-sm font-medium text-black">
                {session?.user?.email || "—"}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gray-50 flex items-center justify-center text-gray-500">
              <Shield className="w-4 h-4" />
            </div>
            <div>
              <p className="text-xs text-gray-500">Account Type</p>
              <p className="text-sm font-medium text-black">Organizer</p>
            </div>
          </div>
        </div>

        <div className="p-6 pt-0">
          <button
            onClick={async () => {
              await signOut({ redirect: false });
              router.push("/login");
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-red-200 text-red-600 rounded-lg font-medium hover:bg-red-50 transition"
          >
            <LogOut className="w-4 h-4" />
            Log Out
          </button>
        </div>
      </div>
    </div>
  );
}
