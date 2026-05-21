"use client";

import { Platform } from "@/lib/platforms";

interface PlatformIconProps {
  platform: Platform;
  query: string;
  isDefault: boolean;
  isSelected?: boolean;
  multiMode?: boolean;
  onSearch: (platform: Platform, query: string) => void;
  onToggleSelected?: (id: string) => void;
}

export default function PlatformIcon({
  platform,
  query,
  isDefault,
  isSelected,
  multiMode,
  onSearch,
  onToggleSelected,
}: PlatformIconProps) {
  function handleClick() {
    if (multiMode && onToggleSelected) {
      onToggleSelected(platform.id);
    } else {
      onSearch(platform, query);
    }
  }

  return (
    <div className="relative flex flex-col items-center gap-2">
      <button
        onClick={handleClick}
        aria-label={`Search on ${platform.name}`}
        aria-pressed={multiMode ? !!isSelected : undefined}
        title={`Search on ${platform.name}${platform.shortcut ? ` [Ctrl+${platform.shortcut.toUpperCase()}]` : ""}`}
        className="relative w-14 h-14 rounded-2xl flex items-center justify-center border-2 cursor-pointer
          active:scale-[0.97] focus:outline-none focus-visible:ring-2"
        style={{
          borderColor: "#1A1524",
          background: isSelected ? "rgba(2,79,70,0.1)" : "#FFFDF9",
        }}
      >
        <span
          className="relative w-7 h-7 flex items-center justify-center pointer-events-none"
          style={{ color: "#1A1524" }}
          dangerouslySetInnerHTML={{ __html: platform.iconSvg }}
        />

        {isSelected && (
          <span
            className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full flex items-center justify-center
              pointer-events-none border-2"
            style={{ background: "#1A1524", borderColor: "#FFFDF9" }}
          >
            <svg viewBox="0 0 20 20" fill="white" className="w-2.5 h-2.5">
              <path d="M16.704 5.29a1 1 0 0 1 .007 1.414l-7.5 7.6a1 1 0 0 1-1.42.006L3.286 9.806a1 1 0 0 1 1.42-1.41l3.793 3.82 6.79-6.88a1 1 0 0 1 1.414-.046Z" />
            </svg>
          </span>
        )}
      </button>

      <span
        className="text-xs font-medium select-none pointer-events-none"
        style={{ color: "#1A1524" }}
      >
        {platform.name}
      </span>

      {platform.shortcut && (
        <span
          className="hidden sm:block text-[10px] font-mono -mt-1 pointer-events-none uppercase tracking-wider"
          style={{ color: "#1A1524", opacity: 0.45 }}
        >
          ^{platform.shortcut.toUpperCase()}
        </span>
      )}
    </div>
  );
}
