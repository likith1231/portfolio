"use client";

import { useEffect, useState } from "react";
import { sfx } from "@/lib/sfx";

type Blast = { id: number; x: number; y: number; big: boolean };

// Click any empty space to fire a repulsor. Hold for a second first to charge a bigger blast.
export default function Repulsors() {
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
      b.big ? sfx.boom() : sfx.repulsor();
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
          style={{ left: charge.x, top: charge.y, boxShadow: "0 0 30px 12px #8fefff" }} />
      )}
      {blasts.map((b) => (
        <div key={b.id} className="absolute" style={{ left: b.x, top: b.y }}>
          <span className={`absolute left-0 top-0 animate-blast rounded-full border-2 border-white ${b.big ? "h-64 w-64" : "h-24 w-24"}`} style={{ boxShadow: "0 0 24px 6px #8fefff, inset 0 0 18px #8fefff" }} />
          <span className={`absolute left-0 top-0 animate-blast rounded-full bg-white/70 blur-md ${b.big ? "h-24 w-24" : "h-10 w-10"}`} />
        </div>
      ))}
    </div>
  );
}
