
const CDN_BASE = 'https://cdn.jsdelivr.net/npm/quran-json@3.1.2/dist';

export interface QuranChapter {
    id: number;
    name: string;
    transliteration: string;
    translation?: string; // Some indexes might have it
    type: string;
    total_verses: number;
    link?: string;
}

export interface QuranVerse {
    id: number; // Ayah number in Surah
    text: string; // Arabic
    translation?: string;
    transliteration?: string;
}

export interface QuranChapterDetail extends QuranChapter {
    verses: QuranVerse[];
}

// Map of Language Code -> Name
export const QURAN_LANGUAGES = [
    { code: 'en', name: 'English' },
    { code: 'ur', name: 'Urdu' },
    { code: 'fr', name: 'French' },
    { code: 'es', name: 'Spanish' },
    { code: 'id', name: 'Indonesian' },
    { code: 'ru', name: 'Russian' },
    { code: 'tr', name: 'Turkish' },
    { code: 'zh', name: 'Chinese' },
    { code: 'bn', name: 'Bengali' },
];

// Cache for chapters index
let _chaptersCache: QuranChapter[] | null = null;
let _cumulativeVersesCache: number[] | null = null;

export async function getChapters(): Promise<QuranChapter[]> {
    if (_chaptersCache) return _chaptersCache;
    try {
        const res = await fetch(`${CDN_BASE}/chapters/index.json`, { next: { revalidate: 3600 } });
        if (!res.ok) throw new Error('Failed to fetch chapters');
        _chaptersCache = await res.json();
        return _chaptersCache!;
    } catch (e) {
        console.error(e);
        return [];
    }
}

export async function getChapterDetail(id: number, lang: string = 'en'): Promise<QuranChapterDetail | null> {
    try {
        const res = await fetch(`${CDN_BASE}/chapters/${lang}/${id}.json`, { next: { revalidate: 3600 } });
        if (!res.ok) throw new Error(`Failed to fetch chapter ${id} in ${lang}`);
        return await res.json();
    } catch (e) {
        console.error(e);
        return null;
    }
}

// Calculate Global Ayah ID for Audio
// We need the verse counts of all previous surahs.
async function getCumulativeVerses(): Promise<number[]> {
    if (_cumulativeVersesCache) return _cumulativeVersesCache;
    const chapters = await getChapters();
    const counts: number[] = [0]; // Index 0 -> Surah 1 start offset (0)
    let total = 0;
    // We want: cumulative[i] = Sum(verses of surahs 1..i)
    // Audio ID for Surah S, Ayah A = (Sum of verses of Surahs 1..S-1) + A
    for (let i = 0; i < 114; i++) {
        // chaptersId is 1-based, array is 0-based.
        // Assuming chapters are sorted by ID in index.json (they usually are)
        // Check finding by ID to be safe
        const ch = chapters.find(c => c.id === (i + 1));
        if (ch) {
            total += ch.total_verses;
            counts.push(total); // count[1] = total verses of surah 1
        } else {
            // Fallback for missing data? 
            counts.push(total);
        }
    }
    _cumulativeVersesCache = counts;
    return counts;
}

export async function getGlobalAyahId(surahId: number, ayahId: number): Promise<number> {
    const cumulative = await getCumulativeVerses();
    // Offset for Surah S is stored at index S-1?
    // cumulative[0] = 0 (Start of Surah 1)
    // cumulative[1] = 7 (End of Surah 1 / Start of Surah 2)
    // Global ID = cumulative[surahId - 1] + ayahId
    if (surahId < 1 || surahId > 114) return 0;
    const offset = cumulative[surahId - 1];
    return offset + ayahId;
}

export function getAudioUrl(globalAyahId: number): string {
    return `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${globalAyahId}.mp3`;
}
