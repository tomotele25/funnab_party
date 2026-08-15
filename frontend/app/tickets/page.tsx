import type { Metadata } from "next";
import TicketsPageClient from "./TicketsPageClient";

export const metadata: Metadata = {
  title: "My Tickets",
  description: "Look up and view your FUNAAB Party tickets by email.",
  robots: {
    index: false,
    follow: false,
  },
};

export default function MyTicketsPage() {
  return <TicketsPageClient />;
}
