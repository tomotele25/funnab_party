import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";
import { Providers } from "./providers";
import PageLoader from "@/component/PageLoader";
import { CartProvider } from "@/context/CartContext";
const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  weight: ["400", "500", "700"],
});

const jetMono = JetBrains_Mono({
  variable: "--font-jet-mono",
  subsets: ["latin"],
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const SITE_URL = "https://funaabparty.com";
const SITE_DESCRIPTION =
  "Find the hottest parties and events, get your tickets in seconds, and show up. An event ticketing platform powered by Chowspace.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "FUNAAB Party — Discover. Get Tickets. Show Up.",
    template: "%s | FUNAAB Party",
  },
  description: SITE_DESCRIPTION,
  robots: {
    index: true,
    follow: true,
  },
  icons: {
    icon: "/icon.png",
    apple: "/apple-icon.png",
  },
  openGraph: {
    siteName: "FUNAAB Party",
    type: "website",
    locale: "en_NG",
    url: "/",
    title: "FUNAAB Party — Discover. Get Tickets. Show Up.",
    description: SITE_DESCRIPTION,
    images: [
      {
        url: "/og-default.png",
        width: 1200,
        height: 630,
        alt: "FUNAAB Party",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "FUNAAB Party — Discover. Get Tickets. Show Up.",
    description: SITE_DESCRIPTION,
    images: ["/og-default.png"],
  },
};

export const viewport: Viewport = {
  themeColor: "#0b0a10",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body
        className={`${inter.variable} ${jetMono.variable} ${spaceGrotesk.variable} antialiased`}
      >
        <PageLoader />
        <CartProvider>
          <Providers>{children}</Providers>
        </CartProvider>
      </body>
    </html>
  );
}
