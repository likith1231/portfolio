"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import SectionHead from "../ui/SectionHead";
import { useHUD } from "../Shell";
import Reveal from "../ui/Reveal";
import { arsenal, diagnostics, education, principles, profile } from "@/data/portfolio";
import IdBadge from "../IdBadge";
import ReactorActivity from "../ReactorActivity";
import { sfx } from "@/lib/sfx";

const GRADE = { S: 1, A: 0.8, B: 0.6 } as const;

function Radar() {
  const isDoom = useHUD().mode === "doom";
  const [hover, setHover] = useState(0);
  const n = diagnostics.length, c = 150, r = 105;
  const pt = (i: number, k: number) => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2;
    return [c + Math.cos(a) * r * k, c + Math.sin(a) * r * k] as const;
  };
  const poly = diagnostics.map((d, i) => pt(i, GRADE[d.grade]).join(",")).join(" ");

  return (
    <div className="hud-panel hud-corners p-5">
      <div className="hud-label mb-2 flex justify-between"><span>{isDoom ? "sovereign diagnostics" : "suit diagnostics"}</span><span className="text-gold">scan complete</span></div>
      <div className="grid items-center gap-4 sm:grid-cols-[1fr_1fr]">
        <svg viewBox="-40 -10 380 320" className="mx-auto w-full max-w-[360px]" role="img" aria-label="Diagnostics radar chart">
          {[0.25, 0.5, 0.75, 1].map((k) => (
            <polygon key={k} points={diagnostics.map((_, i) => pt(i, k).join(",")).join(" ")} fill="none" className="stroke-white/10" />
          ))}
          {diagnostics.map((_, i) => { const [x, y] = pt(i, 1); return <line key={i} x1={c} y1={c} x2={x} y2={y} className="stroke-white/10" />; })}
          <motion.polygon
            points={poly}
            initial={{ scale: 0, opacity: 0 }}
            whileInView={{ scale: 1, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            style={{ transformOrigin: "150px 150px" }}
            className="fill-gold/15 stroke-gold"
            strokeWidth="1.5"
          />
          {diagnostics.map((d, i) => {
            const [x, y] = pt(i, GRADE[d.grade]);
            const [lx, ly] = pt(i, 1.22);
            return (
              <g key={d.stat} onMouseEnter={() => setHover(i)} onClick={() => setHover(i)} data-lock className="cursor-pointer">
                <circle cx={x} cy={y} r={hover === i ? 6 : 4} className={hover === i ? "fill-hot" : "fill-gold"} />
                <text x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" className={`font-mono text-[13px] uppercase ${hover === i ? "fill-white" : "fill-steel-400"}`}>
                  {d.stat}
                </text>
              </g>
            );
          })}
        </svg>
        <div>
          {diagnostics.map((d, i) => (
            <button key={d.stat} onMouseEnter={() => setHover(i)} onClick={() => setHover(i)}
              className={`flex w-full items-center gap-3 border-l-2 px-3 py-2 text-left transition-colors ${hover === i ? "border-hot bg-white/[0.03]" : "border-transparent"}`}>
              <span className={`font-display text-2xl font-bold ${d.grade === "S" ? "text-gold" : "text-white"}`}>{d.grade}</span>
              <span>
                <span className="block font-mono text-[11px] uppercase tracking-[0.18em] text-steel-200">{d.stat}</span>
                {hover === i && <span className="block text-xs text-steel-400">{d.why}</span>}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default function About() {
  const all = arsenal.flatMap((g) => g.items);
  const [armed, setArmed] = useState<number | null>(null);
  return (
    <section id="about" className="relative py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionHead code="07" kicker="pilot profile" title="Behind the mask" />

        <div className="grid items-start gap-14 lg:grid-cols-[440px_1fr]">
          <IdBadge />
          <Reveal>
            <p className="font-serif text-2xl leading-relaxed text-[#f3e6cf] md:text-[1.7rem]">
              A computer science engineer from {profile.location.split(",")[0]} who likes the part of software most people avoid: what happens <em className="gold-text">after</em> it ships.
            </p>
            <p className="mt-5 text-base leading-relaxed text-steel-300 md:text-lg">
              I build full-stack products, then armor them: containers, Kubernetes, GitOps, autoscaling, tracing. Lately I've been giving that infrastructure a brain, with AI agents that diagnose incidents and patch them, but only after a sandbox and a policy agree.
            </p>

            <div className="mt-8 rounded-2xl border border-white/10 bg-void-900/70 p-6">
              <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-gold">Currently studying at</p>
              <p className="mt-2 font-display text-xl font-semibold text-[#f3e6cf]">{education.school}</p>
              <p className="mt-1 text-steel-400">{education.degree} · {education.years}</p>
              <p className="mt-4 flex items-center gap-3 text-steel-200">
                CGPA <span className="gold-text font-display text-2xl font-bold">{education.cgpa}</span>
              </p>
            </div>

            <ul className="mt-8 space-y-4">
              {principles.map((p) => (
                <li key={p.n} className="flex gap-4 text-steel-300">
                  <span className="mt-1 text-gold">✦</span>
                  <span><strong className="text-[#f3e6cf]">{p.title}.</strong> {p.body}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>

        <div className="mt-20 flex flex-col gap-6 lg:flex-row [&>*:empty]:hidden [&>*]:min-w-0 [&>*]:flex-1">
          <Reveal><Radar /></Reveal>
          <Reveal delay={0.1}><ReactorActivity /></Reveal>
        </div>



        <Reveal className="mt-20">
          <div className="mb-6 flex flex-wrap items-end justify-between gap-3">
            <div>
              <div className="hud-label flex items-center gap-3"><span className="text-hot">◆</span> war machine arsenal</div>
              <h3 className="mt-2 font-display text-4xl font-bold text-[#f3e6cf]">Weapon <span className="gold-text font-serif font-normal italic">systems</span></h3>
            </div>
            <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-steel-500">hover or tap a system to arm it</p>
          </div>
          <div className="grid gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.06] sm:grid-cols-2 lg:grid-cols-4">
            {arsenal.map((g, i) => (
              <motion.button key={g.group} type="button" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                onMouseEnter={() => { if (armed !== i) { setArmed(i); sfx.lock(); } }} onClick={() => { setArmed(i); sfx.servo(); }}
                className={`group relative overflow-hidden p-5 text-left transition-colors ${armed === i ? "bg-hot/[0.12]" : "bg-void hover:bg-void-800"}`}>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-steel-500">{g.system}</span>
                  <span className={`font-mono text-[10px] uppercase tracking-[0.2em] ${armed === i ? "text-hot" : "text-steel-500"}`}>{armed === i ? "● armed" : "○ safe"}</span>
                </div>
                <div className="mt-2 font-display text-lg font-semibold uppercase tracking-wider text-white">{g.group}</div>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {g.items.map((t, k) => (
                    <motion.span key={t} className={`chip ${armed === i ? "border-gold/50 text-gold" : ""}`}
                      animate={armed === i ? { opacity: [0.3, 1], y: [4, 0] } : { opacity: 1, y: 0 }} transition={{ delay: armed === i ? k * 0.05 : 0 }}>{t}</motion.span>
                  ))}
                </div>
                {armed === i && <span className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-hot via-gold to-hot" />}
              </motion.button>
            ))}
            <div className="hidden items-center justify-center bg-void p-5 font-mono text-[11px] uppercase tracking-[0.2em] text-steel-500 lg:flex">+ always upgrading</div>
          </div>
        </Reveal>

        <div className="relative mt-10 overflow-hidden border-y border-white/[0.06] py-4 [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
          <div className="flex w-max animate-marquee gap-10 whitespace-nowrap font-display text-2xl uppercase text-steel-500/60">
            {[...all, ...all].map((s, i) => <span key={i} className="flex items-center gap-10">{s}<span className="text-gold/50">◆</span></span>)}
          </div>
        </div>

      </div>
    </section>
  );
}
