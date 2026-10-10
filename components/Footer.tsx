"use client";

import { useEffect, useState } from "react";
import Clock from "./ui/Clock";
import { useHUD } from "./Shell";
import { doom, modelCredits, profile, quotes, socials } from "@/data/portfolio";

// Flight time counts only while the tab is visible.
function FlightTime() {
  const [s, setS] = useState(0);
  useEffect(() => {
    const id = setInterval(() => { if (document.visibilityState === "visible") setS((v) => v + 1); }, 1000);
    return () => clearInterval(id);
  }, []);
  const p = (n: number) => String(n).padStart(2, "0");
  return <span className="text-gold">{p(Math.floor(s / 3600))}:{p(Math.floor((s % 3600) / 60))}:{p(s % 60)}</span>;
}

// Roughly how much of the page the visitor has scrolled past, in words.
function Scanned() {
  const [w, setW] = useState(0);
  useEffect(() => {
    const total = (document.body.innerText || "").split(/\s+/).length;
    const on = () => {
      const k = Math.min(1, (window.scrollY + innerHeight) / document.documentElement.scrollHeight);
      setW((x) => Math.max(x, Math.round(total * k)));
    };
    on();
    window.addEventListener("scroll", on, { passive: true });
    return () => window.removeEventListener("scroll", on);
  }, []);
  return <span className="text-gold">{w.toLocaleString()}</span>;
}

export default function Footer() {
  const { setJarvisOpen, emp, empActive, replayIntro, mode } = useHUD();
  const isDoom = mode === "doom";
  const q = isDoom ? doom.quotes.footer : quotes.footer;
  return (
    <footer className="relative border-t border-white/[0.06] px-4 pb-28 pt-14 md:px-8">
      <div className="mx-auto max-w-7xl">
        <p className="font-serif text-3xl italic text-white md:text-4xl">“{q.text}”</p>
        <p className="hud-label mt-2">{q.by} · {q.film}</p>

        <div className="mt-10 flex flex-col gap-6 font-mono text-[11px] text-steel-500 md:flex-row md:items-end md:justify-between">
          <div className="space-y-1">
            <div className="text-steel-300">{profile.name} © {new Date().getFullYear()} · {isDoom ? "Latverian-grade engineering, by decree" : "Stark-grade engineering, minus the billions"}</div>
            <div>flight time <FlightTime /> · 0 incidents · it's <span className="text-steel-300"><Clock seconds={false} /></span> in Bengaluru</div>
            <div>you've scanned about <Scanned /> words of this page</div>
            <div>Built with Next.js, Three.js and Framer Motion. Set in {isDoom ? "Cinzel" : "Chakra Petch"}, Inter and {isDoom ? "JetBrains Mono" : "Instrument Serif"}.</div>
          </div>
          <div className="flex flex-wrap items-center gap-x-5 gap-y-3 uppercase tracking-[0.18em]">
            <button onClick={emp} disabled={empActive} className={`border px-3 py-1.5 disabled:opacity-40 ${isDoom ? "border-gold/50 text-gold hover:bg-gold/10" : "border-danger/50 text-danger hover:bg-danger/10"}`} title="Freeze every animation for 5 seconds">{isDoom ? "⧗ Halt time" : "⚡ Fire EMP"}</button>
            <button onClick={replayIntro} className="hover:text-gold">{isDoom ? "Time Platform ↺" : "Replay intro"}</button>
            <button onClick={() => setJarvisOpen(true)} className="hover:text-gold">{isDoom ? doom.ai : "J.A.R.V.I.S."}</button>
            <a href={socials.github} target="_blank" rel="noreferrer" className="hover:text-gold">GitHub</a>
            <a href={socials.linkedin} target="_blank" rel="noreferrer" className="hover:text-gold">LinkedIn</a>
            <a href="#top" className="hover:text-gold">Back to top ↑</a>
          </div>
        </div>
        <details className="mt-10 border-t border-white/[0.06] pt-5 font-mono text-[11px] text-steel-500">
          <summary className="cursor-pointer uppercase tracking-[0.18em] hover:text-gold">3D model credits · CC BY 4.0</summary>
          <ul className="mt-3 space-y-1.5">
            {modelCredits.map((c) => (
              <li key={c.title}>
                <span className="text-steel-300">{c.usedFor}</span>: based on “<a href={c.url} target="_blank" rel="noreferrer" className="text-gold hover:underline">{c.title}</a>” by {c.author}, licensed under{" "}
                <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer" className="hover:text-gold">CC BY 4.0</a>. Repainted, rescaled and compressed for this site.
              </li>
            ))}
          </ul>
          <p className="mt-3">Iron Man, Doctor Doom and related characters are owned by Marvel. This is a non-commercial fan tribute; the Doom mask on this site is an original design, not Marvel artwork.</p>
        </details>
        <p className="mt-8 font-mono text-[10px] text-steel-500/60">{isDoom
          ? "psst: press Doom's seal in the corner · ↑ ↑ ↓ ↓ ← → ← → B A · or hold the mouse on empty space to charge a mystic bolt"
          : "psst: try the gauntlet in the corner · ↑ ↑ ↓ ↓ ← → ← → B A · or hold the mouse on empty space, then let go"}</p>
      </div>
    </footer>
  );
}
