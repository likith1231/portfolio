"use client";

import { useEffect, useState } from "react";
import { sfx } from "@/lib/sfx";
import { useHUD } from "./Shell";

type Blast = { id: number; x: number; y: number; big: boolean };

// Click any empty space to fire a repulsor. Hold for a second first to charge a bigger blast.
// In Doom's universe the same click casts a mystic bolt: a burst of green runes and lightning.
const BOLTS = Array.from({ length: 7 }, (_, i) => ({ a: (i / 7) * 360 + (i % 2) * 17, l: 34 + ((i * 13) % 24) }));

export default function Repulsors() {
  const isDoom = useHUD().mode === "doom";
  const [blasts, setBlasts] = useState<Blast[]>([]);
  const [charge, setCharge] = useState<{ x: number; y: number } | null>(null);

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    let id = 0;
    let downAt = 0;
    let timer: ReturnType<typeof setTimeout> | undefined;
    const interactive = (el: EventTarget | null) =>
      !!(el as HTMLElement)?.closest?.("a, button, input, textarea, select, label, [role=dialog], [data-lock], canvas, p, h1, h2, h3, li, pre, code");

    const down = (e: MouseEvent) => {
      if (e.button !== 0 || interactive(e.target)) return;
      downAt = performance.now();
      timer = setTimeout(() => { setCharge({ x: e.clientX, y: e.clientY }); sfx.charge(); }, 250);
    };
    const up = (e: MouseEvent) => {
      clearTimeout(timer);
      if (!downAt) return;
      const held = performance.now() - downAt;
      downAt = 0;
      setCharge(null);
      if (window.getSelection()?.toString()) return;
      const b = { id: ++id, x: e.clientX, y: e.clientY, big: held > 900 };
      setBlasts((s) => [...s.slice(-6), b]);
      if (document.documentElement.dataset.mode === "doom") b.big ? sfx.hexBig() : sfx.hex();
      else b.big ? sfx.boom() : sfx.repulsor();
      setTimeout(() => setBlasts((s) => s.filter((x) => x.id !== b.id)), 700);
    };
    window.addEventListener("mousedown", down);
    window.addEventListener("mouseup", up);
    return () => { window.removeEventListener("mousedown", down); window.removeEventListener("mouseup", up); };
  }, []);

  return (
    <div className="pointer-events-none fixed inset-0 z-[88]">
      {charge && (
        <div className="absolute h-10 w-10 -translate-x-1/2 -translate-y-1/2 animate-pulse rounded-full bg-white/80 blur-sm"
          style={{ left: charge.x, top: charge.y, boxShadow: `0 0 30px 12px ${isDoom ? "#3cff9a" : "#8fefff"}` }} />
      )}
      {isDoom && blasts.map((b) => (
        <div key={b.id} className="absolute" style={{ left: b.x, top: b.y }}>
          <span className={`absolute left-0 top-0 animate-blast rounded-full border-2 border-dashed border-[#3cff9a] ${b.big ? "h-64 w-64" : "h-24 w-24"}`} style={{ boxShadow: "0 0 24px 6px #3cff9a, inset 0 0 18px #3cff9a" }} />
          <svg className="absolute -translate-x-1/2 -translate-y-1/2 animate-blast overflow-visible" width={b.big ? 220 : 110} height={b.big ? 220 : 110} viewBox="-60 -60 120 120" aria-hidden style={{ filter: "drop-shadow(0 0 6px #3cff9a)" }}>
            {BOLTS.map((r, i) => (
              <polyline key={i} transform={`rotate(${r.a})`} points={`0,-6 4,-${r.l * 0.4} -3,-${r.l * 0.65} 3,-${r.l}`} fill="none" stroke="#c9ffe3" strokeWidth="2" strokeLinejoin="round" />
            ))}
          </svg>
        </div>
      ))}
      {!isDoom && blasts.map((b) => (
        <div key={b.id} className="absolute" style={{ left: b.x, top: b.y }}>
          <span className={`absolute left-0 top-0 animate-blast rounded-full border-2 border-white ${b.big ? "h-64 w-64" : "h-24 w-24"}`} style={{ boxShadow: "0 0 24px 6px #8fefff, inset 0 0 18px #8fefff" }} />
          <span className={`absolute left-0 top-0 animate-blast rounded-full bg-white/70 blur-md ${b.big ? "h-24 w-24" : "h-10 w-10"}`} />
        </div>
      ))}
    </div>
  );
}
