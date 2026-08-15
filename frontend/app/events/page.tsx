import type { Metadata } from "next";
import EventsPageClient from "./EventsPageClient";

export const metadata: Metadata = {
  title: "All Events",
  description:
    "Browse every upcoming party and event on FUNAAB Party. Find yours and get your tickets in seconds.",
  alternates: {
    canonical: "/events",
  },
};

export default function EventsPage() {
  return <EventsPageClient />;
}
