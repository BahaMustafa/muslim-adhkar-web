import type { Metadata } from "next";
import { Geist, Geist_Mono, Amiri } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const amiri = Amiri({
  variable: "--font-amiri",
  subsets: ["arabic"],
  weight: ["400", "700"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Muslim Adhkar - Daily Adhkar & Duas",
  description: "Comprehensive collection of authentic Adhkar, Duas, and Hadith sources.",
  metadataBase: new URL("https://muslimadhkar.com"),
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: "Muslim Adhkar",
    description: "Daily Adhkar and Duas from authentic sources.",
    type: "website",
  },
  manifest: '/manifest.json',
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
};

import CommandPalette from "@/components/search/CommandPalette";
import { Footer } from "@/components/layout/Footer";

import { Header } from "@/components/layout/Header";
import Analytics from "@/components/Analytics";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${amiri.variable} antialiased min-h-screen bg-white text-gray-900 flex flex-col`}
      >
        <Analytics />
        <CommandPalette />
        <Header />
        <div className="flex-1">
          {children}
        </div>
        <Footer />
      </body>
    </html>
  );
}
