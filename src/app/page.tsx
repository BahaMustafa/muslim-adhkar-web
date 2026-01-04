import Image from "next/image";
import Link from "next/link";
import { HomeSearchTrigger } from "@/components/search/HomeSearchTrigger";
import { cookies } from 'next/headers';
import translations from '@/lib/translations.json';

export default async function Home() {
  const cookieStore = await cookies();
  const lang = (cookieStore.get("NEXT_LOCALE")?.value || "en") as "en" | "ar";
  const t = translations[lang] || translations.en;
  const arrow = lang === 'ar' ? '←' : '→';
  const isAr = lang === 'ar';

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

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 md:py-20">

        {/* Hero Section */}
        <div className="flex flex-col items-center justify-center text-center mb-16 md:mb-24 animate-in fade-in zoom-in-95 duration-700">
          <div className="relative w-32 h-32 md:w-40 md:h-40 mb-8 drop-shadow-2xl">
            <Image
              src="/logo.png"
              alt="Muslim Adhkar Logo"
              fill
              className="object-contain"
              priority
            />
          </div>

          <h1 className="text-5xl md:text-7xl font-bold mb-6 tracking-tight">
            <span className="bg-gradient-to-r from-emerald-600 via-teal-500 to-emerald-600 bg-clip-text text-transparent bg-[length:200%_auto] animate-gradient">
              {t.branding.name}
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-muted-foreground max-w-2xl leading-relaxed font-light">
            {t.home_hero_subtitle}
          </p>

          <div className="mt-10 w-full max-w-md scale-100 hover:scale-[1.02] transition-transform duration-300">
            <HomeSearchTrigger />
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 auto-rows-[minmax(180px,auto)]">

          {/* Adhkar Card - Large */}
          <Link href="/adhkar" className="group md:col-span-4 relative overflow-hidden rounded-[32px] border border-border/50 bg-white/50 dark:bg-neutral-900/50 hover:bg-white/80 dark:hover:bg-neutral-900/80 transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-500/10 hover:-translate-y-1 p-8 flex flex-col justify-between backdrop-blur-sm">
            <div className="absolute top-0 right-0 p-32 bg-emerald-500/5 rounded-full blur-3xl -mr-16 -mt-16 transition-all group-hover:bg-emerald-500/10" />

            <div>
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-900/30 flex items-center justify-center text-emerald-600 mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>
              </div>
              <h2 className="text-3xl font-bold mb-3">{t.nav.adhkar}</h2>
              <p className="text-muted-foreground leading-relaxed">{t.home_cards.adhkar_desc}</p>
            </div>
            <div className="flex items-center text-emerald-600 font-semibold mt-8 group-hover:gap-2 transition-all">
              <span>{t.action_buttons.read_more}</span>
              <span className="rtl:rotate-180">{isAr ? '←' : '→'}</span>
            </div>
          </Link>

          {/* Duas Card */}
          <Link href="/duas" className="group md:col-span-4 relative overflow-hidden rounded-[32px] border border-border/50 bg-white/50 dark:bg-neutral-900/50 hover:bg-white/80 dark:hover:bg-neutral-900/80 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/10 hover:-translate-y-1 p-8 flex flex-col justify-between backdrop-blur-sm">
            <div className="absolute bottom-0 left-0 p-32 bg-blue-500/5 rounded-full blur-3xl -ml-16 -mb-16 transition-all group-hover:bg-blue-500/10" />

            <div>
              <div className="w-12 h-12 rounded-2xl bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" /></svg>
              </div>
              <h2 className="text-3xl font-bold mb-3">{t.nav.duas}</h2>
              <p className="text-muted-foreground leading-relaxed">{t.home_cards.duas_desc}</p>
            </div>
            <div className="flex items-center text-blue-600 font-semibold mt-8 group-hover:gap-2 transition-all">
              <span>{t.action_buttons.read_more}</span>
              <span className="rtl:rotate-180">{isAr ? '←' : '→'}</span>
            </div>
          </Link>

          {/* Sources Card */}
          <Link href="/sources" className="group md:col-span-4 relative overflow-hidden rounded-[32px] border border-border/50 bg-white/50 dark:bg-neutral-900/50 hover:bg-white/80 dark:hover:bg-neutral-900/80 transition-all duration-500 hover:shadow-2xl hover:shadow-amber-500/10 hover:-translate-y-1 p-8 flex flex-col justify-between backdrop-blur-sm">
            <div className="absolute top-0 left-0 p-32 bg-amber-500/5 rounded-full blur-3xl -ml-16 -mt-16 transition-all group-hover:bg-amber-500/10" />

            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-100 dark:bg-amber-900/30 flex items-center justify-center text-amber-600 mb-6">
                <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" /></svg>
              </div>
              <h2 className="text-3xl font-bold mb-3">{t.nav.sources}</h2>
              <p className="text-muted-foreground leading-relaxed">{t.home_cards.sources_desc}</p>
            </div>
            <div className="flex items-center text-amber-600 font-semibold mt-8 group-hover:gap-2 transition-all">
              <span>{t.action_buttons.read_more}</span>
              <span className="rtl:rotate-180">{isAr ? '←' : '→'}</span>
            </div>
          </Link>

          {/* Prayer Times - Wide Card */}
          <Link href="/prayer-times" className="group md:col-span-12 relative overflow-hidden rounded-[32px] border border-border/50 bg-gradient-to-br from-emerald-900 to-teal-900 text-white transition-all duration-500 hover:shadow-2xl hover:shadow-emerald-900/20 hover:-translate-y-1 p-10 flex flex-col md:flex-row items-center justify-between">
            <div className="absolute inset-0 bg-[url('/pattern.svg')] opacity-10 mix-blend-overlay"></div>

            <div className="relative z-10 text-center md:text-left mb-6 md:mb-0">
              <h2 className="text-3xl md:text-4xl font-bold mb-3">{isAr ? 'مواقيت الصلاة العالمية' : 'Global Prayer Times'}</h2>
              <p className="text-emerald-100/80 max-w-xl text-lg">{isAr ? 'احصل على مواقيت دقيقة للصلاة لمدينتك مع العد التنازلي التلقائي.' : 'Get accurate prayer times for your city with automatic countdowns.'}</p>
            </div>

            <div className="relative z-10 bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-8 py-3 font-semibold hover:bg-white/20 transition-colors">
              {isAr ? 'عرض المواقيت' : 'View Times'}
            </div>
          </Link>

        </div>

      </div>
    </main>
  );
}
