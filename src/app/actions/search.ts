'use server';

import fs from 'fs';
import path from 'path';
import { getChapters } from '@/lib/quran';
import { getSurahSlug } from '@/lib/quran-mapping';
import { SearchResult } from '@/lib/search-types';

let searchIndexCache: SearchResult[] | null = null;

export async function getSearchIndex(): Promise<SearchResult[]> {
    if (searchIndexCache) return searchIndexCache;

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
                // Title is usually in pageTitle or pageDescription
                if (data.pageTitle) {
                    // Determine URL slug from filename
                    const slug = file.replace('.json', '');
                    results.push({
                        id: `adhkar-${slug}`,
                        title: data.pageTitle,
                        url: `/adhkar/${slug}`,
                        type: 'adhkar',
                        description: data.pageDescription || undefined,
                        keywords: [slug.replace(/-/g, ' ')]
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
                url: `/sources/quran/${slug}`,
                type: 'quran',
                description: `Surah ${chapter.translation}`,
                keywords: [
                    chapter.transliteration,
                    chapter.name,
                    chapter.translation,
                    `surah ${chapter.id}`
                ].filter(Boolean) as string[]
            });
        }
    } catch (e) {
        console.error('Error indexing Quran', e);
    }

    // 3. Static Sources
    results.push(
        { id: 'source-quran', title: 'The Noble Quran', url: '/sources/quran', type: 'source' },
        { id: 'source-hisnul', title: 'Hisnul Muslim', url: '/sources/hisnul-muslim', type: 'source' },
        { id: 'source-adhkar', title: 'Adhkar Collection', url: '/sources', type: 'source' }
    );

    searchIndexCache = results;
    return results;
}
