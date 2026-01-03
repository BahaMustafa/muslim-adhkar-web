export const metadata = {
    title: "Privacy Policy - Muslim Adhkar",
    description: "Our commitment to your privacy.",
};

export default function PrivacyPage() {
    return (
        <main className="container mx-auto px-4 py-12 max-w-3xl">
            <h1 className="text-4xl font-bold mb-8 text-foreground/90">Privacy Policy</h1>

            <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">

                <p>
                    At <strong>MuslimAdhkar.com</strong>, we prioritize your privacy above all else.
                    This Privacy Policy outlines the types of personal information that is received and collected by us and how it is used.
                </p>

                <section className="bg-muted/30 p-6 rounded-lg border border-border">
                    <h2 className="text-xl font-semibold mb-2 text-foreground">Our Promise</h2>
                    <p>
                        <strong>MuslimAdhkar.com does not collect personal user data.</strong>
                    </p>
                </section>

                <p>
                    We do not require you to create an account, log in, or provide any personal information to use our website.
                    All Adhkar, Duas, and audio resources are freely available to everyone without tracking or data harvesting.
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">Local Storage</h2>
                <p>
                    We may use your browser's local storage to save your preferences, such as your selected language (English/Arabic) or dark mode settings.
                    This data stays on your device and is never sent to our servers.
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">Contact Us</h2>
                <p>
                    If you have any questions about our Privacy Policy, please feel free to contact us via our GitHub or social media channels.
                </p>

            </div>
        </main>
    );
}
