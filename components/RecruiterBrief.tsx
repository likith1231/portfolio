"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";
import { useHUD } from "./Shell";
import { arsenal as armory, certifications, flagships as projects, profile, socials } from "@/data/portfolio";

// The whole portfolio, condensed to what a recruiter reads in 30 seconds.
export default function RecruiterBrief() {
  const { briefOpen, setBriefOpen } = useHUD();
  const [copied, setCopied] = useState(false);

  const summary = [
    `${profile.name} — ${profile.role}`,
    `${profile.location} · ${profile.education}`,
    `${profile.available}`,
    "",
    ...projects.map((p) => `• ${p.name}: ${p.tagline} (${p.stat.value} ${p.stat.label.split(",")[0]}) ${p.repo}`),
    "",
    `Certified: ${certifications.filter((c) => c.tier === "Professional").map((c) => `${c.name} (verify: ${c.url})`).join("; ")}`,
    `Stack: ${armory.slice(0, 5).map((g) => g.items.slice(0, 3).join(", ")).join("; ")}`,
    `Email: ${profile.email} · GitHub: ${socials.github} · LinkedIn: ${socials.linkedin}`,
  ].join("\n");

  const copy = async () => {
    try { await navigator.clipboard.writeText(summary); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch {}
  };

  return (
    <AnimatePresence>
      {briefOpen && (
        <motion.div className="fixed inset-0 z-[80] flex items-start justify-center overflow-y-auto bg-black/75 px-4 py-10 backdrop-blur-sm"
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={() => setBriefOpen(false)}>
          <motion.article onMouseDown={(e) => e.stopPropagation()} initial={{ y: 30 }} animate={{ y: 0 }} exit={{ y: 20 }}
            className="hud-panel hud-corners w-full max-w-3xl bg-void-900/95 p-6 md:p-9" role="dialog" aria-label="Recruiter brief">
            <div className="flex items-start justify-between gap-4">
              <div>
                <div className="hud-label text-gold">recruiter mode · 30-second brief for ms. potts</div>
                <h2 className="mt-3 font-display text-3xl font-bold uppercase text-white md:text-4xl">{profile.name}</h2>
                <p className="mt-1 text-steel-300">{profile.role}</p>
                <p className="mt-1 text-sm text-steel-500">{profile.location} · {profile.education}</p>
              </div>
              <button onClick={() => setBriefOpen(false)} className="font-mono text-xs text-steel-400 hover:text-white" aria-label="Close">esc ✕</button>
            </div>

            <div className="mt-5 inline-flex items-center gap-2 border border-ok/30 bg-ok/10 px-3 py-1.5 text-xs text-ok">
              <span className="h-1.5 w-1.5 rounded-full bg-ok" /> {profile.available}
            </div>

            <div className="mt-8 space-y-3">
              <div className="hud-label">top builds</div>
              {projects.map((p) => (
                <Link key={p.slug} href={`/work/${p.slug}`} onClick={() => setBriefOpen(false)}
                  className="group grid gap-1 border border-white/[0.07] p-4 transition-colors hover:border-gold/40 sm:grid-cols-[210px_1fr_auto] sm:items-center sm:gap-4">
                  <span className="font-display font-semibold uppercase text-white"><span className="mr-2 font-mono text-[10px] text-hot">{p.short}</span>{p.name}</span>
                  <span className="text-sm text-steel-400">{p.tagline}</span>
                  <span className="font-display text-sm font-bold text-gold">{p.stat.value}</span>
                </Link>
              ))}
            </div>

            <div className="mt-8">
              <div className="hud-label mb-3">certified</div>
              <div className="flex flex-col gap-2">
                {certifications.filter((c) => c.tier === "Professional").map((c) => (
                  <a key={c.name} href={c.url} target="_blank" rel="noreferrer" className="group flex items-center justify-between gap-3 border border-white/[0.07] px-4 py-2.5 hover:border-ok/40">
                    <span className="text-sm text-white">{c.name} <span className="text-steel-500">· {c.issuer}</span></span>
                    <span className="shrink-0 font-mono text-[10px] uppercase tracking-[0.16em] text-ok">verify ↗</span>
                  </a>
                ))}
              </div>
            </div>

            <div className="mt-8">
              <div className="hud-label mb-3">core stack</div>
              <div className="flex flex-wrap gap-1.5">
                {armory.flatMap((g) => g.items.slice(0, 3)).map((s) => <span key={s} className="chip">{s}</span>)}
              </div>
            </div>

            <div className="mt-8 flex flex-wrap gap-3 border-t border-white/[0.07] pt-6">
              <a href={`mailto:${profile.email}`} className="btn-primary">Email {profile.short}</a>
              <a href={socials.linkedin} target="_blank" rel="noreferrer" className="btn-ghost">LinkedIn ↗</a>
              <a href={socials.github} target="_blank" rel="noreferrer" className="btn-ghost">GitHub ↗</a>
              {profile.resume && <a href={profile.resume} target="_blank" rel="noreferrer" className="btn-ghost">Résumé ↓</a>}
              <button onClick={copy} className="btn-ghost">{copied ? "✓ Copied" : "Copy summary"}</button>
            </div>
          </motion.article>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
