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
      <div className="min-h-screen flex items-center justify-center bg-gray-100 text-gray-500">
        Checking access...
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      {/* Sidebar */}
      <aside
        className={`fixed inset-y-0 left-0 w-52 bg-white border-r shadow-md transform transition-transform duration-300 z-20
          ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
      >
        <div className="flex flex-col h-full justify-between">
          <div>
            {/* Brand */}
            <div className="p-4 border-b flex items-center gap-2">
              <div className="w-8 h-8 relative border border-pink-200 rounded-full bg-white p-1">
                <Image
                  src={crownLogo}
                  alt="Funaab Party crown logo"
                  fill
                  className="object-contain"
                />
              </div>
              <h1 className="text-lg font-bold text-black">Organizer</h1>
            </div>

            {/* Navigation */}
            <nav className="p-4">
              <ul className="space-y-2">
                {navLinks.map((link) => (
                  <li key={link.name}>
                    <Link
                      href={link.href}
                      className="flex items-center gap-2 text-gray-700 hover:text-black font-medium p-2 rounded-md hover:bg-gray-100 transition"
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
          <div className="p-4 border-t">
            <button
              onClick={() => signOut({ callbackUrl: "/login" })}
              className="w-full flex items-center justify-center gap-2 px-3 py-2 bg-black text-white rounded hover:bg-gray-800 transition text-sm"
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
        <header className="fixed top-0 right-0 left-0 md:left-52 bg-white p-4 shadow z-10 flex items-center justify-between">
          {/* Page title */}
          <h2 className="text-lg font-bold text-black">Dashboard</h2>

          {/* Right side */}
          <div className="flex items-center gap-3">
            {/* Mobile menu button */}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden p-2 rounded-md border border-gray-300"
            >
              <Menu size={20} />
            </button>
            {/* Dummy profile avatar */}
            <div className="w-8 h-8 rounded-full bg-gray-300" />
          </div>
        </header>

        {/* Page body (add padding for fixed header) */}
        <main className="p-4 flex-1 pt-20">{children}</main>
      </div>
    </div>
  );
}
