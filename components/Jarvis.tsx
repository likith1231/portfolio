"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { useHUD, type LogLine } from "./Shell";
import { SECTIONS } from "./Nav";
import { suits } from "@/data/portfolio";
import { sfx } from "@/lib/sfx";

// Background chores J.A.R.V.I.S. reports while the visitor reads. Purely ambient.
const IDLE = [
  () => `Repulsor calibration on the ${suits[Math.floor(Math.random() * suits.length)].suit}: nominal`,
  () => `Arc reactor output steady at ${(3.2 + Math.random() * 0.3).toFixed(2)} GJ/s`,
  () => "Rerouting auxiliary power to the HUD",
  () => "Polishing the Mark 85 faceplate",
  () => "DUM-E is holding the fire extinguisher again. Monitoring.",
  () => `Thruster temperature ${Math.round(410 + Math.random() * 60)}°C, within limits`,
  () => "Scanning visitor… friendly. Probably a recruiter.",
  () => `Flaps and stabilisers: ${Math.random() > 0.15 ? "aligned" : "re-aligning"}`,
  () => "Backing up suit firmware to the cloud",
  () => "Checking GitHub for new commits from the pilot",
  () => "Counter-measures primed. Nobody asked, but they are.",
];

const toneClass = (t?: LogLine["tone"]) => (t === "ok" ? "text-ok" : t === "warn" ? "text-caution" : t === "bad" ? "text-danger" : "text-steel-200");
const hhmmss = (ms: number) => new Date(ms).toTimeString().slice(0, 8);

