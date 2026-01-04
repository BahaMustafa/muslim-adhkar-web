"use client";

import React, { useState } from 'react';
import PrayerHeaderBar from '@/components/prayer/PrayerHeaderBar';
import { Breadcrumbs } from '@/components/ui/Breadcrumbs';
import { useLanguage } from '@/lib/language-context';
import PrayerTable from '@/components/prayer/PrayerTable';
import { PRAYER_NAMES_EN, PRAYER_NAMES_AR, getNextPrayer, formatTime } from '@/lib/prayer-utils';
import { Coordinates, CalculationMethod, PrayerTimes } from 'adhan';

export default function PrayerTimesIndex() {
    const { t, language } = useLanguage();
    const isAr = language === 'ar';
    const [localData, setLocalData] = useState<{ city: string, prayers: any, next: any } | null>(null);

    const handleDataLoaded = (data: { city: string, prayers: any, next: any }) => {
        setLocalData(data);
    };

    return (
        <div className="min-h-screen bg-gray-50 dark:bg-black">
            <PrayerHeaderBar onDataLoaded={handleDataLoaded} />

            <div className="max-w-3xl mx-auto px-4 py-8">
                <Breadcrumbs items={[
                    { label: t.branding.name, href: "/" },
                    { label: isAr ? 'مواقيت الصلاة' : 'Prayer Times', href: "/prayer-times" }
                ]} />

                <main className="mt-8 text-center">
                    <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-6">
                        {localData
                            ? (isAr ? `مواقيت الصلاة في ${localData.city}` : `Prayer Times in ${localData.city}`)
                            : (isAr ? 'مواقيت الصلاة العالمية' : 'Global Prayer Times')
                        }
                    </h1>

                    {!localData && (
                        <p className="text-gray-600 dark:text-gray-400 max-w-xl mx-auto mb-10">
                            {isAr
                                ? 'اختر مدينتك أو دعنا نحدد موقعك تلقائياً لعرض مواقيت الصلاة الدقيقة.'
                                : 'Choose your city or let us detect your location for accurate prayer times.'}
                        </p>
                    )}

                    {localData && (
                        <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                            <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
                                {isAr
                                    ? `توقيت دقيق حسب التوقيت المحلي لمدينة ${localData.city}`
                                    : `Accurate local prayer times for ${localData.city}`
                                }
                            </p>
                            <PrayerTable
                                times={{
                                    Fajr: formatTime(localData.prayers.fajr, language, Intl.DateTimeFormat().resolvedOptions().timeZone),
                                    Sunrise: formatTime(localData.prayers.sunrise, language, Intl.DateTimeFormat().resolvedOptions().timeZone),
                                    Dhuhr: formatTime(localData.prayers.dhuhr, language, Intl.DateTimeFormat().resolvedOptions().timeZone),
                                    Asr: formatTime(localData.prayers.asr, language, Intl.DateTimeFormat().resolvedOptions().timeZone),
                                    Maghrib: formatTime(localData.prayers.maghrib, language, Intl.DateTimeFormat().resolvedOptions().timeZone),
                                    Isha: formatTime(localData.prayers.isha, language, Intl.DateTimeFormat().resolvedOptions().timeZone),
                                }}
                                nextPrayerKey={localData.next.name}
                                lang={language}
                            />
                        </div>
                    )}
                </main>
            </div>
        </div>
    );
}
