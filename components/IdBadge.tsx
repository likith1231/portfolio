"use client";

import { motion } from "framer-motion";
import { education, profile } from "@/data/portfolio";

const ROWS: [string, string][] = [
  ["Name", "Likith Lochan U"],
  ["Division", "DevOps · Full Stack · AI/ML"],
  ["Program", `B.E. CSE · ${education.years}`],
  ["Base", "Bengaluru, India"],
  ["Flagship armor", "Mark 85 · GhostOps"],
  ["Arc reactor", "Palladium-free, fully charged"],
  ["Nemesis", "A pager alert at 3 a.m."],
  ["Lab assistant", "DUM-E, and a rubber duck"],
];

// A tilted Stark Industries access badge with the pilot's details.
export default function IdBadge() {
  return (
    <motion.article initial={{ opacity: 0, rotate: -6, y: 30 }} whileInView={{ opacity: 1, rotate: -2.5, y: 0 }} viewport={{ once: true }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }} whileHover={{ rotate: 0, scale: 1.01 }}
      className="relative mx-auto w-full max-w-[440px] overflow-hidden rounded-2xl text-[#1b1414] shadow-[0_40px_80px_-30px_rgba(0,0,0,.9)]"
      style={{ background: "linear-gradient(135deg,#f4efe6 0%,#e4ddd1 45%,#d2cabd 100%)" }}>
      {/* red header band */}
      <header className="relative flex items-center gap-4 px-6 py-4 text-white" style={{ background: "linear-gradient(90deg,#8e0f18,#c9182a 60%,#8e0f18)" }}>
        <span className="relative grid h-12 w-12 shrink-0 place-items-center rounded-full border-2 border-[#e8b04a] bg-[#1a0d0d]">
          <span className="absolute inset-1.5 rounded-full border border-dashed border-[#e8b04a]/60" />
          <span className="h-4 w-4 rounded-full bg-white shadow-[0_0_14px_4px_#8fefff]" />
        </span>
        <div>
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-[#ffd9a0]">Stark Industries · Access badge</p>
          <p className="font-display text-2xl font-bold leading-tight">{profile.name}</p>
        </div>
      </header>

      <dl className="px-6 pb-4 pt-3">
        {ROWS.map(([k, v]) => (
          <div key={k} className="grid grid-cols-[120px_1fr] gap-3 border-b border-dashed border-[#1b1414]/15 py-2.5 last:border-0">
            <dt className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#6b5f55]">{k}</dt>
            <dd className="font-serif text-lg leading-snug">{v}</dd>
          </div>
        ))}
      </dl>

      {/* barcode + holo sticker */}
      <footer className="flex items-end justify-between gap-4 px-6 pb-6">
        <div className="flex h-10 items-end gap-[2px]" aria-hidden>
          {Array.from({ length: 34 }).map((_, i) => <span key={i} className="bg-[#1b1414]" style={{ width: i % 3 ? 2 : 3, height: `${60 + ((i * 37) % 40)}%` }} />)}
        </div>
        <span className="grid h-12 w-12 place-items-center rounded-full text-[9px] font-bold uppercase tracking-wider text-[#1b1414]/70"
          style={{ background: "conic-gradient(from 30deg,#ffd6e0,#c8f1ff,#fff4b8,#d9c8ff,#ffd6e0)" }}>SI</span>
      </footer>
      <p className="absolute bottom-16 right-5 rotate-[-10deg] rounded border-2 border-[#c9182a] px-2.5 py-1 font-mono text-[11px] font-bold uppercase tracking-[0.25em] text-[#c9182a]/90">
        Clearance · Level 7
      </p>
    </motion.article>
  );
}
