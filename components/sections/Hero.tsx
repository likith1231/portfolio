"use client";

import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import Clock from "../ui/Clock";
import { useGo } from "../Nav";
import { useHUD } from "../Shell";
import { profile, quotes } from "@/data/portfolio";
import SocialButtons from "../ui/SocialButtons";

const Reactor3D = dynamic(() => import("../three/Reactor3D"), { ssr: false, loading: () => <div className="h-full w-full" /> });

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
  const { setJarvisOpen, introDone } = useHUD();
  const words = profile.headline.split(" ");
  const show = introDone;

  return (
    <section id="top" className="relative flex min-h-[100svh] items-center overflow-hidden pt-20">
      <div className="grid-bg pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      <div className="pointer-events-none absolute -right-40 top-10 h-[640px] w-[640px] rounded-full bg-hot/[0.10] blur-3xl" />
      <div className="pointer-events-none absolute -left-40 bottom-0 h-[420px] w-[420px] rounded-full bg-gold/[0.06] blur-3xl" />

      <div className="relative mx-auto grid w-full max-w-7xl items-center gap-6 px-4 md:px-8 lg:grid-cols-[1.1fr_1fr]">
        <div className="relative z-10 order-2 lg:order-1">
          <motion.div initial={{ opacity: 0 }} animate={show ? { opacity: 1 } : {}} transition={{ delay: 0.2 }} className="hud-label mb-6 flex flex-wrap items-center gap-x-4 gap-y-2">
            <span className="flex items-center gap-2 text-ok"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ok" /> online</span>
            <span>{profile.location}</span>
            <span className="text-steel-200"><Clock /> IST</span>
          </motion.div>

          <h1 className="font-display text-[2.5rem] font-bold uppercase leading-[0.95] tracking-tight text-white sm:text-6xl xl:text-7xl">
            {words.map((w, i) => (
              <motion.span key={i} initial={{ opacity: 0, y: 40, filter: "blur(10px)" }} animate={show ? { opacity: 1, y: 0, filter: "blur(0px)" } : {}}
                transition={{ delay: 0.3 + i * 0.08, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className={`mr-[0.25em] inline-block ${w.startsWith("themselves") ? "gold-text" : ""}`}>
                {w}
              </motion.span>
            ))}
          </h1>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={show ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.9 }} className="mt-6 font-mono text-sm text-steel-300 md:text-base">
            {profile.name} <span className="text-hot">//</span> <Rotator />
          </motion.p>

          <motion.p initial={{ opacity: 0, y: 16 }} animate={show ? { opacity: 1, y: 0 } : {}} transition={{ delay: 1 }} className="mt-5 max-w-xl text-base leading-relaxed text-steel-300 md:text-lg">
            {profile.intro}
          </motion.p>

          <motion.div initial={{ opacity: 0, y: 16 }} animate={show ? { opacity: 1, y: 0 } : {}} transition={{ delay: 1.1 }} className="mt-9 flex flex-wrap gap-3">
            <button onClick={() => go("armor")} className="btn-hot">Enter the Hall of Armor →</button>
            <button onClick={() => setJarvisOpen(true)} className="btn-primary">J.A.R.V.I.S. systems</button>
          </motion.div>

          <motion.div initial={{ opacity: 0 }} animate={show ? { opacity: 1 } : {}} transition={{ delay: 1.3 }} className="mt-10 flex flex-wrap gap-2">
            {profile.roles.map((r) => (
              <span key={r} className="border border-gold/40 bg-gold/[0.06] px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] text-gold">{r}</span>
            ))}
          </motion.div>

          <div className="mt-8"><SocialButtons /></div>
        </div>

        <div className="relative order-1 mx-auto aspect-square w-full max-w-[560px] lg:order-2">
          {introDone && <Reactor3D />}
          <div className="hud-label pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 whitespace-nowrap">
            “{quotes.hero.text}” <span className="text-gold">· move your mouse</span>
          </div>
        </div>
      </div>
    </section>
  );
}
