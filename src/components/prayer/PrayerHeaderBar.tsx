"use client";

import React, { useState, useEffect } from 'react';
import { useLanguage } from '@/lib/language-context';

/* 
 * A slim sticky header showing the next prayer time.
 */

interface PrayerHeaderBarProps {
    nextPrayerName: string;
    nextPrayerTime: string; // Formatted time
    city: string;
    label: string;
}

export default function PrayerHeaderBar({ nextPrayerName, nextPrayerTime, city, label }: PrayerHeaderBarProps) {
    const { t } = useLanguage();

    return (
        <div className="w-full bg-emerald-600 text-white px-4 py-2 flex items-center justify-between shadow-sm text-sm md:text-base">
            <div className="flex items-center gap-2">
                <span className="opacity-80">{label}</span>
                <span className="font-bold">{nextPrayerName}</span>
                <span className="font-mono bg-emerald-700/50 px-2 py-0.5 rounded">{nextPrayerTime}</span>
            </div>
            <div className="text-xs md:text-sm font-medium opacity-90">
                {city}
            </div>
        </div>
    );
}
