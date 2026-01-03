const fs = require('fs');
const path = require('path');

const sourcePath = path.join(__dirname, '../node_modules/quran-json/dist/chapters/index.json');
const rawData = fs.readFileSync(sourcePath, 'utf8');
const chapters = JSON.parse(rawData);

const mapping = {};
const reverseMapping = {};

chapters.forEach(chapter => {
    // Basic slugify: remove ' and spaces
    // e.g. "Al-Fatihah" -> "surah-al-fatihah"
    // "Ali 'Imran" -> "surah-ali-imran"
    let slug = chapter.transliteration
        .toLowerCase()
        .replace(/'/g, '')
        .replace(/\s+/g, '-');

    slug = `surah-${slug}`;

    mapping[chapter.id] = slug;
    reverseMapping[slug] = chapter.id;
});

const fileContent = `
/**
 * Auto-generated mapping between Surah IDs and Semantic Slugs.
 */

// Map ID (number) -> Slug (string)
export const SURAH_ID_TO_SLUG: Record<number, string> = ${JSON.stringify(mapping, null, 4)};

// Map Slug (string) -> ID (number)
export const SURAH_SLUG_TO_ID: Record<string, number> = ${JSON.stringify(reverseMapping, null, 4)};

// Helper
export function getSurahSlug(id: number): string {
    return SURAH_ID_TO_SLUG[id] || id.toString();
}

export function getSurahIdFromSlug(slug: string): number | null {
    // If it's a number string "1", accept it too for backward compat if needed? 
    // Or strict slug only. Let's try strict first, but safe.
    if (SURAH_SLUG_TO_ID[slug]) return SURAH_SLUG_TO_ID[slug];
    
    // Maybe it's a number?
    const parsed = parseInt(slug);
    if (!isNaN(parsed) && parsed >= 1 && parsed <= 114) return parsed;
    
    return null;
}
`;

fs.writeFileSync(path.join(__dirname, '../src/lib/quran-mapping.ts'), fileContent);
console.log('Mapping file generated at src/lib/quran-mapping.ts');
