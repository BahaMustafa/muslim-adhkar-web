import { AdhkarCard } from '@/components/AdhkarCard';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getAdhkarBySlug, getAllAdhkarSlugs } from '@/lib/adhkar-service';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const pageData = await getAdhkarBySlug(slug);

    if (!pageData) {
        return { title: 'Adhkar Not Found' };
    }

    return {
        title: `${pageData.title} - Authentic Daily Remembrances`,
        description: pageData.description,
        openGraph: {
            title: pageData.title,
            description: pageData.description,
            type: 'article',
            modifiedTime: pageData.lastVerified
        },
        other: {
            'last-modified': pageData.lastVerified
        }
    };
}

export default async function AdhkarPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const pageData = await getAdhkarBySlug(slug);

    if (!pageData) {
        notFound();
    }

    const { title, description, items, lastVerified } = pageData;

    // JSON-LD Schema
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": `How to perform ${title}`,
        "description": description,
        "dateModified": lastVerified,
        "step": items.map((adhkar, index) => ({
            "@type": "HowToStep",
            "position": index + 1,
            "name": adhkar.title,
            "text": `Recite ${adhkar.title} ${adhkar.count} times.`,
            "url": `https://muslim-adhkar.com/adhkar/${slug}#${adhkar.slug}`
        }))
    };

    return (
        <div className="max-w-3xl mx-auto px-4 py-8">
            <Breadcrumbs items={[
                { label: "Adhkar", href: "/adhkar" },
                { label: title, href: `/adhkar/${slug}` }
            ]} />

            <header className="mb-10 text-center">
                <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white capitalize">
                    {title}
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                    {description}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                    Last Verified: {lastVerified}
                </p>
            </header>

            <section aria-label="Adhkar List">
                {items.map((adhkar) => (
                    <div key={adhkar.id} id={adhkar.slug}>
                        <AdhkarCard adhkar={adhkar} />
                    </div>
                ))}
            </section>

            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />
        </div>
    );
}

export async function generateStaticParams() {
    const slugs = await getAllAdhkarSlugs();
    return slugs.map(slug => ({
        slug: slug
    }));
}
