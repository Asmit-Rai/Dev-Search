"use client";

import { useRef, useEffect } from "react";

interface SearchBarProps {
  query: string;
  onChange: (value: string) => void;
  onSubmit: () => void;
  recentSearches: string[];
  onRecentSelect: (query: string) => void;
  onClearRecent: () => void;
  showRecent: boolean;
  onFocusChange: (focused: boolean) => void;
}

export default function SearchBar({
  query,
  onChange,
  onSubmit,
  recentSearches,
  onRecentSelect,
  onClearRecent,
  showRecent,
  onFocusChange,
}: SearchBarProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Auto-focus on mount
  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  // Auto-resize textarea height as content changes
  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [query]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    // Enter alone = submit; Shift+Enter = newline
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      onSubmit();
    }
    if (e.key === "Escape") {
      textareaRef.current?.blur();
    }
  }

  return (
    <div className="relative w-full max-w-2xl">
      {/* Search box */}
      <div
        className="relative flex items-start rounded-2xl border border-zinc-800 bg-zinc-900/80 backdrop-blur
          focus-within:border-zinc-600 focus-within:bg-zinc-900
          transition-colors duration-200 shadow-lg shadow-black/30"
      >
        {/* Search icon — aligned to top of first row */}
        <div className="pl-4 pr-2 pt-[18px] text-zinc-500 shrink-0">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-5 h-5"
          >
            <path
              fillRule="evenodd"
              d="M9 3.5a5.5 5.5 0 1 0 0 11 5.5 5.5 0 0 0 0-11ZM2 9a7 7 0 1 1 12.452 4.391l3.328 3.329a.75.75 0 1 1-1.06 1.06l-3.329-3.328A7 7 0 0 1 2 9Z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        {/* Auto-growing textarea */}
        <textarea
          ref={textareaRef}
          value={query}
          onChange={(e) => onChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => onFocusChange(true)}
          onBlur={() => setTimeout(() => onFocusChange(false), 150)}
          placeholder="Search anything..."
          spellCheck={false}
          autoComplete="off"
          rows={1}
          className="flex-1 bg-transparent py-4 text-base text-zinc-100 placeholder:text-zinc-600
            focus:outline-none font-sans resize-none overflow-hidden leading-relaxed"
          style={{ minHeight: "56px" }}
        />

        {/* Right-side controls — pinned to top */}
        <div className="flex items-center gap-1 pt-3 pr-3 shrink-0">
          {query && (
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                onChange("");
                textareaRef.current?.focus();
              }}
              aria-label="Clear search"
              className="p-1 text-zinc-600 hover:text-zinc-400 transition-colors rounded-md hover:bg-zinc-800"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20"
                fill="currentColor"
                className="w-4 h-4"
              >
                <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
              </svg>
            </button>
          )}
          <kbd className="hidden sm:inline-flex items-center rounded-md border border-zinc-700 bg-zinc-800
            px-1.5 py-0.5 text-[11px] text-zinc-500 font-mono">
            ↵
          </kbd>
        </div>
      </div>

      {/* Recent searches dropdown — absolute, never affects layout */}
      {showRecent && recentSearches.length > 0 && (
        <div className="absolute top-full mt-2 w-full rounded-xl border border-zinc-800 bg-zinc-900/95 backdrop-blur
          shadow-xl shadow-black/40 z-50 overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800">
            <span className="text-xs text-zinc-500 font-medium">Recent searches</span>
            <button
              onMouseDown={(e) => { e.preventDefault(); onClearRecent(); }}
              className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              Clear all
            </button>
          </div>
          <ul>
            {recentSearches.map((q, i) => (
              <li key={i}>
                <button
                  onMouseDown={(e) => { e.preventDefault(); onRecentSelect(q); }}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-zinc-300
                    hover:bg-zinc-800 transition-colors text-left"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    className="w-4 h-4 text-zinc-600 shrink-0"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5Z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="truncate">{q}</span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
