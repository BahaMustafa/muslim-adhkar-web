import Link from 'next/link';
import { Metadata } from 'next';

export const metadata: Metadata = {
    title: 'About MuslimAdhkar.com - Methodology & Accuracy',
    description: 'Learn about our methodology for authenticating Adhkar from the Sunnah and our commitment to providing a Digital Waqf for the Ummah.',
};

export default function AboutPage() {
    return (
        <div className="container mx-auto px-4 py-8 max-w-4xl">
            <h1 className="text-4xl font-bold mb-8 text-center text-emerald-800">About MuslimAdhkar.com</h1>

            <div className="bg-white rounded-2xl shadow-sm border border-emerald-100 p-8 mb-8">
                <h2 className="text-2xl font-bold mb-4 text-emerald-700">Our Methodology & Accuracy</h2>
                <div className="prose max-w-none text-gray-700 space-y-4">
                    <p>
                        At MuslimAdhkar.com, we prioritize the authenticity of the Prophetic Sunnah. Our database is primarily sourced from the renowned collection "Hisnul Muslim" (Fortress of the Muslim) by Sheikh Sa'id bin Ali bin Wahf al-Qahtani.
                    </p>

                    <p>Every Adhkar entry on our platform includes:</p>
                    <ul className="list-disc pl-6 space-y-2">
                        <li><strong>Verified Arabic Text:</strong> Sourced from established Hadith narrations with full vocalization (Tashkeel) to ensure correct recitation.</li>
                        <li><strong>Authentic Audio:</strong> High-quality audio recitations provided for correct pronunciation, primarily by Sheikh Saad Al-Ghamdi, and hosted directly on our servers for speed and reliability.</li>
                        <li><strong>Source Transparency:</strong> We aim to provide the specific Hadith collection (e.g., Sahih Bukhari, Sahih Muslim) and reference numbers for every supplication.</li>
                    </ul>

                    <p className="mt-6 pt-6 border-t border-gray-100">
                        This site is a <strong>Digital Waqf</strong> (endowment)—it is free, ad-free, and built solely for the benefit of the Ummah. We do not track users or sell data.
                    </p>
                </div>
            </div>

            <div className="flex justify-center">
                <Link href="/duas" className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 rounded-full font-medium transition-colors duration-200">
                    Explore Adhkar Collection
                </Link>
            </div>
        </div>
    );
}
