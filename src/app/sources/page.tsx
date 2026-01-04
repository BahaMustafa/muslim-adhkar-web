import Link from 'next/link';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import translations from '@/lib/translations.json';

export async function generateMetadata(): Promise<Metadata> {
    const cookieStore = await cookies();
    const lang = (cookieStore.get("NEXT_LOCALE")?.value || "en") as "en" | "ar";
    const t = translations[lang] || translations.en;
    return {
        title: `${t.pages.sources.title} - ${t.branding.name}`,
        description: t.pages.sources.intro,
    };
}

// ... imports

export default async function SourcesPage() {
    const cookieStore = await cookies();
    const lang = (cookieStore.get("NEXT_LOCALE")?.value || "en") as "en" | "ar";
    const t = translations[lang] || translations.en;

    const sources = [
        {
            id: 'hisnul-muslim',
            title: lang === 'ar' ? 'حصن المسلم' : 'Hisnul Muslim',
            description: lang === 'ar' ? 'أصح مجموعة من الأذكار اليومية للشيخ سعيد بن علي بن وهف القحطاني.' : 'Fortress of the Muslim - The most authentic collection of daily Adhkar by Sheikh Sa\'id bin Ali bin Wahf al-Qahtani.',
            count: lang === 'ar' ? '١٣٠+ ذكر يومي' : '130+ Daily Adhkar'
        },
        {
            id: 'quran',
            title: lang === 'ar' ? 'القرآن الكريم' : 'The Holy Quran',
            description: lang === 'ar' ? 'أدعية من كتاب الله مباشرة.' : 'Supplications (Duas) directly from the Book of Allah.',
            count: lang === 'ar' ? 'أدعية مختارة' : 'Selected Duas'
        },
        {
            id: 'bukhari',
            title: lang === 'ar' ? 'صحيح البخاري' : 'Sahih Bukhari',
            description: lang === 'ar' ? 'روايات صحيحة من أصح كتاب بعد القرآن.' : 'Authentic narrations from the most trusted book after the Quran.',
            count: lang === 'ar' ? 'أحاديث مختارة' : 'Selected Hadith'
        }
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-center text-emerald-800">
                {t.pages.sources.title}
            </h1>
            <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
                {t.pages.sources.intro}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {sources.map((source) => (
                    <Link
                        key={source.id}
                        href={`/sources/${source.id}`}
                        className="block bg-white rounded-xl shadow-sm border border-emerald-100 p-6 hover:shadow-md transition-shadow"
                    >
                        <h2 className="text-xl font-bold text-gray-800 mb-2">{source.title}</h2>
                        <div className="text-sm font-medium text-emerald-600 mb-4 bg-emerald-50 inline-block px-3 py-1 rounded-full">
                            {source.count}
                        </div>
                        <p className="text-gray-600">
                            {source.description}
                        </p>
                    </Link>
                ))}
            </div>

            <div className="mt-16 text-center">
                <Link href="/duas" className="text-emerald-600 hover:text-emerald-700 font-medium">
                    {lang === 'ar' ? 'العودة إلى مجموعة الأذكار ←' : 'Back to Adhkar Collection →'}
                </Link>
            </div>
        </div>
    );
}
