"use client";

import { useEffect, useRef, useState } from "react";
import { useHUD } from "../Shell";

// A targeting reticle that replaces the cursor on mouse devices and locks onto links and buttons.
export default function Reticle() {
  const ring = useRef<HTMLDivElement>(null);
  const dot = useRef<HTMLDivElement>(null);
  const [on, setOn] = useState(false);
  const [locked, setLocked] = useState(false);
  const lockedRef = useRef(false);
  const [moved, setMoved] = useState(false);
  const isDoom = useHUD().mode === "doom";

  useEffect(() => {
    if (!window.matchMedia("(pointer: fine)").matches) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setOn(true);
    document.body.classList.add("has-reticle");
    let x = 0, y = 0, rx = 0, ry = 0, id = 0;
    const move = (e: MouseEvent) => {
      if (!rx && !ry) { rx = e.clientX; ry = e.clientY; }
      x = e.clientX; y = e.clientY;
      setMoved(true);
      if (dot.current) dot.current.style.transform = `translate(${x}px, ${y}px)`;
      const l = !!(e.target as HTMLElement)?.closest("a, button, input, textarea, [data-lock]");
      if (l !== lockedRef.current) { lockedRef.current = l; setLocked(l); }
    };
    const loop = () => {
      rx += (x - rx) * 0.2; ry += (y - ry) * 0.2;
      if (ring.current) ring.current.style.transform = `translate(${rx}px, ${ry}px)`;
      id = requestAnimationFrame(loop);
    };
    window.addEventListener("mousemove", move);
    id = requestAnimationFrame(loop);
    return () => {
      window.removeEventListener("mousemove", move);
      cancelAnimationFrame(id);
      document.body.classList.remove("has-reticle");
    };
  }, []);

  if (!on || !moved) return null;
  return (
    <>
      <div ref={ring} className="pointer-events-none fixed left-0 top-0 z-[100]">
        {isDoom ? (
          // Doom's cursor: a turning rune circle that tightens into a gold seal over anything clickable
          <div className={`-translate-x-1/2 -translate-y-1/2 rounded-full border border-dashed transition-all duration-200 ${locked ? "h-11 w-11 border-trim" : "h-9 w-9 border-gold/50"}`}
            style={{ animation: "spin 6s linear infinite", boxShadow: locked ? "0 0 14px rgb(176 141 60 / .5)" : "0 0 10px rgb(60 255 154 / .25)" }} />
        ) : (
          <div
            className={`-translate-x-1/2 -translate-y-1/2 transition-all duration-200 ${locked ? "h-11 w-11 rotate-45 border-gold" : "h-8 w-8 border-white/40"} border`}
            style={{ borderRadius: locked ? 2 : 999 }}
          />
        )}
      </div>
      <div ref={dot} className="pointer-events-none fixed left-0 top-0 z-[100]">
        <div className="h-1 w-1 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gold shadow-[0_0_8px_rgb(var(--gold))]" />
      </div>
    </>
  );
}
