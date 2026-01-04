import Link from 'next/link';
import { Metadata } from 'next';
import { cookies } from 'next/headers';
import translations from '@/lib/translations.json';

export const metadata: Metadata = {
    title: 'Daily Muslim Adhkar Cycle',
    description: 'Structure your day with authentic morning, evening, and post-prayer remembrances.',
};

export default async function DailyAdhkarPage() {
    const dailyRoutine = [
        {
            slug: 'morning-adhkar',
            title: 'Morning Adhkar',
            arabic: 'أذكار الصباح',
            time: 'After Fajr until Sunrise',
            color: 'bg-amber-50 border-amber-100 text-amber-800'
        },
        {
            slug: 'evening-adhkar',
            title: 'Evening Adhkar',
            arabic: 'أذكار المساء',
            time: 'After Asr until Maghrib',
            color: 'bg-indigo-50 border-indigo-100 text-indigo-800'
        },
        {
            slug: 'after-salah',
            title: 'After Salah',
            arabic: 'أذكار ما بعد الصلاة',
            time: 'After every obligatory prayer',
            color: 'bg-emerald-50 border-emerald-100 text-emerald-800'
        },
        {
            slug: 'sleeping-adhkar',
            title: 'Before Sleep',
            arabic: 'أذكار النوم',
            time: 'Before going to bed',
            color: 'bg-slate-50 border-slate-100 text-slate-800'
        },
        {
            slug: 'waking-up-adhkar',
            title: 'Waking Up',
            arabic: 'أذكار الاستيقاظ',
            time: 'Immediately upon waking',
            color: 'bg-yellow-50 border-yellow-100 text-yellow-800'
        }
    ];

    const cookieStore = await cookies();
    const lang = (cookieStore.get("NEXT_LOCALE")?.value || "en") as "en" | "ar";
    const t = translations[lang] || translations.en;

    // ...
    return (
        <div className="container mx-auto px-4 py-8 max-w-5xl">
            <h1 className="text-3xl font-bold mb-4 text-center text-gray-800">
                {lang === 'ar' ? 'وردك اليومي من الأذكار' : 'Your Daily Adhkar Cycle'}
            </h1>
            <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
                {lang === 'ar' ? '"رطب لسانك بذكر الله"' : '"Keep your tongue moist with the remembrance of Allah."'}
            </p>

            <div className="space-y-4">
                {dailyRoutine.map((item) => (
                    <Link
                        key={item.slug}
                        href={`/adhkar/${item.slug}`}
                        className={`block rounded-xl border p-6 hover:shadow-md transition-all duration-200 ${item.color}`}
                    >
                        <div className="flex justify-between items-center">
                            <div>
                                <h2 className="text-2xl font-bold mb-1">
                                    {lang === 'ar' ? item.arabic : item.title}
                                </h2>
                                <p className="text-sm opacity-80 font-medium pt-1">
                                    {lang === 'ar' ? getArabicTimeDescription(item.slug) : item.time}
                                </p>
                            </div>
                            {lang !== 'ar' && (
                                <div className="text-2xl font-amiri opacity-60">
                                    {item.arabic}
                                </div>
                            )}
                        </div>
                    </Link>
                ))}
            </div>

            <div className="mt-12 text-center p-8 bg-gray-50 rounded-2xl dark:bg-neutral-900 border dark:border-neutral-800">
                <h3 className="text-lg font-semibold mb-2">
                    {lang === 'ar' ? 'تبحث عن المزيد؟' : 'Looking for something else?'}
                </h3>
                <p className="text-gray-500 mb-4">
                    {lang === 'ar' ? 'تصفح مجموعتنا الكاملة من الأدعية.' : 'Browse our complete collection of 130+ Dua categories.'}
                </p>
                <Link href="/duas" className="bg-white dark:bg-neutral-800 border border-gray-200 dark:border-neutral-700 text-gray-800 dark:text-gray-200 px-6 py-2 rounded-full hover:bg-gray-50 dark:hover:bg-neutral-700 transition-colors shadow-sm">
                    {lang === 'ar' ? 'عرض جميع الأدعية' : 'View All Duas'}
                </Link>
            </div>
        </div>
    );
}

function getArabicTimeDescription(slug: string) {
    switch (slug) {
        case 'morning-adhkar': return 'بعد الفجر حتى الشروق';
        case 'evening-adhkar': return 'بعد العصر حتى المغرب';
        case 'after-salah': return 'دبر كل صلاة مفروضة';
        case 'sleeping-adhkar': return 'قبل النوم';
        case 'waking-up-adhkar': return 'فور الاستيقاظ';
        default: return '';
    }
}
