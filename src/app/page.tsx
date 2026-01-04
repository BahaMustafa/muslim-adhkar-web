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

  return (
    <main className="flex min-h-[calc(100vh-3.5rem)] flex-col items-center justify-center p-8 md:p-24 relative overflow-hidden">
      <div className="z-10 w-full max-w-5xl items-center justify-between text-sm flex flex-col">
        <div className="mb-6 relative w-32 h-32 md:w-40 md:h-40">
          <Image
            src="/logo.png"
            alt="Muslim Adhkar Logo"
            fill
            className="object-contain drop-shadow-lg"
            priority
          />
        </div>
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-center bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent pb-2">
          {t.branding.name}
        </h1>
        <p className="text-xl md:text-2xl mb-12 text-center max-w-2xl text-muted-foreground">
          {t.home_hero_subtitle}
        </p>

        <HomeSearchTrigger />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-4xl text-left">
          <Link
            href="/adhkar"
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          >
            <h2 className={`mb-3 text-2xl font-semibold`}>
              {t.nav.adhkar}{" "}
              <span className={`inline-block transition-transform ${lang === 'ar' ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'} motion-reduce:transform-none`}>
                {arrow}
              </span>
            </h2>
            <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
              {t.home_cards.adhkar_desc}
            </p>
          </Link>

          <Link
            href="/duas"
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          >
            <h2 className={`mb-3 text-2xl font-semibold`}>
              {t.nav.duas}{" "}
              <span className={`inline-block transition-transform ${lang === 'ar' ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'} motion-reduce:transform-none`}>
                {arrow}
              </span>
            </h2>
            <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
              {t.home_cards.duas_desc}
            </p>
          </Link>

          <Link
            href="/sources"
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          >
            <h2 className={`mb-3 text-2xl font-semibold`}>
              {t.nav.sources}{" "}
              <span className={`inline-block transition-transform ${lang === 'ar' ? 'group-hover:-translate-x-1' : 'group-hover:translate-x-1'} motion-reduce:transform-none`}>
                {arrow}
              </span>
            </h2>
            <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
              {t.home_cards.sources_desc}
            </p>
          </Link>
        </div>
      </div>
    </main>
  );
}
