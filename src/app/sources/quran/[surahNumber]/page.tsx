import { getChapterDetail, getGlobalAyahId, QURAN_LANGUAGES } from '@/lib/quran';
import { getRelatedAdhkar } from '@/lib/quran-related';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import LanguageSelector from '@/components/quran/LanguageSelector';
import AyahAudioPlayer from '@/components/quran/AyahAudioPlayer';
import RelatedAdhkar from '@/components/quran/RelatedAdhkar';
import { notFound } from 'next/navigation';

export async function generateStaticParams() {
    // Generate for top popular Surahs + first few
    const popular = ['1', '18', '36', '55', '56', '67'];
    return popular.map(id => ({ surahNumber: id }));
}

interface PageProps {
    params: { surahNumber: string };
    searchParams: { [key: string]: string | string[] | undefined };
}

export async function generateMetadata({ params, searchParams }: PageProps) {
    const id = parseInt(params.surahNumber);
    if (isNaN(id)) return {};
    const lang = (typeof searchParams.lang === 'string' ? searchParams.lang : 'en');
    const detail = await getChapterDetail(id, lang);
    if (!detail) return {};

    return {
        title: `Surah ${detail.transliteration} (${detail.name}) - Muslim Adhkar`,
        description: `Read and listen to Surah ${detail.transliteration} with ${lang === 'en' ? 'English' : 'Multilingual'} translation.`,
    };
}

export default async function SurahPage({ params, searchParams }: PageProps) {
    const id = parseInt(params.surahNumber);
    const lang = (typeof searchParams.lang === 'string' ? searchParams.lang : 'en');

    if (isNaN(id) || id < 1 || id > 114) {
        notFound();
    }

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

    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <Breadcrumbs items={[
                { label: "Sources", href: "/sources" },
                { label: "Noble Quran", href: "/sources/quran" },
                { label: detail.transliteration, href: `/sources/quran/${id}` }
            ]} />

            {/* Header */}
            <div className="mt-6 mb-8 text-center border-b border-border pb-8">
                <span className="inline-block px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs font-medium mb-3">
                    {detail.type} • {detail.total_verses} Verses
                </span>
                <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-2">
                    {detail.transliteration}
                </h1>
                <p className="font-amiri text-3xl text-emerald-600 mb-4">{detail.name}</p>

                {/* Controls */}
                <div className="flex justify-center items-center gap-4 mt-6">
                    <div className="flex items-center gap-2">
                        <span className="text-sm font-medium text-muted-foreground hidden sm:inline">Translation:</span>
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
                        <div className="space-y-2 max-w-2xl">
                            {/* Transliteration */}
                            {verse.transliteration && (
                                <p className="text-sm text-muted-foreground italic font-light">
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
