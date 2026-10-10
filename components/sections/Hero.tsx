"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import Clock from "../ui/Clock";
import { useGo } from "../Nav";
import { useHUD } from "../Shell";
import { profile, stats } from "@/data/portfolio";
import SocialButtons from "../ui/SocialButtons";

const Reactor3D = dynamic(() => import("../three/Reactor3D"), { ssr: false, loading: () => <div className="h-full w-full" /> });

const SPARKS = Array.from({ length: 22 }, (_, i) => ({
  left: (i * 37) % 100, w: 2 + (i % 3), d: 7 + ((i * 13) % 9), delay: (i * 0.7) % 9, dx: ((i % 5) - 2) * 25,
}));

function Sparks() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden>
      {SPARKS.map((p, i) => (
        <span key={i} className="spark" style={{ left: `${p.left}%`, ["--w" as string]: `${p.w}px`, ["--d" as string]: `${p.d}s`, ["--delay" as string]: `${p.delay}s`, ["--dx" as string]: `${p.dx}px` }} />
      ))}
    </div>
  );
}

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

export default function Hero() {
  const go = useGo();
  const { introDone } = useHUD();
  const words = profile.headline.split(" ");
  const show = introDone;

  return (
    <section id="top" className="relative flex min-h-[100svh] flex-col justify-center overflow-hidden pb-10 pt-24">
      <div className="grid-bg pointer-events-none absolute inset-0 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      <Sparks />
      <div className="pointer-events-none absolute -right-40 top-10 h-[640px] w-[640px] rounded-full bg-hot/[0.10] blur-3xl" />
      <div className="pointer-events-none absolute -left-40 bottom-0 h-[420px] w-[420px] rounded-full bg-gold/[0.06] blur-3xl" />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-6 px-4 md:px-8 lg:grid-cols-[1.1fr_1fr]">
        <div className="relative z-10 order-2 lg:order-1">
          <motion.div initial={{ opacity: 0 }} animate={show ? { opacity: 1 } : {}} transition={{ delay: 0.2 }} className="mb-7 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-[11px] uppercase tracking-[0.25em] text-gold">
            <span className="flex items-center gap-2 text-ok"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ok" /> online</span>
            <span>{profile.location}</span>
            <span className="text-steel-200"><Clock /> IST</span>
          </motion.div>

          <h1 className="font-display text-[2.9rem] font-bold leading-[0.98] tracking-tight text-[#f3e6cf] sm:text-6xl xl:text-[5.2rem]">
            {words.map((w, i) => {
              const last = i === words.length - 1;
              return (
                <motion.span key={i} initial={{ opacity: 0, y: 40, filter: "blur(10px)" }} animate={show ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
                  transition={{ delay: 0.3 + i * 0.08, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                  className={`mr-[0.22em] inline-block ${last ? "gold-text pr-2 font-serif font-normal italic" : ""}`}>
                  {w}
                </motion.span>
              );
            })}
          </h1>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={show ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.9 }} className="mt-7 font-mono text-sm md:text-lg">
            <span className="text-[#f3e6cf]">{profile.name}</span> <span className="text-hot">//</span> <Rotator />
          </motion.p>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={show ? { opacity: 1, y: 0 } : {}} transition={{ delay: 1 }} className="mt-5 max-w-xl text-base leading-relaxed text-steel-300 md:text-lg">
            {profile.intro}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={show ? { opacity: 1, y: 0 } : {}} transition={{ delay: 1.1 }} className="mt-9 flex flex-wrap gap-3">
            <button onClick={() => go("armor")} className="btn-primary">Enter the Hall of Armor →</button>
            <button onClick={() => go("contact")} className="btn-ghost">Open a comm channel</button>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={show ? { opacity: 1 } : {}} transition={{ delay: 1.3 }} className="mt-10 flex flex-wrap gap-2">
            {profile.roles.map((r) => (
              <span key={r} className="rounded-full border border-gold/40 bg-gold/[0.06] px-3.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-gold">{r}</span>
            ))}
          </motion.div>

          <div className="mt-8"><SocialButtons /></div>
        </div>

        <div className="relative order-1 mx-auto w-full max-w-[540px] lg:order-2">
          <div className="relative aspect-square w-full">{introDone && <Reactor3D />}</div>
          <motion.figure initial={{ opacity: 0, x: 30 }} animate={show ? { opacity: 1, x: 0 } : {}} transition={{ delay: 1.2, duration: 0.8 }}
            className="relative -mt-10 hidden rounded-2xl border border-white/10 border-l-hot bg-void-900/80 p-6 backdrop-blur md:block" style={{ borderLeftWidth: 3 }}>
            <blockquote className="font-serif text-2xl italic leading-snug text-[#f3e6cf] xl:text-3xl">
              “I told you, I don’t want to join your super secret boy band.”
            </blockquote>
            <figcaption className="mt-4 font-mono text-[10px] uppercase tracking-[0.25em] text-gold">Tony Stark · Iron Man 2</figcaption>
          </motion.figure>
        </div>
      </div>

      <motion.dl initial={{ opacity: 0, y: 20 }} animate={show ? { opacity: 1, y: 0 } : {}} transition={{ delay: 1.4, duration: 0.8 }}
        className="relative mx-auto mt-14 grid w-full max-w-7xl grid-cols-2 border-y border-white/[0.08] px-4 md:grid-cols-4 md:px-8">
        {stats.map((st, i) => (
          <div key={st.label} className={`flex flex-col-reverse py-7 pl-4 ${i % 2 ? "border-l border-white/[0.08]" : ""} ${i > 0 ? "md:border-l md:border-white/[0.08]" : ""} ${i < 2 ? "border-b border-white/[0.08] md:border-b-0" : ""}`}>
            <dt className="mt-2 text-sm text-steel-400">{st.label}</dt>
            <dd className="gold-text font-display text-4xl font-bold md:text-5xl">{st.value}</dd>
          </div>
        ))}
      </motion.dl>
    </section>
  );
}
