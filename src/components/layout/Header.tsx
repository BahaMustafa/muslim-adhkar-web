"use client";

import { Suspense, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Sparkles } from "lucide-react";
import LanguageSelector from "@/components/quran/LanguageSelector";
import { useLanguage } from "@/lib/language-context";
import { SiteLanguageSwitch } from "./SiteLanguageSwitch";
import { getRecommendedAdhkar, cn } from "@/lib/utils";

export function Header() {
    const { t, language } = useLanguage();

    // Memoize the recommendation to avoid hydration mismatch if time changes slightly, 
    // though strict hydration might still mismatch on server vs client time. 
    // Ideally this component is client-side only or handles hydration carefully.
    // 'Header' is marked 'use client' so it runs on client.
    const recommended = useMemo(() => getRecommendedAdhkar(), []);
    const isAr = language === 'ar';

    const openSearch = () => {
        window.dispatchEvent(new CustomEvent("open-command-palette"));
    };

    return (
        <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-md supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-16 items-center px-4 max-w-7xl mx-auto">
                {/* Logo & Nav */}
                <div className="hidden md:flex items-center gap-8">
                    <Link href="/" className="flex items-center gap-2">
                        <Image src="/logo.png" alt="Muslim Adhkar" width={36} height={36} className="rounded-xl shadow-sm" />
                        <span className="hidden font-bold sm:inline-block text-lg bg-gradient-to-r from-emerald-600 to-teal-500 bg-clip-text text-transparent">
                            {t.branding?.name || "Muslim Adhkar"}
                        </span>
                    </Link>
                    <nav className="flex items-center gap-6 text-sm font-medium">
                        <Link href="/adhkar" className="transition-colors hover:text-emerald-600">{t.nav.adhkar}</Link>
                        <Link href="/duas" className="transition-colors hover:text-emerald-600">{t.nav.duas}</Link>
                        <Link href="/prayer-times" className="transition-colors hover:text-emerald-600">
                            {isAr ? 'مواقيت الصلاة' : 'Prayer Times'}
                        </Link>
                    </nav>
                </div>

                {/* Mobile Logo */}
                <Link href="/" className="mr-auto md:hidden flex items-center gap-2 font-bold">
                    <Image src="/logo.png" alt="Logo" width={32} height={32} />
                    <span>{t.branding.name}</span>
                </Link>

                {/* Right Actions */}
                <div className="flex flex-1 items-center justify-end space-x-3">
                    {/* Daily Wird Button */}
                    <div className="hidden md:block">
                        <Link
                            href={recommended.href}
                            className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-4 py-1.5 text-xs font-semibold text-emerald-700 ring-1 ring-inset ring-emerald-600/20 hover:bg-emerald-100 transition-colors"
                        >
                            <Sparkles className="w-3 h-3" />
                            {isAr ? recommended.label_ar : recommended.label}
                        </Link>
                    </div>

                    {/* Search */}
                    <button
                        onClick={openSearch}
                        className="inline-flex items-center rounded-full border border-input bg-background/50 px-3 py-2 text-sm text-muted-foreground shadow-sm hover:bg-accent hover:text-accent-foreground w-10 md:w-auto"
                        aria-label="Search"
                    >
                        <Search className="h-4 w-4 md:mr-2" />
                        <span className="hidden md:inline-flex">{t.search_placeholder}</span>
                    </button>

                    <SiteLanguageSwitch />
                </div>
            </div>
        </header>
    );
}
