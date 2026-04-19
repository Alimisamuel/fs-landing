/** Subtle haptics on capable mobile browsers; otherwise first ~2s of selection clip. */

const SELECTION_SOUND_SRC = "/sound/studiokolomna-sunrise-114326.mp3";
const PLAY_DURATION_MS = 2000;

let clipAudio: HTMLAudioElement | null = null;
let clipStopTimeout: ReturnType<typeof setTimeout> | null = null;

function playSelectionClip(): void {
  if (typeof window === "undefined") return;

  try {
    if (clipStopTimeout) {
      clearTimeout(clipStopTimeout);
      clipStopTimeout = null;
    }

    if (!clipAudio) {
      clipAudio = new Audio(SELECTION_SOUND_SRC);
      clipAudio.preload = "auto";
      clipAudio.volume = 0.22;
    }

    clipAudio.pause();
    clipAudio.currentTime = 0;
    const playPromise = clipAudio.play();
    if (playPromise !== undefined) {
      void playPromise.catch(() => {});
    }

    clipStopTimeout = setTimeout(() => {
      if (clipAudio) {
        clipAudio.pause();
        clipAudio.currentTime = 0;
      }
      clipStopTimeout = null;
    }, PLAY_DURATION_MS);
  } catch {
    // Ignore blocked or missing audio
  }
}

export function playSelectionFeedback(): void {
  if (typeof window === "undefined") return;

  const coarsePointer =
    typeof window.matchMedia === "function" &&
    window.matchMedia("(pointer: coarse)").matches;
  const touchCapable =
    coarsePointer ||
    ("ontouchstart" in window && navigator.maxTouchPoints > 0);

  if (touchCapable && typeof navigator.vibrate === "function") {
    try {
      navigator.vibrate(12);
      return;
    } catch {
      // Fall through to clip
    }
  }

  playSelectionClip();
}
