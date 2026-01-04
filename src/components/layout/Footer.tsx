"use client";

import Link from "next/link";
import { useLanguage } from "@/lib/language-context";

export function Footer() {
    const { t } = useLanguage();

    return (
        <footer className="border-t bg-muted/30">
            <div className="container mx-auto px-4 py-8 max-w-5xl">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-sm text-muted-foreground">
                        {t.footer.copyright}
                    </div>
                    <nav className="flex items-center gap-6 text-sm text-muted-foreground">
                        <Link href="/about" className="hover:text-foreground transition-colors">
                            {t.nav.about}
                        </Link>
                        <Link href="/privacy" className="hover:text-foreground transition-colors">
                            {t.footer.privacy}
                        </Link>
                        <Link href="/sitemap.xml" className="hover:text-foreground transition-colors">
                            {t.footer.sitemap}
                        </Link>
                        <a
                            href="https://github.com/BahaMustafa/muslim-adhkar-web"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:text-foreground transition-colors"
                        >
                            GitHub
                        </a>
                    </nav>
                </div>
            </div>
        </footer>
    );
}
