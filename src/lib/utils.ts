import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { Adhkar } from "./types";
import { PRAYER_NAMES_EN } from "./prayer-utils";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs))
}

export function getRecommendedAdhkar(): { label: string, href: string, label_ar: string } {
    const now = new Date();
    const hour = now.getHours();

    // Simple time-based recommendation logic for MVP
    // Morning: 4 AM - 11 AM
    // Evening: 3 PM - 8 PM
    // Sleep: 8 PM - 4 AM

    // Ideally this would use prayer times, but for header button, time-based is fast and stateless

    if (hour >= 4 && hour < 12) {
        return { label: "Morning Adhkar", href: "/adhkar/morning-adhkar", label_ar: "أذكار الصباح" };
    } else if (hour >= 15 && hour < 20) {
        return { label: "Evening Adhkar", href: "/adhkar/evening-adhkar", label_ar: "أذكار المساء" };
    } else if (hour >= 20 || hour < 4) {
        return { label: "Sleep Adhkar", href: "/adhkar/before-sleep", label_ar: "أذكار النوم" };
    }

    // Default fallback (e.g. noon)
    return { label: "Daily Adhkar", href: "/adhkar", label_ar: "الأذكار اليومية" };
}
