"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { bootLines, doom, profile, quotes } from "@/data/portfolio";
import { useHUD } from "./Shell";
import { sfx, sound } from "@/lib/sfx";

type Phase = "off" | "boot" | "ready" | "close" | "open";
const COILS = 10;
const BOOT_MS = 3600;

// The loader: an arc reactor assembles itself while J.A.R.V.I.S. boots the suit.
function AssemblingReactor({ p }: { p: number }) {
  const coils = Math.floor((p / 100) * COILS);
  const lit = p >= 100;
  return (
    <svg viewBox="0 0 400 400" className="h-full w-full overflow-visible" aria-hidden>
      <defs>
        <radialGradient id="intro-core">
          <stop offset="0%" stopColor="#fff" />
          <stop offset="40%" stopColor="#8fefff" />
          <stop offset="100%" stopColor="#8fefff" stopOpacity="0" />
        </radialGradient>
      </defs>
      {/* outer casing draws in with progress */}
      <circle cx="200" cy="200" r="182" fill="none" stroke="rgb(var(--gold))" strokeOpacity=".8" strokeWidth="2"
        pathLength={100} strokeDasharray="100" strokeDashoffset={100 - p} transform="rotate(-90 200 200)" />
      <circle cx="200" cy="200" r="168" fill="none" stroke="rgb(var(--hot))" strokeWidth="6"
        pathLength={100} strokeDasharray="12 4" strokeDashoffset={-p} opacity={0.4 + p / 200} />
      {Array.from({ length: 60 }).map((_, i) => (
        <line key={i} x1="200" y1="8" x2="200" y2={i % 5 ? 14 : 22} transform={`rotate(${i * 6} 200 200)`}
          stroke={i / 60 <= p / 100 ? "rgb(var(--gold))" : "#2a2422"} strokeWidth="1.5" />
      ))}
      {/* coils snap in one at a time */}
      {Array.from({ length: COILS }).map((_, i) => (
        <g key={i} transform={`rotate(${i * 36} 200 200)`}>
          <motion.g initial={false} animate={{ opacity: i < coils ? 1 : 0.08, y: i < coils ? 0 : -30 }} transition={{ type: "spring", stiffness: 260, damping: 16 }}>
            <path d="M184 66 L216 66 L209 112 L191 112 Z" fill={i < coils ? "#8fefff22" : "none"} stroke={i < coils ? "#8fefff" : "#3a3330"} strokeWidth="1.5" />
            {[76, 86, 96].map((y) => <line key={y} x1="188" x2="212" y1={y} y2={y} stroke="#8fefff" strokeOpacity={i < coils ? 0.6 : 0} />)}
          </motion.g>
        </g>
      ))}
      <circle cx="200" cy="200" r="88" fill="none" stroke="rgb(var(--gold))" strokeOpacity=".5" />
      <polygon points="200,148 245,174 245,226 200,252 155,226 155,174" fill="none" stroke="#8fefff" strokeOpacity={0.2 + p / 130} strokeWidth="2" />
      <motion.circle cx="200" cy="200" fill="url(#intro-core)" initial={false}
        animate={{ r: lit ? [58, 66, 58] : 18 + (p / 100) * 34, opacity: 0.25 + (p / 100) * 0.75 }}
        transition={lit ? { duration: 1.6, repeat: Infinity } : { duration: 0.2 }} />
      <circle cx="200" cy="200" r={lit ? 22 : 8} fill="#fff" opacity={0.4 + p / 170} />
    </svg>
  );
}

