"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import { useHUD } from "./Shell";
import { doom } from "@/data/portfolio";

// Doom's answer to the Snap. Press his seal in the corner (or ↑ ↑ ↓ ↓ ← → ← → B A) and the
// whole page bows: it tips forward and sinks while a rune circle burns and the words land.
export default function Kneel({ n, onKneel }: { n: number; onKneel: () => void }) {
  const { introDone, narrate } = useHUD();
  const [on, setOn] = useState(false);

  useEffect(() => {
    if (!n) return;
    setOn(true);
    narrate(doom.kneel, "warn");
    const main = document.querySelector("main");
    main?.classList.add("kneeling");
    const t1 = setTimeout(() => main?.classList.remove("kneeling"), 2600);
    const t2 = setTimeout(() => { setOn(false); narrate("The realm rises again. Doom is satisfied.", "ok"); }, 3200);
    return () => { clearTimeout(t1); clearTimeout(t2); main?.classList.remove("kneeling"); };
  }, [n, narrate]);

  return (
    <>
      {/* Doom's seal, tucked in the corner where Tony keeps the gauntlet */}
      <button onClick={onKneel} disabled={on} data-snap-ignore aria-label="Kneel before Doom" title="Kneel before Doom"
        className={`group fixed bottom-5 left-5 z-[76] grid h-14 w-14 place-items-center rounded-full border border-trim/70 bg-void/90 shadow-[0_0_30px_rgb(var(--gold)/0.3)] backdrop-blur transition-opacity ${introDone ? "opacity-100" : "opacity-0"}`}>
        <svg viewBox="0 0 48 48" className="h-9 w-9" aria-hidden>
          <circle cx="24" cy="24" r="21" fill="none" stroke="#b08d3c" strokeWidth="1.2" strokeDasharray="2 3" className="origin-center animate-spin-slow" />
          {/* a small iron mask with lit eyes */}
          <path d="M24 9 C16 9 13 14 13 21 C13 28 15 34 19 37 C21 38.5 22.5 39 24 39 C25.5 39 27 38.5 29 37 C33 34 35 28 35 21 C35 14 32 9 24 9 Z" fill="#6b6f75" stroke="#2a2d30" />
          <path d="M17 20 L22.5 21.5 M31 20 L25.5 21.5" stroke="#3cff9a" strokeWidth="2.2" strokeLinecap="round" style={{ filter: "drop-shadow(0 0 3px #3cff9a)" }} />
          <path d="M24 23 L24 30 M20 33 L28 33" stroke="#2a2d30" strokeWidth="1.4" />
        </svg>
        <span className="pointer-events-none absolute left-16 hidden whitespace-nowrap border border-white/10 bg-void/90 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-gold group-hover:block">kneel</span>
      </button>

      <AnimatePresence>
        {on && (
          <motion.div key={n} className="pointer-events-none fixed inset-0 z-[93] flex items-center justify-center"
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.5 }}>
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgb(15_61_42/.55),rgb(0_0_0/.88)_70%)]" />
            <motion.svg viewBox="0 0 400 400" className="absolute h-[80vmin] w-[80vmin]" initial={{ scale: 0.6, rotate: -40, opacity: 0 }}
              animate={{ scale: 1, rotate: 40, opacity: [0, 1, 1, 0.6] }} transition={{ duration: 3, ease: "easeOut" }} aria-hidden>
              <g fill="none" stroke="#3cff9a" style={{ filter: "drop-shadow(0 0 8px #3cff9a)" }}>
                <circle cx="200" cy="200" r="190" strokeWidth="2" />
                <circle cx="200" cy="200" r="168" strokeWidth="1" strokeDasharray="3 9" />
                <circle cx="200" cy="200" r="120" strokeWidth="1.5" />
                {Array.from({ length: 24 }).map((_, i) => (
                  <path key={i} transform={`rotate(${i * 15} 200 200)`} d={`M200 18 L200 40 M200 ${24 + (i % 4) * 3} L${i % 2 ? 208 : 192} ${32 + (i % 3) * 3}`} strokeWidth="2" strokeLinecap="round" />
                ))}
                <circle cx="200" cy="200" r="96" strokeWidth="1" strokeDasharray="1 6" opacity=".7" />
              </g>
            </motion.svg>
            <motion.p initial={{ opacity: 0, y: -30, letterSpacing: "0.5em" }} animate={{ opacity: 1, y: 0, letterSpacing: "0.08em" }} transition={{ delay: 0.35, duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
              className="relative text-center font-display text-5xl font-bold uppercase text-white md:text-8xl" style={{ textShadow: "0 0 30px rgb(60 255 154 / .6)" }}>
              Kneel before <span className="text-gold">Doom!</span>
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
