"use client";

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/language-context';

/* 
 * A slim sticky header showing the next prayer time.
 */

import { getNextPrayer, formatTime } from '@/lib/prayer-utils';
import { Coordinates, CalculationMethod, PrayerTimes, Madhab } from 'adhan';

interface PrayerHeaderBarProps {
    nextPrayerName?: string;
    nextPrayerTime?: string; // Formatted time
    city?: string;
    label?: string;
    onDataLoaded?: (data: { city: string, prayers: PrayerTimes, next: { name: string, time: Date } }) => void;
}

export default function PrayerHeaderBar({ nextPrayerName, nextPrayerTime, city, label, onDataLoaded }: PrayerHeaderBarProps) {
    const { t, language } = useLanguage();
    const [localData, setLocalData] = useState<{ name: string, time: string, city: string } | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        // Only fetch if props are missing (Geolocation Fallback)
        if (!nextPrayerName || !city) {
            setLoading(true);
            fetch('https://ipapi.co/json/')
                .then(res => res.json())
                .then(data => {
                    const { latitude, longitude, city, timezone } = data;
                    if (latitude && longitude) {
                        const coords = new Coordinates(latitude, longitude);
                        const params = CalculationMethod.MuslimWorldLeague();
                        const date = new Date();
                        const prayers = new PrayerTimes(coords, date, params);

                        const next = getNextPrayer(prayers);
                        const timeStr = formatTime(next.time, language, timezone || Intl.DateTimeFormat().resolvedOptions().timeZone);

                        setLocalData({
                            name: next.name,
                            time: timeStr,
                            city: city
                        });

                        // Callback for parent components
                        if (onDataLoaded) {
                            onDataLoaded({ city, prayers, next });
                        }
                    }
                })
                .catch(err => console.error('Geo fetch failed', err))
                .finally(() => setLoading(false));
        }
    }, [nextPrayerName, city, language, onDataLoaded]);

    const displayCity = city || localData?.city;
    const displayTime = nextPrayerTime || localData?.time;
    const displayName = nextPrayerName || localData?.name;
    const displayLabel = label || (language === 'ar' ? 'الصلاة القادمة:' : 'Next Prayer:');

    if (!displayCity || !displayTime) return null; // Don't show if no data yet

    return (
        <div className="w-full bg-emerald-600 text-white px-4 py-2 flex items-center justify-between shadow-sm text-sm md:text-base transition-all duration-500 ease-in-out">
            <div className="flex items-center gap-2">
                <span className="opacity-80">{displayLabel}</span>
                <span className="font-bold">{displayName}</span>
                <span className="font-mono bg-emerald-700/50 px-2 py-0.5 rounded">{displayTime}</span>
            </div>
            <div className="text-xs md:text-sm font-medium opacity-90">
                {displayCity}
            </div>
        </div>
    );
}
