"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useCallback, useEffect, useRef, useState } from "react";
import { useHUD } from "./Shell";
import { sfx } from "@/lib/sfx";
import { STONES, type SnapPhase } from "./Gauntlet";


const DUSTABLE = [
  "main section h1", "main section h2", "main section h3", "main section p", "main section .chip",
  "main section .btn", "main section .btn-primary", "main section .btn-hot", "main section .btn-ghost",
  "main section .hud-panel", "main section canvas", "main section img", "main section li",
  "main section blockquote", "main section dt", "main section dd", "main blockquote", "header nav a", "header nav button",
].join(",");

type Phase = SnapPhase;

const MAX = 9000;
const ASH = [138, 125, 114];

function parseColor(c: string): [number, number, number, number] | null {
  const m = c.match(/rgba?\(([^)]+)\)/);
  if (!m) return null;
  const p = m[1].split(/[ ,/]+/).filter(Boolean).map(Number);
  return [p[0], p[1], p[2], p[3] ?? 1];
}

// Pick which colours an element's dust is made of.
function dustColors(el: Element): [number, number, number][] {
  if (el instanceof HTMLCanvasElement || el instanceof HTMLImageElement) return [[201, 24, 42], [232, 176, 74], [120, 112, 108], [159, 243, 255]];
  const cs = getComputedStyle(el);
  const out: [number, number, number][] = [];
  for (const c of [cs.color, cs.backgroundColor, cs.borderTopColor]) {
    const v = parseColor(c);
    if (!v || v[3] < 0.15) continue;
    const lum = 0.3 * v[0] + 0.59 * v[1] + 0.11 * v[2];
    if (lum < 35) continue;
    out.push([v[0], v[1], v[2]]);
  }
  return out.length ? out : [[200, 192, 186]];
}

