import { MetadataRoute } from 'next'
import { getAllAdhkarSlugs, getAdhkarBySlug } from '@/lib/adhkar-service'
import { SUPPORTED_CITIES } from '@/lib/prayer-utils'
import { categoryMap } from '@/lib/data'
import { getChapters } from '@/lib/quran'
import { getSurahSlug } from '@/lib/quran-mapping'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://muslimadhkar.com' // Placeholder

    // 1. Static Pages
    const staticPages: MetadataRoute.Sitemap = [
        {
            url: baseUrl,
            lastModified: new Date(),
            changeFrequency: 'daily',
            priority: 1,
        },
        {
            url: `${baseUrl}/adhkar`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/duas`,
            lastModified: new Date(),
            changeFrequency: 'weekly',
            priority: 0.8,
        },
        {
            url: `${baseUrl}/sources`,
            lastModified: new Date(),
            changeFrequency: 'monthly',
            priority: 0.5,
        },
    ]

    // 2. Dynamic Adhkar Pages
    const slugs = await getAllAdhkarSlugs();
    const adhkarPages: MetadataRoute.Sitemap = await Promise.all(slugs.map(async (slug) => {
        const data = await getAdhkarBySlug(slug);
        return {
            url: `${baseUrl}/adhkar/${slug}`,
            lastModified: data?.lastVerified ? new Date(data.lastVerified) : new Date(),
            changeFrequency: 'monthly',
            priority: 0.7,
        }
    }));

    // 3. Dynamic Category Pages
    // Combine static categories and dynamic ones found in JSONs
    const dynamicCategories = new Set<string>();
    for (const slug of slugs) {
        const data = await getAdhkarBySlug(slug);
        if (data?.category) {
            dynamicCategories.add(data.category);
        }
    }
    const allCategories = Array.from(new Set([...Object.keys(categoryMap), ...dynamicCategories]));

    const categoryPages: MetadataRoute.Sitemap = allCategories.map(category => ({
        url: `${baseUrl}/duas/${category}`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.7,
    }));

    // 4. Dynamic Quran Pages
    const chapters = await getChapters();
    const quranPages: MetadataRoute.Sitemap = chapters.map(chapter => ({
        url: `${baseUrl}/sources/quran/${getSurahSlug(chapter.id)}`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.9,
    }));

    // 5. Prayer Time Pages
    const prayerPages: MetadataRoute.Sitemap = SUPPORTED_CITIES.map(city => ({
        url: `${baseUrl}/prayer-times/${city.countrySlug}/${city.slug}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
    }));

    return [...staticPages, ...adhkarPages, ...categoryPages, ...quranPages, ...prayerPages];
}
