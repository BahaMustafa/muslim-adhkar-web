import { getChapters, getGlobalAyahId } from '@/lib/quran';
import { getSurahSlug } from '@/lib/quran-mapping';

const baseUrl = 'https://muslim-adhkar.com';

export async function GET() {
    const chapters = await getChapters();

    // We need to generate urls for every verse.
    // This is expensive to calculate on the fly for 6236 verses if not optimized,
    // but let's try.
    // format: <url><loc>...</loc></url>

    let urls = '';

    for (const chapter of chapters) {
        const slug = getSurahSlug(chapter.id);
        for (let i = 1; i <= chapter.total_verses; i++) {
            urls += `
  <url>
    <loc>${baseUrl}/sources/quran/${slug}/${i}</loc>
    <changefreq>yearly</changefreq>
    <priority>0.6</priority>
  </url>`;
        }
    }

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

    return new Response(sitemap, {
        headers: {
            'Content-Type': 'application/xml',
        },
    });
}
