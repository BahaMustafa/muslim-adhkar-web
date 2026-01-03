import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'Adhkar Sources - Authentic References',
    description: 'Authentic sources of Adhkar and Duas including Hisnul Muslim and Sahih Bukhari.',
};

export default function SourcesPage() {
    const sources = [
        {
            id: 'hisnul-muslim',
            title: 'Hisnul Muslim',
            description: 'Fortress of the Muslim - The most authentic collection of daily Adhkar by Sheikh Sa\'id bin Ali bin Wahf al-Qahtani.',
            count: '130+ Daily Adhkar'
        },
        {
            id: 'quran',
            title: 'The Holy Quran',
            description: 'Supplications (Duas) directly from the Book of Allah.',
            count: 'Selected Duas'
        },
        {
            id: 'bukhari',
            title: 'Sahih Bukhari',
            description: 'Authentic narrations from the most trusted book after the Quran.',
            count: 'Selected Hadith'
        }
    ];

    return (
        <div className="container mx-auto px-4 py-8">
            <h1 className="text-3xl font-bold mb-8 text-center text-emerald-800">Authentic Sources</h1>
            <p className="text-gray-600 text-center mb-12 max-w-2xl mx-auto">
                We strictly adhere to authentic narrations. All content on this platform is verified against these foundational texts.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
                {sources.map((source) => (
                    <Link
                        key={source.id}
                        href={`/sources/${source.id}`}
                        className="block bg-white rounded-xl shadow-sm border border-emerald-100 p-6 hover:shadow-md transition-shadow"
                    >
                        <h2 className="text-xl font-bold text-gray-800 mb-2">{source.title}</h2>
                        <div className="text-sm font-medium text-emerald-600 mb-4 bg-emerald-50 inline-block px-3 py-1 rounded-full">
                            {source.count}
                        </div>
                        <p className="text-gray-600">
                            {source.description}
                        </p>
                    </Link>
                ))}
            </div>

            <div className="mt-16 text-center">
                <Link href="/duas" className="text-emerald-600 hover:text-emerald-700 font-medium">
                    Back to Adhkar Collection →
                </Link>
            </div>
        </div>
    );
}
