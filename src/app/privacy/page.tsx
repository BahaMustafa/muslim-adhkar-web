import { Metadata } from "next";
import { cookies } from "next/headers";
import translations from "@/lib/translations.json";

export async function generateMetadata(): Promise<Metadata> {
    const cookieStore = await cookies();
    const lang = (cookieStore.get("NEXT_LOCALE")?.value || "en") as "en" | "ar";
    const t = translations[lang] || translations.en;
    return {
        title: `${t.pages.privacy.title} - ${t.branding.name}`,
        description: t.pages.privacy.intro.substring(0, 150) + "...",
    };
}

export default async function PrivacyPage() {
    const cookieStore = await cookies();
    const lang = (cookieStore.get("NEXT_LOCALE")?.value || "en") as "en" | "ar";
    const t = translations[lang] || translations.en;

    return (
        <main className="container mx-auto px-4 py-12 max-w-3xl">
            <h1 className="text-4xl font-bold mb-8 text-foreground/90">{t.pages.privacy.title}</h1>

            <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">

                <p>
                    {t.pages.privacy.intro}
                </p>

                <section className="bg-muted/30 p-6 rounded-lg border border-border">
                    <h2 className="text-xl font-semibold mb-2 text-foreground">{t.pages.privacy.promise_title}</h2>
                    <p>
                        <strong>{t.pages.privacy.promise_text}</strong>
                    </p>
                </section>

                <p>
                    {t.pages.privacy.no_data_text}
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">{t.pages.privacy.local_storage_title}</h2>
                <p>
                    {t.pages.privacy.local_storage_text}
                </p>

                <h2 className="text-2xl font-semibold mt-8 mb-4 text-foreground">{t.pages.privacy.contact_title}</h2>
                <p>
                    {t.pages.privacy.contact_text}
                </p>

            </div>
        </main>
    );
}
