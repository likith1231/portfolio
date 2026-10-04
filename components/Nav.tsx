"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useHUD } from "./Shell";
import { scrollToId } from "./ui/SmoothScroll";
import { profile } from "@/data/portfolio";
import { sfx } from "@/lib/sfx";

export const SECTIONS = [
  { id: "armor", label: "Armor" },
  { id: "schematics", label: "Schematics" },
  { id: "drill", label: "Threats" },
  { id: "lab", label: "Stress test" },
  { id: "training", label: "Training" },
  { id: "status", label: "Status" },
  { id: "about", label: "Pilot" },
  { id: "contact", label: "Contact" },
];

export function useGo() {
  const router = useRouter();
  const path = usePathname();
  return (id: string) => {
    if (path === "/" && scrollToId(id)) return;
    router.push(`/#${id}`);
  };
}

function SoundIcon({ on }: { on: boolean }) {
  return (
    <span className="flex h-3 items-end gap-[2px]" aria-hidden>
      {[0.4, 1, 0.6, 0.85].map((h, i) => (
        <span key={i} className={`w-[2px] bg-current ${on ? "animate-pulse" : ""}`} style={{ height: on ? `${h * 100}%` : "20%", animationDelay: `${i * 0.15}s` }} />
      ))}
    </span>
  );
}

export default function Nav() {
  const { mode, toggleMode, soundOn, setSound, setJarvisOpen, setBriefOpen } = useHUD();
  const go = useGo();
  const [active, setActive] = useState("");
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 40);
      let cur = "";
      for (const s of SECTIONS) {
        const el = document.getElementById(s.id);
        if (el && el.getBoundingClientRect().top < window.innerHeight * 0.4) cur = s.id;
      }
      setActive(cur);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? "border-b border-white/[0.06] bg-void/80 backdrop-blur-md" : ""}`}>
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-3 px-4 md:px-8">
        <Link href="/" className="group flex shrink-0 items-center gap-3" aria-label="Home">
          <span className="relative grid h-8 w-8 place-items-center rounded-full border border-gold/60">
            <span className="absolute inset-1 animate-spin-slow rounded-full border border-dashed border-hot/70" />
            <span className="h-2 w-2 rounded-full bg-reactor shadow-[0_0_10px_#8fefff]" />
          </span>
          <span className="hidden font-display text-sm font-semibold uppercase tracking-[0.25em] text-white sm:inline">{profile.name}</span>
        </Link>

        <div className="hidden items-center xl:flex">
          {SECTIONS.map((s) => (
            <button key={s.id} onClick={() => { sfx.tick(); go(s.id); }}
              className={`relative px-2.5 py-2 font-mono text-[11px] uppercase tracking-[0.16em] transition-colors ${active === s.id ? "text-gold" : "text-steel-300 hover:text-white"}`}>
              {active === s.id && <motion.span layoutId="nav-dot" className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-hot" />}
              {s.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => setSound(!soundOn)} aria-label={soundOn ? "Mute suit sounds" : "Turn suit sounds on"} title={soundOn ? "Sound on" : "Sound off"}
            className={`grid h-8 w-9 place-items-center border ${soundOn ? "border-gold/60 text-gold" : "border-white/10 text-steel-500"} hover:border-gold`}>
            <SoundIcon on={soundOn} />
          </button>
          <button onClick={toggleMode} title={mode === "mark" ? "Switch to War Machine (black & gunmetal)" : "Back to classic red & gold"}
            className="flex h-8 items-center gap-2 border border-white/10 px-2.5 font-mono text-[11px] uppercase tracking-[0.12em] text-steel-200 hover:border-gold/60">
            <span className="flex gap-0.5">
              <span className="h-2.5 w-2.5 bg-hot" />
              <span className="h-2.5 w-2.5 bg-gold" />
            </span>
            <span className="hidden sm:inline">{mode === "mark" ? "War Machine" : "Classic"}</span>
          </button>
          <button onClick={() => { sfx.lock(); setJarvisOpen(true); }} className="flex h-8 items-center gap-2 border border-gold/50 bg-gold/10 px-3 font-mono text-[11px] uppercase tracking-[0.12em] text-gold hover:bg-gold hover:text-void">
            <span className="h-1.5 w-1.5 rounded-full bg-reactor shadow-[0_0_6px_#8fefff]" /> <span className="hidden md:inline">J.A.R.V.I.S.</span><span className="md:hidden">AI</span>
          </button>
          <button onClick={() => setBriefOpen(true)} className="hidden h-8 border border-hot/60 px-3 font-mono text-[11px] uppercase tracking-[0.12em] text-white hover:bg-hot lg:block">
            Recruiter
          </button>
          <button onClick={() => setOpen((v) => !v)} className="grid h-8 w-9 place-items-center border border-white/10 xl:hidden" aria-label="Menu">
            <span className="font-mono text-xs text-white">{open ? "✕" : "≡"}</span>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="max-h-[80vh] overflow-y-auto border-b border-white/10 bg-void/95 px-4 pb-6 backdrop-blur-md xl:hidden">
            {SECTIONS.map((s, i) => (
              <button key={s.id} onClick={() => { setOpen(false); go(s.id); }} className="flex w-full items-center gap-4 border-b border-white/5 py-3 text-left font-display text-lg uppercase text-steel-100">
                <span className="font-mono text-xs text-hot">0{i + 1}</span>{s.label}
              </button>
            ))}
            <button onClick={() => { setOpen(false); setBriefOpen(true); }} className="btn-hot mt-4 w-full justify-center">Recruiter mode</button>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
