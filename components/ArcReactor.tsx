"use client";

import { motion, useScroll, useTransform, type MotionValue } from "framer-motion";
import { useEffect, useState } from "react";

const COILS = 10;

function Coil({ i }: { i: number }) {
  const a = (360 / COILS) * i;
  return (
    <g transform={`rotate(${a} 200 200)`}>
      <path d="M186 72 L214 72 L208 112 L192 112 Z" className="fill-arc/10 stroke-arc/60" strokeWidth="1" />
      <line x1="190" y1="80" x2="210" y2="80" className="stroke-arc/50" />
      <line x1="191" y1="88" x2="209" y2="88" className="stroke-arc/40" />
      <line x1="192" y1="96" x2="208" y2="96" className="stroke-arc/30" />
    </g>
  );
}

// The arc reactor. It spins faster and glows brighter as the page is scrolled ("charges").
export default function ArcReactor({ tiltX, tiltY }: { tiltX?: MotionValue<number>; tiltY?: MotionValue<number> }) {
  const { scrollYProgress } = useScroll();
  const glow = useTransform(scrollYProgress, [0, 1], [0.55, 1]);
  const [charge, setCharge] = useState(0);

  useEffect(() => scrollYProgress.on("change", (v) => setCharge(Math.round(v * 100))), [scrollYProgress]);

  return (
    <motion.div style={{ rotateX: tiltY, rotateY: tiltX }} className="relative aspect-square w-full max-w-[460px] [transform-style:preserve-3d]">
      <motion.div style={{ opacity: glow }} className="absolute inset-[18%] rounded-full bg-arc/30 blur-3xl" />
      <svg viewBox="0 0 400 400" className="relative h-full w-full" aria-hidden>
        <defs>
          <radialGradient id="core" cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="35%" stopColor="rgb(var(--arc))" />
            <stop offset="100%" stopColor="rgb(var(--arc))" stopOpacity="0" />
          </radialGradient>
        </defs>

        {/* outer HUD ring with ticks */}
        <g className="origin-center animate-spin-slow" style={{ transformOrigin: "200px 200px", animationDuration: "60s" }}>
          <circle cx="200" cy="200" r="190" fill="none" className="stroke-white/10" />
          {Array.from({ length: 72 }).map((_, i) => (
            <line key={i} x1="200" y1="10" x2="200" y2={i % 6 === 0 ? 24 : 16} transform={`rotate(${i * 5} 200 200)`} className={i % 6 === 0 ? "stroke-arc/70" : "stroke-white/20"} />
          ))}
        </g>

        {/* segmented ring, counter-rotating */}
        <g style={{ transformOrigin: "200px 200px", animation: "spin 24s linear infinite reverse" }}>
          <circle cx="200" cy="200" r="160" fill="none" className="stroke-hot/60" strokeWidth="3" strokeDasharray="60 22 8 22" />
        </g>
        <circle cx="200" cy="200" r="146" fill="none" className="stroke-white/10" />

        <g style={{ transformOrigin: "200px 200px", animation: "spin 40s linear infinite" }}>
          {Array.from({ length: COILS }).map((_, i) => <Coil key={i} i={i} />)}
        </g>

        <circle cx="200" cy="200" r="86" fill="none" className="stroke-arc/50" strokeWidth="1.5" />
        <g style={{ transformOrigin: "200px 200px", animation: "spin 8s linear infinite" }}>
          <circle cx="200" cy="200" r="74" fill="none" className="stroke-warm/70" strokeWidth="2" strokeDasharray="4 10" />
        </g>
        <polygon points="200,150 243,175 243,225 200,250 157,225 157,175" fill="none" className="stroke-arc/80" strokeWidth="1.5" />
        <circle cx="200" cy="200" r="56" fill="url(#core)" opacity="0.95">
          <animate attributeName="r" values="52;58;52" dur="3s" repeatCount="indefinite" />
        </circle>
        <circle cx="200" cy="200" r="20" fill="#fff" />
      </svg>

      <div className="hud-label absolute -bottom-2 left-1/2 flex -translate-x-1/2 items-center gap-2 whitespace-nowrap">
        <span>reactor charge</span>
        <span className="text-arc">{String(charge).padStart(3, "0")}%</span>
        <span className="hidden sm:inline">· scroll to charge</span>
      </div>
    </motion.div>
  );
}
