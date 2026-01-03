"use client";

import { Search } from "lucide-react";

export function HomeSearchTrigger() {
    return (
        <div
            onClick={() => window.dispatchEvent(new CustomEvent("open-command-palette"))}
            className="relative w-full max-w-2xl cursor-text rounded-full border border-border bg-background py-4 px-6 text-lg shadow-sm hover:shadow-md transition-shadow flex items-center mb-12 text-muted-foreground group"
        >
            <Search className="mr-3 h-5 w-5 group-hover:text-primary transition-colors" />
            <span className="flex-1">Search for Duas, Surahs, or Adhkar...</span>
            <kbd className="hidden sm:inline-flex h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
                <span className="text-xs">⌘</span>K
            </kbd>
        </div>
    );
}
