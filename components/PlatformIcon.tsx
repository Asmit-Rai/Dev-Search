"use client";

import { useRef } from "react";
import { Platform } from "@/lib/platforms";

interface PlatformIconProps {
  platform: Platform;
  query: string;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onSearch: (platform: Platform, query: string) => void;
  isDefault: boolean;
}

export default function PlatformIcon({
  platform,
  query,
  isFavorite,
  onToggleFavorite,
  onSearch,
  isDefault,
}: PlatformIconProps) {
  const btnRef = useRef<HTMLButtonElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const iconRef = useRef<HTMLSpanElement>(null);
  const labelRef = useRef<HTMLSpanElement>(null);

  // Direct DOM manipulation — zero re-renders, instant response
  function handleMouseEnter() {
    if (btnRef.current) {
      btnRef.current.style.transform = "scale(1.1)";
      btnRef.current.style.borderColor = `${platform.color}70`;
      btnRef.current.style.boxShadow = `0 0 0 1px ${platform.color}30, 0 8px 24px ${platform.color}20`;
    }
    if (glowRef.current) glowRef.current.style.opacity = "1";
    if (iconRef.current) iconRef.current.style.color = platform.color;
    if (labelRef.current) labelRef.current.style.color = platform.color;
  }

  function handleMouseLeave() {
    if (btnRef.current) {
      btnRef.current.style.transform = "scale(1)";
      btnRef.current.style.borderColor = "";
      btnRef.current.style.boxShadow = "none";
    }
    if (glowRef.current) glowRef.current.style.opacity = "0";
    if (iconRef.current) iconRef.current.style.color = "#a1a1aa";
    if (labelRef.current) labelRef.current.style.color = "#71717a";
  }

  function handleMouseDown() {
    if (btnRef.current) btnRef.current.style.transform = "scale(0.93)";
  }

  function handleMouseUp() {
    if (btnRef.current) btnRef.current.style.transform = "scale(1.1)";
  }

  function handleFavoriteClick(e: React.MouseEvent) {
    e.stopPropagation();
    onToggleFavorite(platform.id);
  }

  return (
    <div className="relative group flex flex-col items-center gap-2">
      {/* Favorite star */}
      <button
        onClick={handleFavoriteClick}
        aria-label={`${isFavorite ? "Remove" : "Add"} ${platform.name} from favorites`}
        className="absolute -top-1 -right-1 z-10 w-5 h-5 flex items-center justify-center rounded-full
          opacity-0 group-hover:opacity-100 transition-opacity duration-100
          text-zinc-500 hover:text-yellow-400"
      >
        <svg
          viewBox="0 0 24 24"
          fill={isFavorite ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth={2}
          className={`w-3.5 h-3.5 ${isFavorite ? "text-yellow-400" : ""}`}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5z"
          />
        </svg>
      </button>

      {/* Icon button — all visual effects via DOM refs, no React state */}
      <button
        ref={btnRef}
        onClick={() => onSearch(platform, query)}
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        aria-label={`Search on ${platform.name}`}
        title={`Search on ${platform.name}${platform.shortcut ? ` [Ctrl+${platform.shortcut.toUpperCase()}]` : ""}`}
        className="relative w-14 h-14 rounded-2xl flex items-center justify-center
          bg-zinc-900 border border-zinc-800 cursor-pointer
          focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
        style={{ transition: "transform 80ms ease, box-shadow 80ms ease, border-color 80ms ease" }}
      >
        {/* Glow background */}
        <div
          ref={glowRef}
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            background: `radial-gradient(circle at center, ${platform.color}15, transparent 70%)`,
            opacity: 0,
            transition: "opacity 80ms ease",
          }}
        />

        {/* SVG icon */}
        <span
          ref={iconRef}
          className="relative w-7 h-7 flex items-center justify-center pointer-events-none"
          style={{ color: "#a1a1aa", transition: "color 80ms ease" }}
          dangerouslySetInnerHTML={{ __html: platform.iconSvg }}
        />

        {/* Default platform dot */}
        {isDefault && (
          <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-zinc-400 rounded-full border-2 border-zinc-950 pointer-events-none" />
        )}
      </button>

      {/* Label */}
      <span
        ref={labelRef}
        className="text-xs font-medium select-none pointer-events-none"
        style={{ color: "#71717a", transition: "color 80ms ease" }}
      >
        {platform.name}
      </span>

      {/* Shortcut badge */}
      {platform.shortcut && (
        <span className="text-[10px] text-zinc-700 font-mono -mt-1 pointer-events-none">
          ^{platform.shortcut.toUpperCase()}
        </span>
      )}
    </div>
  );
}
