'use client';

import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { QURAN_LANGUAGES } from '@/lib/quran';

export default function LanguageSelector() {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();
    const currentLang = searchParams.get('lang') || 'en';

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newLang = e.target.value;
        const params = new URLSearchParams(searchParams);
        params.set('lang', newLang);
        router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    };

    return (
        <select
            value={currentLang}
            onChange={handleChange}
            className="bg-card text-card-foreground border border-border rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-primary"
        >
            {QURAN_LANGUAGES.map(lang => (
                <option key={lang.code} value={lang.code}>
                    {lang.name}
                </option>
            ))}
        </select>
    );
}
