"use client";

import { AnimatePresence, motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useState } from "react";
import ArcReactor from "../ArcReactor";
import Clock from "../ui/Clock";
import { useGo } from "../Nav";
import { useHUD } from "../Shell";
import { profile, socials } from "@/data/portfolio";

function Rotator() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % profile.roles.length), 2600);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="relative inline-flex h-[1.4em] overflow-hidden align-bottom">
      <AnimatePresence mode="wait">
        <motion.span key={i} initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "-100%" }} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }} className="inline-block text-arc">
          {profile.roles[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

export default function Hero() {
  const go = useGo();
  const { setPaletteOpen } = useHUD();
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 60, damping: 18 });
  const sy = useSpring(my, { stiffness: 60, damping: 18 });
  const tiltX = useTransform(sx, [-0.5, 0.5], [-14, 14]);
  const tiltY = useTransform(sy, [-0.5, 0.5], [12, -12]);
  const textX = useTransform(sx, [-0.5, 0.5], [-8, 8]);

  useEffect(() => {
    const move = (e: MouseEvent) => { mx.set(e.clientX / innerWidth - 0.5); my.set(e.clientY / innerHeight - 0.5); };
    window.addEventListener("mousemove", move);
    return () => window.removeEventListener("mousemove", move);
  }, [mx, my]);

  const words = profile.headline.split(" ");

  return (
    <section id="top" className="relative flex min-h-[100svh] items-center overflow-hidden pt-20">
      <div className="grid-bg pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      <div className="pointer-events-none absolute -top-40 right-0 h-[600px] w-[600px] rounded-full bg-arc/[0.06] blur-3xl" />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-12 px-4 md:px-8 lg:grid-cols-[1.15fr_1fr]">
        <motion.div style={{ x: textX }}>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }} className="hud-label mb-6 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="flex items-center gap-2 text-ok">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ok" /> online
            </span>
            <span>{profile.location}</span>
            <span className="text-steel-200"><Clock /> IST</span>
          </motion.div>

          <h1 className="font-display text-[2.6rem] font-bold uppercase leading-[0.95] tracking-tight text-white sm:text-6xl xl:text-7xl">
            {words.map((w, i) => (
              <motion.span
                key={i}
                initial={{ opacity: 0, y: 40, filter: "blur(10px)" }}
                animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                transition={{ delay: 0.3 + i * 0.08, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className={`mr-[0.25em] inline-block ${w.startsWith("themselves") ? "text-arc glow-text" : ""}`}
              >
                {w}
              </motion.span>
            ))}
          </h1>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.9 }} className="mt-6 font-mono text-sm text-steel-300 md:text-base">
            {profile.name} <span className="text-steel-500">//</span> <Rotator />
          </motion.p>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1 }} className="mt-5 max-w-xl text-base leading-relaxed text-steel-300 md:text-lg">
            {profile.intro}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.1 }} className="mt-9 flex flex-wrap gap-3">
            <button onClick={() => go("work")} className="btn-primary">See the suits →</button>
            <button onClick={() => go("drill")} className="btn-ghost">Break something</button>
            <button onClick={() => setPaletteOpen(true)} className="btn-ghost hidden sm:inline-flex">Open terminal <kbd className="text-steel-500">/</kbd></button>
          </motion.div>

          <motion.dl initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.3 }} className="mt-12 grid max-w-xl grid-cols-1 gap-4 border-t border-white/[0.07] pt-6 sm:grid-cols-2">
            <div>
              <dt className="hud-label">Building</dt>
              <dd className="mt-1 text-sm text-steel-200">{profile.building}</dd>
            </div>
            <div>
              <dt className="hud-label">Status</dt>
              <dd className="mt-1 text-sm text-steel-200">{profile.available}</dd>
            </div>
          </motion.dl>

          <div className="mt-8 flex gap-5 font-mono text-xs uppercase tracking-[0.2em]">
            <a href={socials.github} target="_blank" rel="noreferrer" className="text-steel-400 hover:text-arc">GitHub ↗</a>
            <a href={socials.linkedin} target="_blank" rel="noreferrer" className="text-steel-400 hover:text-arc">LinkedIn ↗</a>
            <a href={`mailto:${profile.email}`} className="text-steel-400 hover:text-arc">Email ↗</a>
          </div>
        </motion.div>

        <motion.div initial={{ opacity: 0, scale: 0.85 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4, duration: 1.2, ease: [0.16, 1, 0.3, 1] }} className="mx-auto w-full max-w-[460px] [perspective:900px]">
          <ArcReactor tiltX={tiltX} tiltY={tiltY} />
        </motion.div>
      </div>

      <div className="hud-label absolute bottom-6 left-1/2 hidden -translate-x-1/2 md:block">scroll ↓</div>
    </section>
  );
}
