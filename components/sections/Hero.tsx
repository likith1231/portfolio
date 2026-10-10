"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import Clock from "../ui/Clock";
import DotMatrix from "../ui/DotMatrix";
import Typewriter from "../ui/Typewriter";
import { useGo } from "../Nav";
import { useHUD } from "../Shell";
import { profile, stats } from "@/data/portfolio";
import SocialButtons from "../ui/SocialButtons";
import { sfx } from "@/lib/sfx";

const Reactor3D = dynamic(() => import("../three/Reactor3D"), { ssr: false, loading: () => <div className="h-full w-full" /> });

// Fonts the visitor can try on the headline's accent word.
const FONTS = [
  { name: "Instrument Serif", css: "var(--font-serif)", italic: true },
  { name: "Chakra Petch", css: "var(--font-display)", italic: false },
  { name: "JetBrains Mono", css: "var(--font-mono)", italic: false },
  { name: "Inter", css: "var(--font-inter)", italic: false },
  { name: "Georgia", css: "Georgia, serif", italic: true },
  { name: "Impact", css: "Impact, 'Arial Narrow Bold', sans-serif", italic: false },
];

function Rotator() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((v) => (v + 1) % profile.roles.length), 2600);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="relative inline-flex h-[1.4em] overflow-hidden align-bottom">
      <AnimatePresence mode="wait">
        <motion.span key={i} initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "-100%" }} transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }} className="inline-block text-gold">
          {profile.roles[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

const pop = (d: number, show: boolean) => ({
  initial: { opacity: 0, y: 24 },
  animate: show ? { opacity: 1, y: 0 } : {},
  transition: { delay: d, duration: 0.7, ease: [0.16, 1, 0.3, 1] as const },
});

export default function Hero() {
  const go = useGo();
  const { introDone, mode, toggleMode, narrate } = useHUD();
  const [font, setFont] = useState(0);
  const [hoverFont, setHoverFont] = useState<number | null>(null);
  const words = profile.headline.split(" ");
  const show = introDone;
  const f = FONTS[hoverFont ?? font];

  return (
    <section id="top" className="relative px-3 pb-6 pt-20 md:px-6">
      <div className="mx-auto grid max-w-[1400px] gap-3 lg:grid-cols-12">
        {/* headline + narrator intro */}
        <motion.div {...pop(0.1, show)} className="tile flex flex-col justify-between p-6 md:p-10 lg:col-span-7">
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11px] uppercase tracking-[0.25em] text-gold">
            <span className="flex items-center gap-2 text-ok"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ok" /> online</span>
            <span>{profile.location}</span>
          </div>

          <h1 className="mt-10 font-display text-[2.7rem] font-bold leading-[0.98] tracking-tight text-[#f3e6cf] sm:text-6xl xl:text-[4.6rem]">
            {words.map((w, i) => {
              const last = i === words.length - 1;
              return (
                <motion.span key={i} initial={{ opacity: 0, y: 40, filter: "blur(10px)" }} animate={show ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className={`mr-[0.22em] inline-block ${last ? "gold-text pr-2 font-normal" : ""}`}
                  style={last ? { fontFamily: f.css, fontStyle: f.italic ? "italic" : "normal", transition: "font-family .2s" } : undefined}>
                  {w}
                </motion.span>
              );
            })}
          </h1>

          <p className="mt-8 max-w-2xl text-base leading-relaxed text-steel-300 md:text-lg">
            <Typewriter start={show}
              text={`Hey there! I'm ${profile.name}. I build full-stack products and then armor them: containers, Kubernetes, autoscaling, and AI agents that patch production incidents on their own. I als`}
              after={<button onClick={() => { sfx.click(); narrate("Pilot muted. He was about to talk about Kubernetes again."); }} className="ml-1 rounded border border-gold/40 px-1.5 font-mono text-sm text-gold hover:bg-gold/10">[ muted ]</button>} />
          </p>
          <p className="mt-2 font-mono text-xs text-steel-500">J.A.R.V.I.S.: that was the short version of him.</p>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <button onClick={() => go("armor")} className="btn-primary">See the work →</button>
            <button onClick={() => go("contact")} className="btn-ghost">Open a comm channel</button>
          </div>

          <div className="mt-8 flex flex-wrap items-end justify-between gap-4 border-t border-white/[0.06] pt-5">
            <div className="font-mono text-sm"><span className="text-[#f3e6cf]">{profile.name}</span> <span className="text-hot">//</span> <Rotator /></div>
            <div className="font-mono text-[11px] uppercase tracking-[0.2em] text-steel-400">local time <span className="text-white"><Clock /></span> · <span className="text-gold">GMT +05:30</span></div>
          </div>
        </motion.div>

        {/* the reactor */}
        <motion.div {...pop(0.2, show)} className="tile relative min-h-[360px] overflow-hidden p-0 lg:col-span-5">
          <div className="absolute left-5 top-5 z-10 tile-label">arc reactor · drag the mouse</div>
          <div className="absolute inset-0">{introDone && <Reactor3D />}</div>
          <div className="absolute inset-x-5 bottom-5 z-10 flex flex-wrap gap-2">
            {profile.roles.map((r) => (
              <span key={r} className="rounded-full border border-gold/40 bg-void/70 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.16em] text-gold backdrop-blur">{r}</span>
            ))}
          </div>
        </motion.div>

        {/* restyle the headline */}
        <motion.div {...pop(0.3, show)} className="tile lg:col-span-4" data-lock>
          <div className="flex items-center justify-between">
            <span className="tile-label">restyle the headline</span>
            <span className="font-mono text-[10px] text-steel-500">{FONTS[font].name}</span>
          </div>
          <ul className="mt-4 grid grid-cols-2 gap-1.5" onMouseLeave={() => setHoverFont(null)}>
            {FONTS.map((x, i) => (
              <li key={x.name}>
                <button onMouseEnter={() => setHoverFont(i)} onClick={() => { sfx.tick(); setFont(i); }}
                  className={`w-full truncate rounded-lg border px-3 py-2 text-left text-lg transition-colors ${i === font ? "border-gold/60 bg-gold/10 text-gold" : "border-white/[0.06] text-steel-200 hover:border-gold/30"}`}
                  style={{ fontFamily: x.css, fontStyle: x.italic ? "italic" : "normal" }}>
                  {x.name}
                </button>
              </li>
            ))}
          </ul>
          <div className="mt-4 flex items-center justify-between border-t border-white/[0.06] pt-4">
            <span className="tile-label">suit finish</span>
            <button onClick={toggleMode} className="rounded-full border border-white/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.14em] text-steel-200 hover:border-gold/60">
              {mode === "mark" ? "● red & gold" : "● war machine"} ⇄
            </button>
          </div>
        </motion.div>

        {/* stats as dot-matrix readouts */}
        {stats.map((st, i) => (
          <motion.div key={st.label} {...pop(0.35 + i * 0.06, show)} className="tile flex flex-col justify-between gap-6 lg:col-span-2">
            <span className="tile-label">{st.label}</span>
            <DotMatrix value={st.value} dot={7} className="max-w-full" />
          </motion.div>
        ))}

        <motion.div {...pop(0.6, show)} className="tile flex items-center lg:col-span-12">
          <SocialButtons />
        </motion.div>
      </div>
    </section>
  );
}
