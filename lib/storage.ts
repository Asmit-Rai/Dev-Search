const RECENT_KEY = "devsearch:recent";
const DEFAULT_PLATFORM_KEY = "devsearch:default";
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

export function getDefaultPlatform(): string {
  if (typeof window === "undefined") return "google";
  return localStorage.getItem(DEFAULT_PLATFORM_KEY) ?? "google";
}

export function setDefaultPlatform(id: string): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(DEFAULT_PLATFORM_KEY, id);
}
