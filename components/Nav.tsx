"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useHUD } from "./Shell";
import { scrollToId } from "./ui/SmoothScroll";
import { doom, profile } from "@/data/portfolio";
import { sfx } from "@/lib/sfx";
import { FileIcon, GitHubIcon, LinkedInIcon } from "./ui/SocialButtons";
import { socials } from "@/data/portfolio";

export const SECTIONS = [
  { id: "armor", label: "Armor" },
  { id: "schematics", label: "Schematics" },
  { id: "drill", label: "Threats" },
  { id: "lab", label: "Stress" },
  { id: "training", label: "Training" },
  { id: "status", label: "Status" },
  { id: "about", label: "Pilot" },
  { id: "log", label: "Log" },
  { id: "certs", label: "Certs" },
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
  const isDoom = mode === "doom";
  const label = (s: { id: string; label: string }) => (isDoom ? doom.nav[s.id] ?? s.label : s.label);
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
            <span className="h-2 w-2 rounded-full bg-reactor shadow-[0_0_10px_rgb(var(--reactor))]" />
          </span>
          <span className="hidden font-display text-sm font-semibold uppercase tracking-[0.25em] text-white sm:inline xl:hidden 2xl:inline">{profile.name}</span>
        </Link>

        <div className="hidden items-center xl:flex">
          {SECTIONS.map((s) => (
            <button key={s.id} onClick={() => { sfx.tick(); go(s.id); }}
              className={`relative whitespace-nowrap px-1.5 py-2 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors 2xl:px-2 ${active === s.id ? "text-gold" : "text-steel-300 hover:text-white"}`}>
              {active === s.id && <motion.span layoutId="nav-dot" className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-hot" />}
              {label(s)}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <a href={socials.github} target="_blank" rel="noreferrer" aria-label="GitHub" title="GitHub" className="hidden h-8 w-8 place-items-center border border-white/10 text-steel-200 hover:border-gold hover:text-gold md:grid"><GitHubIcon /></a>
          <a href={socials.linkedin} target="_blank" rel="noreferrer" aria-label="LinkedIn" title="LinkedIn" className="hidden h-8 w-8 place-items-center border border-white/10 text-steel-200 hover:border-gold hover:text-gold md:grid"><LinkedInIcon /></a>
          {profile.resume && (
            <a href={profile.resume} target="_blank" rel="noreferrer" title="Résumé (PDF)"
              className="hidden h-8 items-center gap-1.5 border border-white/10 px-2.5 font-mono text-[11px] uppercase tracking-[0.12em] text-steel-200 hover:border-gold hover:text-gold md:flex">
              <FileIcon className="h-3.5 w-3.5" /><span className="hidden 2xl:inline">Résumé</span>
            </a>
          )}
          <button onClick={() => setSound(!soundOn)} aria-label={soundOn ? "Mute suit sounds" : "Turn suit sounds on"} title={soundOn ? "Sound on" : "Sound off"}
            className={`flex h-8 items-center gap-1.5 border px-2 font-mono text-[10px] uppercase tracking-[0.12em] ${soundOn ? "border-gold/60 text-gold" : "border-white/10 text-steel-500"} hover:border-gold`}>
            <SoundIcon on={soundOn} /><span className="hidden 2xl:inline">{soundOn ? "SFX" : "Muted"}</span>
          </button>
          {/* the universe switch: [ STARK | DOOM ] */}
          <button onClick={toggleMode} role="switch" aria-checked={isDoom} aria-label={isDoom ? "Return to Tony Stark's universe" : "Enter Doctor Doom's universe"}
            title={isDoom ? "Return to Tony Stark's universe" : "Enter Doctor Doom's universe"}
            className="relative flex h-8 items-center border border-white/10 p-0.5 font-mono text-[10px] uppercase tracking-[0.14em] hover:border-gold/60">
            <motion.span layout transition={{ type: "spring", stiffness: 420, damping: 32 }}
              className={`absolute inset-y-0.5 w-[calc(50%-2px)] ${isDoom ? "right-0.5 bg-[#1f6b47] shadow-[0_0_14px_rgb(60_255_154/.45)]" : "left-0.5 bg-[#cc1a2a] shadow-[0_0_14px_rgb(204_26_42/.45)]"}`} />
            <span className={`relative z-10 w-12 text-center sm:w-14 ${isDoom ? "text-steel-400" : "text-white"}`}>Stark</span>
            <span className={`relative z-10 w-12 text-center sm:w-14 ${isDoom ? "text-white" : "text-steel-400"}`}>Doom</span>
          </button>
          <button onClick={() => { sfx.lock(); setJarvisOpen(true); }} className="flex h-8 items-center gap-2 border border-gold/50 bg-gold/10 px-3 font-mono text-[11px] uppercase tracking-[0.12em] text-gold hover:bg-gold hover:text-void">
            <span className="h-1.5 w-1.5 rounded-full bg-reactor shadow-[0_0_6px_rgb(var(--reactor))]" /> <span className="hidden whitespace-nowrap md:inline">{isDoom ? doom.ai : "J.A.R.V.I.S."}</span><span className="md:hidden">AI</span>
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
                <span className="font-mono text-xs text-hot">{String(i + 1).padStart(2, "0")}</span>{label(s)}
              </button>
            ))}
            <button onClick={() => { setOpen(false); setBriefOpen(true); }} className="btn-hot mt-4 w-full justify-center">Recruiter mode</button>
            {profile.resume && <a href={profile.resume} target="_blank" rel="noreferrer" className="btn-ghost mt-2 w-full justify-center">Résumé (PDF) ↗</a>}
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
