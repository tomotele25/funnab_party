"use client";

import { useState } from "react";
import Link from "next/link";
import { signOut } from "next-auth/react";
import { Calendar, Ticket, Settings, LogOut, Menu } from "lucide-react";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navLinks = [
    {
      name: "Dashboard",
      href: "/organizer/dashboard",
    },
    { name: "Events", href: "/organizer/events", icon: <Calendar size={18} /> },
    { name: "Tickets", href: "/organizer/tickets", icon: <Ticket size={18} /> },
    {
      name: "Settings",
      href: "/organizer/settings",
      icon: <Settings size={18} />,
    },
  ];

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
            {/* Header / Brand */}
            <div className="p-4 border-b">
              <h1 className="text-xl font-bold text-black">Admin</h1>
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

          {/* Logout button */}
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
      <div className="flex-1 md:ml-52">
        {/* Top bar for mobile */}
        <header className="flex items-center justify-between bg-white p-3 shadow md:hidden">
          <h2 className="text-lg font-bold">Organizer</h2>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-md border border-gray-300"
          >
            <Menu size={20} />
          </button>
        </header>

        <main className="p-4">{children}</main>
      </div>
    </div>
  );
}
