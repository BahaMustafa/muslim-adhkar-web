import type { Metadata } from "next";
import { Geist, Geist_Mono, Amiri } from "next/font/google";
import { cookies } from "next/headers";
import "./globals.css";
import { LanguageProvider } from "@/lib/language-context";
import translations from "@/lib/translations.json";
import CommandPalette from "@/components/search/CommandPalette";
import { Footer } from "@/components/layout/Footer";
import { Header } from "@/components/layout/Header";
import Analytics from "@/components/Analytics";
import { BottomNav } from "@/components/layout/BottomNav";

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

import { constructMetadata } from "@/components/SEO";

export async function generateMetadata(): Promise<Metadata> {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("NEXT_LOCALE")?.value || "en") as "en" | "ar";
  const t = translations[lang];

  return constructMetadata({
    title: lang === 'ar' ? "أذكار وأدعية يومية" : "Daily Adhkar & Duas", // Builder appends site name
    description: lang === 'ar' ? t.home_hero_subtitle : "Comprehensive collection of authentic Adhkar, Duas, and Hadith sources.",
    path: "/",
    lang: lang
  });
}

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("NEXT_LOCALE")?.value || "en") as "en" | "ar";

  return (
    <html lang={lang}>
      <body
        className={`${geistSans.variable} ${geistMono.variable} ${amiri.variable} antialiased min-h-screen bg-white text-gray-900 flex flex-col`}
        data-lang={lang}
      >
        <LanguageProvider initialLang={lang}>
          <Analytics />
          <CommandPalette />
          <Header />
          <div className="flex-1 pb-16 md:pb-0">
            {children}
          </div>
          <Footer />
          <BottomNav />
        </LanguageProvider>
      </body>
    </html>
  );
}
