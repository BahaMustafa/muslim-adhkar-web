"use client";

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/language-context';
import { getNextPrayer, formatTime } from '@/lib/prayer-utils';
import { Coordinates, CalculationMethod, PrayerTimes } from 'adhan';
import { Loader2, Clock } from 'lucide-react';

export function HomePrayerRibbon() {
    const { language } = useLanguage();
    const isAr = language === 'ar';

    // State
    const [times, setTimes] = useState<{ name: string, time: string, isNext: boolean }[]>([]);
    const [loading, setLoading] = useState(true);
    const [city, setCity] = useState<string>("");
    const [nextPrayer, setNextPrayer] = useState<{ name: string, time: string } | null>(null);

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
                    const prayers = new PrayerTimes(coords, date, params);
                    const next = getNextPrayer(prayers);

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
                    setNextPrayer({
                        name: next.name,
                        time: formatTime(next.time, language, timezone || Intl.DateTimeFormat().resolvedOptions().timeZone)
                    });
                }
            })
            .catch(err => {
                console.error("Ribbon geo error", err);
                setCity(isAr ? "غير محدد" : "Unknown");
            })
            .finally(() => setLoading(false));
    }, [language, isAr]);

    const labelsAr: Record<string, string> = {
        'Fajr': 'الفجر', 'Dhuhr': 'الظهر', 'Asr': 'العصر', 'Maghrib': 'المغرب', 'Isha': 'العشاء'
    };

    // Render Logic
    return (
        <>
            {/* Header Section */}
            <div className="relative z-10 flex items-center gap-6 text-center md:text-left mb-6 md:mb-0">
                <div className="p-4 bg-white/10 rounded-2xl backdrop-blur-md">
                    <Clock className="w-8 h-8 text-emerald-400" />
                </div>
                <div>
                    <h2 className="text-2xl font-bold mb-1">
                        {loading
                            ? (isAr ? 'مواقيت الصلاة...' : 'Prayer Times...')
                            : (isAr ? `مواقيت الصلاة في ${city}` : `Prayer Times in ${city}`)}
                    </h2>
                    <p className="text-slate-300 text-sm">
                        {loading
                            ? (isAr ? 'جاري تحديد موقعك...' : ' detecting your location...')
                            : nextPrayer
                                ? (isAr ? `الصلاة القادمة: ${labelsAr[nextPrayer.name] || nextPrayer.name} ${nextPrayer.time}` : `Next: ${nextPrayer.name} at ${nextPrayer.time}`)
                                : (isAr ? 'تابع أوقات الصلاة بدقة' : 'Track accurate prayer times')}
                    </p>
                </div>
            </div>

            {/* Ribbon Section */}
            <div className="relative z-10 flex flex-wrap gap-2 justify-center md:justify-end">
                {loading ? (
                    <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
                ) : (
                    times.map((p) => (
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
                    ))
                )}
            </div>
        </>
    );
}
