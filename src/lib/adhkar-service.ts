import fs from 'fs';
import path from 'path';
import { AdhkarPageData } from './types';

const dataDirectory = path.join(process.cwd(), 'src/data/adhkar-items');

export async function getAdhkarBySlug(slug: string): Promise<AdhkarPageData | null> {
    const filePath = path.join(dataDirectory, `${slug}.json`);

    try {
        const fileContents = fs.readFileSync(filePath, 'utf8');
        const data = JSON.parse(fileContents);
        return data as AdhkarPageData;
    } catch (error) {
        console.error(`Error reading adhkar file for slug ${slug}:`, error);
        return null;
    }
}

export async function getAllAdhkarSlugs(): Promise<string[]> {
    try {
        if (!fs.existsSync(dataDirectory)) {
            return [];
        }
        const fileNames = fs.readdirSync(dataDirectory);
        return fileNames
            .filter(fileName => fileName.endsWith('.json'))
            .map(fileName => fileName.replace(/\.json$/, ''));
    } catch (error) {
        console.error('Error reading adhkar directory:', error);
        return [];
    }
}

export async function getAllAdhkarByCategory(category: string): Promise<AdhkarPageData[]> {
    const slugs = await getAllAdhkarSlugs();
    const allAdhkarPromises = slugs.map(slug => getAdhkarBySlug(slug));
    const allAdhkar = (await Promise.all(allAdhkarPromises)).filter((item): item is AdhkarPageData => item !== null);

    // Normalize category for comparison (optional)
    const normalizedCategory = category.toLowerCase().trim();

    return allAdhkar.filter(page => page.category?.toLowerCase() === normalizedCategory);
}
