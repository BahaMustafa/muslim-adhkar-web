"use client";

import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search } from "lucide-react";
import LanguageSelector from "@/components/quran/LanguageSelector";
import { useLanguage } from "@/lib/language-context";
import { SiteLanguageSwitch } from "./SiteLanguageSwitch";

export function Header() {
    const { t } = useLanguage();
    const openSearch = () => {
        window.dispatchEvent(new CustomEvent("open-command-palette"));
    };

    return (
        <header className="sticky top-0 z-40 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center px-4 max-w-5xl mx-auto">
                {/* Logo */}
                <div className="hidden md:flex items-center gap-6">
                    <Link href="/" className="flex items-center gap-2">
                        <Image src="/logo.png" alt="Muslim Adhkar" width={32} height={32} className="rounded-sm" />
                        <span className="hidden font-bold sm:inline-block">{t.branding?.name || "Muslim Adhkar"}</span>
                    </Link>
                    <nav className="flex items-center gap-6 text-sm font-medium">
                        <Link href="/adhkar" className="transition-colors hover:text-foreground/80 text-foreground/60">{t.nav.adhkar}</Link>
                        <Link href="/duas" className="transition-colors hover:text-foreground/80 text-foreground/60">{t.nav.duas}</Link>
                        <Link href="/sources" className="transition-colors hover:text-foreground/80 text-foreground/60">{t.nav.sources}</Link>
                    </nav>
                </div>

                {/* Mobile Logo */}
                <Link href="/" className="mr-auto md:hidden flex items-center gap-2 font-bold">
                    <Image src="/logo.png" alt="Logo" width={28} height={28} />
                    <span>{t.branding.name}</span>
                </Link>

                {/* Search Trigger */}
                <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end">
                    <div className="w-full flex-1 md:w-auto md:flex-none">
                        <button
                            onClick={openSearch}
                            className="inline-flex items-center rounded-md font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground h-9 px-4 py-2 relative w-full justify-start text-sm text-muted-foreground sm:pr-12 md:w-40 lg:w-64"
                        >
                            <span className="inline-flex truncate">{t.search_placeholder}</span>
                            <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                                <span className="text-xs">⌘</span>K
                            </kbd>
                        </button>
                    </div>
                    <div>
                        <SiteLanguageSwitch />
                    </div>
                </div>
            </div>
        </header>
    );
}
