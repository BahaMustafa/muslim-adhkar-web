import Link from 'next/link';
import { notFound } from 'next/navigation';
import { allAdhkar, collectionsData } from '@/lib/data';
import { AdhkarCard } from '@/components/AdhkarCard';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Metadata } from 'next';

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

    // Filter Adhkar belonging to this source (simple text match for the mock data)
    // In a real app we'd use IDs or exact source strings.
    const sourceAdhkar = allAdhkar.filter(a =>
        a.source.collection.toLowerCase().replace(/\s+/g, '-') === collection
    );

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
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
                    {sourceAdhkar.length} Adhkar Available
                </div>
            </header>

            <section>
                <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-100">
                    Adhkar from this Source
                </h2>
                {sourceAdhkar.length > 0 ? (
                    sourceAdhkar.map((adhkar) => (
                        <AdhkarCard key={adhkar.id} adhkar={adhkar} />
                    ))
                ) : (
                    <p className="text-gray-500 italic">No Adhkar currently listed from this source in our database.</p>
                )}
            </section>
        </div>
    );
}

export async function generateStaticParams() {
    // Generate params for all defined collections
    return Object.keys(collectionsData).map(slug => ({
        collection: slug
    }));
}