// The Doom loader: a rune circle is drawn, the iron mask forms inside it, then the eyes ignite.
const MASK = "M200 92 C150 92 122 120 120 170 C118 215 128 262 152 292 C168 312 184 322 200 324 C216 322 232 312 248 292 C272 262 282 215 280 170 C278 120 250 92 200 92 Z";
function FormingMask({ p }: { p: number }) {
  const lit = p >= 100;
  const glyphs = 24;
  return (
    <svg viewBox="0 0 400 400" className="h-full w-full overflow-visible" aria-hidden>
      <defs>
        <linearGradient id="doom-iron" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#b9bec4" />
          <stop offset="45%" stopColor="#6b6f75" />
          <stop offset="100%" stopColor="#24272a" />
        </linearGradient>
        <radialGradient id="doom-eye"><stop offset="0%" stopColor="#fff" /><stop offset="45%" stopColor="#3cff9a" /><stop offset="100%" stopColor="#3cff9a" stopOpacity="0" /></radialGradient>
      </defs>
      <g style={{ filter: "drop-shadow(0 0 6px #3cff9a)" }}>
        <circle cx="200" cy="200" r="186" fill="none" stroke="#3cff9a" strokeOpacity=".85" strokeWidth="2"
          pathLength={100} strokeDasharray="100" strokeDashoffset={100 - p} transform="rotate(-90 200 200)" />
        <circle cx="200" cy="200" r="150" fill="none" stroke="#3cff9a" strokeOpacity=".5" strokeWidth="1.5"
          pathLength={100} strokeDasharray="100" strokeDashoffset={-(100 - p)} transform="rotate(90 200 200)" />
        {Array.from({ length: glyphs }).map((_, i) => (
          <g key={i} transform={`rotate(${(i * 360) / glyphs} 200 200)`} opacity={i / glyphs <= p / 100 ? 1 : 0.06}>
            <path d={`M200 22 L200 44 M200 ${26 + (i % 4) * 3} L${i % 2 ? 208 : 192} ${34 + (i % 3) * 3}${i % 3 === 0 ? " M200 36 L206 42" : ""}`} stroke="#3cff9a" strokeWidth="2" strokeLinecap="round" fill="none" />
          </g>
        ))}
      </g>
      <motion.g animate={{ rotate: 360 }} transition={{ duration: 30, repeat: Infinity, ease: "linear" }} style={{ originX: "200px", originY: "200px" }}>
        <circle cx="200" cy="200" r="168" fill="none" stroke="#b08d3c" strokeOpacity=".45" strokeDasharray="2 10" />
      </motion.g>
      {/* the mask: its outline is traced by the sorcery, then the iron fills in */}
      <path d={MASK} fill="url(#doom-iron)" opacity={Math.max(0, (p - 45) / 55)} />
      <path d={MASK} fill="none" stroke="#3cff9a" strokeWidth="2" pathLength={100} strokeDasharray="100" strokeDashoffset={100 - Math.min(100, p * 1.6)} style={{ filter: "drop-shadow(0 0 8px #3cff9a)" }} />
      <g opacity={Math.max(0, (p - 60) / 40)} stroke="#1b1d1f" strokeWidth="3" fill="none">
        <path d="M150 150 Q200 136 250 150" />
        <path d="M200 182 L200 250" />
        <path d="M168 280 L232 280" strokeWidth="5" />
      </g>
      {[-1, 1].map((s) => (
        <g key={s} transform={`translate(${200 + s * 34} 176) rotate(${s * 11})`}>
          <ellipse rx="22" ry="7" fill="#050605" opacity={Math.max(0, (p - 55) / 45)} />
          <motion.ellipse rx="18" ry="4.5" fill="#3cff9a" initial={false} animate={{ opacity: lit ? [0.6, 1, 0.8, 1] : 0 }} transition={lit ? { duration: 1.6, repeat: Infinity } : {}}
            style={{ filter: "drop-shadow(0 0 10px #3cff9a) drop-shadow(0 0 22px #3cff9a)" }} />
        </g>
      ))}
    </svg>
  );
}

function Telemetry({ p, isDoom }: { p: number; isDoom?: boolean }) {
  const rows = isDoom ? [
    ["SORCERY", Math.min(100, p * 1.2)],
    ["IRON", Math.min(100, Math.max(0, p * 1.4 - 20))],
    ["RUNES", Math.min(100, Math.max(0, p * 1.6 - 50))],
    ["THRONE", Math.min(100, p * 1.05)],
  ] as const : [
    ["REPULSORS", Math.min(100, p * 1.2)],
    ["THRUSTERS", Math.min(100, Math.max(0, p * 1.4 - 20))],
    ["FLAPS", Math.min(100, Math.max(0, p * 1.6 - 50))],
    ["HUD", Math.min(100, p * 1.05)],
  ] as const;
  return (
    <div className="w-44 space-y-3 font-mono text-[10px] uppercase tracking-[0.2em] text-steel-400">
      {rows.map(([k, v]) => (
        <div key={k}>
          <div className="flex justify-between"><span>{k}</span><span className={v >= 100 ? "text-ok" : "text-gold"}>{v >= 100 ? "OK" : `${Math.round(v)}%`}</span></div>
          <div className="mt-1 h-[3px] bg-white/10"><div className="h-full bg-gold" style={{ width: `${v}%` }} /></div>
        </div>
      ))}
    </div>
  );
}

