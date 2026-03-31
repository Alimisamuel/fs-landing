export const SELECTED_EXPERIENCE_STORAGE_KEY = "faithstream_selected_experience";

export function getSelectedExperience(): string | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SELECTED_EXPERIENCE_STORAGE_KEY);
    const trimmed = raw?.trim();
    return trimmed ? trimmed : null;
  } catch {
    return null;
  }
}

export function setSelectedExperience(name: string): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(
      SELECTED_EXPERIENCE_STORAGE_KEY,
      name.trim(),
    );
  } catch {
    /* ignore quota / private mode */
  }
}
