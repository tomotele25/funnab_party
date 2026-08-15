import type { Metadata } from "next";
import HomePageClient from "./HomePageClient";

export const metadata: Metadata = {
  title: "FUNAAB Party — Discover. Get Tickets. Show Up.",
  description:
    "Find the hottest parties, raves, and campus events near you. Get your tickets in seconds and show up. An event ticketing platform powered by Chowspace.",
  alternates: {
    canonical: "/",
  },
};

export default function Home() {
  return <HomePageClient />;
}
