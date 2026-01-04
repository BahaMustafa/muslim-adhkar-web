"use client";

import { useLanguage } from "@/lib/language-context";

export function SiteLanguageSwitch() {
    const { language, setLanguage } = useLanguage();

    return (
        <button
            onClick={() => setLanguage(language === 'en' ? 'ar' : 'en')}
            className="px-3 py-1.5 text-sm font-medium hover:bg-accent hover:text-accent-foreground rounded-md border border-input bg-background transition-colors flex items-center gap-2"
            aria-label="Switch Language"
        >
            <span className="text-xs font-mono">{language === 'en' ? 'AR' : 'EN'}</span>
            {language === 'en' ? 'العربية' : 'English'}
        </button>
    );
}
