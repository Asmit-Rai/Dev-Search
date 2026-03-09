"use client";

import { Platform } from "@/lib/platforms";
import { useState } from "react";

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
  const [hovered, setHovered] = useState(false);
  const [pressed, setPressed] = useState(false);

  function handleClick() {
    onSearch(platform, query);
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
          opacity-0 group-hover:opacity-100 transition-opacity duration-150
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

      {/* Icon button */}
      <button
        onClick={handleClick}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => { setHovered(false); setPressed(false); }}
        onMouseDown={() => setPressed(true)}
        onMouseUp={() => setPressed(false)}
        aria-label={`Search on ${platform.name}`}
        title={`Search on ${platform.name}${platform.shortcut ? ` [Ctrl+${platform.shortcut.toUpperCase()}]` : ""}`}
        className="relative w-14 h-14 rounded-2xl flex items-center justify-center
          bg-zinc-900 border border-zinc-800
          transition-all duration-150 ease-out
          focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-400"
        style={{
          transform: pressed ? "scale(0.92)" : hovered ? "scale(1.08)" : "scale(1)",
          boxShadow: hovered
            ? `0 0 0 1px ${platform.color}40, 0 8px 24px ${platform.color}25`
            : "none",
          borderColor: hovered ? `${platform.color}60` : undefined,
        }}
      >
        {/* Glow bg */}
        <div
          className="absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-150"
          style={{
            background: `radial-gradient(circle at center, ${platform.color}18, transparent 70%)`,
            opacity: hovered ? 1 : 0,
          }}
        />

        {/* Icon */}
        <span
          className="relative w-7 h-7 flex items-center justify-center transition-colors duration-150"
          style={{ color: hovered ? platform.color : "#a1a1aa" }}
          dangerouslySetInnerHTML={{ __html: platform.iconSvg }}
        />

        {/* Default badge */}
        {isDefault && (
          <span className="absolute -bottom-1 -right-1 w-3 h-3 bg-zinc-400 rounded-full border-2 border-zinc-950" />
        )}
      </button>

      {/* Label */}
      <span
        className="text-xs font-medium transition-colors duration-150 select-none"
        style={{ color: hovered ? platform.color : "#71717a" }}
      >
        {platform.name}
      </span>

      {/* Shortcut badge */}
      {platform.shortcut && (
        <span className="text-[10px] text-zinc-700 font-mono -mt-1">
          ^{platform.shortcut.toUpperCase()}
        </span>
      )}
    </div>
  );
}
