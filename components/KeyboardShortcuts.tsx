"use client";

import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

export default function KeyboardShortcuts() {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  // Ensure portal target is available (SSR-safe)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Close on Escape
  useEffect(() => {
    if (!open) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  const shortcuts = [
    { key: "/", description: "Focus search bar" },
    { key: "Esc", description: "Blur search bar" },
    { key: "↵ Enter", description: "Search on default platform (Google)" },
    { key: "Ctrl + Y", description: "Search on YouTube" },
    { key: "Ctrl + G", description: "Search on GitHub" },
    { key: "Ctrl + S", description: "Search on Stack Overflow" },
    { key: "Ctrl + O", description: "Search on Google" },
    { key: "Ctrl + M", description: "Search on MDN" },
    { key: "Ctrl + D", description: "Search on Dev.to" },
    { key: "Ctrl + R", description: "Search on Reddit" },
    { key: "Ctrl + N", description: "Search on npm" },
    { key: "Ctrl + C", description: "Search on ChatGPT" },
    { key: "Ctrl + A", description: "Search on Claude" },
  ];

  const modal = open ? (
    <div
      className="fixed inset-0 flex items-center justify-center bg-black/60 backdrop-blur-sm"
      style={{ zIndex: 99999 }}
      onClick={() => setOpen(false)}
    >
      <div
        className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-sm mx-4 shadow-2xl
          flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4 shrink-0">
          <h2 className="text-sm font-semibold text-zinc-200">Keyboard Shortcuts</h2>
          <button
            onClick={() => setOpen(false)}
            className="text-zinc-600 hover:text-zinc-400 transition-colors p-1 rounded-md hover:bg-zinc-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4">
              <path d="M6.28 5.22a.75.75 0 0 0-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 1 0 1.06 1.06L10 11.06l3.72 3.72a.75.75 0 1 0 1.06-1.06L11.06 10l3.72-3.72a.75.75 0 0 0-1.06-1.06L10 8.94 6.28 5.22Z" />
            </svg>
          </button>
        </div>

        {/* Scrollable body */}
        <div className="overflow-y-auto px-6 pb-6">
          <p className="text-xs text-zinc-500 mb-4">
            Type your query, then press{" "}
            <kbd className="rounded border border-zinc-700 bg-zinc-900 px-1 py-0.5 text-[11px] text-zinc-400 font-mono">
              Ctrl
            </kbd>{" "}
            + a letter to instantly search — works whether or not the search bar is focused.
          </p>
          <div className="space-y-1">
            {shortcuts.map(({ key, description }) => (
              <div key={key} className="flex items-center justify-between py-1.5">
                <span className="text-xs text-zinc-400">{description}</span>
                <kbd className="inline-flex items-center rounded border border-zinc-700 bg-zinc-900
                  px-2 py-0.5 text-[11px] text-zinc-400 font-mono shrink-0 ml-4">
                  {key}
                </kbd>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  ) : null;

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-xs text-zinc-600 hover:text-zinc-400
          transition-colors px-3 py-1.5 rounded-lg hover:bg-zinc-900"
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

      {/* Render modal at document.body via portal — escapes all stacking contexts */}
      {mounted && createPortal(modal, document.body)}
    </>
  );
}
