"use client";

import React from 'react';
import Link from 'next/link';
import { Home, BookOpen, Moon, Sun, Settings } from 'lucide-react';
import { useLanguage } from '@/lib/language-context';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';

export function BottomNav() {
    const { t, language } = useLanguage();
    const pathname = usePathname();
    const isAr = language === 'ar';

    const isActive = (path: string) => pathname === path;
    const navItems = [
        { label: t.nav.home || "Home", href: "/", icon: Home },
        { label: t.nav.quran || "Quran", href: "/sources/quran", icon: BookOpen },
        { label: t.nav.adhkar || "Adhkar", href: "/adhkar", icon: Moon },
        { label: t.nav.duas || "Duas", href: "/duas", icon: Sun },
        { label: isAr ? "الإعدادات" : "Settings", href: "/settings", icon: Settings },
    ];

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-lg border-t border-border/50 pb-safe">
            <div className="flex justify-around items-center h-16 px-2">
                {navItems.map((item) => (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex flex-col items-center justify-center w-full h-full space-y-1 transition-all duration-300",
                            isActive(item.href)
                                ? "text-emerald-600 dark:text-emerald-400 scale-110"
                                : "text-muted-foreground hover:text-emerald-600/70"
                        )}
                    >
                        <item.icon className={cn("w-5 h-5", isActive(item.href) && "fill-current opacity-20")} strokeWidth={isActive(item.href) ? 2.5 : 2} />
                        <span className="text-[10px] font-medium">{item.label}</span>
                    </Link>
                ))}
            </div>
        </div>
    );
}
