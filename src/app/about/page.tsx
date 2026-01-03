export const metadata = {
    title: "About Us - Muslim Adhkar",
    description: "Learn about our mission to provide authentic Adhkar and Duas to the global Ummah.",
};

export default function AboutPage() {
    return (
        <main className="container mx-auto px-4 py-12 max-w-3xl">
            <h1 className="text-4xl font-bold mb-8 text-foreground/90">About Muslim Adhkar</h1>

            <div className="space-y-8 text-lg leading-relaxed text-muted-foreground">

                <section>
                    <h2 className="text-2xl font-semibold mb-3 text-foreground">Mission</h2>
                    <p>
                        To provide the global Ummah with a fast, ad-free, and authentic resource for daily remembrances.
                        We believe that accessing the words of Allah (SWT) and His Prophet (ﷺ) should be simple, beautiful, and distracting-free.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-3 text-foreground">Methodology</h2>
                    <p>
                        Our content is primarily sourced from the recognized book <strong>Hisnul Muslim</strong> (Fortress of the Muslim) and the <strong>Noble Quran Encyclopedia</strong>.
                        We organize these Adhkar and Duas into intuitive categories to help you find exactly what you need for every occasion in your daily life.
                    </p>
                </section>

                <section>
                    <h2 className="text-2xl font-semibold mb-3 text-foreground">Authenticity</h2>
                    <p>
                        We take authenticity seriously. We use verified Arabic scripts and high-quality audio by <strong>Sheikh Saad Al-Ghamdi</strong> to ensure accuracy in recitation.
                        Every translation and transliteration is double-checked against established sources to ensure the correct meaning is conveyed.
                    </p>
                </section>

            </div>
        </main>
    );
}
