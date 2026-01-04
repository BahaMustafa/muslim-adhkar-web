import { AdhkarCard } from '@/components/AdhkarCard';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { getAdhkarBySlug, getAllAdhkarSlugs } from '@/lib/adhkar-service';
import { cookies } from 'next/headers';
import translations from '@/lib/translations.json';

import { constructMetadata } from '@/components/SEO';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const pageData = await getAdhkarBySlug(slug);
    const cookieStore = await cookies();
    const lang = (cookieStore.get("NEXT_LOCALE")?.value || "en") as "en" | "ar";

    if (!pageData) {
        return constructMetadata({ title: 'Adhkar Not Found', lang });
    }

    const transKey = slug.replaceAll('-', '_');
    // @ts-ignore
    const titleAr = translations.ar.category_titles[transKey];
    const displayTitle = lang === 'ar' ? (pageData.title_ar || titleAr || pageData.title) : pageData.title;
    const description = lang === 'ar' ? (pageData.description_ar || pageData.description) : pageData.description;

    return constructMetadata({
        title: displayTitle,
        description: description,
        path: `/adhkar/${slug}`,
        lang: lang
    });
}

export default async function AdhkarPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const pageData = await getAdhkarBySlug(slug);
    const cookieStore = await cookies();
    const lang = (cookieStore.get("NEXT_LOCALE")?.value || "en") as "en" | "ar";

    if (!pageData) {
        notFound();
    }

    const { title, description, items, lastVerified } = pageData;

    // Localization Logic
    const transKey = slug.replaceAll('-', '_');
    // @ts-ignore
    const titleAr = translations.ar.category_titles[transKey];
    const displayTitle = lang === 'ar' ? (pageData.title_ar || titleAr || title) : title;
    const displayDescription = lang === 'ar' ? (pageData.description_ar || description) : description;

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
                { label: lang === 'ar' ? translations.ar.nav.adhkar : "Adhkar", href: "/adhkar" },
                { label: displayTitle, href: `/adhkar/${slug}` }
            ]} />

            <header className="mb-10 text-center">
                <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white capitalize">
                    {displayTitle}
                </h1>
                <p className="text-xl text-gray-600 dark:text-gray-300">
                    {displayDescription}
                </p>
                <p className="text-xs text-gray-400 mt-2">
                    {lang === 'ar' ? 'آخر تحقق:' : 'Last Verified:'} {new Intl.DateTimeFormat(lang === 'ar' ? 'ar-EG' : 'en-US', { dateStyle: 'long' }).format(new Date(lastVerified))}
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
