export interface SearchResult {
    id: string;
    title: string;
    arabicTitle?: string;
    url: string;
    type: 'adhkar' | 'quran' | 'source';
    description?: string;
    keywords?: string[]; // For better search matching
}
