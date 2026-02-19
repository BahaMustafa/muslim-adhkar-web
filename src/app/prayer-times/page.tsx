import type { Metadata } from 'next';
import { cookies } from 'next/headers';
import { constructMetadata } from '@/components/SEO';
import PrayerTimesIndexClient from '@/components/prayer/PrayerTimesIndexClient';

export async function generateMetadata(): Promise<Metadata> {
    const cookieStore = await cookies();
    const lang = (cookieStore.get('NEXT_LOCALE')?.value || 'en') as 'en' | 'ar';

    return constructMetadata({
        title: lang === 'ar' ? 'مواقيت الصلاة العالمية' : 'Global Prayer Times',
        description: lang === 'ar'
            ? 'اعرف مواقيت الصلاة الدقيقة حسب موقعك أو حسب المدينة التي تختارها.'
            : 'Get accurate prayer times based on your location or selected city.',
        path: '/prayer-times',
        lang,
    });
}

export default function PrayerTimesPage() {
    return <PrayerTimesIndexClient />;
}
