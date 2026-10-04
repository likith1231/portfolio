"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import SectionHead from "../ui/SectionHead";
import Reveal from "../ui/Reveal";
import { armory, diagnostics, principles, profile } from "@/data/portfolio";

const GRADE = { S: 1, A: 0.8, B: 0.6 } as const;

function Radar() {
  const [hover, setHover] = useState(0);
  const n = diagnostics.length, c = 150, r = 105;
  const pt = (i: number, k: number) => {
    const a = (Math.PI * 2 * i) / n - Math.PI / 2;
    return [c + Math.cos(a) * r * k, c + Math.sin(a) * r * k] as const;
  };
  const poly = diagnostics.map((d, i) => pt(i, GRADE[d.grade]).join(",")).join(" ");

  return (
    <div className="hud-panel hud-corners p-5">
      <div className="hud-label mb-2 flex justify-between"><span>suit diagnostics</span><span className="text-arc">scan complete</span></div>
      <div className="grid items-center gap-4 sm:grid-cols-[1fr_1fr]">
        <svg viewBox="-40 -10 380 320" className="w-full" role="img" aria-label="Diagnostics radar chart">
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
            className="fill-arc/15 stroke-arc"
            strokeWidth="1.5"
          />
          {diagnostics.map((d, i) => {
            const [x, y] = pt(i, GRADE[d.grade]);
            const [lx, ly] = pt(i, 1.22);
            return (
              <g key={d.stat} onMouseEnter={() => setHover(i)} onClick={() => setHover(i)} data-lock className="cursor-pointer">
                <circle cx={x} cy={y} r={hover === i ? 6 : 4} className={hover === i ? "fill-hot" : "fill-arc"} />
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
              <span className={`font-display text-2xl font-bold ${d.grade === "S" ? "text-warm" : "text-white"}`}>{d.grade}</span>
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
  const all = armory.flatMap((g) => g.items);
  return (
    <section id="about" className="relative py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionHead code="05" kicker="pilot profile" title="Behind the mask" />

        <div className="grid gap-10 lg:grid-cols-[1fr_1.1fr]">
          <Reveal>
            <div className="space-y-5 text-base leading-relaxed text-steel-300 md:text-lg">
              <p>
                I'm <span className="text-white">{profile.name}</span>, a computer science engineer in {profile.location.split(",")[0]} who likes the part of software most people avoid: what happens <em className="font-serif text-xl text-arc">after</em> it ships.
              </p>
              <p>
                I build full-stack products, then armor them: containers, Kubernetes, GitOps, autoscaling, tracing. Lately I've been giving that infrastructure a brain, with AI agents that diagnose incidents and patch them, but only after a sandbox and a policy agree.
              </p>
              <p>The model proposes. The tests decide. A human merges.</p>
            </div>
            <dl className="mt-8 grid grid-cols-1 gap-px bg-white/[0.06] sm:grid-cols-2">
              {[["Education", profile.education], ["Focus", profile.focus], ["Based", `${profile.location} · UTC+5:30`], ["Up next", profile.next]].map(([k, v]) => (
                <div key={k} className="bg-void p-4">
                  <dt className="hud-label">{k}</dt>
                  <dd className="mt-1 text-sm text-steel-100">{v}</dd>
                </div>
              ))}
            </dl>
          </Reveal>
          <Reveal delay={0.15}><Radar /></Reveal>
        </div>

        <Reveal className="mt-20">
          <div className="hud-label mb-6 flex items-center gap-3"><span className="text-arc">◆</span> the armory</div>
          <div className="grid gap-px bg-white/[0.06] sm:grid-cols-2 lg:grid-cols-4">
            {armory.map((g, i) => (
              <motion.div key={g.group} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: i * 0.06 }}
                className="group bg-void p-5 transition-colors hover:bg-void-800">
                <div className="flex items-center justify-between">
                  <span className="font-display text-sm font-semibold uppercase tracking-wider text-white">{g.group}</span>
                  <span className="font-mono text-[10px] text-steel-500 group-hover:text-arc">0{i + 1}</span>
                </div>
                <div className="mt-3 flex flex-wrap gap-1.5">{g.items.map((s) => <span key={s} className="chip">{s}</span>)}</div>
              </motion.div>
            ))}
            <div className="hidden items-center justify-center bg-void p-5 font-mono text-[11px] uppercase tracking-[0.2em] text-steel-500 lg:flex">+ always learning</div>
          </div>
        </Reveal>

        <div className="relative mt-10 overflow-hidden border-y border-white/[0.06] py-4 [mask-image:linear-gradient(90deg,transparent,black_10%,black_90%,transparent)]">
          <div className="flex w-max animate-marquee gap-10 whitespace-nowrap font-display text-2xl uppercase text-steel-500/60">
            {[...all, ...all].map((s, i) => <span key={i} className="flex items-center gap-10">{s}<span className="text-arc/50">◆</span></span>)}
          </div>
        </div>

        <Reveal className="mt-20">
          <div className="hud-label mb-6 flex items-center gap-3"><span className="text-arc">◆</span> operating protocols</div>
          <div className="grid gap-4 md:grid-cols-3">
            {principles.map((p) => (
              <div key={p.n} className="hud-panel hud-corners p-6">
                <div className="font-display text-5xl font-bold text-hot/80">{p.n}</div>
                <h3 className="mt-3 font-display text-xl font-semibold uppercase text-white">{p.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-steel-400">{p.body}</p>
              </div>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
