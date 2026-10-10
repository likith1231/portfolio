"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import SectionHead from "../ui/SectionHead";
import LiveBadge from "../ui/LiveBadge";
import { useHUD } from "../Shell";
import { doom, suits } from "@/data/portfolio";
import { sfx } from "@/lib/sfx";

const DoomMask3D = dynamic(() => import("../three/DoomMask3D"), { ssr: false, loading: () => <div className="grid h-full place-items-center hud-label">the mask is forming…</div> });
const Hall3D = dynamic(() => import("../three/Hall3D"), { ssr: false, loading: () => <div className="grid h-full place-items-center hud-label">powering up the hall…</div> });

// Strongest first: Mark 85 down to Mark 1.
const order = [...suits].sort((a, b) => b.mark - a.mark);

export default function HallOfArmor() {
  const [i, setI] = useState(0);
  const { narrate, mode } = useHUD();
  const isDoom = mode === "doom";
  const drag = useRef<number | null>(null);
  const s = order[i];
  const ROMAN = ["I", "II", "III", "IV", "V", "VI"];

  const go = (d: number) => {
    sfx.servo();
    setI((v) => (v + d + order.length) % order.length);
  };

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const el = document.getElementById("armor");
      if (!el) return;
      const r = el.getBoundingClientRect();
      if (r.top > innerHeight * 0.5 || r.bottom < innerHeight * 0.5) return;
      if (e.key === "ArrowRight") go(1);
      if (e.key === "ArrowLeft") go(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    if (i === 0) return;
    narrate(isDoom ? `Throne room: Doom presents ${s.name}. Power rating ${s.power}.` : `Hall of Armor: ${s.suit} on the stand for ${s.name}. Power rating ${s.power}.`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i]);

  return (
    <section id="armor" className="relative py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionHead code="01" kicker="the hall of armor" title="Six suits. One engineer.">
          {isDoom
            ? "Doom wears one armor and needs no other. His works are listed before the throne, strongest first. Choose one, or use the arrows."
            : "Every project wears a suit from the films. The more advanced the build, the higher the Mark. Drag, use the arrows, or pick a suit."}
        </SectionHead>
      </div>

      <div className="relative mx-auto max-w-[1400px]">
        {isDoom ? (
          // Doom has one armor: a single mask on the throne, with his works listed beside it.
          <div className="mx-auto grid max-w-7xl items-center gap-8 px-4 md:px-8 lg:grid-cols-[1fr_1fr]">
            <div className="relative mx-auto aspect-square w-full max-w-[520px]">
              <div className="pointer-events-none absolute inset-x-[15%] bottom-[4%] h-10 rounded-[50%] bg-gold/25 blur-2xl" />
              <DoomMask3D />
            </div>
            <ol className="space-y-2">
              {order.map((x, k) => (
                <li key={x.slug}>
                  <button onClick={() => { sfx.click(); setI(k); }}
                    className={`flex w-full items-baseline gap-4 rounded-xl border px-5 py-4 text-left transition-colors ${k === i ? "border-trim/60 bg-hot/20" : "border-white/[0.07] hover:border-trim/40"}`}>
                    <span className="w-8 shrink-0 font-display text-lg text-trim">{ROMAN[k]}</span>
                    <span className="min-w-0">
                      <span className={`block font-display text-xl font-bold uppercase ${k === i ? "text-white" : "text-steel-200"}`}>{x.name}</span>
                      <span className="block truncate text-sm text-steel-400">{doom.works[x.slug] ?? x.tagline}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ol>
          </div>
        ) : (
          <>
        <div
          className="relative h-[460px] touch-pan-y select-none md:h-[560px]"
          onPointerDown={(e) => { drag.current = e.clientX; }}
          onPointerUp={(e) => { if (drag.current !== null && Math.abs(e.clientX - drag.current) > 40) go(e.clientX < drag.current ? 1 : -1); drag.current = null; }}
          data-lock
        >
          <Hall3D suits={order} index={i} />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-[var(--bg)] to-transparent" />
          <button onClick={() => go(-1)} aria-label="Previous suit" className="absolute left-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center border border-gold/40 bg-void/70 text-gold hover:bg-gold hover:text-void md:left-8">←</button>
          <button onClick={() => go(1)} aria-label="Next suit" className="absolute right-3 top-1/2 grid h-12 w-12 -translate-y-1/2 place-items-center border border-gold/40 bg-void/70 text-gold hover:bg-gold hover:text-void md:right-8">→</button>
        </div>

        <div className="mx-auto mt-2 flex max-w-7xl flex-wrap justify-center gap-2 px-4">
          {order.map((x, k) => (
            <button key={x.slug} onClick={() => { sfx.click(); setI(k); }}
              className={`border px-3 py-2 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors ${k === i ? "border-hot bg-hot/15 text-white" : "border-white/10 text-steel-400 hover:border-gold/50 hover:text-gold"}`}>
              {x.short}
            </button>
          ))}
        </div>

          </>
        )}
        <div className="mx-auto mt-10 max-w-7xl px-4 md:px-8">
          <AnimatePresence mode="wait">
            <motion.div key={s.slug} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.35 }}
              className="hud-panel hud-corners grid gap-8 p-6 md:grid-cols-[1.2fr_1fr] md:p-8">
              <div>
                <div className="hud-label flex flex-wrap items-center gap-3">
                  <span className="text-hot">{isDoom ? `Work ${ROMAN[i]}` : s.suit}</span><span>· rank {7 - s.mark} of 6</span><LiveBadge live={s.live} />
                </div>
                <h3 className="mt-3 font-display text-4xl font-bold uppercase text-white md:text-5xl">{s.name}</h3>
                <p className="mt-2 font-serif text-xl italic text-gold">{isDoom ? doom.works[s.slug] ?? s.tagline : s.tagline}</p>
                <p className="mt-4 leading-relaxed text-steel-300">{s.summary}</p>
                <div className="mt-6 flex flex-wrap gap-3">
                  <Link href={`/work/${s.slug}`} className="btn-primary">Open schematic →</Link>
                  <a href={s.repo} target="_blank" rel="noreferrer" className="btn-ghost">Source ↗</a>
                  {s.live ? <a href={s.live} target="_blank" rel="noreferrer" className="btn-ghost">Live ↗</a> : <span className="btn border-dashed border-white/10 text-steel-500">Live demo soon</span>}
                </div>
              </div>
              <div className="space-y-5">
                <div>
                  <div className="hud-label flex justify-between"><span>power rating</span><span className="text-gold">{s.power}/100</span></div>
                  <div className="mt-2 h-2 bg-white/[0.06]">
                    <motion.div className="h-full bg-gradient-to-r from-hot to-gold" initial={{ width: 0 }} animate={{ width: `${s.power}%` }} transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }} />
                  </div>
                </div>
                <div className="flex items-start gap-4 border-l-2 border-hot pl-4">
                  <span className="whitespace-nowrap font-display text-4xl font-bold text-white">{s.stat.value}</span>
                  <span className="text-sm leading-snug text-steel-400">{s.stat.label}</span>
                </div>
                <div className="flex flex-wrap gap-1.5">{s.stack.map((t) => <span key={t} className="chip">{t}</span>)}</div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}
