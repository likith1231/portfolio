"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useHUD } from "./Shell";

const NARRATION: Record<string, string> = {
  armor: "Visitor entered the Hall of Armor. 6 suits on display, Mark 85 powered.",
  schematics: "Projecting blueprints for 3 flagship suits.",
  drill: "Threat response armed. Fault injection is available to the visitor.",
  lab: "Stress test bay open. Autoscaler model loaded: 2–8 pods @ 60% CPU.",
  training: "Training room online. Bug-drone simulation on standby.",
  status: "Running health checks on every suit.",
  about: "Pilot profile decrypted. Weapon systems on safe.",
  contact: "Comm channel open. Encryption: not needed, he's friendly.",
};

// Flight instruments on the left edge: altitude follows the scroll, speed follows scroll velocity.
// Updated straight on the DOM (no React re-renders) and only on wide screens where it shows.
export default function FlightHUD() {
  const { narrate, introDone } = useHUD();
  const path = usePathname();
  const altEl = useRef<HTMLSpanElement>(null);
  const spdEl = useRef<HTMLSpanElement>(null);
  const barEl = useRef<HTMLDivElement>(null);
  const said = useRef(new Set<string>());

  useEffect(() => {
    const wide = window.matchMedia("(min-width: 1536px)");
    let id = 0, lastY = window.scrollY, lastT = performance.now(), spd = 0;
    const loop = (t: number) => {
      const y = window.scrollY;
      const v = Math.abs(y - lastY) / Math.max(1, t - lastT);
      lastY = y; lastT = t;
      spd += (v * 900 - spd) * 0.12;
      if (altEl.current) altEl.current.textContent = Math.round(y * 3.2).toLocaleString();
      if (spdEl.current) spdEl.current.textContent = `${Math.round(spd)} kn`;
      if (barEl.current) barEl.current.style.width = `${Math.min(100, spd / 30)}%`;
      id = requestAnimationFrame(loop);
    };
    const start = () => { cancelAnimationFrame(id); if (wide.matches) id = requestAnimationFrame(loop); };
    start();
    wide.addEventListener("change", start);
    return () => { cancelAnimationFrame(id); wide.removeEventListener("change", start); };
  }, []);

  useEffect(() => {
    if (!introDone || path !== "/") return;
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.isIntersecting && !said.current.has(e.target.id) && NARRATION[e.target.id]) {
          said.current.add(e.target.id);
          narrate(NARRATION[e.target.id]);
        }
      }
    }, { threshold: 0.25 });
    const t = setTimeout(() => Object.keys(NARRATION).forEach((id) => { const el = document.getElementById(id); if (el) io.observe(el); }), 1500);
    return () => { clearTimeout(t); io.disconnect(); };
  }, [introDone, path, narrate]);

  return (
    <div className="pointer-events-none fixed left-3 top-1/2 z-40 hidden -translate-y-1/2 select-none font-mono text-[10px] text-steel-500 2xl:block" aria-hidden>
      <div className="mb-1 tracking-[0.2em] text-gold">ALT</div>
      <div className="flex items-center gap-1 text-white"><span className="text-hot">▶</span><span ref={altEl}>0</span> ft</div>
      <div className="mt-4 tracking-[0.2em] text-gold">SPD</div>
      <span ref={spdEl} className="text-white">0 kn</span>
      <div className="mt-1 h-1 w-14 bg-white/10"><div ref={barEl} className="h-full bg-hot" style={{ width: "0%" }} /></div>
      <div className="mt-4 tracking-[0.2em] text-gold">PWR</div>
      <div className="text-ok">100%</div>
    </div>
  );
}
