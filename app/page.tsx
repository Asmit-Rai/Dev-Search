"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { platforms, Platform } from "@/lib/platforms";
import {
  getRecentSearches,
  addRecentSearch,
  clearRecentSearches,
  getFavorites,
  toggleFavorite,
} from "@/lib/storage";
import SearchBar from "@/components/SearchBar";
import PlatformIcon from "@/components/PlatformIcon";
import KeyboardShortcuts from "@/components/KeyboardShortcuts";

const DEFAULT_PLATFORM_ID = "google";

export default function Home() {
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [showRecent, setShowRecent] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const inputHasFocus = useRef(false);

  useEffect(() => {
    setRecentSearches(getRecentSearches());
    setFavorites(getFavorites());
  }, []);

  const handleSearch = useCallback((platform: Platform, q: string) => {
    const trimmed = q.trim();
    if (!trimmed) return;
    addRecentSearch(trimmed);
    setRecentSearches(getRecentSearches());
    setShowRecent(false);
    window.open(platform.buildUrl(trimmed), "_blank", "noopener,noreferrer");
  }, []);

  const handleDefaultSearch = useCallback(() => {
    const platform = platforms.find((p) => p.id === DEFAULT_PLATFORM_ID)!;
    handleSearch(platform, query);
  }, [query, handleSearch]);

  const handleToggleFavorite = useCallback((id: string) => {
    setFavorites(toggleFavorite(id));
  }, []);

  const handleClearRecent = useCallback(() => {
    clearRecentSearches();
    setRecentSearches([]);
  }, []);

  const handleRecentSelect = useCallback((q: string) => {
    setQuery(q);
    setShowRecent(false);
  }, []);

  // Global keyboard shortcuts
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      const isInput = tag === "input" || tag === "textarea";

      // "/" focuses search bar
      if (e.key === "/" && !isInput) {
        e.preventDefault();
        (document.querySelector("textarea") as HTMLTextAreaElement)?.focus();
        return;
      }

      // Ctrl+letter — search that platform, requires non-empty query
      if (e.ctrlKey && !e.metaKey && !e.altKey && !e.shiftKey && query.trim()) {
        const matched = platforms.find((p) => p.shortcut === e.key);
        if (matched) {
          e.preventDefault();
          handleSearch(matched, query);
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [query, handleSearch]);

  const sortedPlatforms = [
    ...platforms.filter((p) => favorites.includes(p.id)),
    ...platforms.filter((p) => !favorites.includes(p.id)),
  ];

  return (
    // h-screen + overflow-hidden = no scroll, fully static layout
    <div className="h-screen overflow-hidden flex flex-col bg-[#09090b]">
      {/* Background gradient */}
      <div
        className="pointer-events-none fixed inset-0 z-0"
        style={{
          background:
            "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(120,120,180,0.08), transparent)",
        }}
      />

      {/* Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-zinc-900 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-lg bg-zinc-200 flex items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              fill="currentColor"
              className="w-4 h-4 text-zinc-900"
            >
              <path
                fillRule="evenodd"
                d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <span className="text-sm font-semibold text-zinc-200 tracking-tight">DevSearch</span>
        </div>
        <KeyboardShortcuts />
      </header>

      {/* Main — fills remaining height, centered, never scrolls */}
      <main className="relative z-10 flex flex-col items-center justify-center flex-1 px-4 overflow-hidden">
        {/* Hero */}
        <div className="text-center mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold text-zinc-100 tracking-tight mb-3">
            Search once,{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-zinc-300 to-zinc-500">
              search everywhere
            </span>
          </h1>
          <p className="text-sm text-zinc-500 max-w-md mx-auto">
            Type your query and click a platform. No more switching tabs to retype the same thing.
          </p>
        </div>

        {/* Search bar — fixed position in layout, dropdown is absolute so it never shifts anything */}
        <SearchBar
          query={query}
          onChange={setQuery}
          onSubmit={handleDefaultSearch}
          recentSearches={recentSearches}
          onRecentSelect={handleRecentSelect}
          onClearRecent={handleClearRecent}
          showRecent={showRecent && searchFocused}
          onFocusChange={(focused) => {
            inputHasFocus.current = focused;
            setSearchFocused(focused);
            if (focused) setShowRecent(true);
          }}
        />

        {/* Tip */}
        <p className="mt-3 text-xs text-zinc-700">
          <kbd className="inline-flex items-center rounded border border-zinc-800 bg-zinc-900 px-1.5 py-0.5 text-[11px] text-zinc-500 font-mono">
            /
          </kbd>{" "}
          to focus ·{" "}
          <kbd className="inline-flex items-center rounded border border-zinc-800 bg-zinc-900 px-1.5 py-0.5 text-[11px] text-zinc-500 font-mono">
            Ctrl
          </kbd>
          {" + letter to search · star to favorite"}
        </p>

        {/* Platform icons */}
        <div className="mt-10 w-full max-w-3xl">
          {favorites.length > 0 && (
            <p className="text-[11px] text-zinc-700 font-medium uppercase tracking-widest mb-4 text-center">
              Favorites first
            </p>
          )}
          <div className="flex flex-wrap justify-center gap-6 sm:gap-8">
            {sortedPlatforms.map((platform) => (
              <PlatformIcon
                key={platform.id}
                platform={platform}
                query={query}
                isFavorite={favorites.includes(platform.id)}
                onToggleFavorite={handleToggleFavorite}
                onSearch={handleSearch}
                isDefault={platform.id === DEFAULT_PLATFORM_ID}
              />
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}
