import Link from 'next/link';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Metadata } from 'next';
import { getAllAdhkarByCategory, getAllAdhkarSlugs, getAdhkarBySlug } from '@/lib/adhkar-service';
import { AdhkarPageData } from '@/lib/types';
import { categoryMap } from '@/lib/data';
import { cookies } from 'next/headers';
import translations from '@/lib/translations.json';

export async function generateMetadata(): Promise<Metadata> {
    const cookieStore = await cookies();
    const lang = (cookieStore.get("NEXT_LOCALE")?.value || "en") as "en" | "ar";
    const t = translations[lang] || translations.en;
    return {
        title: `${t.pages.duas.title} - ${t.branding.name}`,
        description: t.pages.duas.intro,
    };
}

export default async function DuasIndexPage() {
    const cookieStore = await cookies();
    const lang = (cookieStore.get("NEXT_LOCALE")?.value || "en") as "en" | "ar";
    const t = translations[lang] || translations.en;

    // Dynamically fetch all categories and their titles
    const slugs = await getAllAdhkarSlugs();
    const dynamicCategories = new Set<string>();
    const categoryCounts: Record<string, number> = {};
    const categoryTitles: Record<string, { en: string; ar: string }> = {};

    for (const slug of slugs) {
        const data = await getAdhkarBySlug(slug);
        if (data?.category) {
            dynamicCategories.add(data.category);
            categoryCounts[data.category] = (categoryCounts[data.category] || 0) + data.items.length;

            // Capture localized titles if not already set
            if (!categoryTitles[data.category]) {
                categoryTitles[data.category] = {
                    en: data.title || data.category.replace(/-/g, ' '),
                    ar: data.title_ar || data.title || data.category
                };
            }
        }
    }

    // Include static map categories in counts
    Object.keys(categoryMap).forEach(cat => {
        if (!categoryCounts[cat] && !dynamicCategories.has(cat)) {
            // Estimate or just list them. We might overlap if not careful.
            // For now, let's prioritize dynamic ones.
            categoryCounts[cat] = (categoryCounts[cat] || 0) + categoryMap[cat].length;
        }
    });

    const allCategories = Array.from(new Set([...Object.keys(categoryMap), ...dynamicCategories]))
        .filter(cat => ![
            'morning-adhkar',
            'evening-adhkar',
            'after-salah',
            'sleeping-adhkar',
            'waking-up-adhkar'
        ].includes(cat));

    return (
        <div className="max-w-5xl mx-auto px-4 py-8">
            <Breadcrumbs items={[
                { label: t.nav.duas, href: "/duas" }
            ]} />

            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
                    {t.pages.duas.title}
                </h1>
                <div className="max-w-3xl mx-auto prose dark:prose-invert text-lg text-gray-600 dark:text-gray-300">
                    <p>
                        {t.pages.duas.intro}
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allCategories.map((category) => {
                    const staticTitle = (t.category_titles as Record<string, string>)[category];

                    const title = lang === 'ar'
                        ? (categoryTitles[category]?.ar || staticTitle || category)
                        : (categoryTitles[category]?.en || staticTitle || category.replace(/-/g, ' '));

                    return (
                        <Link
                            key={category}
                            href={`/duas/${category}`}
                            className="group block bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all hover:border-emerald-500/50"
                        >
                            <div className="flex flex-col h-full justify-between">
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 capitalize mb-2">
                                        {title}
                                    </h3>
                                    <p className="text-sm text-gray-500 dark:text-gray-400">
                                        {lang === 'ar' ? `مجموعة ${title}` : `Collection of ${title}`}
                                    </p>
                                </div>
                                <div className="mt-4 flex items-center text-sm font-medium text-emerald-600 dark:text-emerald-500">
                                    <span>{categoryCounts[category] || 'Various'} {lang === 'ar' ? 'ذكر' : 'Items'}</span>
                                    <svg className={`w-4 h-4 ${lang === 'ar' ? 'mr-2 rotate-180' : 'ml-2'} group-hover:translate-x-1 transition-transform`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                </div>
                            </div>
                        </Link>
                    );
                })}
            </div>
        </div>
    );
}
