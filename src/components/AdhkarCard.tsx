"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Adhkar } from '@/lib/types';
import { ArabicText } from '@/components/ui/ArabicText';
import { AudioPlayer } from '@/components/ui/AudioPlayer';
import { useLanguage } from '@/lib/language-context';

interface AdhkarCardProps {
    adhkar: Adhkar;
}

export const AdhkarCard: React.FC<AdhkarCardProps> = ({ adhkar }) => {
    const { language, t } = useLanguage();
    const sourceSlug = adhkar.source.collection.toLowerCase().replace(/\s+/g, '-');
    const [count, setCount] = useState(adhkar.count);
    const [isComplete, setIsComplete] = useState(false);

    // Reset state if adhkar changes (e.g. navigation)
    useEffect(() => {
        setCount(adhkar.count);
        setIsComplete(false);
    }, [adhkar.id, adhkar.count]);

    const handleCount = () => {
        if (count > 0) {
            const newCount = count - 1;
            setCount(newCount);

            // Haptic feedback (short tap)
            if (typeof navigator !== 'undefined' && navigator.vibrate) {
                navigator.vibrate(15);
            }

            if (newCount === 0) {
                setIsComplete(true);
                // Success feedback (longer or double tap)
                if (typeof navigator !== 'undefined' && navigator.vibrate) {
                    navigator.vibrate([50, 50, 50]);
                }
            }
        }
    };

    const handleReset = () => {
        setCount(adhkar.count);
        setIsComplete(false);
    };

    return (
        <article className="bg-white dark:bg-neutral-900 border border-gray-200 dark:border-neutral-800 rounded-xl p-6 shadow-sm mb-6 transition-all hover:shadow-md">
            {/* Header */}
            <div className="flex justify-between items-start mb-4">
                <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                    {language === 'ar' ? (adhkar.title_ar || adhkar.title) : adhkar.title}
                </h3>
                <span className={`text-xs font-medium px-2.5 py-0.5 rounded transition-colors ${isComplete
                    ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                    : "bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300"
                    }`}>
                    {isComplete ? t.card_labels.completed : `${t.card_labels.target}: ${adhkar.count}x`}
                </span>
            </div>

            {/* Arabic Text */}
            <div className="mb-6 bg-gray-50 dark:bg-neutral-800/50 rounded-lg p-4">
                <ArabicText text={adhkar.arabic} />

                {/* Interactive Counter for > 1 */}
                {adhkar.count > 1 && (
                    <div className="mt-4 flex justify-center">
                        {!isComplete ? (
                            <button
                                onClick={handleCount}
                                className="w-full sm:w-auto min-w-[200px] bg-emerald-600 hover:bg-emerald-700 text-white font-medium py-3 px-6 rounded-lg shadow-sm active:scale-95 transition-all flex items-center justify-center gap-2 select-none"
                            >
                                <span className="text-lg">{t.card_labels.tap_to_count}</span>
                                <span className="bg-emerald-800/50 px-2 py-0.5 rounded text-sm font-mono">
                                    {count}
                                </span>
                            </button>
                        ) : (
                            <button
                                onClick={handleReset}
                                className="w-full sm:w-auto min-w-[200px] bg-green-500 hover:bg-green-600 text-white font-medium py-3 px-6 rounded-lg shadow-sm transition-all flex items-center justify-center gap-2"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    <polyline points="20 6 9 17 4 12"></polyline>
                                </svg>
                                <span>{t.card_labels.done} (Reset?)</span>
                            </button>
                        )}
                    </div>
                )}
            </div>

            {/* Audio Player (Conditional) */}
            {adhkar.audioFile && (
                <div className="mb-6">
                    <AudioPlayer
                        src={`/audio/adhkar/${adhkar.audioFile}`}
                        reciter={adhkar.reciter || "Mishary Rashid Alafasy"}
                    />
                </div>
            )}

            {/* Transliteration & Translation */}
            <div className="space-y-4 mb-6">
                {language !== 'ar' && (
                    <div>
                        <h4 className="text-xs uppercase tracking-wide text-gray-400 font-semibold mb-1">{t.card_labels.transliteration}</h4>
                        <p className="text-gray-600 dark:text-gray-300 italic leading-relaxed">{adhkar.transliteration}</p>
                    </div>
                )}
                {language !== 'ar' && (
                    <div>
                        <h4 className="text-xs uppercase tracking-wide text-gray-400 font-semibold mb-1">{t.card_labels.translation}</h4>
                        <p className="text-gray-700 dark:text-gray-200 leading-relaxed">{adhkar.translation}</p>
                    </div>
                )}
            </div>

            {/* Footer: Source & Virtue */}
            <div className="border-t border-gray-100 dark:border-neutral-800 pt-4 flex flex-col sm:flex-row gap-4 text-sm">
                <div className="flex-1">
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{t.card_labels.source}: </span>
                    <Link
                        href={`/sources/${sourceSlug}`}
                        className="text-emerald-600 dark:text-emerald-400 hover:underline decoration-emerald-600/50"
                    >
                        {adhkar.source.collection}
                    </Link>
                    <span className="text-gray-500 dark:text-gray-400"> ({adhkar.source.reference})</span>
                </div>
                {language !== 'ar' && adhkar.virtue && (
                    <div className="flex-1">
                        <span className="font-semibold text-gray-900 dark:text-gray-100">{t.card_labels.virtue}: </span>
                        <span className="text-gray-600 dark:text-gray-400">{adhkar.virtue}</span>
                    </div>
                )}
            </div>
        </article>
    );
};
