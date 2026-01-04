"use client";

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/language-context';
import { getNextPrayer, formatTime } from '@/lib/prayer-utils';
import { Coordinates, CalculationMethod, PrayerTimes } from 'adhan';
import { Loader2 } from 'lucide-react';

export function HomePrayerRibbon() {
    const { language } = useLanguage();
    const isAr = language === 'ar';

    // State
    const [times, setTimes] = useState<{ name: string, time: string, isNext: boolean }[]>([]);
    const [loading, setLoading] = useState(true);
    const [city, setCity] = useState<string>("");

    useEffect(() => {
        setLoading(true);
        fetch('/api/geolocation')
            .then(res => res.json())
            .then(data => {
                const { latitude, longitude, city, timezone } = data;
                if (latitude && longitude) {
                    const coords = new Coordinates(latitude, longitude);
                    const params = CalculationMethod.MuslimWorldLeague();
                    const date = new Date();
                    // Just to be safe with timezone, but generally client time is okay for "ribbon" if display matches
                    const prayers = new PrayerTimes(coords, date, params);
                    const next = getNextPrayer(prayers);

                    // Prayer List (Standard 5)
                    const prayerList = [
                        { key: 'Fajr', val: prayers.fajr },
                        { key: 'Dhuhr', val: prayers.dhuhr },
                        { key: 'Asr', val: prayers.asr },
                        { key: 'Maghrib', val: prayers.maghrib },
                        { key: 'Isha', val: prayers.isha },
                    ];

                    const formatted = prayerList.map(p => ({
                        name: p.key,
                        time: formatTime(p.val, language, timezone || Intl.DateTimeFormat().resolvedOptions().timeZone),
                        isNext: next.name === p.key
                    }));

                    setTimes(formatted);
                    setCity(city || (isAr ? "مدينتك" : "Your City"));
                }
            })
            .catch(err => {
                console.error("Ribbon geo error", err);
                setCity(isAr ? "غير محدد" : "Unknown");
            })
            .finally(() => setLoading(false));
    }, [language, isAr]);

    if (loading) {
        return (
            <div className="relative z-10 mt-6 md:mt-0 flex gap-2 items-center justify-center min-h-[40px]">
                <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
            </div>
        );
    }

    if (!times.length) {
        // Fallback placeholder if failed
        return (
            <div className="relative z-10 mt-6 md:mt-0 flex gap-2">
                {['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'].map((p) => (
                    <div key={p} className="px-3 py-1 rounded-full text-xs font-medium border border-white/5 bg-white/5 text-slate-400">
                        {p} --:--
                    </div>
                ))}
            </div>
        );
    }

    const labelsAr: Record<string, string> = {
        'Fajr': 'الفجر',
        'Dhuhr': 'الظهر',
        'Asr': 'العصر',
        'Maghrib': 'المغرب',
        'Isha': 'العشاء'
    };

    return (
        <div className="relative z-10 mt-6 md:mt-0 flex flex-wrap gap-2 justify-center md:justify-end">
            {times.map((p) => (
                <div
                    key={p.name}
                    className={`px-3 py-1 rounded-full text-xs font-medium border transition-all duration-500 ${p.isNext
                            ? 'bg-emerald-500 text-white border-emerald-400 shadow-[0_0_15px_rgba(16,185,129,0.4)] scale-105'
                            : 'bg-white/5 text-slate-300 border-white/10'
                        }`}
                >
                    <span className="opacity-70 mr-1">{isAr ? labelsAr[p.name] : p.name}</span>
                    <span className="font-bold">{p.time}</span>
                </div>
            ))}
        </div>
    );
}
