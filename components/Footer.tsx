"use client";

import { useEffect, useState } from "react";
import Clock from "./ui/Clock";
import { useHUD } from "./Shell";
import { modelCredits, profile, socials } from "@/data/portfolio";
import { useGo } from "./Nav";
import { FileIcon, GitHubIcon, LinkedInIcon, MailIcon } from "./ui/SocialButtons";

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

const LINKS = [
  { id: "top", label: "Home" },
  { id: "armor", label: "Work" },
  { id: "drill", label: "Lab" },
  { id: "about", label: "About" },
  { id: "contact", label: "Contact" },
];

// The footer as a bento: section tiles, social tiles, the sign-off, and a studded plate with live readouts.
export default function Footer() {
  const { setJarvisOpen, emp, empActive, replayIntro } = useHUD();
  const go = useGo();
  const socialsList = [
    { href: socials.github, label: "GitHub", Icon: GitHubIcon },
    { href: socials.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
    { href: `mailto:${profile.email}`, label: "Email", Icon: MailIcon },
    ...(profile.resume ? [{ href: profile.resume, label: "Résumé", Icon: FileIcon }] : []),
  ];
  return (
    <footer className="relative px-3 pb-28 pt-6 md:px-6">
      <div className="mx-auto grid max-w-[1400px] gap-3 lg:grid-cols-12">
        <div className="grid gap-3 lg:col-span-7">
          <nav className="grid grid-cols-[repeat(auto-fit,minmax(110px,1fr))] gap-3" aria-label="Footer">
            {LINKS.map((l) => (
              <button key={l.id} onClick={() => go(l.id)} className="tile tile-hover py-5 text-center font-mono text-xs uppercase tracking-[0.2em] text-gold hover:text-white">
                {l.label}
              </button>
            ))}
          </nav>
          <div className="grid gap-3 sm:grid-cols-[auto_1fr]">
            <div className="grid grid-cols-4 gap-3 sm:grid-cols-1">
              {socialsList.map(({ href, label, Icon }) => (
                <a key={label} href={href} target={href.startsWith("mailto") ? undefined : "_blank"} rel="noreferrer" aria-label={label} title={label}
                  className="tile tile-hover grid place-items-center p-4 text-gold hover:text-white"><Icon className="h-4 w-4" /></a>
              ))}
            </div>
            <div className="tile flex flex-col justify-between gap-10 p-6 md:p-8">
              <div className="flex flex-wrap justify-between gap-3 font-mono text-[11px] uppercase tracking-[0.18em] text-steel-400">
                <span>{profile.name} © {new Date().getFullYear()}</span>
                <span>Stark-grade engineering, minus the billions</span>
              </div>
              <p className="font-display text-5xl font-bold text-[#f3e6cf] md:text-6xl">Suit <span className="gold-text font-serif font-normal italic">off</span><span className="text-gold">.</span></p>
            </div>
          </div>
        </div>

        <div className="tile studs flex flex-col justify-end gap-5 lg:col-span-5">
          <div className="rounded-2xl border border-white/[0.08] bg-void/90 p-5 font-mono text-[11px] text-steel-400 backdrop-blur">
            <div>flight time <FlightTime /> · 0 incidents · it&apos;s <span className="text-steel-200"><Clock seconds={false} /></span> in Bengaluru</div>
            <div className="mt-1">you&apos;ve scanned about <Scanned /> words of this page</div>
            <div className="mt-1">Built with Next.js, Three.js and Framer Motion.</div>
            <div className="mt-4 flex flex-wrap gap-x-5 gap-y-3 uppercase tracking-[0.18em]">
              <button onClick={emp} disabled={empActive} className="border border-danger/50 px-3 py-1.5 text-danger hover:bg-danger/10 disabled:opacity-40" title="Freeze every animation for 5 seconds">⚡ Fire EMP</button>
              <button onClick={replayIntro} className="hover:text-gold">Replay intro</button>
              <button onClick={() => setJarvisOpen(true)} className="hover:text-gold">J.A.R.V.I.S.</button>
            </div>
            <details className="mt-4 border-t border-white/[0.06] pt-3">
              <summary className="cursor-pointer uppercase tracking-[0.18em] hover:text-gold">3D model credits · CC BY 4.0</summary>
              <ul className="mt-3 space-y-1.5">
                {modelCredits.map((c) => (
                  <li key={c.title}>
                    <span className="text-steel-300">{c.usedFor}</span>: based on “<a href={c.url} target="_blank" rel="noreferrer" className="text-gold hover:underline">{c.title}</a>” by {c.author}, licensed under{" "}
                    <a href="https://creativecommons.org/licenses/by/4.0/" target="_blank" rel="noreferrer" className="hover:text-gold">CC BY 4.0</a>. Repainted, rescaled and compressed for this site.
                  </li>
                ))}
              </ul>
              <p className="mt-3">Iron Man and related characters are owned by Marvel. This is a non-commercial fan tribute.</p>
            </details>
            <p className="mt-3 text-[10px] text-steel-500/70">psst: try the gauntlet in the corner · ↑ ↑ ↓ ↓ ← → ← → B A · or hold the mouse on empty space, then let go</p>
          </div>
        </div>
      </div>
    </footer>
  );
}
