/**
 * Lightweight Web Audio blips — no asset files required.
 */

let ctx: AudioContext | null = null;

function getCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return null;
  try {
    ctx ??= new AudioContext();
    return ctx;
  } catch {
    return null;
  }
}

/** Call once from a user gesture (or early) so later blips are allowed. */
export function unlockTechAudio() {
  const audio = getCtx();
  if (!audio) return;
  void audio.resume();
}

export function playTechBoot() {
  const audio = getCtx();
  if (!audio) return;
  void audio.resume();

  const now = audio.currentTime;
  const tones = [220, 330, 440];
  tones.forEach((freq, i) => {
    const osc = audio.createOscillator();
    const gain = audio.createGain();
    osc.type = 'square';
    osc.frequency.value = freq;
    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.045, now + 0.02 + i * 0.05);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18 + i * 0.06);
    osc.connect(gain);
    gain.connect(audio.destination);
    osc.start(now + i * 0.05);
    osc.stop(now + 0.22 + i * 0.06);
  });
}

export function playTechType() {
  const audio = getCtx();
  if (!audio) return;
  void audio.resume();

  const now = audio.currentTime;
  const osc = audio.createOscillator();
  const gain = audio.createGain();
  osc.type = 'triangle';
  osc.frequency.value = 880 + Math.random() * 420;
  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(0.028, now + 0.005);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
  osc.connect(gain);
  gain.connect(audio.destination);
  osc.start(now);
  osc.stop(now + 0.05);
}
