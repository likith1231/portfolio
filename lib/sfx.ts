// Suit sounds, synthesised with the Web Audio API (no audio files). Off until the visitor opts in.

let ctx: AudioContext | null = null;
let enabled = false;
const listeners = new Set<(on: boolean) => void>();

export const sound = {
  get on() { return enabled; },
  set(on: boolean) {
    enabled = on;
    if (on) audio();
    try { localStorage.setItem("suit-sound", on ? "1" : "0"); } catch {}
    listeners.forEach((l) => l(on));
  },
  subscribe(fn: (on: boolean) => void) { listeners.add(fn); return () => { listeners.delete(fn); }; },
};

function audio() {
  if (typeof window === "undefined") return null;
  if (!ctx) {
    const AC = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
  }
  if (ctx.state === "suspended") ctx.resume();
  return ctx;
}

function tone(freq: number, dur: number, type: OscillatorType = "sine", vol = 0.08, slideTo?: number, delay = 0) {
  if (!enabled) return;
  const a = audio();
  if (!a) return;
  const t = a.currentTime + delay;
  const o = a.createOscillator();
  const g = a.createGain();
  o.type = type;
  o.frequency.setValueAtTime(freq, t);
  if (slideTo) o.frequency.exponentialRampToValueAtTime(slideTo, t + dur);
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(vol, t + 0.01);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  o.connect(g).connect(a.destination);
  o.start(t);
  o.stop(t + dur + 0.02);
}

function noise(dur: number, vol = 0.1, from = 3000, to = 200, delay = 0) {
  if (!enabled) return;
  const a = audio();
  if (!a) return;
  const t = a.currentTime + delay;
  const buf = a.createBuffer(1, Math.floor(a.sampleRate * dur), a.sampleRate);
  const d = buf.getChannelData(0);
  for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  const src = a.createBufferSource();
  src.buffer = buf;
  const f = a.createBiquadFilter();
  f.type = "bandpass";
  f.frequency.setValueAtTime(from, t);
  f.frequency.exponentialRampToValueAtTime(to, t + dur);
  const g = a.createGain();
  g.gain.setValueAtTime(vol, t);
  g.gain.exponentialRampToValueAtTime(0.0001, t + dur);
  src.connect(f).connect(g).connect(a.destination);
  src.start(t);
}

export const sfx = {
  tick: () => tone(1800, 0.03, "square", 0.015),
  click: () => tone(900, 0.06, "triangle", 0.05, 600),
  servo: () => { tone(140, 0.35, "sawtooth", 0.025, 320); tone(280, 0.35, "sine", 0.02, 520); },
  lock: () => { tone(1200, 0.05, "square", 0.03); tone(1600, 0.08, "square", 0.03, undefined, 0.07); },
  charge: () => tone(200, 0.5, "sawtooth", 0.03, 1400),
  repulsor: () => { tone(900, 0.18, "sawtooth", 0.05, 120); noise(0.35, 0.12, 4000, 300); },
  boom: () => { noise(0.6, 0.18, 1200, 60); tone(90, 0.5, "sine", 0.12, 40); },
  alert: () => { tone(660, 0.12, "square", 0.04); tone(660, 0.12, "square", 0.04, undefined, 0.18); },
  success: () => { [523, 659, 784].forEach((f, i) => tone(f, 0.18, "triangle", 0.05, undefined, i * 0.09)); },
  boot: () => { [220, 330, 440, 660, 880].forEach((f, i) => tone(f, 0.25, "sine", 0.04, undefined, i * 0.12)); noise(1.2, 0.04, 400, 4000, 0.2); },
  ignite: () => { tone(80, 1.2, "sine", 0.14, 160); tone(1200, 0.9, "sine", 0.03, 2400); noise(0.9, 0.06, 6000, 800, 0.05); },
  faceplate: () => { noise(0.25, 0.15, 2500, 400); tone(180, 0.25, "square", 0.04, 90); },
  stone: (i: number) => tone(330 * Math.pow(1.19, i), 0.35, "sine", 0.05),
  snap: () => { noise(0.06, 0.5, 6000, 3000); tone(1800, 0.05, "square", 0.08, 400); tone(55, 1.6, "sine", 0.18, 30, 0.05); noise(1.4, 0.08, 800, 60, 0.08); },
  dust: () => noise(2.6, 0.07, 3000, 300),
  // Doom: a low bell for "Kneel", and a crackling hex for mystic bolts.
  toll: () => { tone(98, 2.2, "sine", 0.16, 92); tone(196, 1.6, "sine", 0.05, 190, 0.02); tone(49, 2.4, "triangle", 0.08, 46); },
  hex: () => { tone(520, 0.22, "sawtooth", 0.03, 1400); noise(0.25, 0.08, 7000, 1200); },
  hexBig: () => { tone(110, 0.9, "sawtooth", 0.05, 40); noise(0.9, 0.14, 5000, 200); tone(880, 0.4, "sine", 0.03, 2200, 0.05); },
  portal: () => { noise(0.9, 0.09, 200, 5000); tone(60, 1.0, "sawtooth", 0.05, 30); tone(740, 0.5, "sine", 0.03, 220, 0.3); },
  reform: () => { noise(1.4, 0.06, 300, 3000); tone(140, 1.4, "sine", 0.05, 420); },
};
