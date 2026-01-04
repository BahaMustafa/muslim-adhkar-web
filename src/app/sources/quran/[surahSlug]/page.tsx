import { getChapterDetail, getGlobalAyahId, QURAN_LANGUAGES } from '@/lib/quran';
import { getRelatedAdhkar } from '@/lib/quran-related';
import { getSurahIdFromSlug, getSurahSlug } from '@/lib/quran-mapping';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import LanguageSelector from '@/components/quran/LanguageSelector';
import AyahAudioPlayer from '@/components/quran/AyahAudioPlayer';
import RelatedAdhkar from '@/components/quran/RelatedAdhkar';
import { notFound, redirect } from 'next/navigation';
import { getChapters } from '@/lib/quran';
import { cookies } from 'next/headers';
import translations from '@/lib/translations.json';

export async function generateStaticParams() {
    const chapters = await getChapters();
    return chapters.map((chapter) => ({
        surahSlug: getSurahSlug(chapter.id),
    }));
}

interface PageProps {
    params: Promise<{ surahSlug: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params, searchParams }: PageProps) {
    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;
    const { surahSlug } = resolvedParams;

    const id = getSurahIdFromSlug(surahSlug);
    if (!id) return {};

    const cookieStore = await cookies();
    const cookieLang = (cookieStore.get("NEXT_LOCALE")?.value || "en") as "en" | "ar";
    const lang = (typeof resolvedSearchParams.lang === 'string' ? resolvedSearchParams.lang : cookieLang) as "en" | "ar";
    const t = translations[lang] || translations.en; // Use 'en' as default if not found

    const detail = await getChapterDetail(id, lang);
    if (!detail) return {};

    const title = lang === 'ar' ? detail.name : detail.transliteration;

    return {
        title: `${title} - ${t.pages.quran.title} - ${t.branding.name}`,
        description: lang === 'ar'
            ? `${t.pages.quran.subtitle} ${detail.name}`
            : `Read and listen to Surah ${detail.transliteration} (${detail.name}) with multilingual translation, transliteration and audio.`,
    };
}

export default async function SurahPage({ params, searchParams }: PageProps) {
    const resolvedParams = await params;
    const resolvedSearchParams = await searchParams;

    const { surahSlug } = resolvedParams;

    const id = getSurahIdFromSlug(surahSlug);

    if (!id) {
        // Fallback: is it a number?
        const parsed = parseInt(surahSlug);
        if (!isNaN(parsed) && parsed >= 1 && parsed <= 114) {
            const correctSlug = getSurahSlug(parsed);
            redirect(`/sources/quran/${correctSlug}`);
        }
        notFound();
    }

    const cookieStore = await cookies();
    const cookieLang = (cookieStore.get("NEXT_LOCALE")?.value || "en") as "en" | "ar";
    // NOTE: quran-json fetch might fail if we pass 'ar' as language for content, caught by getChapterDetail internal logic now
    const lang = (typeof resolvedSearchParams.lang === 'string' ? resolvedSearchParams.lang : cookieLang) as "en" | "ar";
    const t = translations[lang] || translations.en;

    // Parallel Fetching
    const detailData = getChapterDetail(id, lang);
    const relatedData = getRelatedAdhkar(`Surah ${id}`, id);

    const [detail, related] = await Promise.all([detailData, relatedData]);

    if (!detail) {
        notFound();
    }

    const versesWithAudio = await Promise.all(detail.verses.map(async (v) => ({
        ...v,
        globalId: await getGlobalAyahId(id, v.id)
    })));

    const mainTitle = lang === 'ar' ? detail.name : detail.transliteration;
    const subTitle = lang === 'ar' ? detail.transliteration : detail.name;

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <Breadcrumbs
                homeLabel={t.nav.home}
                items={[
                    { label: t.nav.sources, href: "/sources" },
                    { label: t.pages.quran.title, href: "/sources/quran" },
                    { label: mainTitle, href: `/sources/quran/${surahSlug}` }
                ]} />

            {/* Header */}
            <div className="mt-6 mb-8 text-center border-b border-border pb-8">
                <span className="inline-block px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium mb-3">
                    {detail.type === 'meccan' ? t.pages.quran.meccan : t.pages.quran.medinan} • {detail.total_verses} {t.pages.quran.verses}
                </span>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2 font-amiri-if-ar">
                    {mainTitle}
                </h1>
                <p className="text-2xl text-emerald-600 mb-4 opacity-80">{subTitle}</p>

                {/* Controls */}
                <div className="flex justify-center items-center gap-4 mt-6">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-muted-foreground hidden sm:inline">{t.pages.quran.translation_label}</span>
                        <LanguageSelector />
                    </div>
                </div>
            </div>

            {/* Bismillah */}
            {id !== 1 && id !== 9 && (
                <div className="text-center mb-10 font-amiri text-2xl text-foreground/80">
                    بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ
                </div>
            )}

            {/* Verses */}
            <div className="space-y-8">
                {versesWithAudio.map((verse) => (
                    <div key={verse.id} className="group relative rounded-xl hover:bg-secondary/20 p-4 transition-colors">
                        {/* Number & Actions */}
                        <div className="flex items-center justify-between mb-4">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-secondary text-xs font-semibold text-muted-foreground">
                                {verse.id}
                            </span>
                            <div className="flex gap-2">
                                <AyahAudioPlayer globalAyahId={verse.globalId} />
                            </div>
                        </div>

                        {/* Arabic */}
                        <div className="text-right mb-4">
                            <p className="font-amiri text-3xl md:text-4xl leading-[2.2] text-foreground">
                                {verse.text}
                            </p>
                        </div>

                        {/* Translation/Transliteration */}
                        <div className="space-y-2 max-w-2xl rtl:text-right rtl:ml-auto">
                            {/* Transliteration */}
                            {verse.transliteration && (
                                <p className="text-sm text-muted-foreground italic font-light dir-ltr text-left">
                                    {verse.transliteration}
                                </p>
                            )}
                            {/* Translation */}
                            <p className="text-lg text-foreground/90 font-medium leading-relaxed">
                                {verse.translation}
                            </p>
                        </div>
                    </div>
                ))}
            </div>

            {/* Related Adhkar */}
            <RelatedAdhkar related={related} />
        </div>
    );
}
