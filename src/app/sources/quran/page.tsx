import Link from 'next/link';
import { getChapters } from '@/lib/quran';
import { getSurahSlug } from '@/lib/quran-mapping';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { cookies } from 'next/headers';
import translations from '@/lib/translations.json';
import { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
    const cookieStore = await cookies();
    const lang = (cookieStore.get("NEXT_LOCALE")?.value || "en") as "en" | "ar";
    const t = translations[lang] || translations.en;

    return {
        title: `${t.pages.quran.title} - ${t.branding.name}`,
        description: t.pages.quran.subtitle,
    };
}

export default async function QuranIndexPage() {
    const chapters = await getChapters();
    const cookieStore = await cookies();
    const lang = (cookieStore.get("NEXT_LOCALE")?.value || "en") as "en" | "ar";
    const t = translations[lang] || translations.en;

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <Breadcrumbs items={[
                { label: t.nav.sources, href: "/sources" },
                { label: t.pages.quran.title, href: "/sources/quran" }
            ]} />

            <div className="mt-6 mb-10 text-center">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent mb-3">
                    {t.pages.quran.title}
                </h1>
                <p className="text-muted-foreground">{t.pages.quran.subtitle}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {chapters.map((chapter) => (
                    <Link
                        key={chapter.id}
                        href={`/sources/quran/${getSurahSlug(chapter.id)}`}
                        className="group relative flex items-center p-4 rounded-xl border border-border bg-card hover:border-emerald-500/50 hover:shadow-md transition-all duration-200"
                    >
                        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-secondary text-secondary-foreground font-semibold text-sm group-hover:bg-emerald-100 group-hover:text-emerald-700 transition-colors">
                            {chapter.id}
                        </div>
                        <div className="ml-4 flex-grow text-left rtl:text-right">
                            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                {chapter.transliteration}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${chapter.type === 'meccan'
                                    ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                    : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                    }`}>
                                    {chapter.type === 'meccan' ? t.pages.quran.meccan : t.pages.quran.medinan}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    • {chapter.total_verses} {t.pages.quran.verses}
                                </span>
                            </div>
                        </div>
                        <div className="text-right rtl:text-left pl-2 rtl:pl-0 rtl:pr-2">
                            <span className="font-amiri text-2xl text-foreground/80">{chapter.name}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
