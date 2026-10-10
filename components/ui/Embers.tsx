"use client";

// Ambient particles drifting up behind every section, not just the hero:
// gold workshop sparks for Stark, green embers for Doom (the colour comes from the theme).
const SPARKS = Array.from({ length: 30 }, (_, i) => ({
  left: (i * 37) % 100, w: 2 + (i % 3), d: 9 + ((i * 13) % 11), delay: (i * 0.7) % 12, dx: ((i % 5) - 2) * 25,
}));

export default function Embers() {
  return (
    <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden" aria-hidden>
      {SPARKS.map((p, i) => (
        <span key={i} className="spark" style={{ left: `${p.left}%`, ["--w" as string]: `${p.w}px`, ["--d" as string]: `${p.d}s`, ["--delay" as string]: `${p.delay}s`, ["--dx" as string]: `${p.dx}px` }} />
      ))}
    </div>
  );
}
