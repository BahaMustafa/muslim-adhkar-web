import Link from "next/link";

export function Footer() {
    return (
        <footer className="border-t bg-muted/30">
            <div className="container mx-auto px-4 py-8 max-w-5xl">
                <div className="flex flex-col md:flex-row justify-between items-center gap-4">
                    <div className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} Muslim Adhkar. All rights reserved.
                    </div>
                    <nav className="flex items-center gap-6 text-sm text-muted-foreground">
                        <Link href="/about" className="hover:text-foreground transition-colors">
                            About
                        </Link>
                        <Link href="/privacy" className="hover:text-foreground transition-colors">
                            Privacy Policy
                        </Link>
                        <Link href="/sitemap.xml" className="hover:text-foreground transition-colors">
                            Sitemap
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
