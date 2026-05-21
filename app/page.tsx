"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import { platforms, Platform } from "@/lib/platforms";
import {
  getRecentSearches,
  addRecentSearch,
  clearRecentSearches,
  getDefaultPlatform,
  setDefaultPlatform,
} from "@/lib/storage";
import SearchBar from "@/components/SearchBar";
import PlatformIcon from "@/components/PlatformIcon";
import KeyboardShortcuts from "@/components/KeyboardShortcuts";

export default function Home() {
  const [query, setQuery] = useState("");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [defaultPlatformId, setDefaultPlatformId] = useState<string>("google");
  const [multiMode, setMultiMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [shortcutsOpen, setShortcutsOpen] = useState(false);
  const [showRecent, setShowRecent] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [defaultPillOpen, setDefaultPillOpen] = useState(false);
  const inputHasFocus = useRef(false);

  useEffect(() => {
    // Hydrate client-only state from localStorage after mount (SSR-safe).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setRecentSearches(getRecentSearches());
    setDefaultPlatformId(getDefaultPlatform());
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
    const platform = platforms.find((p) => p.id === defaultPlatformId) ?? platforms[0];
    handleSearch(platform, query);
  }, [query, defaultPlatformId, handleSearch]);

  const handleSetDefault = useCallback((id: string) => {
    setDefaultPlatformId(id);
    setDefaultPlatform(id);
    setDefaultPillOpen(false);
  }, []);

  const handleToggleMultiMode = useCallback(() => {
    setMultiMode((m) => {
      if (m) setSelectedIds([]);
      return !m;
    });
  }, []);

  const handleToggleSelected = useCallback((id: string) => {
    setSelectedIds((ids) =>
      ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id]
    );
  }, []);

  const handleSearchSelected = useCallback(() => {
    const trimmed = query.trim();
    if (!trimmed || selectedIds.length === 0) return;
    addRecentSearch(trimmed);
    setRecentSearches(getRecentSearches());
    setShowRecent(false);
    for (const id of selectedIds) {
      const platform = platforms.find((p) => p.id === id);
      if (platform) {
        window.open(platform.buildUrl(trimmed), "_blank", "noopener,noreferrer");
      }
    }
    setSelectedIds([]);
  }, [query, selectedIds]);

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

      if (e.key === "?" && !isInput) {
        e.preventDefault();
        setShortcutsOpen(true);
        return;
      }

      if (e.key === "/" && !isInput) {
        e.preventDefault();
        (document.querySelector("textarea") as HTMLTextAreaElement)?.focus();
        return;
      }

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

  const defaultPlatform = platforms.find((p) => p.id === defaultPlatformId) ?? platforms[0];

  return (
    <div className="min-h-screen flex flex-col relative" style={{ background: "var(--background)" }}>
      <main className="relative z-10 flex flex-col items-center justify-center flex-1 w-full px-4 py-12 sm:py-8">
        {/* Hero — Playfair display, editorial italic on secondary clause */}
        <div className="text-center mb-8 animate-fade-up">
          <h1
            className="font-display text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight mb-3"
            style={{ color: "#1A1A1A" }}
          >
            Search once,{" "}
            <span className="italic font-normal" style={{ color: "#1A1524", opacity: 0.6 }}>
              search everywhere
            </span>
          </h1>
          <p className="text-sm max-w-md mx-auto px-2" style={{ color: "#1A1524", opacity: 0.7 }}>
            Type your query and click a platform. No more switching tabs to retype the same thing.
          </p>
        </div>

        {/* Search bar */}
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
          multiMode={multiMode}
          onToggleMultiMode={handleToggleMultiMode}
          selectedCount={selectedIds.length}
          onSubmitMulti={handleSearchSelected}
        />

        {/* Hint line + default platform pill */}
        <div
          className="mt-5 text-[11px] flex flex-wrap items-center justify-center gap-x-3 gap-y-2 px-2"
          style={{ color: "#1A1524" }}
        >
          <span className="flex items-center gap-1.5">
            <kbd
              className="inline-flex items-center rounded px-1.5 py-0.5 text-[11px] font-mono font-semibold"
              style={{ background: "#024F46", color: "#FFFFEB" }}
            >
              /
            </kbd>
            <span>to focus</span>
          </span>
          <span className="hidden sm:inline" style={{ opacity: 0.3 }}>·</span>
          <span className="flex items-center gap-1.5">
            <kbd
              className="inline-flex items-center rounded px-1.5 py-0.5 text-[11px] font-mono font-semibold"
              style={{ background: "#024F46", color: "#FFFFEB" }}
            >
              Ctrl
            </kbd>
            <span>+ letter to search</span>
          </span>
          <span className="hidden sm:inline" style={{ opacity: 0.3 }}>·</span>

          {/* Default platform pill — recipe 6.5 + interactive */}
          <div className="relative">
            <button
              onClick={() => setDefaultPillOpen((o) => !o)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full border text-[10px] font-medium
                transition-all hover:opacity-85 active:scale-[0.97]"
              style={{ borderColor: "#024F46", background: "#024F46", color: "#FFFFEB" }}
              aria-haspopup="menu"
              aria-expanded={defaultPillOpen}
            >
              <span
                className="w-1.5 h-1.5 rounded-full"
                style={{ backgroundColor: defaultPlatform.color }}
              />
              <span className="uppercase tracking-widest">Default · {defaultPlatform.name}</span>
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 0 1 1.06.02L10 11.06l3.71-3.83a.75.75 0 1 1 1.08 1.04l-4.25 4.39a.75.75 0 0 1-1.08 0L5.21 8.27a.75.75 0 0 1 .02-1.06Z" clipRule="evenodd" />
              </svg>
            </button>
            {defaultPillOpen && (
              <>
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setDefaultPillOpen(false)}
                  aria-hidden
                />
                <div
                  role="menu"
                  className="absolute top-full mt-1.5 left-1/2 -translate-x-1/2 z-50 rounded-2xl border-2 py-1 min-w-[180px]
                    animate-fade-in"
                  style={{
                    borderColor: "#1A1524",
                    background: "#FFFDF9",
                    boxShadow: "none",
                  }}
                >
                  {platforms.map((p) => (
                    <button
                      key={p.id}
                      role="menuitem"
                      onClick={() => handleSetDefault(p.id)}
                      className="w-full flex items-center gap-2 px-3 py-1.5 text-xs text-left transition-all
                        hover:opacity-85"
                      style={{
                        background: p.id === defaultPlatformId ? "rgba(2,79,70,0.1)" : "transparent",
                        color: "#1A1524",
                        fontWeight: p.id === defaultPlatformId ? 600 : 400,
                      }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full shrink-0"
                        style={{ backgroundColor: p.color }}
                      />
                      <span className="flex-1">{p.name}</span>
                      {p.id === defaultPlatformId && (
                        <svg viewBox="0 0 20 20" fill="currentColor" className="w-3 h-3">
                          <path fillRule="evenodd" d="M16.704 5.29a1 1 0 0 1 .007 1.414l-7.5 7.6a1 1 0 0 1-1.42.006L3.286 9.806a1 1 0 0 1 1.42-1.41l3.793 3.82 6.79-6.88a1 1 0 0 1 1.414-.046Z" clipRule="evenodd" />
                        </svg>
                      )}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>

        {/* Platforms grid */}
        <div className="mt-6 sm:mt-10 w-full max-w-3xl">
          <div
            className="grid gap-3 sm:gap-6 md:gap-8 justify-items-center"
            style={{
              gridTemplateColumns: "repeat(auto-fit, minmax(60px, 1fr))",
            }}
          >
            {platforms.map((platform) => (
              <PlatformIcon
                key={platform.id}
                platform={platform}
                query={query}
                isDefault={platform.id === defaultPlatformId}
                isSelected={selectedIds.includes(platform.id)}
                multiMode={multiMode}
                onSearch={handleSearch}
                onToggleSelected={handleToggleSelected}
              />
            ))}
          </div>
        </div>
      </main>

      {/* Floating Shortcuts trigger pill (bottom-right, sm+) */}
      <button
        onClick={() => setShortcutsOpen(true)}
        className="hidden sm:flex fixed bottom-4 right-4 z-20 items-center gap-1.5 px-3 py-1.5 rounded-full border
          text-[10px] font-semibold uppercase tracking-widest transition-all hover:opacity-85 active:scale-[0.97]"
        style={{
          borderColor: "#024F46",
          background: "#024F46",
          color: "#FFFFEB",
        }}
        aria-label="Open keyboard shortcuts"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-3.5 h-3.5"
        >
          <path
            fillRule="evenodd"
            d="M9.638 1.093a.75.75 0 0 1 .724 0l2 1.104a.75.75 0 1 1-.724 1.313L10 2.607l-1.638.903a.75.75 0 1 1-.724-1.313l2-1.104ZM5.403 4.287a.75.75 0 0 1-.295 1.019l-.805.444.805.444a.75.75 0 0 1-.724 1.314L3.5 7.02v.73a.75.75 0 0 1-1.5 0v-2a.75.75 0 0 1 .388-.657l1.996-1.1a.75.75 0 0 1 1.019.294Zm9.194 0a.75.75 0 0 1 1.02-.295l1.995 1.101A.75.75 0 0 1 18 5.75v2a.75.75 0 0 1-1.5 0v-.73l-.884.488a.75.75 0 1 1-.724-1.314l.806-.444-.806-.444a.75.75 0 0 1-.295-1.019ZM7.343 8.284a.75.75 0 0 1 1.02-.294L10 8.893l1.638-.903a.75.75 0 1 1 .724 1.313l-1.612.89v1.557a.75.75 0 0 1-1.5 0V10.193l-1.613-.89a.75.75 0 0 1-.294-1.019ZM2 12.75a.75.75 0 0 1 .75-.75h1a.75.75 0 0 1 0 1.5H3.5v.73l1.612.89a.75.75 0 1 1-.724 1.313l-2-1.104A.75.75 0 0 1 2 14.75v-2ZM16.5 13.5v-.73l-1.612-.89a.75.75 0 1 1 .724-1.312l2 1.104A.75.75 0 0 1 18 12.75v2a.75.75 0 0 1-.388.657l-2 1.104a.75.75 0 1 1-.724-1.313l1.612-.89v-.808ZM9.25 16.193v1.557a.75.75 0 0 0 1.5 0v-1.557l1.612-.89a.75.75 0 1 0-.724-1.312l-1.638.903-1.638-.903a.75.75 0 1 0-.724 1.313l1.612.89Z"
            clipRule="evenodd"
          />
        </svg>
        Shortcuts
      </button>

      <KeyboardShortcuts open={shortcutsOpen} onClose={() => setShortcutsOpen(false)} />
    </div>
  );
}