// Endgame: half the page turns to dust, comes back, and ends on the line.
export default function Snap() {
  const { narrate } = useHUD();
  const [phase, setPhase] = useState<Phase>("idle");
  const [lit, setLit] = useState(0);
  const canvas = useRef<HTMLCanvasElement>(null);
  const busy = useRef(false);
  const [origin, setOrigin] = useState({ x: 0, y: 0 });

  // let the gauntlets on the page follow along
  useEffect(() => {
    window.dispatchEvent(new CustomEvent("stark:snap-state", { detail: { lit, phase } }));
  }, [lit, phase]);

  const run = useCallback(async (from?: { x: number; y: number }) => {
    if (busy.current) return;
    busy.current = true;
    setOrigin(from ?? { x: innerWidth / 2, y: innerHeight / 2 });
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));
    const lenis = (window as unknown as { __lenis?: { stop: () => void; start: () => void } }).__lenis;
    lenis?.stop();
    document.documentElement.style.overflow = "hidden";

    // 1. the stones light up
    setPhase("charge");
    narrate("Infinity Stones detected in the gauntlet. Power levels off the chart.", "warn");
    for (let i = 1; i <= 6; i++) { setLit(i); sfx.stone(i); await wait(140); }
    await wait(250);

    // 2. snap
    setPhase("snap");
    sfx.snap();
    narrate("Snap.", "bad");
    await wait(220);

    // 3. half the page turns to dust
    const vh = innerHeight, vw = innerWidth;
    let cands = Array.from(document.querySelectorAll<HTMLElement>(DUSTABLE)).filter((el) => {
      if (el.closest("[data-snap-ignore]")) return false;
      const r = el.getBoundingClientRect();
      return r.width * r.height > 60 && r.bottom > 0 && r.top < vh && r.right > 0 && r.left < vw && getComputedStyle(el).visibility !== "hidden";
    });
    cands = cands.filter((el) => !cands.some((o) => o !== el && o.contains(el))); // biggest pieces only
    const chosen = cands.sort(() => Math.random() - 0.5).slice(0, Math.max(1, Math.ceil(cands.length / 2)));

    const saved = chosen.map((el) => ({ el, style: el.getAttribute("style") }));
    const cv = canvas.current!;
    const dpr = Math.min(1.5, devicePixelRatio || 1);
    cv.width = vw * dpr; cv.height = vh * dpr;
    const ctx = cv.getContext("2d")!;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

    // particles: origin, velocity, delay, size, colour
    const totalArea = chosen.reduce((a, el) => { const r = el.getBoundingClientRect(); return a + Math.min(r.width, vw) * Math.min(r.height, vh); }, 0);
    const density = Math.min(1 / 40, MAX / Math.max(1, totalArea));
    const P: { ox: number; oy: number; x: number; y: number; vx: number; vy: number; d: number; s: number; c: string }[] = [];
    for (const el of chosen) {
      const r = el.getBoundingClientRect();
      const cols = dustColors(el);
      const n = Math.min(1600, Math.ceil(r.width * r.height * density));
      for (let i = 0; i < n; i++) {
        const ox = r.left + Math.random() * r.width, oy = r.top + Math.random() * r.height;
        const base = cols[(Math.random() * cols.length) | 0];
        const k = Math.random() < 0.45 ? 0.55 : 0; // some of it is ash
        const c = `rgb(${base[0] * (1 - k) + ASH[0] * k | 0},${base[1] * (1 - k) + ASH[1] * k | 0},${base[2] * (1 - k) + ASH[2] * k | 0})`;
        P.push({ ox, oy, x: ox, y: oy, vx: 40 + Math.random() * 140, vy: -20 - Math.random() * 90, d: (ox / vw) * 900 + Math.random() * 500, s: 0.8 + Math.random() * 1.8, c });
      }
    }

    setPhase("dust");
    if (!reduced) sfx.dust();
    narrate(`${chosen.length} of ${cands.length} elements reduced to dust.`, "bad");
    chosen.forEach(({ style }, i) => {
      const el = chosen[i];
      const r = el.getBoundingClientRect();
      const delay = (r.left / vw) * 900 + Math.random() * 400;
      el.style.transition = `opacity 1.1s ease ${delay}ms, filter 1.1s ease ${delay}ms, transform 1.4s ease ${delay}ms`;
      el.style.opacity = "0";
      el.style.filter = "blur(6px)";
      el.style.transform = `translate(${20 + Math.random() * 30}px, ${-10 - Math.random() * 20}px)`;
      void style;
    });

    const t0 = performance.now();
    let mode: "out" | "back" = "out";
    let tBack = 0;
    let raf = 0;
    const draw = (now: number) => {
      ctx.clearRect(0, 0, vw, vh);
      for (const p of P) {
        if (mode === "out") {
          const age = (now - t0 - p.d) / 1000;
          if (age < 0) continue;
          const a = Math.max(0, 1 - age / 2.6);
          if (a <= 0) continue;
          p.x = p.ox + p.vx * age + Math.sin(age * 3 + p.oy * 0.05) * 12 * age;
          p.y = p.oy + p.vy * age - 18 * age * age;
          ctx.globalAlpha = a;
        } else {
          const k = Math.min(1, Math.max(0, (now - tBack - (1 - p.ox / vw) * 500) / 1100));
          const e = 1 - Math.pow(1 - k, 3);
          const sx = p.ox + p.vx * 1.6, sy = p.oy + p.vy * 1.6 - 40;
          p.x = sx + (p.ox - sx) * e;
          p.y = sy + (p.oy - sy) * e;
          ctx.globalAlpha = k < 1 ? Math.min(1, k * 2) : Math.max(0, 1 - (now - tBack - 1600) / 400);
        }
        ctx.fillStyle = p.c;
        ctx.fillRect(p.x, p.y, p.s, p.s);
      }
      raf = requestAnimationFrame(draw);
    };
    if (!reduced) raf = requestAnimationFrame(draw);

    await wait(reduced ? 600 : 3900);

    // 4. everything comes back
    setPhase("reform");
    if (!reduced) sfx.reform();
    narrate("Reversing the snap. Restoring everyone.", "ok");
    mode = "back";
    tBack = performance.now();
    chosen.forEach((el) => {
      const r = el.getBoundingClientRect();
      const delay = 700 + (1 - r.left / vw) * 500;
      el.style.transition = `opacity 0.9s ease ${delay}ms, filter 0.9s ease ${delay}ms, transform 1s ease ${delay}ms`;
      el.style.opacity = "1";
      el.style.filter = "blur(0px)";
      el.style.transform = "translate(0, 0)";
    });
    await wait(2300);
    cancelAnimationFrame(raf);
    ctx.clearRect(0, 0, vw, vh);
    saved.forEach(({ el, style }) => (style === null ? el.removeAttribute("style") : el.setAttribute("style", style)));

    // 5. the line
    setPhase("final");
    sfx.ignite();
    narrate("I am Iron Man.", "ok");
    await wait(3600);

    setPhase("idle");
    setLit(0);
    document.documentElement.style.overflow = "";
    lenis?.start();
    busy.current = false;
  }, [narrate]);

  useEffect(() => {
    const go = (e: Event) => run((e as CustomEvent).detail);
    window.addEventListener("stark:snap", go);
    return () => window.removeEventListener("stark:snap", go);
  }, [run]);

  return (
    <>


      <canvas ref={canvas} className="pointer-events-none fixed inset-0 z-[91] h-full w-full" aria-hidden />

      {/* charge glow and the flash */}
      <AnimatePresence>
        {phase === "charge" && (
          <motion.div key="charge" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="pointer-events-none fixed inset-0 z-[90]"
            style={{ background: `radial-gradient(circle at ${origin.x}px ${origin.y}px, ${STONES[Math.max(0, lit - 1)]}66, transparent 55%)` }} />
        )}
        {phase === "snap" && (
          <motion.div key="flash" initial={{ opacity: 1 }} animate={{ opacity: 0 }} transition={{ duration: 0.5 }} className="pointer-events-none fixed inset-0 z-[93] bg-white" />
        )}
        {phase === "final" && (
          <motion.div key="final" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.8 }}
            className="pointer-events-none fixed inset-0 z-[93] flex items-center justify-center bg-black/85">
            <div className="absolute h-[50vmin] w-[50vmin] rounded-full blur-3xl" style={{ background: "radial-gradient(circle, #9ff3ff55, transparent 70%)" }} />
            <div className="relative text-center">
              <p className="font-serif text-5xl italic text-white md:text-8xl">
                {["I", "am", "Iron", "Man."].map((w, i) => (
                  <motion.span key={w} initial={{ opacity: 0, y: 20, filter: "blur(8px)" }} animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                    transition={{ delay: 0.3 + i * 0.35, duration: 0.7 }} className="mr-[0.25em] inline-block">{w}</motion.span>
                ))}
              </p>
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.9 }} className="hud-label mt-6 text-gold">
                Tony Stark · Avengers: Endgame (2019)
              </motion.p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
