const RECENT_KEY = "devsearch:recent";
const FAVORITES_KEY = "devsearch:favorites";
const MAX_RECENT = 8;

export function getRecentSearches(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function addRecentSearch(query: string): void {
  if (typeof window === "undefined") return;
  const current = getRecentSearches();
  const filtered = current.filter((q) => q !== query);
  const updated = [query, ...filtered].slice(0, MAX_RECENT);
  localStorage.setItem(RECENT_KEY, JSON.stringify(updated));
}

export function clearRecentSearches(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(RECENT_KEY);
}

export function getFavorites(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(FAVORITES_KEY) ?? "[]");
  } catch {
    return [];
  }
}

export function toggleFavorite(platformId: string): string[] {
  const current = getFavorites();
  const updated = current.includes(platformId)
    ? current.filter((id) => id !== platformId)
    : [...current, platformId];
  localStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  return updated;
}
