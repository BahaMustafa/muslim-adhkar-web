import Link from 'next/link';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { Metadata } from 'next';
import { getAllAdhkarByCategory, getAllAdhkarSlugs, getAdhkarBySlug } from '@/lib/adhkar-service';
import { AdhkarPageData } from '@/lib/types';
import { categoryMap } from '@/lib/data';

export const metadata: Metadata = {
    title: 'Authentic Adhkar & Duas Directory - Muslim Adhkar',
    description: 'Explore our complete directory of authentic Adhkar and Duas categorized by daily routines, morning, evening, and specific needs. Based on Quran and Sunnah.',
};

export default async function DuasIndexPage() {
    // Dynamically fetch all categories
    const slugs = await getAllAdhkarSlugs();
    const dynamicCategories = new Set<string>();
    const categoryCounts: Record<string, number> = {};

    for (const slug of slugs) {
        const data = await getAdhkarBySlug(slug);
        if (data?.category) {
            dynamicCategories.add(data.category);
            categoryCounts[data.category] = (categoryCounts[data.category] || 0) + data.items.length;
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
                { label: "Duas", href: "/duas" }
            ]} />

            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold mb-6 text-gray-900 dark:text-white">
                    Authentic Adhkar & Duas Directory
                </h1>
                <div className="max-w-3xl mx-auto prose dark:prose-invert text-lg text-gray-600 dark:text-gray-300">
                    <p>
                        Welcome to the comprehensive directory of authentic remembrances (Adhkar) and supplications (Duas) from the Quran and Sunnah.
                    </p>
                    <p>
                        In Islam, maintaining a constant connection with Allah through Dhikr is the key to spiritual tranquility and protection. Allah says in the Quran: <em>"Verily, in the remembrance of Allah do hearts find rest"</em> (13:28).
                    </p>
                    <p>
                        Our collection is meticulously categorized to help you find the right Dua for every moment of your day—whether you are waking up, seeking protection in the evening, or looking for specific guidance. Each entry is verified against authentic sources like Sahih Bukhari and Sahih Muslim.
                    </p>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allCategories.map((category) => (
                    <Link
                        key={category}
                        href={`/duas/${category}`}
                        className="group block bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm hover:shadow-md transition-all hover:border-emerald-500/50"
                    >
                        <div className="flex flex-col h-full justify-between">
                            <div>
                                <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 capitalize mb-2">
                                    {category.replace('-', ' ')}
                                </h3>
                                <p className="text-sm text-gray-500 dark:text-gray-400">
                                    Collection of {category.replace('-', ' ')} Adhkar
                                </p>
                            </div>
                            <div className="mt-4 flex items-center text-sm font-medium text-emerald-600 dark:text-emerald-500">
                                <span>{categoryCounts[category] || 'Various'} Items</span>
                                <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                </svg>
                            </div>
                        </div>
                    </Link>
                ))}
            </div>
        </div>
    );
}
