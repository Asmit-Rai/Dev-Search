"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface KeyboardShortcutsProps {
  open: boolean;
  onClose: () => void;
}

export default function KeyboardShortcuts({ open, onClose }: KeyboardShortcutsProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // Defer createPortal until after mount so document.body is available (SSR-safe).
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const shortcuts = [
    { key: "/", description: "Focus search bar" },
    { key: "Esc", description: "Blur search bar" },
    { key: "?", description: "Open this shortcuts panel" },
    { key: "↵ Enter", description: "Search on default platform" },
    { key: "Ctrl + Y", description: "Search on YouTube" },
    { key: "Ctrl + G", description: "Search on GitHub" },
    { key: "Ctrl + S", description: "Search on Stack Overflow" },
    { key: "Ctrl + O", description: "Search on Google" },
    { key: "Ctrl + R", description: "Search on Reddit" },
    { key: "Ctrl + C", description: "Search on ChatGPT" },
    { key: "Ctrl + A", description: "Search on Claude" },
    { key: "Ctrl + X", description: "Search on X (Twitter)" },
    { key: "Ctrl + L", description: "Search on LinkedIn" },
    { key: "Ctrl + H", description: "Search on Hacker News" },
    { key: "Ctrl + D", description: "Search on MDN" },
    { key: "Ctrl + P", description: "Search on Pinterest" },
    { key: "Ctrl + Q", description: "Search on Quora" },
    { key: "Ctrl + M", description: "Search on Medium" },
  ];

  if (!open || !mounted) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in"
      style={{ zIndex: 99999 }}
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/20 backdrop-blur-sm" />
      <div
        className="relative w-full max-w-md rounded-3xl border-2 p-8 flex flex-col max-h-[90vh]
          animate-slide-up"
        style={{
          background: "#FFFDF9",
          borderColor: "#1A1524",
          boxShadow: "none",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between mb-5 shrink-0">
          <h2
            className="font-display text-2xl font-semibold tracking-tight"
            style={{ color: "#1A1A1A" }}
          >
            Keyboard Shortcuts
          </h2>
          <button
            onClick={onClose}
            aria-label="Close shortcuts"
            className="rounded-xl border-2 w-8 h-8 flex items-center justify-center transition-all
              hover:opacity-85 active:scale-[0.95]"
            style={{ borderColor: "#1A1524", color: "#1A1524" }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        </div>

        <div className="overflow-y-auto -mx-2 px-2">
          <p
            className="text-[10px] font-semibold uppercase tracking-widest mb-4"
            style={{ color: "#1A1524", opacity: 0.6 }}
          >
            Type your query, then press Ctrl + a letter to instantly search
          </p>
          <div className="space-y-0.5">
            {shortcuts.map(({ key, description }) => (
              <div
                key={key}
                className="flex items-center justify-between py-2 border-b"
                style={{ borderColor: "rgba(26,21,36,0.15)" }}
              >
                <span className="text-sm font-medium" style={{ color: "#1A1A1A" }}>
                  {description}
                </span>
                <kbd
                  className="inline-flex items-center rounded-md border-2 px-2 py-0.5 text-[10px] font-mono font-semibold shrink-0 ml-4"
                  style={{
                    borderColor: "#024F46",
                    background: "#024F46",
                    color: "#FFFFEB",
                  }}
                >
                  {key}
                </kbd>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
