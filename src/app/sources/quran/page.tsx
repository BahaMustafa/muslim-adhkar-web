import Link from 'next/link';
import { getChapters } from '@/lib/quran';
import { getSurahSlug } from '@/lib/quran-mapping';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';

export const metadata = {
    title: 'The Noble Quran - Muslim Adhkar',
    description: 'Index of all 114 Surahs of the Noble Quran with multilingual translations and audio.',
};

export default async function QuranIndexPage() {
    const chapters = await getChapters();

    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <Breadcrumbs items={[
                { label: "Sources", href: "/sources" },
                { label: "Noble Quran", href: "/sources/quran" }
            ]} />

            <div className="mt-6 mb-10 text-center">
                <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 to-emerald-400 bg-clip-text text-transparent mb-3">
                    The Noble Quran
                </h1>
                <p className="text-muted-foreground">Select a Surah to read and listen.</p>
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
                        <div className="ml-4 flex-grow">
                            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                                {chapter.transliteration}
                            </h3>
                            <div className="flex items-center gap-2 mt-1">
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full font-medium ${chapter.type === 'meccan'
                                        ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                        : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400'
                                    }`}>
                                    {chapter.type === 'meccan' ? 'Meccan' : 'Medinan'}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    • {chapter.total_verses} Verses
                                </span>
                            </div>
                        </div>
                        <div className="text-right pl-2">
                            <span className="font-amiri text-2xl text-foreground/80">{chapter.name}</span>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
