import { MovieLanguages } from "@/lib/constants/mock";

export const getLanguageName = (code: string): string => {
  const lang = MovieLanguages.find((l) => l.code === code);
  return lang ? lang.name : code; // fallback to code if not found
};

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  return date.toLocaleString("en-US", {
    month: "short", // Aug
    day: "numeric", // 20
    year: "numeric", // 2025
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

export const formatDuration = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;

  if (h > 0 && m > 0) return `${h}h ${m}min`;
  if (h > 0) return `${h}h`;
  if (m > 0) return `${m}min`;
  return `${s}s`;
};

export function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

export const getSafeMediaUrl = (
  url?: unknown,
  fallback?: string
): string | undefined => {
  if (typeof url !== "string") return fallback;

  const trimmed = url.trim();
  if (!trimmed) return fallback;

  // allow local
  if (trimmed.startsWith("/")) return trimmed;

  try {
    new URL(trimmed);
    return trimmed;
  } catch {
    return fallback;
  }
};



export const formatEpisodeDuration = (
  seconds: number | string | null | undefined,
): string => {
  const totalSeconds = Number(seconds);
  if (!Number.isFinite(totalSeconds) || totalSeconds < 0) return "0:00";

  const mins = Math.floor(totalSeconds / 60);
  const secs = Math.floor(totalSeconds % 60)
    .toString()
    .padStart(2, "0");
  return `${mins}:${secs}`;
};

export const THUMBNAIL_FALLBACK = "/images/thumbnail_fallback.jpeg"
