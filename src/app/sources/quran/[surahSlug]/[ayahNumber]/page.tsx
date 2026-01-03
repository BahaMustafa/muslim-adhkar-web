import { getGlobalAyahId, getVerse, getAudioUrl, getChapterDetail, QURAN_LANGUAGES } from '@/lib/quran';
import { getSurahIdFromSlug, getSurahSlug } from '@/lib/quran-mapping';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import AyahAudioPlayer from '@/components/quran/AyahAudioPlayer';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

interface PageProps {
    params: Promise<{ surahSlug: string; ayahNumber: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { surahSlug, ayahNumber } = await params;
    const surahId = getSurahIdFromSlug(surahSlug);
    if (!surahId) return {};

    const ayahNum = parseInt(ayahNumber);
    // Fetch basic details (or just use static names if we had them map accessible)
    // For title, we'll try to be quick. 
    // Ideally we'd fetch chapter info, but for now lets assume "Surah X Ayah Y"

    // Actually, getVerse fetches the chapter name inside it :)
    const globalId = await getGlobalAyahId(surahId, ayahNum);
    const verse = await getVerse(globalId);

    if (verse) {
        return {
            title: `Surah ${verse.chapter.transliteration} Ayah ${verse.number} - Arabic, English & Audio`,
            description: `Read and listen to Verse ${verse.number} of Surah ${verse.chapter.transliteration} in Arabic and English.`
        };
    }

    return {
        title: `Surah ${surahSlug} Ayah ${ayahNumber}`,
    };
}

export default async function AyahPage({ params, searchParams }: PageProps) {
    const { surahSlug, ayahNumber } = await params;
    const { lang } = await searchParams; // Language for query param logic if we want to toggle display

    const surahId = getSurahIdFromSlug(surahSlug);
    if (!surahId) notFound();

    const ayahNum = parseInt(ayahNumber);
    if (isNaN(ayahNum)) notFound();

    const globalId = await getGlobalAyahId(surahId, ayahNum);

    // Fetch Verse
    const verse = await getVerse(globalId);

    if (!verse) {
        // Fallback: This might mean the ayah number is out of range
        notFound();
    }

    // Determine translation language code. 
    // The Verse API returns ALL translations in a map: { en: "...", es: "..." }
    const targetLang = typeof lang === 'string' && QURAN_LANGUAGES.some(l => l.code === lang) ? lang : 'en';
    const translationText = verse.translations[targetLang] || verse.translations['en'];

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl min-h-screen flex flex-col">
            <Breadcrumbs items={[
                { label: "Sources", href: "/sources" },
                { label: "Noble Quran", href: "/sources/quran" },
                { label: verse.chapter.transliteration, href: `/sources/quran/${surahSlug}` },
                { label: `Ayah ${ayahNum}`, href: `/sources/quran/${surahSlug}/${ayahNum}` }
            ]} />

            <div className="flex-1 flex flex-col justify-center items-center py-12">

                {/* Header Info */}
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-semibold text-muted-foreground mb-2">
                        Surah {verse.chapter.transliteration} • Ayah {verse.number}
                    </h1>
                </div>

                {/* Card */}
                <div className="w-full max-w-3xl bg-card border border-border rounded-2xl p-8 md:p-12 shadow-sm text-center">

                    {/* Arabic */}
                    <p className="font-amiri text-4xl md:text-5xl leading-[2.5] text-foreground mb-10" dir="rtl">
                        {verse.text}
                    </p>

                    {/* Transliteration */}
                    <p className="text-lg text-muted-foreground italic font-light mb-6">
                        {verse.transliteration}
                    </p>

                    {/* Translation */}
                    <p className="text-xl md:text-2xl text-foreground font-medium leading-relaxed mb-10">
                        {translationText}
                    </p>

                    {/* Actions */}
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4 border-t border-border pt-8">
                        <div className="flex items-center gap-2">
                            <AyahAudioPlayer globalAyahId={verse.id} />
                            <span className="text-sm font-medium">Play Audio</span>
                        </div>
                    </div>
                </div>

                {/* Navigation Back */}
                <div className="mt-12">
                    <Link
                        href={`/sources/quran/${surahSlug}`}
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 bg-primary text-primary-foreground hover:bg-primary/90 h-11 px-8 py-2"
                    >
                        View Full Surah
                    </Link>
                </div>

            </div>
        </div>
    );
}
