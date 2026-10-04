"use client";

import dynamic from "next/dynamic";
import { useRef } from "react";
import Gauntlet, { STONES, triggerSnap, useSnapState } from "../Gauntlet";
import Reveal from "../ui/Reveal";

const Gauntlet3D = dynamic(() => import("../three/Gauntlet3D"), { ssr: false, loading: () => <div className="grid h-full place-items-center hud-label">forging gauntlet…</div> });

const NAMES = ["Space", "Mind", "Reality", "Power", "Time", "Soul"];

// The Snap, front and centre: a big gauntlet and one button.
export default function SnapSection() {
  const { lit, phase } = useSnapState();
  const hand = useRef<HTMLDivElement>(null);
  const busy = phase !== "idle";

  return (
    <section id="snap" className="relative overflow-hidden py-28">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgb(var(--hot)/0.16),transparent_60%)]" />
      <div className="relative mx-auto grid max-w-7xl items-center gap-12 px-4 md:px-8 lg:grid-cols-[1fr_1.1fr]">
        <div ref={hand} data-snap-ignore className="relative mx-auto aspect-[4/5] w-full max-w-[460px]">
          <div className="absolute inset-[12%] rounded-full blur-3xl transition-colors duration-500"
            style={{ background: lit ? `${STONES[lit - 1]}55` : "rgb(var(--gold) / 0.12)" }} />
          <div className="relative h-full w-full"><Gauntlet3D lit={lit} phase={phase} /></div>
        </div>

        <Reveal>
          <div className="hud-label flex items-center gap-3"><span className="text-hot">◆</span> the snap · avengers: endgame</div>
          <h2 className="mt-4 font-display text-5xl font-bold uppercase leading-[0.95] text-white md:text-7xl">
            One snap.<br /><span className="gold-text">Half this page.</span>
          </h2>
          <p className="mt-6 max-w-lg text-lg leading-relaxed text-steel-300">
            Six stones. One gauntlet. Snap your fingers and half of whatever is on your screen turns to dust. Don't worry, it all comes back.
          </p>

          <div className="mt-8 flex flex-wrap gap-2" data-snap-ignore>
            {NAMES.map((n, i) => (
              <span key={n} className="flex items-center gap-2 border px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.18em] transition-colors"
                style={{ borderColor: i < lit ? STONES[i] : "rgba(255,255,255,.1)", color: i < lit ? STONES[i] : undefined }}>
                <span className="h-2 w-2 rounded-full" style={{ background: STONES[i], boxShadow: i < lit ? `0 0 10px ${STONES[i]}` : undefined }} />{n}
              </span>
            ))}
          </div>

          <button data-snap-ignore disabled={busy} onClick={() => triggerSnap(hand.current)}
            className="group relative mt-10 inline-flex items-center gap-4 overflow-hidden border border-hot bg-hot px-8 py-4 font-display text-lg font-bold uppercase tracking-[0.2em] text-white shadow-[0_0_50px_rgb(var(--hot)/0.5)] transition hover:brightness-125 disabled:opacity-60">
            <span className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition-transform duration-700 group-hover:translate-x-full" />
            <Gauntlet lit={busy ? lit : 6} className="relative h-8 w-8" />
            <span className="relative">{busy ? "Inevitable…" : "Snap"}</span>
          </button>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-steel-500">sound on for the full effect</p>
        </Reveal>
      </div>
    </section>
  );
}
