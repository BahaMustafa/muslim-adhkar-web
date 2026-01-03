import Link from 'next/link';
import { notFound } from 'next/navigation';
import { collectionsData } from '@/lib/data';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Metadata } from 'next';
import { getAllAdhkarSlugs, getAdhkarBySlug } from '@/lib/adhkar-service';

export async function generateMetadata({ params }: { params: Promise<{ collection: string }> }): Promise<Metadata> {
    const { collection } = await params;
    const collectionInfo = collectionsData[collection];

    if (!collectionInfo) {
        return { title: 'Source Not Found' };
    }

    return {
        title: `${collectionInfo.title} - Authentic Adhkar Source`,
        description: `Browse all Adhkar and Duas sourced from ${collectionInfo.title}. ${collectionInfo.description}`,
    };
}


export default async function SourcePage({ params }: { params: Promise<{ collection: string }> }) {
    const { collection } = await params;
    const collectionInfo = collectionsData[collection];

    if (!collectionInfo) {
        notFound();
    }

    // For Hisnul Muslim, we display EVERYTHING as it is the source of our current dataset.
    // For others (Quran/Bukhari), we would filter if we had source metadata in the JSONs.
    // Currently all our JSONs are effectively Hisnul Muslim.
    let displayedCategories: import('@/lib/types').AdhkarPageData[] = [];

    if (collection === 'hisnul-muslim') {
        const slugs = await getAllAdhkarSlugs();
        const dataPromises = slugs.map(slug => getAdhkarBySlug(slug));
        const allData = await Promise.all(dataPromises);

        displayedCategories = allData.filter(d => d !== null).sort((a, b) => a!.title.localeCompare(b!.title));
    } else {
        // Placeholder or filtered list for other sources
        // In V1, we assume all content is HM-compatible, ensuring the HM page is the master index.
        displayedCategories = [];
    }

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <Breadcrumbs items={[
                { label: "Sources", href: "/sources" },
                { label: collectionInfo.title, href: `/sources/${collection}` }
            ]} />

            <header className="mb-12 border-b pb-8 dark:border-neutral-800">
                <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white capitalize">
                    {collectionInfo.title}
                </h1>
                <div className="prose dark:prose-invert max-w-none text-lg text-gray-600 dark:text-gray-300">
                    <p>{collectionInfo.description}</p>
                </div>
                <div className="mt-4 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-100 dark:bg-neutral-800 text-gray-800 dark:text-gray-200">
                    {displayedCategories.length} Categories Indexed
                </div>
            </header>

            <section>
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
                    Complete Index
                </h2>

                {displayedCategories.length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {displayedCategories.map((cat) => (
                            <Link
                                key={cat!.category} // category slug is hidden in 'category' field usually matches filename but getting category name is safer? 
                                // Actually getAdhkarBySlug returns the object which has title. 
                                // We need the slug relative to /duas (general) or /adhkar?
                                // The instructions say this is the physical book index. Linking to the general /duas/[category] is safest for canonical URL.
                                href={['morning-adhkar', 'evening-adhkar', 'after-salah', 'sleeping-adhkar', 'waking-up-adhkar'].includes(cat!.category) ? `/adhkar/${cat!.category}` : `/duas/${cat!.category}`}
                                className="group block bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all hover:border-emerald-500/50"
                            >
                                <h3 className="text-xl font-bold text-gray-800 dark:text-gray-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 mb-2">
                                    {cat!.title}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {cat!.items.length} Items
                                </p>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 bg-gray-50 rounded-lg">
                        <p className="text-gray-500">
                            {collection === 'hisnul-muslim' ? 'Loading index...' : 'Content for this specific source compilation coming soon. Please browse the main directory.'}
                        </p>
                        {collection !== 'hisnul-muslim' && (
                            <Link href="/duas" className="mt-4 inline-block text-emerald-600 hover:underline">Go to Main Directory</Link>
                        )}
                    </div>
                )}
            </section>
        </div>
    );
}

export async function generateStaticParams() {
    return Object.keys(collectionsData).map(slug => ({
        collection: slug
    }));
}
