"use client";

import React, { createContext, useContext, useEffect, useState } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import translations from './translations.json';

type Language = 'en' | 'ar';
type Translations = typeof translations.en;

interface LanguageContextType {
    language: Language;
    setLanguage: (lang: Language) => void;
    t: Translations;
    dir: 'ltr' | 'rtl';
}

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children, initialLang = 'en' }: { children: React.ReactNode, initialLang?: Language }) {
    const [language, setLanguageState] = useState<Language>(initialLang);
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    useEffect(() => {
        // Sync with localStorage on client mount if cookie was missing or we want to persist across sessions
        const stored = localStorage.getItem('language') as Language;
        if (stored && stored !== language) {
            // Decide policy: Does LocalStorage override Cookie? 
            // For now, let's update the cookie if localStorage exists so next reload is correct
            // But to avoid flicker, we might just set the cookie and refresh if they differ effectively.
            // However, simplest is: User explicitly switches -> sets Cookie + LocalStorage.
            // On load -> Server reads Cookie. 
            // If Cookie is missing, we default to 'en'. Check LocalStorage?
            if (!document.cookie.includes('NEXT_LOCALE')) {
                setLanguage(stored);
            }
        }
    }, []);

    const setLanguage = (lang: Language) => {
        setLanguageState(lang);
        localStorage.setItem('language', lang);
        document.cookie = `NEXT_LOCALE=${lang}; path=/; max-age=31536000; SameSite=Lax`;

        // Update URL to ensure shareable links
        const params = new URLSearchParams(searchParams.toString());
        if (lang === 'ar') {
            params.set('lang', 'ar');
        } else {
            params.delete('lang');
        }

        // Push new URL (this triggers a Server Component refresh with the new params)
        router.push(`${pathname}?${params.toString()}`);
        router.refresh();
    };

    const t = translations[language];
    const dir = language === 'ar' ? 'rtl' : 'ltr';

    useEffect(() => {
        // Update body attribute for global styling
        document.body.setAttribute('data-lang', language);
    }, [language]);

    return (
        <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLanguage() {
    const context = useContext(LanguageContext);
    if (context === undefined) {
        throw new Error('useLanguage must be used within a LanguageProvider');
    }
    return context;
}
