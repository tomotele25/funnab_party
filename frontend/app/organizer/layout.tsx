"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { signOut, useSession } from "next-auth/react";
import crownLogo from "../../public/crown-icon.png";
import {
  LayoutDashboard,
  Calendar,
  BarChart3,
  ScanLine,
  UserCircle,
  LogOut,
  Menu,
} from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "loading") return;
    if (!session || !session.user?.isOrganizer) {
      router.push("/login");
    }
  }, [session, status, router]);

  const navLinks = [
    {
      name: "Dashboard",
      href: "/organizer",
      icon: <LayoutDashboard size={18} />,
    },
    {
      name: "Events",
      href: "/organizer/manageEvents",
      icon: <Calendar size={18} />,
    },
    {
      name: "Analytics",
      href: "/organizer/analytics",
      icon: <BarChart3 size={18} />,
    },
    { name: "Scan", href: "/organizer/scan", icon: <ScanLine size={18} /> },
    {
      name: "Profile",
      href: "/organizer/profile",
      icon: <UserCircle size={18} />,
    },
  ];

  if (status === "loading" || !session || !session.user?.isOrganizer) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[var(--color-bg)] text-[var(--color-text-muted)]">
        Checking access...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[var(--color-bg)]">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-52 bg-[var(--color-surface)] border-r border-[var(--color-border)] shadow-md transform transition-transform duration-300 z-20
          ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
      >
        <div className="flex flex-col h-full justify-between">
          <div>
            {/* Brand */}
            <div className="p-4 border-b border-[var(--color-border)] flex items-center gap-2">
              <div className="w-8 h-8 relative border border-[var(--color-accent)]/30 rounded-full bg-[var(--color-surface-2)] p-1">
                <Image
                  src={crownLogo}
                  alt="Funaab Party crown logo"
                  fill
                  className="object-contain grayscale"
                />
              </div>
              <h1
                className="text-lg font-bold text-[var(--color-text)]"
                style={{ fontFamily: "var(--font-space-grotesk)" }}
              >
                Organizer
              </h1>
            </div>

            {/* Navigation */}
            <nav className="p-4">
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="flex items-center gap-2 text-[var(--color-text-muted)] hover:text-[var(--color-text)] font-medium p-2 rounded-[var(--radius-btn)] hover:bg-[var(--color-surface-2)] transition"
                    >
                      {link.icon}
                      <span className="text-sm">{link.name}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Logout */}
          <div className="p-4 border-t border-[var(--color-border)]">
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 btn-aurora text-sm"
            >
              <LogOut size={18} />
              Logout
            </button>
          </div>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 md:ml-52 flex flex-col">
        {/* Fixed Header */}
        <header className="fixed top-0 right-0 left-0 md:left-52 bg-[var(--color-surface)] border-b border-[var(--color-border)] p-4 shadow z-10 flex items-center justify-between">
          {/* Page title */}
          <h2
            className="text-lg font-bold text-[var(--color-text)]"
            style={{ fontFamily: "var(--font-space-grotesk)" }}
          >
            Dashboard
          </h2>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 rounded-[var(--radius-btn)] border border-[var(--color-border)]"
            >
              <Menu size={20} />
            </button>
            {/* Profile avatar */}
            <Link
              href="/organizer/profile"
              className="w-8 h-8 rounded-full gradient-aurora flex items-center justify-center text-xs font-semibold text-white"
              title={session.user?.name || session.user?.email || "Profile"}
            >
              {(session.user?.name || session.user?.email || "?")
                .charAt(0)
                .toUpperCase()}
            </Link>
          </div>
        </header>

        {/* Page body (add padding for fixed header) */}
        <main className="p-4 flex-1 pt-20">{children}</main>
      </div>
    </div>
  );
}
