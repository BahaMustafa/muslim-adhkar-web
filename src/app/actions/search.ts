'use server';

import fs from 'fs';
import path from 'path';
import { getChapters } from '@/lib/quran';
import { getSurahSlug } from '@/lib/quran-mapping';
import { SearchResult } from '@/lib/search-types';
import translations from '@/lib/translations.json';
import { SUPPORTED_CITIES } from '@/lib/prayer-utils';

let searchIndexCache: SearchResult[] | null = null;

export async function getSearchIndex(): Promise<SearchResult[]> {
    // if (searchIndexCache) return searchIndexCache;

    const results: SearchResult[] = [];

    // 1. Index Adhkar
    try {
        const adhkarDir = path.join(process.cwd(), 'src/data/adhkar-items');
        const files = fs.readdirSync(adhkarDir).filter(f => f.endsWith('.json'));

        for (const file of files) {
            const filePath = path.join(adhkarDir, file);
            const content = fs.readFileSync(filePath, 'utf8');
            try {
                const data = JSON.parse(content);
                const title = data.title || data.pageTitle;

                if (title) {
                    const slug = file.replace('.json', '');
                    const transKey = slug.replaceAll('-', '_');
                    // @ts-ignore
                    const arabicCategoryTitle = translations.ar.category_titles[transKey];
                    const arabicTitle = data.title_ar || arabicCategoryTitle;

                    const keywords = [
                        slug.replace(/-/g, ' '),
                        title,
                        arabicTitle,
                        data.description_ar,
                        data.description
                    ].filter(Boolean);

                    // Add items keywords
                    if (data.items && Array.isArray(data.items)) {
                        data.items.forEach((item: any) => {
                            if (item.title) keywords.push(item.title);
                            if (item.title_ar) keywords.push(item.title_ar);
                            // Avoid adding full Arabic text to keywords, too noisy? Maybe just titles.
                        });
                    }

                    results.push({
                        id: `adhkar-${slug}`,
                        title: title,
                        arabicTitle: arabicTitle,
                        url: `/adhkar/${slug}`,
                        type: 'adhkar',
                        description: data.description || data.pageDescription || undefined,
                        keywords: [...new Set(keywords)] as string[]
                    });
                }
            } catch (e) {
                console.error(`Error parsing ${file}`, e);
            }
        }
    } catch (e) {
        console.error('Error indexing adhkar', e);
    }

    // 2. Index Quran Surahs
    try {
        const chapters = await getChapters();
        for (const chapter of chapters) {
            const slug = getSurahSlug(chapter.id);
            results.push({
                id: `surah-${chapter.id}`,
                title: `Surah ${chapter.transliteration} (${chapter.name})`,
                arabicTitle: `سورة ${chapter.name}`,
                url: `/sources/quran/${slug}`,
                type: 'quran',
                description: `Surah ${chapter.translation}`,
                keywords: [
                    chapter.transliteration,
                    chapter.name,
                    `سورة ${chapter.name}`,
                    chapter.translation,
                    `surah ${chapter.id}`,
                    String(chapter.id)
                ].filter(Boolean) as string[]
            });
        }
    } catch (e) {
        console.error('Error indexing Quran', e);
    }

    // 3. Static Sources
    results.push(
        { id: 'source-quran', title: 'The Noble Quran', arabicTitle: 'القرآن الكريم', url: `/sources/quran`, type: 'source', keywords: ['quran', 'القرآن'] },
        { id: 'source-hisnul', title: 'Hisnul Muslim', arabicTitle: 'حصن المسلم', url: `/sources/hisnul-muslim`, type: 'source', keywords: ['hisnul', 'muslim', 'حصن', 'المسلم'] },
        { id: 'source-adhkar', title: 'Adhkar Collection', arabicTitle: 'جامع الأذكار', url: `/sources`, type: 'source', keywords: ['adhkar', 'azkar', 'أذكار', 'المصادر'] }
    );

    // 4. Index Prayer Times Cities
    const getCityNameAr = (name: string): string => {
        const map: Record<string, string> = {
            'Mecca': 'مكة المكرمة',
            'Medina': 'المدينة المنورة',
            'Cairo': 'القاهرة',
            'Istanbul': 'إسطنبول',
            'London': 'لندن',
            'New York': 'نيويورك',
            'Dubai': 'دبي',
            'Riyadh': 'الرياض',
            'Jakarta': 'جاكرتا',
            'Kuala Lumpur': 'كوالالمبور',
            'Karachi': 'كراتشي',
            'Lahore': 'لاهور',
            'Abu Dhabi': 'أبو ظبي',
            'Mumbai': 'مومباي',
            'Paris': 'باريس',
            'Berlin': 'برلين',
            'Toronto': 'تورونتو',
            'Sydney': 'سيدني',
            'Dhaka': 'دكا',
            'Lagos': 'لاغوس',
            'Moscow': 'موسكو',
            'Singapore': 'سنغافورة',
            'Alexandria': 'الإسكندرية',
            'Ankara': 'أنقرة',
            'Los Angeles': 'لوس أنجلوس',
            'Chicago': 'شيكاغو',
            'Birmingham': 'برمنغهام',
            'New Delhi': 'نيودلهي',
        };
        return map[name] || name;
    };

    SUPPORTED_CITIES.forEach(city => {
        const arabicName = getCityNameAr(city.name);
        results.push({
            id: `prayer-${city.slug}`,
            title: `Prayer Times ${city.name}`,
            arabicTitle: `مواقيت الصلاة في ${arabicName}`,
            url: `/prayer-times/${city.countrySlug}/${city.slug}`,
            type: 'source',
            description: `Fajr, Dhuhr, Asr, Maghrib, Isha times for ${city.name}`,
            keywords: [
                'prayer times', 'salah', 'namaz', 'salat',
                'مواقيت', 'صلاة', 'أوقات',
                city.name.toLowerCase(),
                city.slug.replace(/-/g, ' '),
                arabicName,
                city.country.toLowerCase()
            ]
        });
    });

    searchIndexCache = results;
    return results;
}
