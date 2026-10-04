"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import Flow from "../Flow";
import SectionHead from "../ui/SectionHead";
import Reveal from "../ui/Reveal";
import LiveBadge from "../ui/LiveBadge";
import { otherBuilds, projects } from "@/data/portfolio";

export default function Work() {
  return (
    <section id="work" className="relative mx-auto max-w-7xl px-4 py-28 md:px-8">
      <SectionHead code="01" kicker="the armory of builds" title="The Suits">
        Three flagship builds, each engineered end to end. Every one says what it does, what it runs on, how it fits together, and what broke along the way.
      </SectionHead>

      <div className="space-y-24">
        {projects.map((p, idx) => (
          <article key={p.slug} className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
            <Reveal className={idx % 2 ? "lg:order-2" : ""}>
              <div className="hud-label flex flex-wrap items-center gap-3">
                <span className="text-arc">{p.mark}</span>
                <span>· {p.episode}</span>
                <LiveBadge live={p.live} />
              </div>
              <h3 className="mt-4 font-display text-4xl font-bold uppercase text-white md:text-5xl">{p.name}</h3>
              <p className="mt-2 font-serif text-2xl italic text-steel-200">{p.tagline}</p>
              <p className="mt-5 leading-relaxed text-steel-300">{p.summary}</p>

              <div className="mt-7 flex items-start gap-5 border-l-2 border-hot/70 pl-5">
                <motion.span
                  initial={{ opacity: 0, scale: 0.8 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  className="whitespace-nowrap font-display text-4xl font-bold text-white md:text-5xl"
                >
                  {p.stat.value}
                </motion.span>
                <span className="text-sm leading-snug text-steel-400">{p.stat.label}</span>
              </div>

              <div className="mt-7 flex flex-wrap gap-1.5">
                {p.stack.map((s) => <span key={s} className="chip">{s}</span>)}
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={`/work/${p.slug}`} className="btn-primary">Read the schematic →</Link>
                <a href={p.repo} target="_blank" rel="noreferrer" className="btn-ghost">Source ↗</a>
                {p.live ? (
                  <a href={p.live} target="_blank" rel="noreferrer" className="btn-ghost">Live ↗</a>
                ) : (
                  <span className="btn border-dashed border-white/10 text-steel-500">Live demo soon</span>
                )}
              </div>
            </Reveal>

            <Reveal delay={0.15} className={`self-center ${idx % 2 ? "lg:order-1" : ""}`}>
              <Flow nodes={p.flow} title={p.flowTitle} note={p.flowNote} />
            </Reveal>
          </article>
        ))}
      </div>

      <Reveal className="mt-28">
        <div className="hud-label mb-6 flex items-center gap-3"><span className="text-arc">+</span> other builds in the hangar</div>
        <div className="grid gap-4 md:grid-cols-3">
          {otherBuilds.map((b) => (
            <div key={b.name} className="hud-panel hud-corners group flex flex-col p-6 transition-colors hover:border-arc/30">
              <div className="flex items-center justify-between">
                <h4 className="font-display text-xl font-semibold uppercase text-white">{b.name}</h4>
                {b.live && <LiveBadge live={b.live} />}
              </div>
              <p className="mt-1 text-sm text-arc">{b.tagline}</p>
              <p className="mt-3 flex-1 text-sm leading-relaxed text-steel-400">{b.body}</p>
              <div className="mt-4 flex flex-wrap gap-1.5">{b.stack.map((s) => <span key={s} className="chip">{s}</span>)}</div>
              <div className="mt-5 flex gap-4 font-mono text-[11px] uppercase tracking-[0.18em]">
                <a href={b.repo} target="_blank" rel="noreferrer" className="text-steel-300 hover:text-arc">Source ↗</a>
                {b.live && <a href={b.live} target="_blank" rel="noreferrer" className="text-steel-300 hover:text-arc">Live ↗</a>}
              </div>
            </div>
          ))}
        </div>
      </Reveal>
    </section>
  );
}
