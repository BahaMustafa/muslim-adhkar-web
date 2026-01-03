'use client';

import { useState, useRef, useEffect } from 'react';
import { getAudioUrl } from '@/lib/quran';
import { Play, Pause, Loader2 } from 'lucide-react';

interface AudioPlayerProps {
    globalAyahId: number;
}

export default function AyahAudioPlayer({ globalAyahId }: AudioPlayerProps) {
    const [isPlaying, setIsPlaying] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const togglePlay = () => {
        if (!audioRef.current) {
            const url = getAudioUrl(globalAyahId);
            audioRef.current = new Audio(url);

            audioRef.current.addEventListener('canplaythrough', () => {
                setIsLoading(false);
            });
            audioRef.current.addEventListener('ended', () => {
                setIsPlaying(false);
            });
            audioRef.current.addEventListener('error', () => {
                setIsLoading(false);
                setIsPlaying(false);
                alert('Audio unavailable');
            });

            // Start loading
            setIsLoading(true);
            audioRef.current.play().then(() => {
                setIsPlaying(true);
                setIsLoading(false);
            }).catch(e => {
                console.error("Playback failed", e);
                setIsLoading(false);
                setIsPlaying(false);
            });
        } else {
            if (isPlaying) {
                audioRef.current.pause();
                setIsPlaying(false);
            } else {
                audioRef.current.play();
                setIsPlaying(true);
            }
        }
    };

    // Cleanup on unmount
    useEffect(() => {
        return () => {
            if (audioRef.current) {
                audioRef.current.pause();
                audioRef.current = null;
            }
        };
    }, []);

    return (
        <button
            onClick={togglePlay}
            className="inline-flex items-center justify-center rounded-md w-8 h-8 text-muted-foreground hover:bg-secondary hover:text-primary transition-colors focus:outline-none focus:ring-2 focus:ring-primary/50"
            title="Play Audio"
            aria-label={isPlaying ? "Pause" : "Play"}
        >
            {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
            ) : isPlaying ? (
                <Pause className="h-4 w-4" />
            ) : (
                <Play className="h-4 w-4" />
            )}
        </button>
    );
}
