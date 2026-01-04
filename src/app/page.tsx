import Image from "next/image";
import Link from "next/link";
import { HomeSearchTrigger } from "@/components/search/HomeSearchTrigger";
import { cookies } from 'next/headers';
import translations from '@/lib/translations.json';
import { getRecommendedAdhkar } from "@/lib/utils";
import { BookOpen, Moon, Sun, Clock, Sparkles } from "lucide-react";
import { HomePrayerRibbon } from "@/components/prayer/HomePrayerRibbon";

export default async function Home() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("NEXT_LOCALE")?.value || "en") as "en" | "ar";
  const t = translations[lang] || translations.en;
  const arrow = lang === 'ar' ? '←' : '→';
  const isAr = lang === 'ar';

  const recommended = getRecommendedAdhkar();

  const hour = new Date().getHours();
  let greeting = isAr ? 'السلام عليكم' : 'As-salamu alaykum';
  if (hour < 12) greeting = isAr ? 'صباح الخير' : 'Good Morning';
  else if (hour < 18) greeting = isAr ? 'مساء الخير' : 'Good Afternoon';
  else greeting = isAr ? 'طابت ليلتكم' : 'Good Evening';

  return (
    <main className="min-h-screen relative overflow-hidden bg-gray-50 dark:bg-black selection:bg-emerald-500/30">

      {/* Pattern Background */}
      <div
        className="absolute inset-0 pointer-events-none z-0 opacity-[0.03] dark:opacity-[0.05]"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2310b981' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-background z-0 pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 md:py-16">

        {/* Dynamic Hero Section */}
        <div className="flex flex-col items-center justify-center text-center mb-12 animate-in fade-in zoom-in-95 duration-700">
          <span className="text-emerald-600 font-medium mb-2 tracking-wide uppercase text-xs md:text-sm">{greeting}</span>
          <h1 className="text-4xl md:text-6xl font-bold mb-8 tracking-tight text-foreground">
            <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              {t.branding.name}
            </span>
          </h1>

          {/* Smart Adhkar Button */}
          <Link href={recommended.href} className="group relative inline-flex items-center gap-3 px-8 py-4 bg-emerald-600 text-white rounded-full text-lg font-semibold shadow-lg shadow-glow hover:bg-emerald-700 hover:scale-105 transition-all duration-300">
            <Sparkles className="w-5 h-5 animate-pulse" />
            <span>{isAr ? recommended.label_ar : recommended.label}</span>
            <div className="absolute inset-0 rounded-full ring-2 ring-white/20 group-hover:ring-white/40 transition-all" />
          </Link>

          <div className="mt-8 w-full max-w-md scale-100 hover:scale-[1.01] transition-transform duration-300 relative z-20">
            <HomeSearchTrigger />
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[minmax(160px,auto)]">

          {/* 1. Prayer Times Ribbon (Top Priority) */}
          <Link href="/prayer-times" className="group md:col-span-12 relative overflow-hidden rounded-[32px] border border-border/50 bg-gradient-to-r from-slate-900 to-slate-800 text-white p-8 flex flex-col md:flex-row items-center justify-between shadow-xl hover:shadow-2xl transition-all hover:-translate-y-1">
            <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-5 mix-blend-overlay" />
            <HomePrayerRibbon />
          </Link>

          {/* 2. Quran Quick Access */}
          <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-6">
            {/* Al-Kahf */}
            <Link href="/sources/quran/surah-al-kahf" className="relative group overflow-hidden rounded-[32px] bg-gradient-to-br from-[#8FB9A8] to-[#C3DED6] p-8 flex flex-col justify-between h-56 hover:shadow-lg transition-all hover:scale-[1.02]">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white">
                <BookOpen className="w-5 h-5" />
              </div>
              <div className="relative z-10">
                <h3 className="font-bold text-2xl text-white leading-tight mb-1">{isAr ? 'سورة الكهف' : 'Surah Al-Kahf'}</h3>
                <p className="text-white/80 text-sm font-medium">{isAr ? 'نور ما بين الجمعتين' : 'Friday Sunnah'}</p>
              </div>
              {/* Islamic Pattern Overlay */}
              <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10 mix-blend-overlay" />
            </Link>

            {/* Al-Mulk */}
            <Link href="/sources/quran/surah-al-mulk" className="relative group overflow-hidden rounded-[32px] bg-gradient-to-br from-[#A8AED1] to-[#D5D8E8] p-8 flex flex-col justify-between h-56 hover:shadow-lg transition-all hover:scale-[1.02]">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white">
                <Moon className="w-5 h-5" />
              </div>
              <div className="relative z-10">
                <h3 className="font-bold text-2xl text-white leading-tight mb-1">{isAr ? 'سورة الملك' : 'Surah Al-Mulk'}</h3>
                <p className="text-white/80 text-sm font-medium">{isAr ? 'المنجية من عذاب القبر' : 'Protection from Grave'}</p>
              </div>
              <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10 mix-blend-overlay" />
            </Link>

            {/* Last 10 */}
            <Link href="/sources/quran" className="relative group overflow-hidden rounded-[32px] bg-gradient-to-br from-[#DBC0B8] to-[#EEE0DC] p-8 flex flex-col justify-between h-56 hover:shadow-lg transition-all hover:scale-[1.02]">
              <div className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 backdrop-blur-sm text-white">
                <Sun className="w-5 h-5" />
              </div>
              <div className="relative z-10">
                <h3 className="font-bold text-2xl text-white leading-tight mb-1">{isAr ? 'قصار السور' : 'Last 10 Surahs'}</h3>
                <p className="text-white/80 text-sm font-medium">{isAr ? 'للحفظ والمراجعة' : 'Easy to Memorize'}</p>
              </div>
              <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10 mix-blend-overlay" />
            </Link>
          </div>

          {/* 3. Main Adhkar Entry */}
          <Link href="/adhkar" className="md:col-span-4 relative overflow-hidden rounded-[32px] bg-[#0c2e28] border border-emerald-800/30 p-8 flex flex-col justify-between hover:scale-[1.02] transition-all duration-300 group">
            {/* Authentic Islamic Geometric Pattern (8-Point Star Interlock) */}
            <div className="absolute inset-0 opacity-[0.15] pointer-events-none"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='%2310b981' stroke-width='1.5'%3E%3Cpath d='M0 40L20 20 40 40V20L20 0 0 20z' opacity='.5'/%3E%3Cpath d='M20 40L40 20 20 0 0 20z' opacity='.5'/%3E%3Ccircle cx='20' cy='20' r='6'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}
            />

            <div className="relative z-10 flex items-start justify-between">
              <div className="w-14 h-14 rounded-2xl bg-emerald-500/10 backdrop-blur-md border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
                <BookOpen className="w-7 h-7" />
              </div>
              <div className="w-8 h-8 rounded-full border border-emerald-500/30 flex items-center justify-center text-emerald-500 opacity-0 group-hover:opacity-100 transition-opacity">
                <span className="rtl:rotate-180">→</span>
              </div>
            </div>

            <div className="relative z-10 mt-8">
              <h2 className="text-3xl font-bold text-emerald-50 mb-2 tracking-wide">{t.nav.adhkar}</h2>
              <p className="text-emerald-200/60 text-sm leading-relaxed">{t.home_cards.adhkar_desc}</p>
            </div>
          </Link>

          {/* 4. Duas & Sources (Small) */}
          <Link href="/duas" className="md:col-span-4 relative overflow-hidden rounded-[32px] bg-[#0f172a] border border-blue-800/30 p-8 flex flex-col justify-between hover:scale-[1.02] transition-all duration-300 group">
            {/* Islamic Floral/Geo Pattern */}
            <div className="absolute inset-0 opacity-[0.12] pointer-events-none"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='50' height='50' viewBox='0 0 50 50' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg stroke='%233b82f6' stroke-width='1'%3E%3Cpath d='M25 0l25 25-25 25L0 25z'/%3E%3Cpath d='M25 10l15 15-15 15-15-15z'/%3E%3Cpath d='M25 0v50M0 25h50' stroke-opacity='.3'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}
            />

            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 backdrop-blur-md border border-blue-500/20 flex items-center justify-center text-blue-400 group-hover:bg-blue-500/20 transition-colors mb-6">
                <Sun className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-blue-50 mb-1">{t.nav.duas}</h3>
              <p className="text-blue-200/60 text-sm line-clamp-2">{t.home_cards.duas_desc}</p>
            </div>
          </Link>

          <Link href="/sources" className="md:col-span-4 relative overflow-hidden rounded-[32px] bg-[#271c19] border border-amber-800/30 p-8 flex flex-col justify-between hover:scale-[1.02] transition-all duration-300 group">
            {/* Hexagonal Islamic Pattern */}
            <div className="absolute inset-0 opacity-[0.15] pointer-events-none"
              style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='30' height='52' viewBox='0 0 30 52' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' stroke='%23f59e0b' stroke-width='1'%3E%3Cpath d='M15 1L29 9v16L15 33 1 25V9z'/%3E%3Cpath d='M15 51L1 43V27l14-8 14 8v16z'/%3E%3C/g%3E%3C/svg%3E")` }}
            />

            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-amber-500/10 backdrop-blur-md border border-amber-500/20 flex items-center justify-center text-amber-400 group-hover:bg-amber-500/20 transition-colors mb-6">
                <BookOpen className="w-7 h-7" />
              </div>
              <h3 className="text-2xl font-bold text-amber-50 mb-1">{t.nav.sources}</h3>
              <p className="text-amber-200/60 text-sm line-clamp-2">{t.home_cards.sources_desc}</p>
            </div>
          </Link>

        </div>

      </div >
    </main >
  );
}
