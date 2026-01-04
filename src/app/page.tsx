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
          <div className="md:col-span-8 grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Al-Kahf */}
            <Link href="/sources/quran/surah-al-kahf" className="relative group overflow-hidden rounded-[24px] bg-emerald-50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-900/20 p-6 flex flex-col justify-center hover:bg-emerald-100 dark:hover:bg-emerald-900/20 transition-all">
              <h3 className="font-bold text-lg text-emerald-800 dark:text-emerald-400 mb-1">{isAr ? 'سورة الكهف' : 'Surah Al-Kahf'}</h3>
              <p className="text-xs text-emerald-600/80">{isAr ? 'نور ما بين الجمعتين' : 'Friday Sunnah'}</p>
              <BookOpen className="absolute bottom-4 right-4 w-12 h-12 text-emerald-200 dark:text-emerald-800 opacity-20 group-hover:scale-110 transition-transform" />
            </Link>
            {/* Al-Mulk */}
            <Link href="/sources/quran/surah-al-mulk" className="relative group overflow-hidden rounded-[24px] bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20 p-6 flex flex-col justify-center hover:bg-blue-100 dark:hover:bg-blue-900/20 transition-all">
              <h3 className="font-bold text-lg text-blue-800 dark:text-blue-400 mb-1">{isAr ? 'سورة الملك' : 'Surah Al-Mulk'}</h3>
              <p className="text-xs text-blue-600/80">{isAr ? 'المنجية من عذاب القبر' : 'Protection from Grave'}</p>
              <Moon className="absolute bottom-4 right-4 w-12 h-12 text-blue-200 dark:text-blue-800 opacity-20 group-hover:scale-110 transition-transform" />
            </Link>
            {/* Last 10 */}
            <Link href="/sources/quran" className="relative group overflow-hidden rounded-[24px] bg-amber-50 dark:bg-amber-900/10 border border-amber-100 dark:border-amber-900/20 p-6 flex flex-col justify-center hover:bg-amber-100 dark:hover:bg-amber-900/20 transition-all">
              <h3 className="font-bold text-lg text-amber-800 dark:text-amber-400 mb-1">{isAr ? 'قصار السور' : 'Last 10 Surahs'}</h3>
              <p className="text-xs text-amber-600/80">{isAr ? 'للحفظ والمراجعة' : 'Easy to Memorize'}</p>
              <Sun className="absolute bottom-4 right-4 w-12 h-12 text-amber-200 dark:text-amber-800 opacity-20 group-hover:scale-110 transition-transform" />
            </Link>
          </div>

          {/* 3. Main Adhkar Entry */}
          <Link href="/adhkar" className="md:col-span-4 relative overflow-hidden rounded-[32px] bg-white dark:bg-neutral-900 border border-border/50 p-8 flex flex-col justify-between hover:shadow-lg transition-all group">
            <div>
              <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 flex items-center justify-center mb-4 text-slate-600">
                <BookOpen className="w-5 h-5" />
              </div>
              <h2 className="text-2xl font-bold mb-2">{t.nav.adhkar}</h2>
              <p className="text-muted-foreground text-sm">{t.home_cards.adhkar_desc}</p>
            </div>
            <div className="mt-4 flex justify-end text-emerald-600">
              <span className="group-hover:translate-x-1 transition-transform rtl:group-hover:-translate-x-1">→</span>
            </div>
          </Link>

          {/* 4. Duas & Sources (Small) */}
          <Link href="/duas" className="md:col-span-6 relative overflow-hidden rounded-[32px] bg-white dark:bg-neutral-900 border border-border/50 p-8 flex items-center gap-6 hover:bg-slate-50 dark:hover:bg-neutral-800/50 transition-all">
            <div className="p-4 rounded-full bg-blue-50 text-blue-600 dark:bg-blue-900/20">
              <Sun className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">{t.nav.duas}</h3>
              <p className="text-sm text-muted-foreground line-clamp-1">{t.home_cards.duas_desc}</p>
            </div>
          </Link>

          <Link href="/sources" className="md:col-span-6 relative overflow-hidden rounded-[32px] bg-white dark:bg-neutral-900 border border-border/50 p-8 flex items-center gap-6 hover:bg-slate-50 dark:hover:bg-neutral-800/50 transition-all">
            <div className="p-4 rounded-full bg-amber-50 text-amber-600 dark:bg-amber-900/20">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold">{t.nav.sources}</h3>
              <p className="text-sm text-muted-foreground line-clamp-1">{t.home_cards.sources_desc}</p>
            </div>
          </Link>

        </div>

      </div >
    </main >
  );
}
