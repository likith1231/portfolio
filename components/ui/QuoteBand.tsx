"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { useHUD } from "../Shell";
import { doom } from "@/data/portfolio";

// A cinematic interstitial: a famous line from the films, drifting with scroll.
// Pass `doomKey` to swap in a line in Doom's voice when the Doom universe is active.
export default function QuoteBand({ doomKey, ...stark }: { text: string; by: string; film?: string; doomKey?: keyof typeof doom.quotes }) {
  const { text, by, film } = useHUD().mode === "doom" && doomKey ? doom.quotes[doomKey] : stark;
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], ["6%", "-6%"]);
  const o = useTransform(scrollYProgress, [0, 0.35, 0.65, 1], [0, 1, 1, 0]);
  return (
    <div ref={ref} className="relative overflow-hidden border-y border-white/[0.05] py-20 md:py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(var(--hot)/0.10),transparent_65%)]" />
      <motion.blockquote style={{ x, opacity: o }} className="relative mx-auto max-w-6xl px-4 text-center">
        <p className="font-serif text-3xl italic leading-tight text-white md:text-6xl">“{text}”</p>
        <footer className="hud-label mt-6"><span className="text-gold">{by}</span>{film ? ` · ${film}` : ""}</footer>
      </motion.blockquote>
    </div>
  );
}
