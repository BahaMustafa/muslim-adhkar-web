import { notFound } from 'next/navigation';
import { getPrayerTimes, getNextPrayer, formatTime, SUPPORTED_CITIES, PRAYER_NAMES_EN } from '@/lib/prayer-utils';
import { constructMetadata } from '@/components/SEO';
import PrayerTable from '@/components/prayer/PrayerTable';
import PrayerHeaderBar from '@/components/prayer/PrayerHeaderBar';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { cookies } from 'next/headers';
import translations from '@/lib/translations.json';
import { Metadata } from 'next';

interface Props {
    params: Promise<{ city: string }>;
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export async function generateMetadata({ params, searchParams }: Props): Promise<Metadata> {
    const { city: citySlug } = await params;
    const resolvedSearchParams = await searchParams;

    const cookieStore = await cookies();
    const cookieLang = (cookieStore.get("NEXT_LOCALE")?.value || "en") as "en" | "ar";
    const lang = (typeof resolvedSearchParams.lang === 'string' ? resolvedSearchParams.lang : cookieLang) as "en" | "ar";

    const city = SUPPORTED_CITIES.find(c => c.slug === citySlug);
    if (!city) return constructMetadata({ title: 'City Not Found', lang });

    const cityName = lang === 'ar' ? getCityNameAr(city.name) : city.name;
    const title = lang === 'ar'
        ? `مواقيت الصلاة في ${cityName}`
        : `${city.name} Prayer Times`;

    return constructMetadata({
        title: title,
        description: lang === 'ar'
            ? `احصل على مواقيت الصلاة الدقيقة لمدينة ${cityName}: الفجر، الظهر، العصر، المغرب، والعشاء.`
            : `Get accurate prayer times for ${city.name}: Fajr, Dhuhr, Asr, Maghrib, and Isha.`,
        path: `/prayer-times/${citySlug}`,
        lang: lang
    });
}

function getCityNameAr(name: string): string {
    const map: Record<string, string> = {
        'Mecca': 'مكة المكرمة',
        'Medina': 'المدينة المنورة',
        'Cairo': 'القاهرة',
        'Istanbul': 'إسطنبول',
        'London': 'لندن',
        'New York': 'نيويورك',
        'Dubai': 'دبي'
    };
    return map[name] || name;
}

export default async function PrayerCityPage({ params, searchParams }: Props) {
    const { city: citySlug } = await params;
    const resolvedSearchParams = await searchParams;

    // Localization
    const cookieStore = await cookies();
    const cookieLang = (cookieStore.get("NEXT_LOCALE")?.value || "en") as "en" | "ar";
    const lang = (typeof resolvedSearchParams.lang === 'string' ? resolvedSearchParams.lang : cookieLang) as "en" | "ar";
    const t = translations[lang] || translations.en;

    const city = SUPPORTED_CITIES.find(c => c.slug === citySlug);

    if (!city) {
        notFound();
    }

    // Logic
    const prayers = getPrayerTimes(citySlug);
    if (!prayers) notFound();

    const formattedTimes = {
        Fajr: formatTime(prayers.fajr, lang, city.timezone),
        Sunrise: formatTime(prayers.sunrise, lang, city.timezone),
        Dhuhr: formatTime(prayers.dhuhr, lang, city.timezone),
        Asr: formatTime(prayers.asr, lang, city.timezone),
        Maghrib: formatTime(prayers.maghrib, lang, city.timezone),
        Isha: formatTime(prayers.isha, lang, city.timezone),
    };

    const nextOne = getNextPrayer(prayers);
    // Rough translation of prayer name for header
    const nextNameEn = nextOne.name;
    const isAr = lang === 'ar';
    // Simple index mapping
    const pIndex = PRAYER_NAMES_EN.indexOf(nextNameEn);
    const nextNameDisplay = isAr ? ['الفجر', 'الشروق', 'الظهر', 'العصر', 'المغرب', 'العشاء'][pIndex] || nextNameEn : nextNameEn;

    const cityNameDisplay = isAr ? getCityNameAr(city.name) : city.name;
    const pageTitle = isAr ? `مواقيت الصلاة في ${cityNameDisplay}` : `Prayer Times in ${cityNameDisplay}`;

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black">
            <PrayerHeaderBar
                nextPrayerName={nextNameDisplay}
                nextPrayerTime={formatTime(nextOne.time, lang, city.timezone)}
                city={cityNameDisplay}
                label={isAr ? 'الصلاة القادمة:' : 'Next Prayer:'}
            />

            <div className="max-w-3xl mx-auto px-4 py-8">
                <Breadcrumbs items={[
                    { label: t.branding.name, href: "/" },
                    { label: pageTitle, href: `/prayer-times/${citySlug}` }
                ]} />

                <main className="mt-8">
                    <div className="text-center mb-10">
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
                            {pageTitle}
                        </h1>
                        <p className="text-lg text-gray-600 dark:text-gray-400">
                            {isAr
                                ? `توقيت دقيق حسب التوقيت المحلي لمدينة ${cityNameDisplay}`
                                : `Accurate local prayer times for ${cityNameDisplay}`}
                        </p>
                    </div>

                    <PrayerTable times={formattedTimes} nextPrayerKey={nextOne.name} lang={lang} />
                </main>
            </div>
        </div>
    );
}

export async function generateStaticParams() {
    return SUPPORTED_CITIES.map(city => ({
        city: city.slug
    }));
}
