export interface Adhkar {
    id: string;
    slug: string;
    title: string;
    title_ar?: string;
    arabic: string;
    transliteration: string;
    translation: string;
    source: {
        collection: string;
        reference: string;
    };
    virtue: string;
    count: number;
    lastVerified?: string;
    audioFile?: string;
    reciter?: string;
}

export interface AdhkarPageData {
    title: string;
    title_ar?: string;
    description: string;
    description_ar?: string;
    category: string;
    seoContent?: string; // For 200+ words SEO text
    lastVerified: string;
    items: Adhkar[];
}
