"use client";

import { motion } from "framer-motion";

// The universe switch: the screen glitches, a portal tears open and covers everything,
// the skin swaps underneath, then the portal closes on the other universe.
const SLICES = Array.from({ length: 9 }, (_, i) => ({ top: (i * 11.3) % 100, h: 2 + ((i * 7) % 6), dx: ((i % 3) - 1) * 40 }));

export default function Portal({ to }: { to: "stark" | "doom" }) {
  const core = to === "doom" ? "#3cff9a" : "#ffb84d";
  const rim = to === "doom" ? "#0f3d2a" : "#cc1a2a";
  return (
    <div className="pointer-events-none fixed inset-0 z-[96] overflow-hidden" aria-hidden>
      {/* glitch: horizontal slices jump sideways, with a colour-split flash */}
      {SLICES.map((s, i) => (
        <motion.div key={i} className="absolute inset-x-0 mix-blend-screen"
          style={{ top: `${s.top}%`, height: `${s.h}%`, background: `linear-gradient(90deg, transparent, ${core}33, transparent)` }}
          initial={{ x: 0, opacity: 0 }} animate={{ x: [0, s.dx, -s.dx / 2, 0], opacity: [0, 1, 0.6, 0] }}
          transition={{ duration: 0.45, delay: i * 0.02, ease: "linear" }} />
      ))}
      {/* the portal: a ring of energy that grows until it fills the screen, then closes */}
      <motion.div className="absolute left-1/2 top-1/2 aspect-square w-[180vmax] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{ background: `radial-gradient(circle, #020302 0 46%, ${core} 49%, ${rim} 53%, #020302 58%)` }}
        initial={{ scale: 0, opacity: 0 }} animate={{ scale: [0, 1.05, 1.05, 0], opacity: [0, 1, 1, 0] }}
        transition={{ duration: 1.2, times: [0, 0.38, 0.62, 1], ease: [0.7, 0, 0.3, 1] }} />
      <motion.div className="absolute inset-0 flex items-center justify-center"
        initial={{ opacity: 0 }} animate={{ opacity: [0, 0, 1, 0] }} transition={{ duration: 1.2, times: [0, 0.3, 0.5, 0.75] }}>
        <span className="font-mono text-xs uppercase tracking-[0.6em]" style={{ color: core }}>
          {to === "doom" ? "entering latveria" : "returning to stark industries"}
        </span>
      </motion.div>
    </div>
  );
}
