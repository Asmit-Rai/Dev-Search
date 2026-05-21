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
  multiMode: boolean;
  onToggleMultiMode: () => void;
  selectedCount: number;
  onSubmitMulti: () => void;
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
  multiMode,
  onToggleMultiMode,
  selectedCount,
  onSubmitMulti,
}: SearchBarProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    textareaRef.current?.focus();
  }, []);

  useEffect(() => {
    const el = textareaRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [query]);

  function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (multiMode && selectedCount > 0) {
        onSubmitMulti();
      } else if (!multiMode) {
        onSubmit();
      }
    }
    if (e.key === "Escape") {
      textareaRef.current?.blur();
    }
  }

  const trimmedQuery = query.trim().toLowerCase();
  const filteredRecents = trimmedQuery
    ? recentSearches.filter((q) => q.toLowerCase().includes(trimmedQuery))
    : recentSearches;

  return (
    <div className="relative w-full max-w-2xl">
      {/* Search box — 2px warm beige border, transitions to black on focus */}
      <div
        className="relative flex items-start rounded-2xl border-2"
        style={{ borderColor: "#1A1524", boxShadow: "none", background: "#FFFDF9" }}
      >
        {/* Search icon */}
        <div className="pl-4 pr-2 pt-[18px] shrink-0" style={{ color: "var(--muted-text)" }}>
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
          className="flex-1 bg-transparent py-4 text-base font-medium appearance-none
            focus:outline-none resize-none overflow-hidden leading-relaxed min-w-0"
          style={{ minHeight: "56px", color: "#1A1A1A", boxShadow: "none", WebkitAppearance: "none" }}
        />

        {/* Clear button */}
        {query && (
          <div className="flex items-center pt-3 pr-3 shrink-0">
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                onChange("");
                textareaRef.current?.focus();
              }}
              aria-label="Clear search"
              className="p-1 rounded-md transition-all hover:opacity-85 active:scale-[0.95]"
              style={{ color: "var(--muted-text)" }}
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
          </div>
        )}
      </div>

      {/* Mode + submit row */}
      <div className="mt-2 flex items-center justify-between px-1">
        <div
          className="inline-flex rounded-md overflow-hidden border-2"
          style={{ borderColor: "#1A1524" }}
          role="tablist"
          aria-label="Search mode"
        >
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              if (multiMode) onToggleMultiMode();
            }}
            aria-pressed={!multiMode}
            className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider transition-all hover:opacity-85 active:scale-[0.97]"
            style={{
              background: !multiMode ? "#1A1524" : "#FFFDF9",
              color: !multiMode ? "#FFFFEB" : "#1A1524",
              borderRight: "1.5px solid #1A1524",
            }}
          >
            Single
          </button>
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              if (!multiMode) onToggleMultiMode();
            }}
            aria-pressed={multiMode}
            className="px-3 py-1 text-[10px] font-semibold uppercase tracking-wider transition-all hover:opacity-85 active:scale-[0.97]"
            style={{
              background: multiMode ? "#1A1524" : "#FFFDF9",
              color: multiMode ? "#FFFFEB" : "#1A1524",
            }}
          >
            Multi
          </button>
        </div>

        {!multiMode ? (
          <kbd
            className="inline-flex items-center rounded-md border px-1.5 py-0.5 text-[11px] font-mono"
            style={{ borderColor: "#024F46", background: "#024F46", color: "#FFFFEB" }}
          >
            ↵ Enter
          </kbd>
        ) : (
          <button
            onMouseDown={(e) => {
              e.preventDefault();
              if (selectedCount > 0) onSubmitMulti();
            }}
            disabled={selectedCount === 0}
            className="inline-flex items-center rounded-md border-2 px-3 py-1 text-[10px] font-semibold tabular-nums uppercase tracking-wider transition-all hover:opacity-85 active:scale-[0.97] disabled:opacity-40 disabled:cursor-not-allowed disabled:active:scale-100"
            style={
              selectedCount > 0
                ? { background: "#1A1524", borderColor: "#1A1524", color: "#FFFFEB" }
                : { background: "#FFFDF9", borderColor: "#1A1524", color: "#1A1524" }
            }
          >
            Search {selectedCount}
          </button>
        )}
      </div>

      {/* Recent searches dropdown */}
      {showRecent && (
        <div
          className="absolute top-full mt-1 w-full rounded-2xl border-2 z-50 overflow-hidden animate-fade-in"

          style={{
            borderColor: "#1A1524",
            background: "#FFFDF9",
            boxShadow: "none",
          }}
        >
          <div
            className="flex items-center justify-between px-4 py-2 border-b-2"
            style={{ borderColor: "var(--border-color)" }}
          >
            <span
              className="text-[10px] font-semibold uppercase tracking-widest"
              style={{ color: "var(--muted-text)" }}
            >
              Recent searches
            </span>
            {recentSearches.length > 0 && (
              <button
                onMouseDown={(e) => { e.preventDefault(); onClearRecent(); }}
                className="text-[10px] font-medium uppercase tracking-wider transition-all hover:opacity-85"
                style={{ color: "var(--muted-text)" }}
              >
                Clear all
              </button>
            )}
          </div>
          {recentSearches.length === 0 ? (
            <div
              className="flex flex-col items-center justify-center px-4 py-6 gap-2"
              style={{ color: "var(--muted-text)" }}
            >
              <svg viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 opacity-60">
                <path fillRule="evenodd" d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm.75-13a.75.75 0 0 0-1.5 0v5c0 .414.336.75.75.75h4a.75.75 0 0 0 0-1.5h-3.25V5Z" clipRule="evenodd" />
              </svg>
              <span className="text-xs">Your searches will appear here</span>
            </div>
          ) : filteredRecents.length === 0 ? (
            <div
              className="px-4 py-6 text-center text-xs"
              style={{ color: "var(--muted-text)" }}
            >
              No matches in history
            </div>
          ) : (
            <ul>
              {filteredRecents.map((q, i) => (
                <li key={`${q}-${i}`}>
                  <button
                    onMouseDown={(e) => { e.preventDefault(); onRecentSelect(q); }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-medium text-left transition-all
                      hover:bg-[rgba(0,0,0,0.06)]"
                    style={{ color: "#1A1A1A" }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                      className="w-4 h-4 shrink-0"
                      style={{ color: "#1A1524", opacity: 0.5 }}
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
          )}
        </div>
      )}
    </div>
  );
}
