"use client";

import dynamic from "next/dynamic";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";
import SectionHead from "../ui/SectionHead";
import LiveBadge from "../ui/LiveBadge";
import { useHUD } from "../Shell";
import { suits } from "@/data/portfolio";
import { sfx } from "@/lib/sfx";

const SuitViewer = dynamic(() => import("../three/SuitViewer"), { ssr: false, loading: () => <div className="grid h-full place-items-center tile-label">powering up the suit…</div> });

// Strongest first: Mark 85 down to Mark 1.
const order = [...suits].sort((a, b) => b.mark - a.mark);

// The works: every project listed on the left; the one you hover or pick stands on the right in its suit.
export default function HallOfArmor() {
  const [i, setI] = useState(0);
  const { narrate } = useHUD();
  const s = order[i];

  useEffect(() => {
    if (i === 0) return;
    narrate(`Hall of Armor: ${s.suit} on the stand for ${s.name}. Power rating ${s.power}.`);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i]);

  const pick = (k: number) => { if (k !== i) { sfx.servo(); setI(k); } };

  return (
    <section id="armor" className="relative px-3 py-20 md:px-6">
      <div className="mx-auto max-w-[1400px]">
        <div className="tile mb-3 px-6 py-8 md:px-10">
          <SectionHead code="01" kicker="works" title="Six suits. One engineer." compact>
            Every project wears a suit from the films: the more advanced the build, the higher the Mark. Hover or tap a project to put its suit on the stand.
          </SectionHead>
        </div>

        <div className="grid gap-3 lg:grid-cols-12">
          <ol className="grid gap-3 lg:col-span-7">
            {order.map((x, k) => (
              <li key={x.slug}>
                <button onMouseEnter={() => pick(k)} onFocus={() => pick(k)} onClick={() => pick(k)}
                  className={`tile tile-hover w-full text-left transition-colors md:p-8 ${k === i ? "border-gold/40 bg-hot/[0.07]" : ""}`}>
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <h3 className="flex items-center gap-3 font-display text-2xl font-bold uppercase text-white md:text-3xl">
                      {x.name} <span className={`text-gold transition-transform ${k === i ? "translate-x-1" : ""}`}>⇢</span>
                    </h3>
                    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-hot">{x.suit}</span>
                  </div>
                  <p className="mt-2 text-steel-300">{x.tagline}</p>
                  <div className="mt-5 flex flex-wrap gap-x-6 gap-y-2 text-sm text-steel-200">
                    {x.stack.slice(0, 3).map((t) => <span key={t} className="flex items-center gap-2"><span className="text-gold">✦</span>{t}</span>)}
                  </div>
                </button>
              </li>
            ))}
          </ol>

          {/* the stand: sticky on desktop, shown above the list on phones via order */}
          <div className="order-first lg:order-none lg:col-span-5">
            <div className="tile overflow-hidden p-0 lg:sticky lg:top-20">
              <div className="relative h-[380px] md:h-[460px]">
                <SuitViewer suit={s} />
                <div className="pointer-events-none absolute left-5 top-5 tile-label">on the stand · rank {7 - s.mark} of 6</div>
              </div>
              <AnimatePresence mode="wait">
                <motion.div key={s.slug} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.25 }}
                  className="border-t border-white/[0.06] p-6">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-hot">{s.suit}</span><LiveBadge live={s.live} />
                  </div>
                  <p className="mt-3 text-sm leading-relaxed text-steel-300">{s.summary}</p>
                  <div className="mt-4">
                    <div className="flex justify-between font-mono text-[10px] uppercase tracking-[0.2em] text-steel-400"><span>power rating</span><span className="text-gold">{s.power}/100</span></div>
                    <div className="mt-1.5 h-1.5 bg-white/[0.06]">
                      <motion.div className="h-full bg-gradient-to-r from-hot to-gold" initial={{ width: 0 }} animate={{ width: `${s.power}%` }} transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }} />
                    </div>
                  </div>
                  <div className="mt-4 flex items-start gap-3 border-l-2 border-hot pl-3">
                    <span className="whitespace-nowrap font-display text-3xl font-bold text-white">{s.stat.value}</span>
                    <span className="text-xs leading-snug text-steel-400">{s.stat.label}</span>
                  </div>
                  <div className="mt-5 flex flex-wrap gap-2">
                    <Link href={`/work/${s.slug}`} className="btn-primary px-5 py-2.5">Open schematic →</Link>
                    <a href={s.repo} target="_blank" rel="noreferrer" className="btn-ghost px-5 py-2.5">Source ↗</a>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
