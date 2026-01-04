"use client";

import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2 } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';

interface AudioPlayerProps {
    src: string;
    reciter?: string;
}

export const AudioPlayer: React.FC<AudioPlayerProps> = ({ src, reciter }) => {
    const { language } = useLanguage();
    const audioRef = useRef<HTMLAudioElement>(null);
    const [isPlaying, setIsPlaying] = useState(false);
    const [progress, setProgress] = useState(0);
    const [duration, setDuration] = useState(0);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            const current = audioRef.current.currentTime;
            const total = audioRef.current.duration;
            setDuration(total);
            setProgress((current / total) * 100);
        }
    };

    const handleEnded = () => {
        setIsPlaying(false);
        setProgress(0);
    };

    const handleProgressChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (audioRef.current) {
            const newTime = (Number(e.target.value) / 100) * audioRef.current.duration;
            audioRef.current.currentTime = newTime;
            setProgress(Number(e.target.value));
        }
    };

    return (
        <div className="bg-emerald-50/50 dark:bg-emerald-900/10 border border-emerald-100 dark:border-emerald-800/30 rounded-lg p-3 w-full flex flex-col gap-2 mt-4">
            <audio
                ref={audioRef}
                src={src}
                onTimeUpdate={handleTimeUpdate}
                onEnded={handleEnded}
                preload="none"
            />

            <div className="flex items-center gap-3">
                <button
                    onClick={togglePlay}
                    className="flex-shrink-0 w-10 h-10 flex items-center justify-center rounded-full bg-emerald-600 text-white hover:bg-emerald-700 transition-colors focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2"
                    aria-label={isPlaying ? (language === 'ar' ? 'إيقاف' : 'Pause') : (language === 'ar' ? 'تشغيل' : 'Play')}
                >
                    {isPlaying ? <Pause size={18} fill="currentColor" /> : <Play size={18} fill="currentColor" className="ml-1" />}
                </button>

                <div className="flex-1 flex flex-col justify-center">
                    {reciter && (
                        <span className="text-xs text-emerald-700 dark:text-emerald-400 font-medium mb-1">
                            {language === 'ar' ? 'القارئ: ' : 'Recitation by: '} {reciter}
                        </span>
                    )}
                    <input
                        type="range"
                        min="0"
                        max="100"
                        value={progress || 0}
                        onChange={handleProgressChange}
                        className="w-full h-1.5 bg-emerald-200 dark:bg-emerald-800 rounded-lg appearance-none cursor-pointer [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-3 [&::-webkit-slider-thumb]:h-3 [&::-webkit-slider-thumb]:bg-emerald-600 [&::-webkit-slider-thumb]:rounded-full hover:[&::-webkit-slider-thumb]:scale-110 transition-all"
                    />
                </div>

                <div className="flex-shrink-0 text-emerald-600 dark:text-emerald-400">
                    <Volume2 size={16} />
                </div>
            </div>
        </div>
    );
};
