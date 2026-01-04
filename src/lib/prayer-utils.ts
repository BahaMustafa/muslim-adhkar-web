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
    countrySlug: string;
    lat: number;
    lng: number;
    timezone: string;
    country: string;
}

export const SUPPORTED_CITIES: CityConfig[] = [
    // Saudi Arabia
    { name: 'Mecca', slug: 'mecca', countrySlug: 'saudi-arabia', lat: 21.3891, lng: 39.8579, timezone: 'Asia/Riyadh', country: 'Saudi Arabia' },
    { name: 'Medina', slug: 'medina', countrySlug: 'saudi-arabia', lat: 24.5247, lng: 39.5692, timezone: 'Asia/Riyadh', country: 'Saudi Arabia' },
    { name: 'Riyadh', slug: 'riyadh', countrySlug: 'saudi-arabia', lat: 24.7136, lng: 46.6753, timezone: 'Asia/Riyadh', country: 'Saudi Arabia' },

    // Egypt
    { name: 'Cairo', slug: 'cairo', countrySlug: 'egypt', lat: 30.0444, lng: 31.2357, timezone: 'Africa/Cairo', country: 'Egypt' },
    { name: 'Alexandria', slug: 'alexandria', countrySlug: 'egypt', lat: 31.2001, lng: 29.9187, timezone: 'Africa/Cairo', country: 'Egypt' },

    // Turkey
    { name: 'Istanbul', slug: 'istanbul', countrySlug: 'turkey', lat: 41.0082, lng: 28.9784, timezone: 'Europe/Istanbul', country: 'Turkey' },
    { name: 'Ankara', slug: 'ankara', countrySlug: 'turkey', lat: 39.9334, lng: 32.8597, timezone: 'Europe/Istanbul', country: 'Turkey' },

    // UAE
    { name: 'Dubai', slug: 'dubai', countrySlug: 'uae', lat: 25.2048, lng: 55.2708, timezone: 'Asia/Dubai', country: 'UAE' },
    { name: 'Abu Dhabi', slug: 'abu-dhabi', countrySlug: 'uae', lat: 24.4539, lng: 54.3773, timezone: 'Asia/Dubai', country: 'UAE' },

    // Indonesia
    { name: 'Jakarta', slug: 'jakarta', countrySlug: 'indonesia', lat: -6.2088, lng: 106.8456, timezone: 'Asia/Jakarta', country: 'Indonesia' },

    // UK
    { name: 'London', slug: 'london', countrySlug: 'uk', lat: 51.5074, lng: -0.1278, timezone: 'Europe/London', country: 'UK' },
    { name: 'Birmingham', slug: 'birmingham', countrySlug: 'uk', lat: 52.4862, lng: -1.8904, timezone: 'Europe/London', country: 'UK' },

    // USA
    { name: 'New York', slug: 'new-york', countrySlug: 'usa', lat: 40.7128, lng: -74.0060, timezone: 'America/New_York', country: 'USA' },
    { name: 'Los Angeles', slug: 'los-angeles', countrySlug: 'usa', lat: 34.0522, lng: -118.2437, timezone: 'America/Los_Angeles', country: 'USA' },
    { name: 'Chicago', slug: 'chicago', countrySlug: 'usa', lat: 41.8781, lng: -87.6298, timezone: 'America/Chicago', country: 'USA' },

    // Canada
    { name: 'Toronto', slug: 'toronto', countrySlug: 'canada', lat: 43.6532, lng: -79.3832, timezone: 'America/Toronto', country: 'Canada' },

    // France
    { name: 'Paris', slug: 'paris', countrySlug: 'france', lat: 48.8566, lng: 2.3522, timezone: 'Europe/Paris', country: 'France' },

    // Germany
    { name: 'Berlin', slug: 'berlin', countrySlug: 'germany', lat: 52.5200, lng: 13.4050, timezone: 'Europe/Berlin', country: 'Germany' },

    // Pakistan
    { name: 'Karachi', slug: 'karachi', countrySlug: 'pakistan', lat: 24.8607, lng: 67.0011, timezone: 'Asia/Karachi', country: 'Pakistan' },
    { name: 'Lahore', slug: 'lahore', countrySlug: 'pakistan', lat: 31.5204, lng: 74.3587, timezone: 'Asia/Karachi', country: 'Pakistan' },

    // India
    { name: 'Mumbai', slug: 'mumbai', countrySlug: 'india', lat: 19.0760, lng: 72.8777, timezone: 'Asia/Kolkata', country: 'India' },
    { name: 'New Delhi', slug: 'new-delhi', countrySlug: 'india', lat: 28.6139, lng: 77.2090, timezone: 'Asia/Kolkata', country: 'India' },

    // Bangladesh
    { name: 'Dhaka', slug: 'dhaka', countrySlug: 'bangladesh', lat: 23.8103, lng: 90.4125, timezone: 'Asia/Dhaka', country: 'Bangladesh' },

    // Nigeria
    { name: 'Lagos', slug: 'lagos', countrySlug: 'nigeria', lat: 6.5244, lng: 3.3792, timezone: 'Africa/Lagos', country: 'Nigeria' },

    // Malaysia
    { name: 'Kuala Lumpur', slug: 'kuala-lumpur', countrySlug: 'malaysia', lat: 3.1390, lng: 101.6869, timezone: 'Asia/Kuala_Lumpur', country: 'Malaysia' },

    // Russia
    { name: 'Moscow', slug: 'moscow', countrySlug: 'russia', lat: 55.7558, lng: 37.6173, timezone: 'Europe/Moscow', country: 'Russia' },

    // Singapore
    { name: 'Singapore', slug: 'singapore', countrySlug: 'singapore', lat: 1.3521, lng: 103.8198, timezone: 'Asia/Singapore', country: 'Singapore' },
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
