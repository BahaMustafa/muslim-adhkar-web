"use client";

import { useEffect, useState, useMemo, useRef } from "react";
import { Search, Book, FileText, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { getSearchIndex } from "@/app/actions/search";
import { SearchResult } from "@/lib/search-types";

export default function CommandPalette() {
    const [isOpen, setIsOpen] = useState(false);
    const [query, setQuery] = useState("");
    const [index, setIndex] = useState<SearchResult[]>([]);
    const [selected, setSelected] = useState(0);
    const [loading, setLoading] = useState(false);
    const router = useRouter();
    const inputRef = useRef<HTMLInputElement>(null);
    const listRef = useRef<HTMLUListElement>(null);

    // Load index on mount
    useEffect(() => {
        async function load() {
            setLoading(true);
            try {
                const data = await getSearchIndex();
                setIndex(data);
            } catch (e) {
                console.error("Failed to load search index", e);
            } finally {
                setLoading(false);
            }
        }
        load();
    }, []);

    // Shortcut listeners
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.metaKey || e.ctrlKey) && e.key === "k") {
                e.preventDefault();
                setIsOpen((prev) => !prev);
            }
            if (e.key === "Escape") {
                setIsOpen(false);
            }
        };

        const handleOpenEvent = () => setIsOpen(true);

        window.addEventListener("keydown", handleKeyDown);
        window.addEventListener("open-command-palette", handleOpenEvent);

        return () => {
            window.removeEventListener("keydown", handleKeyDown);
            window.removeEventListener("open-command-palette", handleOpenEvent);
        };
    }, []);

    // Focus input when opened
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 10);
            document.body.style.overflow = "hidden";
        } else {
            document.body.style.overflow = "unset";
            setQuery("");
            setSelected(0);
        }
    }, [isOpen]);

    // Filter results
    const filtered = useMemo(() => {
        if (!query) return [];

        const tokens = query.toLowerCase().split(/\s+/).filter(t => t.length > 0);

        return index.filter(item => {
            const searchString = `${item.title} ${item.description || ''} ${item.keywords?.join(' ') || ''}`.toLowerCase();
            return tokens.every(token => searchString.includes(token));
        }).slice(0, 8);
    }, [query, index]);

    // Handle selection navigation
    useEffect(() => {
        const handleNav = (e: KeyboardEvent) => {
            if (!isOpen) return;

            if (e.key === "ArrowDown") {
                e.preventDefault();
                setSelected(prev => Math.min(prev + 1, filtered.length - 1));
            } else if (e.key === "ArrowUp") {
                e.preventDefault();
                setSelected(prev => Math.max(prev - 1, 0));
            } else if (e.key === "Enter") {
                e.preventDefault();
                if (filtered[selected]) {
                    navigateTo(filtered[selected].url);
                }
            }
        };

        window.addEventListener("keydown", handleNav);
        return () => window.removeEventListener("keydown", handleNav);
    }, [isOpen, filtered, selected]);

    // Reset selected when query changes
    useEffect(() => {
        setSelected(0);
    }, [query]);

    const navigateTo = (url: string) => {
        setIsOpen(false);
        router.push(url);
    };

    if (!isOpen) return null;

    return (
        <div className="fixed inset-0 z-50 flex items-start justify-center pt-[20vh] px-4">
            {/* Backdrop */}
            <div
                className="fixed inset-0 bg-background/80 backdrop-blur-sm transition-all duration-200"
                onClick={() => setIsOpen(false)}
            />

            {/* Search Box */}
            <div className="relative w-full max-w-lg transform overflow-hidden rounded-xl border border-border bg-card shadow-2xl transition-all duration-200 animate-in fade-in zoom-in-95 data-[state=closed]:animate-out data-[state=closed]:fade-out data-[state=closed]:zoom-out-95">

                {/* Input Header */}
                <div className="flex items-center border-b border-border px-4 py-3">
                    <Search className="mr-2 h-5 w-5 shrink-0 opacity-50" />
                    <input
                        ref={inputRef}
                        className="flex h-10 w-full rounded-md bg-transparent py-3 text-lg outline-none placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50"
                        placeholder="Search Adhkar, Surahs, Duas..."
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <kbd className="hidden sm:inline-flex h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100">
                        <span className="text-xs">ESC</span>
                    </kbd>
                </div>

                {/* Results List */}
                <div className="max-h-[300px] overflow-y-auto p-2" ref={listRef as any}>
                    {filtered.length === 0 && query ? (
                        <p className="p-4 text-center text-sm text-muted-foreground">
                            No results found for "{query}"
                        </p>
                    ) : null}

                    {filtered.length === 0 && !query ? (
                        <div className="py-6 text-center text-sm text-muted-foreground">
                            <p>Type to search...</p>
                            <p className="text-xs mt-2 opacity-70">Try "Morning", "Travel", "Al-Fatihah"</p>
                        </div>
                    ) : null}

                    {filtered.map((item, i) => (
                        <button
                            key={item.id}
                            onClick={() => navigateTo(item.url)}
                            onMouseEnter={() => setSelected(i)}
                            className={`relative flex w-full cursor-default select-none items-center rounded-lg px-3 py-3 text-sm outline-none transition-colors ${i === selected ? "bg-accent text-accent-foreground" : "text-foreground hover:bg-accent hover:text-accent-foreground"
                                }`}
                        >
                            <div className="mr-3 flex h-8 w-8 items-center justify-center rounded-md border border-border bg-background">
                                {item.type === 'quran' ? <Book className="h-4 w-4" /> : <FileText className="h-4 w-4" />}
                            </div>
                            <div className="flex flex-col items-start">
                                <span className="font-medium">{item.title}</span>
                                {item.description && (
                                    <span className="text-xs text-muted-foreground line-clamp-1 text-left">{item.description}</span>
                                )}
                            </div>
                            {item.type === 'quran' && (
                                <span className="ml-auto text-xs text-muted-foreground bg-secondary px-1.5 py-0.5 rounded">Surah</span>
                            )}
                        </button>
                    ))}
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between border-t border-border px-4 py-2 text-xs text-muted-foreground bg-muted/30">
                    <div>
                        Navigate <span className="font-mono">↑↓</span>, Select <span className="font-mono">↵</span>
                    </div>
                    <div>
                        {index.length} items indexed
                    </div>
                </div>
            </div>
        </div>
    );
}
