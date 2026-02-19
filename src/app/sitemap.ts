import { MetadataRoute } from 'next';
import { getAllAdhkarSlugs, getAdhkarBySlug } from '@/lib/adhkar-service';
import { SUPPORTED_CITIES } from '@/lib/prayer-utils';
import { categoryMap } from '@/lib/data';
import { getChapters } from '@/lib/quran';
import { getSurahSlug } from '@/lib/quran-mapping';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://www.muslimadhkar.com';

    const staticPages: MetadataRoute.Sitemap = [
        { url: baseUrl, changeFrequency: 'daily', priority: 1 },
        { url: `${baseUrl}/adhkar`, changeFrequency: 'weekly', priority: 0.9 },
        { url: `${baseUrl}/duas`, changeFrequency: 'weekly', priority: 0.9 },
        { url: `${baseUrl}/sources`, changeFrequency: 'weekly', priority: 0.8 },
        { url: `${baseUrl}/sources/quran`, changeFrequency: 'weekly', priority: 0.8 },
        { url: `${baseUrl}/sources/hisnul-muslim`, changeFrequency: 'weekly', priority: 0.7 },
        { url: `${baseUrl}/prayer-times`, changeFrequency: 'daily', priority: 0.8 },
        { url: `${baseUrl}/about`, changeFrequency: 'monthly', priority: 0.4 },
        { url: `${baseUrl}/privacy`, changeFrequency: 'yearly', priority: 0.3 },
    ];

    const slugs = await getAllAdhkarSlugs();
    const adhkarData = await Promise.all(
        slugs.map(async (slug) => {
            const data = await getAdhkarBySlug(slug);
            return { slug, data };
        })
    );

    const adhkarPages: MetadataRoute.Sitemap = adhkarData.map(({ slug, data }) => ({
        url: `${baseUrl}/adhkar/${slug}`,
        lastModified: data?.lastVerified ? new Date(data.lastVerified) : undefined,
        changeFrequency: 'monthly',
        priority: 0.7,
    }));

    const dynamicCategories = new Set<string>();
    for (const { data } of adhkarData) {
        if (data?.category) {
            dynamicCategories.add(data.category);
        }
    }
    const allCategories = Array.from(new Set([...Object.keys(categoryMap), ...dynamicCategories]));

    const categoryPages: MetadataRoute.Sitemap = allCategories.map((category) => ({
        url: `${baseUrl}/duas/${category}`,
        changeFrequency: 'weekly',
        priority: 0.7,
    }));

    const chapters = await getChapters();
    const quranPages: MetadataRoute.Sitemap = chapters.map((chapter) => ({
        url: `${baseUrl}/sources/quran/${getSurahSlug(chapter.id)}`,
        changeFrequency: 'monthly',
        priority: 0.8,
    }));

    const prayerPages: MetadataRoute.Sitemap = SUPPORTED_CITIES.map((city) => ({
        url: `${baseUrl}/prayer-times/${city.countrySlug}/${city.slug}`,
        changeFrequency: 'daily',
        priority: 0.8,
    }));

    return [...staticPages, ...adhkarPages, ...categoryPages, ...quranPages, ...prayerPages];
}