function useFps() {
  const [fps, setFps] = useState(60);
  useEffect(() => {
    let frames = 0, last = performance.now(), id = 0;
    const loop = (t: number) => {
      frames++;
      if (t - last > 1000) { setFps(Math.round((frames * 1000) / (t - last))); frames = 0; last = t; }
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, []);
  return fps;
}

// J.A.R.V.I.S. as a running system, not a chatbot: a live log, real gauges, and protocols you can trigger.
export default function Jarvis() {
  const { jarvisOpen, setJarvisOpen, narrate, log, introDone, toggleMode, mode, emp, empActive, unibeam, replayIntro, setBriefOpen } = useHUD();
  const fps = useFps();
  const [loadMs, setLoadMs] = useState<number | null>(null);
  const [visited, setVisited] = useState<Set<string>>(new Set());
  const [ticker, setTicker] = useState<LogLine | null>(null);
  const body = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  // boot log + real page timings
  useEffect(() => {
    if (!introDone || started.current) return;
    started.current = true;
    const nav = performance.getEntriesByType("navigation")[0] as PerformanceNavigationTiming | undefined;
    const ms = nav ? Math.round(nav.domContentLoadedEventEnd) : null;
    setLoadMs(ms);
    narrate("J.A.R.V.I.S. online. All suit systems green.", "ok");
    if (ms) setTimeout(() => narrate(`Page assembled in ${ms} ms`, "ok"), 900);
    setTimeout(() => narrate(`${suits.length} suits registered. ${suits.filter((s) => s.live).length} live, ${suits.filter((s) => !s.live && s.flagship).length} awaiting cloud deploy.`, "info"), 1800);
  }, [introDone, narrate]);

  // idle chores
  useEffect(() => {
    if (!introDone) return;
    const id = setInterval(() => { if (document.visibilityState === "visible") narrate(IDLE[Math.floor(Math.random() * IDLE.length)]()); }, 9000);
    return () => clearInterval(id);
  }, [introDone, narrate]);

  // live suits are pinged now and then; latency is real
  useEffect(() => {
    if (!introDone) return;
    const live = suits.filter((s) => s.live);
    if (!live.length) return;
    let i = 0;
    const ping = async () => {
      const s = live[i++ % live.length];
      const t0 = performance.now();
      try {
        await fetch(s.live!, { mode: "no-cors", cache: "no-store" });
        narrate(`Pinged ${s.suit} · ${s.name}: ${Math.round(performance.now() - t0)} ms`, "ok");
      } catch {
        narrate(`${s.suit} · ${s.name} did not answer the ping`, "warn");
      }
    };
    const first = setTimeout(ping, 4000);
    const id = setInterval(ping, 25000);
    return () => { clearTimeout(first); clearInterval(id); };
  }, [introDone, narrate]);

  // which sections the visitor has explored
  useEffect(() => {
    const io = new IntersectionObserver((es) => es.forEach((e) => e.isIntersecting && setVisited((v) => (v.has(e.target.id) ? v : new Set(v).add(e.target.id)))), { threshold: 0.3 });
    const t = setTimeout(() => SECTIONS.forEach((s) => { const el = document.getElementById(s.id); if (el) io.observe(el); }), 1000);
    return () => { clearTimeout(t); io.disconnect(); };
  }, []);

  // newest line flashes in the ticker next to the orb
  useEffect(() => {
    const last = log[log.length - 1];
    if (!last) return;
    setTicker(last);
    const t = setTimeout(() => setTicker((x) => (x?.id === last.id ? null : x)), 4500);
    return () => clearTimeout(t);
  }, [log]);

  useEffect(() => { body.current?.scrollTo({ top: body.current.scrollHeight, behavior: "smooth" }); }, [log, jarvisOpen]);

  const protocol = (name: string, fn: () => void, tone: LogLine["tone"] = "warn") => { narrate(`${name} initiated by visitor`, tone); fn(); };

  const gauges = [
    { k: "Frame rate", v: `${fps} fps`, pct: Math.min(100, (fps / 60) * 100) },
    { k: "Page assembly", v: loadMs ? `${loadMs} ms` : "…", pct: loadMs ? Math.max(8, 100 - loadMs / 40) : 0 },
    { k: "Sectors explored", v: `${visited.size}/${SECTIONS.length}`, pct: (visited.size / SECTIONS.length) * 100 },
  ];

  return (
    <>
      {/* orb + ticker */}
      <div className="fixed bottom-5 right-5 z-[76] flex items-center gap-3" data-snap-ignore>
        <AnimatePresence>
          {ticker && !jarvisOpen && (
            <motion.button key={ticker.id} onClick={() => setJarvisOpen(true)} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }}
              className="hidden max-w-[340px] border border-white/10 bg-void/90 px-3 py-2 text-left backdrop-blur md:block">
              <span className="block font-mono text-[9px] uppercase tracking-[0.25em] text-gold">J.A.R.V.I.S. · {hhmmss(ticker.at)}</span>
              <span className={`block truncate font-mono text-[11px] ${toneClass(ticker.tone)}`}>{ticker.text}</span>
            </motion.button>
          )}
        </AnimatePresence>
        <button onClick={() => { sfx.lock(); setJarvisOpen(!jarvisOpen); }} aria-label="J.A.R.V.I.S. systems"
          className="relative grid h-14 w-14 shrink-0 place-items-center rounded-full border border-gold/60 bg-void/90 shadow-[0_0_30px_rgb(var(--hot)/0.35)] backdrop-blur">
          <span className="absolute inset-1.5 animate-spin-slow rounded-full border border-dashed border-gold/60" />
          <span className="absolute inset-3 rounded-full border border-hot/50" style={{ animation: "spin 6s linear infinite reverse" }} />
          <span className="h-3.5 w-3.5 rounded-full bg-white shadow-[0_0_16px_6px_#8fefff]" />
        </button>
      </div>

      <AnimatePresence>
        {jarvisOpen && (
          <motion.aside initial={{ opacity: 0, y: 20, scale: 0.96 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20, scale: 0.96 }}
            className="hud-panel hud-corners fixed bottom-24 right-4 z-[77] flex max-h-[min(620px,76vh)] w-[min(440px,calc(100vw-2rem))] flex-col bg-void/95 shadow-[0_0_80px_rgb(var(--hot)/0.25)]"
            aria-label="J.A.R.V.I.S. systems">
            <div className="flex items-center justify-between border-b border-white/[0.07] px-4 py-3">
              <div className="flex items-center gap-3">
                <span className="relative grid h-9 w-9 place-items-center rounded-full border border-gold/50">
                  <span className="absolute inset-1 animate-spin-slow rounded-full border border-dashed border-hot/60" />
                  <span className="h-2.5 w-2.5 rounded-full bg-white shadow-[0_0_10px_3px_#8fefff]" />
                </span>
                <div>
                  <div className="font-display text-sm font-semibold uppercase tracking-[0.2em] text-white">J.A.R.V.I.S.</div>
                  <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-steel-500">just a rather very intelligent system</div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.2em] text-ok"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ok" />active</span>
                <button onClick={() => setJarvisOpen(false)} className="font-mono text-xs text-steel-400 hover:text-white" aria-label="Close">✕</button>
              </div>
            </div>

            {/* waveform */}
            <div className="flex h-10 items-center justify-center gap-[3px] border-b border-white/[0.07]" aria-hidden>
              {Array.from({ length: 36 }).map((_, i) => (
                <span key={i} className="w-[3px] rounded-full bg-gold/70" style={{ height: "30%", animation: `wave 1.${i % 9}s ease-in-out ${i * 0.04}s infinite alternate` }} />
              ))}
            </div>

            <div className="grid grid-cols-3 gap-px border-b border-white/[0.07] bg-white/[0.06]">
              {gauges.map((g) => (
                <div key={g.k} className="bg-void px-3 py-2.5">
                  <div className="font-mono text-[9px] uppercase tracking-[0.18em] text-steel-500">{g.k}</div>
                  <div className="font-display text-base font-semibold text-white">{g.v}</div>
                  <div className="mt-1 h-[3px] bg-white/10"><div className="h-full bg-gradient-to-r from-hot to-gold transition-all" style={{ width: `${g.pct}%` }} /></div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-between px-4 pt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-steel-500">
              <span>activity log</span><span>{log.length} events</span>
            </div>
            <div ref={body} className="min-h-[140px] flex-1 space-y-1 overflow-y-auto px-4 py-2 font-mono text-[11.5px] leading-relaxed" data-lenis-prevent>
              {log.map((l) => (
                <motion.div key={l.id} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} className="flex gap-3">
                  <span className="shrink-0 text-steel-500">{hhmmss(l.at)}</span>
                  <span className={toneClass(l.tone)}>{l.text}</span>
                </motion.div>
              ))}
              <span className="inline-block h-3 w-1.5 animate-pulse bg-gold align-middle" />
            </div>

            <div className="border-t border-white/[0.07] p-3">
              <div className="mb-2 font-mono text-[10px] uppercase tracking-[0.2em] text-steel-500">protocols</div>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => protocol(mode === "mark" ? "War Machine protocol" : "Classic Mark protocol", toggleMode, "info")} className="chip py-2 text-left hover:border-gold/50 hover:text-gold">⬢ {mode === "mark" ? "War Machine" : "Classic red & gold"}</button>
                <button onClick={() => protocol("Unibeam", unibeam)} className="chip py-2 text-left hover:border-gold/50 hover:text-gold">◉ Unibeam</button>
                <button onClick={() => protocol("EMP discharge", emp, "bad")} disabled={empActive} className="chip py-2 text-left hover:border-danger/50 hover:text-danger disabled:opacity-40">⚡ EMP</button>
                <button onClick={() => protocol("Clean Slate: suit reboot", () => { setJarvisOpen(false); replayIntro(); })} className="chip py-2 text-left hover:border-gold/50 hover:text-gold">↻ Reboot suit</button>
                <button onClick={() => protocol("Infinity Gauntlet engaged", () => { setJarvisOpen(false); setTimeout(() => window.dispatchEvent(new Event("stark:snap")), 300); }, "bad")} className="chip py-2 text-left hover:border-gold/50 hover:text-gold">✋ The Snap</button>
                <button onClick={() => protocol("Briefing for Ms. Potts", () => { setJarvisOpen(false); setBriefOpen(true); }, "info")} className="chip py-2 text-left hover:border-gold/50 hover:text-gold">▤ Recruiter brief</button>
              </div>
            </div>
            <style>{`@keyframes wave { from { height: 15% } to { height: 90% } }`}</style>
          </motion.aside>
        )}
      </AnimatePresence>
    </>
  );
}
