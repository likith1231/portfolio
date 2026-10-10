"use client";

import { useEffect, useState } from "react";

// Space, Mind, Reality, Power, Time, Soul
export const STONES = ["#4f8dff", "#ffd23f", "#ff3b3b", "#b45cff", "#3ddc84", "#ff8a1f"];

// In the Doom universe the gauntlet holds green mystic energy instead of the stones.
export const RUNES = ["#3cff9a", "#5dffad", "#2ee68a", "#7affc0", "#1fd67a", "#a8ffd6"];

export type SnapPhase = "idle" | "charge" | "snap" | "dust" | "reform" | "final";

// Start the snap. Pass the element that was clicked so the charge glow starts from it.
export function triggerSnap(from?: Element | null) {
  const r = from?.getBoundingClientRect();
  const detail = r ? { x: r.left + r.width / 2, y: r.top + r.height / 2 } : { x: innerWidth / 2, y: innerHeight / 2 };
  window.dispatchEvent(new CustomEvent("stark:snap", { detail }));
}

// Follow the snap from anywhere: how many stones are lit and which phase it's in.
export function useSnapState() {
  const [state, setState] = useState<{ lit: number; phase: SnapPhase }>({ lit: 0, phase: "idle" });
  useEffect(() => {
    const on = (e: Event) => setState((e as CustomEvent).detail);
    window.addEventListener("stark:snap-state", on);
    return () => window.removeEventListener("stark:snap-state", on);
  }, []);
  return state;
}

// The Iron Man nano-gauntlet with the six stones. `lit` stones glow; `pulse` makes idle stones breathe.
// Drawn in SVG with gradients so it stays crisp at any size.
export default function Gauntlet({ lit = 0, pulse = false, className = "h-9 w-9", doom = false }: { lit?: number; pulse?: boolean; className?: string; doom?: boolean }) {
  const gems = doom ? RUNES : STONES;
  // Space, Mind, Reality, Power on the knuckles, Time on the thumb, Soul in the palm
  const spots: [number, number, number][] = [[19.2, 11.5, 1.7], [24, 8.5, 1.7], [28.9, 9.5, 1.7], [33.8, 12.5, 1.6], [10.6, 25.2, 1.7], [25, 26, 2.6]];
  return (
    <svg viewBox="0 0 48 48" className={className} aria-hidden>
      <defs>
        <linearGradient id="g-red" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={doom ? "#a3a8ae" : "#e3283a"} />
          <stop offset="55%" stopColor={doom ? "#6b6f75" : "#a5121e"} />
          <stop offset="100%" stopColor={doom ? "#2c2f33" : "#5e0a11"} />
        </linearGradient>
        <linearGradient id="g-gold" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor={doom ? "#d9c27e" : "#ffe3a3"} />
          <stop offset="50%" stopColor={doom ? "#b08d3c" : "#e8b04a"} />
          <stop offset="100%" stopColor={doom ? "#6b5420" : "#9c6a1f"} />
        </linearGradient>
        {gems.map((c, i) => (
          <radialGradient key={i} id={`g-stone-${i}`} cx="35%" cy="30%" r="75%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="35%" stopColor={c} />
            <stop offset="100%" stopColor="#120808" />
          </radialGradient>
        ))}
        {gems.map((c, i) => (
          <radialGradient key={`h${i}`} id={`g-halo-${i}`}>
            <stop offset="0%" stopColor={c} stopOpacity="0.9" />
            <stop offset="100%" stopColor={c} stopOpacity="0" />
          </radialGradient>
        ))}
      </defs>
      {/* thumb */}
      <path d="M15.5 33 Q9.5 30.5 8.2 25.5 Q7.5 22.6 10.3 22.2 Q12.4 22 13.3 24.4 L15.5 28.5 Z" fill="url(#g-red)" stroke="url(#g-gold)" strokeWidth="1" />
      {/* hand and fingers */}
      <path d="M14.5 44 L14.5 26 Q14.5 22 17 21 L17 9.5 Q17 7.2 19.2 7.2 Q21.3 7.2 21.3 9.5 L21.6 19 L21.8 6.5 Q21.8 4.3 24 4.3 Q26.2 4.3 26.2 6.5 L26.4 19 L26.8 7.4 Q26.8 5.3 28.9 5.3 Q31 5.3 31 7.4 L31.3 20 L31.7 10.5 Q31.7 8.4 33.8 8.4 Q35.9 8.4 35.9 10.5 L35.9 30 Q35.9 38.5 30 44 Z"
        fill="url(#g-red)" stroke="url(#g-gold)" strokeWidth="1.1" strokeLinejoin="round" />
      {/* gold plating */}
      <path d="M17.5 21.5 Q25 19.5 35.4 21.8 L35.4 24 Q25 22 17.5 24 Z" fill="url(#g-gold)" opacity=".9" />
      <path d="M14.5 31 L35.9 31 L35.9 33 L14.5 33 Z" fill="url(#g-gold)" opacity=".85" />
      <path d="M15.5 38.5 L33.5 38.5 L32.5 40.2 L15.5 40.2 Z" fill="url(#g-gold)" opacity=".7" />
      {[19.2, 24, 28.9, 33.8].map((x) => <path key={x} d={`M${x - 1.6} 15.5 L${x + 1.6} 15.5`} stroke="#4a070d" strokeWidth=".7" />)}
      {/* stones */}
      {spots.map(([x, y, r], i) => {
        const on = i < lit;
        return (
          <g key={i} style={{ animation: pulse && !on ? `stone-breathe 2.4s ease-in-out ${i * 0.3}s infinite` : undefined }}>
            {(on || pulse) && <circle cx={x} cy={y} r={r * (on ? 3.2 : 2.2)} fill={`url(#g-halo-${i})`} opacity={on ? 1 : 0.55} />}
            <circle cx={x} cy={y} r={r + 0.45} fill="url(#g-gold)" />
            <circle cx={x} cy={y} r={r} fill={on || pulse ? `url(#g-stone-${i})` : "#2a1d16"} />
            <circle cx={x - r * 0.35} cy={y - r * 0.4} r={r * 0.28} fill="#fff" opacity={on || pulse ? 0.85 : 0.2} />
          </g>
        );
      })}
      <style>{`@keyframes stone-breathe { 0%,100% { opacity: .7 } 50% { opacity: 1 } }`}</style>
    </svg>
  );
}
