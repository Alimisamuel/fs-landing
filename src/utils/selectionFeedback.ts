/** Subtle haptics on capable mobile browsers; otherwise a very soft click. */

let sharedAudioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  const AC = window.AudioContext ?? (window as Window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
  if (!AC) return null;
  if (!sharedAudioContext) {
    sharedAudioContext = new AC();
  }
  return sharedAudioContext;
}

function playSoftClick(): void {
  try {
    const audioCtx = getAudioContext();
    if (!audioCtx) return;
    if (audioCtx.state === "suspended") {
      void audioCtx.resume();
    }

    const t = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();

    osc.type = "sine";
    osc.frequency.setValueAtTime(2200, t);
    osc.frequency.exponentialRampToValueAtTime(900, t + 0.018);

    gain.gain.setValueAtTime(0.0001, t);
    gain.gain.exponentialRampToValueAtTime(0.022, t + 0.002);
    gain.gain.exponentialRampToValueAtTime(0.0001, t + 0.04);

    osc.connect(gain);
    gain.connect(audioCtx.destination);

    osc.start(t);
    osc.stop(t + 0.045);
  } catch {
    // Ignore missing/blocked audio
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
      // Fall through to synthesized click
    }
  }

  playSoftClick();
}
