import { getAllAdhkar } from './adhkar-service';

export async function getRelatedAdhkar(surahName: string, surahId: number) {
    const allAdhkar = await getAllAdhkar();

    // Normalize names
    const searchTerms = [
        `Surah ${surahName}`,
        `Surah Al-${surahName.replace(/^Al-/, '')}`,
        `Surah number ${surahId}`,
    ];

    const related: any[] = [];

    allAdhkar.forEach(page => {
        const matches = page.items.filter(item => {
            const ref = item.source?.reference || "";
            const virtue = item.virtue || "";
            return searchTerms.some(term =>
                ref.toLowerCase().includes(term.toLowerCase()) ||
                virtue.toLowerCase().includes(term.toLowerCase())
            );
        });

        if (matches.length > 0) {
            related.push({
                pageTitle: page.title,
                pageSlug: page.category,
                items: matches.map(m => ({
                    id: m.id,
                    title: m.title,
                    text: m.translation || m.arabic,
                    link: `/adhkar/${page.category}#${m.id}`
                }))
            });
        }
    });

    return related;
}
