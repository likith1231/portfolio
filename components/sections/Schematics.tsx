"use client";

import Link from "next/link";
import Flow from "../Flow";
import SectionHead from "../ui/SectionHead";
import Reveal from "../ui/Reveal";
import LiveBadge from "../ui/LiveBadge";
import { flagships } from "@/data/portfolio";

// The three flagship suits, opened up: what's inside and how the parts connect.
export default function Schematics() {
  return (
    <section id="schematics" className="relative mx-auto max-w-7xl px-4 py-28 md:px-8">
      <SectionHead code="02" kicker="blueprints · flagship suits" title="Schematics">
        The three heaviest suits, opened up. Each diagram is the real pipeline inside the project.
      </SectionHead>

      <div className="space-y-24">
        {flagships.map((p, idx) => (
          <article key={p.slug} className="grid gap-8 lg:grid-cols-[1fr_1.1fr] lg:gap-12">
            <Reveal className={idx % 2 ? "lg:order-2" : ""}>
              <div className="hud-label flex flex-wrap items-center gap-3">
                <span className="text-hot">{p.suit}</span><LiveBadge live={p.live} />
              </div>
              <h3 className="mt-4 font-display text-4xl font-bold uppercase text-white md:text-5xl">{p.name}</h3>
              <p className="mt-2 font-serif text-2xl italic text-gold">{p.tagline}</p>
              <p className="mt-5 leading-relaxed text-steel-300">{p.problem}</p>
              <ul className="mt-6 space-y-2 font-mono text-[13px]">
                {p.highlights.slice(0, 3).map((h) => (
                  <li key={h} className="flex gap-3 text-steel-300"><span className="text-hot">›</span>{h}</li>
                ))}
              </ul>
              <div className="mt-8 flex flex-wrap gap-3">
                <Link href={`/work/${p.slug}`} className="btn-primary">Full schematic →</Link>
                <a href={p.repo} target="_blank" rel="noreferrer" className="btn-ghost">Source ↗</a>
              </div>
            </Reveal>
            <Reveal delay={0.15} className={`self-center ${idx % 2 ? "lg:order-1" : ""}`}>
              <Flow nodes={p.flow} title={p.flowTitle} note={p.flowNote} />
            </Reveal>
          </article>
        ))}
      </div>
    </section>
  );
}
