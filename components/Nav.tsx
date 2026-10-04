"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useHUD } from "./Shell";
import { scrollToId } from "./ui/SmoothScroll";
import { profile } from "@/data/portfolio";

export const SECTIONS = [
  { id: "work", label: "Work" },
  { id: "drill", label: "Drill" },
  { id: "lab", label: "Lab" },
  { id: "status", label: "Status" },
  { id: "about", label: "About" },
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

export default function Nav() {
  const { mode, toggleMode, setPaletteOpen, setBriefOpen } = useHUD();
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
    <header className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${scrolled ? "border-b border-white/[0.06] bg-void/75 backdrop-blur-md" : ""}`}>
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 md:px-8">
        <Link href="/" className="group flex items-center gap-3" aria-label="Home">
          <span className="relative grid h-8 w-8 place-items-center rounded-full border border-arc/50">
            <span className="absolute inset-1 rounded-full border border-dashed border-arc/40 animate-spin-slow" />
            <span className="h-2 w-2 rounded-full bg-arc shadow-[0_0_10px_rgb(var(--arc))]" />
          </span>
          <span className="font-display text-sm font-semibold uppercase tracking-[0.25em] text-white">{profile.name}</span>
        </Link>

        <div className="hidden items-center gap-1 lg:flex">
          {SECTIONS.map((s) => (
            <button
              key={s.id}
              onClick={() => go(s.id)}
              className={`relative px-3 py-2 font-mono text-[11px] uppercase tracking-[0.2em] transition-colors ${active === s.id ? "text-arc" : "text-steel-300 hover:text-white"}`}
            >
              {active === s.id && <motion.span layoutId="nav-dot" className="absolute -bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-arc" />}
              {s.label}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button onClick={() => setPaletteOpen(true)} className="hidden items-center gap-2 border border-white/10 px-2.5 py-1.5 font-mono text-[11px] text-steel-300 hover:border-arc/50 hover:text-arc md:flex" aria-label="Open command palette">
            <span>⌘K</span>
          </button>
          <button
            onClick={toggleMode}
            title={mode === "stealth" ? "Suit up: switch to red & gold" : "Back to stealth black"}
            className="flex items-center gap-2 border border-white/10 px-2.5 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-steel-200 hover:border-hot/60"
          >
            <span className="flex gap-0.5">
              <span className="h-2.5 w-2.5 bg-hot" />
              <span className="h-2.5 w-2.5 bg-warm" />
            </span>
            <span className="hidden sm:inline">{mode === "stealth" ? "Suit up" : "Stealth"}</span>
          </button>
          <button onClick={() => setBriefOpen(true)} className="hidden border border-arc/40 bg-arc/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.15em] text-arc hover:bg-arc hover:text-void sm:block">
            Recruiter mode
          </button>
          <button onClick={() => setOpen((v) => !v)} className="grid h-9 w-9 place-items-center border border-white/10 lg:hidden" aria-label="Menu">
            <span className="font-mono text-xs text-white">{open ? "✕" : "≡"}</span>
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} className="border-b border-white/10 bg-void/95 px-4 pb-6 backdrop-blur-md lg:hidden">
            {SECTIONS.map((s, i) => (
              <button key={s.id} onClick={() => { setOpen(false); go(s.id); }} className="flex w-full items-center gap-4 border-b border-white/5 py-3 text-left font-display text-lg uppercase text-steel-100">
                <span className="font-mono text-xs text-arc">0{i + 1}</span>{s.label}
              </button>
            ))}
            <div className="mt-4 flex gap-2">
              <button onClick={() => { setOpen(false); setBriefOpen(true); }} className="btn-primary flex-1 justify-center">Recruiter mode</button>
              <button onClick={() => { setOpen(false); setPaletteOpen(true); }} className="btn-ghost justify-center">Terminal</button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
