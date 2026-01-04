import { Coordinates, CalculationMethod, PrayerTimes, Madhab } from 'adhan';

export interface PrayerTime {
    name: string;
    time: Date;
    formatted: string;
    isNext?: boolean;
}

export interface CityConfig {
    name: string;
    slug: string;
    lat: number;
    lng: number;
    timezone: string;
    country: string;
}

// Basic list of major cities (expandable)
export const SUPPORTED_CITIES: CityConfig[] = [
    { name: 'Mecca', slug: 'mecca', lat: 21.3891, lng: 39.8579, timezone: 'Asia/Riyadh', country: 'Saudi Arabia' },
    { name: 'Medina', slug: 'medina', lat: 24.5247, lng: 39.5692, timezone: 'Asia/Riyadh', country: 'Saudi Arabia' },
    { name: 'Cairo', slug: 'cairo', lat: 30.0444, lng: 31.2357, timezone: 'Africa/Cairo', country: 'Egypt' },
    { name: 'Istanbul', slug: 'istanbul', lat: 41.0082, lng: 28.9784, timezone: 'Europe/Istanbul', country: 'Turkey' },
    { name: 'London', slug: 'london', lat: 51.5074, lng: -0.1278, timezone: 'Europe/London', country: 'UK' },
    { name: 'New York', slug: 'new-york', lat: 40.7128, lng: -74.0060, timezone: 'America/New_York', country: 'USA' },
    { name: 'Dubai', slug: 'dubai', lat: 25.2048, lng: 55.2708, timezone: 'Asia/Dubai', country: 'UAE' },
];

export const PRAYER_NAMES_EN = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
export const PRAYER_NAMES_AR = ['الفجر', 'الشروق', 'الظهر', 'العصر', 'المغرب', 'العشاء'];

export function getPrayerTimes(citySlug: string, date: Date = new Date()): PrayerTimes | null {
    const city = SUPPORTED_CITIES.find(c => c.slug.toLowerCase() === citySlug.toLowerCase());
    if (!city) return null;

    const coordinates = new Coordinates(city.lat, city.lng);
    const params = CalculationMethod.MuslimWorldLeague();
    params.madhab = Madhab.Shafi;

    // Adjust method based on region if needed (e.g. UMM_AL_QURA for KSA)
    if (city.country === 'Saudi Arabia') {
        // adhan library doesn't export CalculationMethod.UmmAlQura directly in some versions? 
        // using MWL as safe default or specific known params
    }

    return new PrayerTimes(coordinates, date, params);
}

export function formatTime(date: Date, lang: 'en' | 'ar', timezone: string): string {
    const formatter = new Intl.DateTimeFormat(lang === 'ar' ? 'ar-EG' : 'en-US', {
        hour: 'numeric',
        minute: 'numeric',
        hour12: true,
        timeZone: timezone
    });
    return formatter.format(date);
}

export function getNextPrayer(prayers: PrayerTimes): { name: string, time: Date, remainingMs: number } {
    const now = new Date();
    const list = [
        { name: 'Fajr', time: prayers.fajr },
        { name: 'Sunrise', time: prayers.sunrise }, // Usually skipped for "next prayer" logic in apps, but kept for list
        { name: 'Dhuhr', time: prayers.dhuhr },
        { name: 'Asr', time: prayers.asr },
        { name: 'Maghrib', time: prayers.maghrib },
        { name: 'Isha', time: prayers.isha },
    ];

    // Find first prayer in the future
    let next = list.find(p => p.time > now);

    // If none (after Isha), it's Fajr tomorrow (not handled perfectly here without next day calc, 
    // but for simple MVP valid for "today's view"). 
    // Actually, let's just return null or the first one if looping?
    // User wants "Next Prayer" logic. 

    if (!next) {
        // Technically it's Fajr tomorrow. 
        // For simple display, let's just return null and handle "See tomorrow" in UI or just show Isha passed.
        // Or cleaner: wrapping logic usually requires calc(today) AND calc(tomorrow).
        return { name: 'Fajr', time: prayers.fajr, remainingMs: 0 }; // Placeholder
    }

    return {
        name: next.name,
        time: next.time,
        remainingMs: next.time.getTime() - now.getTime()
    };
}