export default function Intro({ onDone }: { onDone: () => void }) {
  const [phase, setPhase] = useState<Phase>("off");
  const [p, setP] = useState(0);
  const [line, setLine] = useState(0);
  const [mobile, setMobile] = useState(false);
  const done = useRef(false);
  const isDoom = useHUD().mode === "doom";
  const lines = isDoom ? doom.bootLines : bootLines;

  const finish = () => {
    if (done.current) return;
    done.current = true;
    try { sessionStorage.setItem("suited", "1"); } catch {}
    document.documentElement.style.overflow = "";
    setPhase("off");
    onDone();
  };

  useEffect(() => {
    let seen = false;
    try { seen = !!sessionStorage.getItem("suited"); } catch {}
    if (seen || window.matchMedia("(prefers-reduced-motion: reduce)").matches) { finish(); return; }
    setMobile(window.innerWidth < 768);
    setPhase("boot");
    document.documentElement.style.overflow = "hidden";
    const t0 = performance.now();
    let id = 0;
    const loop = (t: number) => {
      // ease-out with a little stutter, like a real boot
      const x = Math.min(1, (t - t0) / BOOT_MS);
      const eased = 1 - Math.pow(1 - x, 2.2);
      setP(Math.min(100, Math.floor(eased * 100)));
      if (x < 1) id = requestAnimationFrame(loop);
      else setPhase("ready");
    };
    id = requestAnimationFrame(loop);
    const li = setInterval(() => setLine((l) => Math.min(l + 1, bootLines.length - 1)), BOOT_MS / bootLines.length);
    const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") finish(); };
    window.addEventListener("keydown", onKey);
    return () => { cancelAnimationFrame(id); clearInterval(li); window.removeEventListener("keydown", onKey); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => { if (p > 0 && p % 10 === 0) sfx.tick(); }, [p]);

  const suitUp = (withSound: boolean) => {
    sound.set(withSound);
    if (withSound) sfx.ignite();
    setPhase("close");
    setTimeout(() => sfx.faceplate(), 80);
    setTimeout(() => { setPhase("open"); sfx.servo(); }, 1250);
    setTimeout(finish, 2150);
  };

  if (phase === "off") return null;

  return (
    <div className="fixed inset-0 z-[95]">
      {/* boot + ready screens */}
      <AnimatePresence>
        {(phase === "boot" || phase === "ready") && (
          <motion.div className="absolute inset-0 flex flex-col items-center justify-center overflow-hidden bg-void px-4" exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
            <div className="scanlines pointer-events-none absolute inset-0" />
            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgb(var(--hot)/0.12),transparent_60%)]" />

            <div className="absolute left-4 top-4 font-mono text-[10px] uppercase tracking-[0.3em] text-steel-500 md:left-8 md:top-8">
              {isDoom ? `castle doom // ${profile.callsign} // the mask awakens` : `stark industries // ${profile.callsign} // suit boot`}
            </div>
            <button onClick={finish} className="absolute right-4 top-4 font-mono text-[10px] uppercase tracking-[0.3em] text-steel-500 hover:text-gold md:right-8 md:top-8">
              skip intro · esc
            </button>

            <div className="relative flex w-full max-w-5xl items-center justify-center gap-10">
              <div className="hidden lg:block"><Telemetry p={p} isDoom={isDoom} /></div>
              <motion.div className="relative h-[min(62vw,340px)] w-[min(62vw,340px)]"
                animate={phase === "ready" ? { scale: [1, 1.04, 1] } : {}} transition={{ duration: 2, repeat: Infinity }}>
                <div className="absolute inset-[22%] rounded-full blur-3xl" style={{ background: isDoom ? "#3cff9a" : "#8fefff", opacity: p / (isDoom ? 420 : 260) }} />
                {isDoom ? <FormingMask p={p} /> : <AssemblingReactor p={p} />}
              </motion.div>
              <div className="hidden w-44 font-mono text-[10px] uppercase tracking-[0.2em] text-steel-400 lg:block">
                <div className="text-gold">{isDoom ? "The Iron Mask" : "Mark 85"}</div>
                <div className="mt-1">serial 0x{(48879 + p * 97).toString(16).toUpperCase()}</div>
                <div className="mt-4">{isDoom ? `forge temp ${Math.round(30 + p * 14)}°C` : `core temp ${Math.round(30 + p * 2.6)}°C`}</div>
                <div>{isDoom ? `works sealed ${Math.round(p * 0.06)} / 6` : `output ${(p * 0.04).toFixed(2)} GJ/s`}</div>
                <div className="mt-4 text-steel-500">{isDoom ? "science and sorcery" : "palladium-free core"}</div>
              </div>
            </div>

            <div className="relative mt-8 text-center">
              <div className="font-display text-6xl font-bold tabular-nums text-white md:text-7xl">
                {String(p).padStart(3, "0")}<span className="text-gold">%</span>
              </div>
              <div className="mt-3 h-5 font-mono text-xs text-steel-300 md:text-sm">
                <AnimatePresence mode="wait">
                  <motion.span key={phase === "ready" ? "ready" : line} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }}>
                    {phase === "ready" ? (isDoom ? "Doom has awakened. Latveria awaits." : "Welcome home, sir. Suit is ready.") : lines[line]}
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>

            <div className="relative mt-8 flex h-28 flex-col items-center">
              <AnimatePresence>
                {phase === "ready" && (
                  <motion.div initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col items-center gap-3">
                    <div className="flex flex-wrap justify-center gap-3">
                      <button onClick={() => suitUp(true)} className="btn-hot">{isDoom ? "▶ Don the mask · sound on" : "▶ Suit up · sound on"}</button>
                      <button onClick={() => suitUp(false)} className="btn-ghost">Enter silently</button>
                    </div>
                    {mobile && <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-steel-500">Best on desktop. The suit still fits your phone.</p>}
                    {isDoom
                      ? <p className="font-serif text-base text-steel-400">“Doom does not wait. Doom arrives.” <span className="text-steel-500">— Victor von Doom</span></p>
                      : <p className="font-serif text-base italic text-steel-400">“{quotes.intro.text}” <span className="not-italic text-steel-500">— {quotes.intro.by}</span></p>}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* faceplate: closes over the screen, eyes light up, then opens onto the site */}
      {(phase === "close" || phase === "open") && (
        <>
          <motion.div className="absolute inset-x-0 top-0 h-1/2 overflow-hidden"
            initial={{ y: "-100%" }} animate={{ y: phase === "close" ? "0%" : "-105%" }}
            transition={{ duration: phase === "close" ? 0.45 : 0.7, ease: phase === "close" ? [0.7, 0, 0.84, 0] : [0.16, 1, 0.3, 1] }}>
            <div className="absolute inset-0" style={{ background: isDoom ? "linear-gradient(180deg,#06140d,#0f3d2a 70%,#0a2a1c)" : "linear-gradient(180deg,#5a0a10,rgb(var(--hot)) 70%,#7a0e15)" }} />
            <svg viewBox="0 0 1000 500" preserveAspectRatio="xMidYMax slice" className="absolute inset-0 h-full w-full">
              <path d="M300 500 L330 230 Q500 140 670 230 L700 500 Z" fill={isDoom ? "#6b6f75" : "rgb(var(--gold))"} />
              <path d="M330 230 Q500 140 670 230" fill="none" stroke="#000" strokeOpacity=".35" strokeWidth="4" />
              <motion.path d="M365 420 L470 438 L462 462 L372 446 Z" fill={isDoom ? "#3cff9a" : "#fff"} initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0.7, 1] }} transition={{ delay: 0.45, duration: 0.4 }} style={{ filter: `drop-shadow(0 0 16px ${isDoom ? "#3cff9a" : "#fff"})` }} />
              <motion.path d="M635 420 L530 438 L538 462 L628 446 Z" fill={isDoom ? "#3cff9a" : "#fff"} initial={{ opacity: 0 }} animate={{ opacity: [0, 1, 0.7, 1] }} transition={{ delay: 0.45, duration: 0.4 }} style={{ filter: `drop-shadow(0 0 16px ${isDoom ? "#3cff9a" : "#fff"})` }} />
              <line x1="500" y1="150" x2="500" y2="500" stroke="#000" strokeOpacity=".25" strokeWidth="3" />
            </svg>
          </motion.div>
          <motion.div className="absolute inset-x-0 bottom-0 h-1/2 overflow-hidden"
            initial={{ y: "100%" }} animate={{ y: phase === "close" ? "0%" : "105%" }}
            transition={{ duration: phase === "close" ? 0.45 : 0.7, ease: phase === "close" ? [0.7, 0, 0.84, 0] : [0.16, 1, 0.3, 1] }}>
            <div className="absolute inset-0" style={{ background: isDoom ? "linear-gradient(0deg,#06140d,#0f3d2a 70%,#0a2a1c)" : "linear-gradient(0deg,#5a0a10,rgb(var(--hot)) 70%,#7a0e15)" }} />
            <svg viewBox="0 0 1000 500" preserveAspectRatio="xMidYMin slice" className="absolute inset-0 h-full w-full">
              <path d="M300 0 L700 0 L660 210 Q500 300 340 210 Z" fill={isDoom ? "#6b6f75" : "rgb(var(--gold))"} />
              <path d="M420 120 L580 120" stroke="#000" strokeOpacity=".4" strokeWidth="6" strokeLinecap="round" />
              <line x1="500" y1="0" x2="500" y2="270" stroke="#000" strokeOpacity=".25" strokeWidth="3" />
            </svg>
          </motion.div>
          <motion.div className="pointer-events-none absolute inset-0 flex items-center justify-center font-mono text-xs uppercase tracking-[0.5em] text-white"
            initial={{ opacity: 0 }} animate={{ opacity: phase === "close" ? [0, 0, 1] : 0 }} transition={{ duration: 0.7 }}>
            {isDoom ? "doom awakens" : "hud online"}
          </motion.div>
        </>
      )}
    </div>
  );
}
