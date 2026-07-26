import type { SavedRecommendation } from "@/types";

const STORAGE_KEY = "makeup-look-recommendations";

export function saveRecommendation(value: SavedRecommendation): void {
  const existing = loadRecommendations();

  const updated = [value, ...existing];

  window.localStorage.setItem(
    STORAGE_KEY,
    JSON.stringify(updated)
  );
}

export function loadRecommendations(): SavedRecommendation[] {
  const raw = window.localStorage.getItem(STORAGE_KEY);

  if (!raw) return [];

  try {
    const parsed = JSON.parse(raw);

    return Array.isArray(parsed) ? parsed : [];
  } catch {
    window.localStorage.removeItem(STORAGE_KEY);
    return [];
  }
}