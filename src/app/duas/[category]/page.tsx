import Link from 'next/link';
import { notFound } from 'next/navigation';
import { AdhkarCard } from '@/components/AdhkarCard';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Metadata } from 'next';
import { getAllAdhkarByCategory, getAllAdhkarSlugs, getAdhkarBySlug } from '@/lib/adhkar-service';
import { AdhkarPageData } from '@/lib/types';
import { allAdhkar, categoryMap } from '@/lib/data'; // Fallback for statically mapped categories

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }): Promise<Metadata> {
    const { category } = await params;
    // Simple title casing
    const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ');

    return {
        title: `${categoryTitle} Duas - Muslim Adhkar`,
        description: `Collection of authentic ${categoryTitle} Duas and Adhkar.`,
    };
}

export default async function DuaCategoryPage({ params }: { params: Promise<{ category: string }> }) {
    const { category } = await params;

    // 1. Try fetching from dynamic JSON files first
    const dynamicAdhkarPages = await getAllAdhkarByCategory(category);
    let categoryAdhkarItems: any[] = [];
    let seoContent = "";

    // If dynamic pages exist for this category (e.g. morning-adhkar), aggregate their items
    if (dynamicAdhkarPages.length > 0) {
        dynamicAdhkarPages.forEach(page => {
            categoryAdhkarItems = [...categoryAdhkarItems, ...page.items];
            if (page.seoContent && !seoContent) seoContent = page.seoContent; // Take the first SEO content found
        });
    }

    // 2. Fallback or Additional: Check static map for singular Adhkar IDs (legacy/individual duas)
    if (categoryMap[category]) {
        const staticIds = categoryMap[category];
        const staticItems = allAdhkar.filter(a => staticIds.includes(a.id));
        // Avoid duplicates if possible, though simplistic here
        categoryAdhkarItems = [...categoryAdhkarItems, ...staticItems];
    }

    // 3. If no items found at all, return 404
    if (categoryAdhkarItems.length === 0) {
        notFound();
    }

    // Deduplicate by ID
    categoryAdhkarItems = Array.from(new Map(categoryAdhkarItems.map(item => [item.id, item])).values());

    const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1).replace('-', ' ');

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <Breadcrumbs items={[
                { label: "Duas", href: "/duas" },
                { label: categoryTitle, href: `/duas/${category}` }
            ]} />

            <header className="mb-10 text-center">
                <div className="sticky top-0 z-20 bg-white/95 dark:bg-black/95 backdrop-blur-sm py-4 -mx-4 px-4 border-b border-gray-100 dark:border-neutral-800 shadow-sm transition-all">
                    <h1 className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white capitalize">
                        {categoryTitle} Duas
                    </h1>
                </div>
                <div className="pt-6">
                    <p className="text-xl text-gray-600 dark:text-gray-300 mb-6">
                        Authentic supplications for {categoryTitle.toLowerCase()}.
                    </p>
                    {seoContent && (
                        <div className="prose dark:prose-invert max-w-none text-left bg-gray-50 dark:bg-neutral-800/50 p-6 rounded-lg border border-gray-100 dark:border-neutral-800">
                            <p>{seoContent}</p>
                        </div>
                    )}
                </div>
            </header>

            <section className="space-y-8">
                {categoryAdhkarItems.length > 0 ? (
                    categoryAdhkarItems.map((adhkar) => (
                        <div key={adhkar.id}>
                            <AdhkarCard adhkar={adhkar} />
                        </div>
                    ))
                ) : (
                    <p className="text-center text-gray-500">No Duas found in this category.</p>
                )}
            </section>
        </div>
    );
}

export async function generateStaticParams() {
    // Combine static map keys AND dynamic categories discovered from JSONs
    const staticCategories = Object.keys(categoryMap);

    const slugs = await getAllAdhkarSlugs();
    const dynamicCategories = new Set<string>();

    for (const slug of slugs) {
        const data = await getAdhkarBySlug(slug);
        if (data?.category) {
            dynamicCategories.add(data.category);
        }
    }

    const allCategories = Array.from(new Set([...staticCategories, ...dynamicCategories]));

    return allCategories.map(cat => ({
        category: cat
    }));
}
