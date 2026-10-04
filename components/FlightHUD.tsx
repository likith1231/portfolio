"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { useHUD } from "./Shell";

const NARRATION: Record<string, string> = {
  armor: "Visitor entered the Hall of Armor. 6 suits on display, Mark VI powered.",
  schematics: "Projecting blueprints for 3 flagship suits.",
  drill: "Threat response armed. Fault injection is available to the visitor.",
  lab: "Stress test bay open. Autoscaler model loaded: 2–8 pods @ 60% CPU.",
  training: "Training room online. Bug-drone simulation on standby.",
  status: "Running health checks on every suit.",
  about: "Pilot profile decrypted. Weapon systems on safe.",
  contact: "Comm channel open. Encryption: not needed, he's friendly.",
};

// Flight instruments on the left edge: altitude follows the scroll, speed follows scroll velocity.
export default function FlightHUD() {
  const { narrate, introDone } = useHUD();
  const path = usePathname();
  const [alt, setAlt] = useState(0);
  const [spd, setSpd] = useState(0);
  const last = useRef({ y: 0, t: 0 });
  const said = useRef(new Set<string>());

  useEffect(() => {
    let id = 0;
    const loop = (t: number) => {
      const y = window.scrollY;
      const dt = Math.max(1, t - last.current.t);
      const v = Math.abs(y - last.current.y) / dt;
      last.current = { y, t };
      setSpd((s) => s + (v * 900 - s) * 0.12);
      setAlt(y * 3.2);
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
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

  const ticks = Array.from({ length: 9 }, (_, i) => Math.round((alt / 100 + (i - 4)) ) * 100);

  return (
    <div className="pointer-events-none fixed left-3 top-1/2 z-40 hidden -translate-y-1/2 select-none font-mono text-[10px] text-steel-500 2xl:block" aria-hidden>
      <div className="mb-2 tracking-[0.2em] text-gold">ALT</div>
      <div className="relative h-56 w-14 overflow-hidden border-l border-white/10">
        <div className="absolute inset-x-0 top-1/2 z-10 flex -translate-y-1/2 items-center gap-1 bg-void/90 py-0.5 text-white">
          <span className="text-hot">▶</span>{Math.round(alt).toLocaleString()}
        </div>
        {ticks.map((v, i) => (
          <div key={i} className="absolute left-0 flex items-center gap-1" style={{ top: `${(i / 8) * 100 - ((alt % 100) / 100) * 12.5}%` }}>
            <span className="h-px w-2 bg-white/20" />{v >= 0 ? v.toLocaleString() : ""}
          </div>
        )).reverse()}
      </div>
      <div className="mt-4 tracking-[0.2em] text-gold">SPD</div>
      <div className="text-white">{Math.round(spd)} kn</div>
      <div className="mt-1 h-1 w-14 bg-white/10"><div className="h-full bg-hot" style={{ width: `${Math.min(100, spd / 30)}%` }} /></div>
      <div className="mt-4 tracking-[0.2em] text-gold">PWR</div>
      <div className="text-ok">100%</div>
    </div>
  );
}
