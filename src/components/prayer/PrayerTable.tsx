"use client";

import React from 'react';
import { useLanguage } from '@/lib/language-context';
import { PRAYER_NAMES_AR, PRAYER_NAMES_EN } from '@/lib/prayer-utils';

interface PrayerTimesList {
    Fajr: string;
    Sunrise: string;
    Dhuhr: string;
    Asr: string;
    Maghrib: string;
    Isha: string;
}

interface PrayerTableProps {
    times: PrayerTimesList;
    nextPrayerKey?: string; // e.g. 'Asr'
    lang: 'en' | 'ar';
}

export default function PrayerTable({ times, nextPrayerKey, lang }: PrayerTableProps) {
    const isAr = lang === 'ar';

    const names = isAr ? PRAYER_NAMES_AR : PRAYER_NAMES_EN;
    const keys = ['Fajr', 'Sunrise', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];

    return (
        <div className="relative overflow-hidden rounded-xl bg-white dark:bg-neutral-900 border border-emerald-100 dark:border-emerald-900/30 shadow-sm">
            {/* Islamic Pattern Overlay */}
            <div className="absolute inset-0 opacity-[0.03] pointer-events-none bg-[url('https://www.transparenttextures.com/patterns/arabesque.png')] bg-contain"></div>

            <table className="w-full text-left rtl:text-right relative z-10">
                <thead className="bg-emerald-50 dark:bg-emerald-900/20">
                    <tr>
                        <th className="px-6 py-4 text-emerald-800 dark:text-emerald-400 font-semibold">{isAr ? 'الصلاة' : 'Prayer'}</th>
                        <th className="px-6 py-4 text-emerald-800 dark:text-emerald-400 font-semibold text-right rtl:text-left">{isAr ? 'الوقت' : 'Time'}</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100 dark:divide-neutral-800">
                    {keys.map((key, index) => {
                        const isNext = nextPrayerKey === key;
                        const rowClass = isNext
                            ? "bg-emerald-50/60 dark:bg-emerald-900/10 font-medium"
                            : "hover:bg-gray-50 dark:hover:bg-neutral-800/50 transition-colors";

                        return (
                            <tr key={key} className={rowClass}>
                                <td className="px-6 py-4 flex items-center gap-3">
                                    <span className={`w-2 h-2 rounded-full ${isNext ? 'bg-emerald-500 animate-pulse' : 'bg-gray-300 dark:bg-gray-600'}`}></span>
                                    {names[index]}
                                </td>
                                <td className="px-6 py-4 text-right rtl:text-left font-mono text-lg opacity-90">
                                    {/* @ts-ignore */}
                                    {times[key]}
                                </td>
                            </tr>
                        );
                    })}
                </tbody>
            </table>
        </div>
    );
}
