"use client";

import { createContext, useCallback, useContext, useEffect, useRef, useState } from "react";
import Intro from "./Intro";
import Nav from "./Nav";
import Reticle from "./ui/Reticle";
import ScrollProgress from "./ui/ScrollProgress";
import SmoothScroll from "./ui/SmoothScroll";
import FlightHUD from "./FlightHUD";
import Repulsors from "./Repulsors";
import Jarvis from "./Jarvis";
import RecruiterBrief from "./RecruiterBrief";
import Snap from "./Snap";
import Portal from "./Portal";
import { sfx, sound } from "@/lib/sfx";

export type Mode = "stark" | "doom";
export type LogLine = { id: number; at: number; text: string; tone?: "ok" | "warn" | "bad" | "info" };
type HUD = {
  mode: Mode;
  toggleMode: () => void;
  soundOn: boolean;
  setSound: (v: boolean) => void;
  jarvisOpen: boolean;
  setJarvisOpen: (v: boolean) => void;
  briefOpen: boolean;
  setBriefOpen: (v: boolean) => void;
  unibeam: () => void;
  emp: () => void;
  empActive: boolean;
  narrate: (text: string, tone?: LogLine["tone"]) => void;
  log: LogLine[];
  introDone: boolean;
  replayIntro: () => void;
};

const Ctx = createContext<HUD | null>(null);
export const useHUD = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useHUD outside Shell");
  return c;
};

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

export default function Shell({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>("stark");
  const [portal, setPortal] = useState<{ n: number; to: Mode } | null>(null);
  const [soundOn, setSoundOn] = useState(false);
  const [jarvisOpen, setJarvisOpen] = useState(false);
  const [briefOpen, setBriefOpen] = useState(false);
  const [beam, setBeam] = useState(0);
  const [empActive, setEmpActive] = useState(false);
  const [log, setLog] = useState<LogLine[]>([]);
  const [introDone, setIntroDone] = useState(false);
  const [introKey, setIntroKey] = useState(0);
  const toastId = useRef(0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("hud-mode");
      // Older visits saved "mark" / "warmachine"; War Machine mode is gone, so both land on Stark.
      if (saved === "doom") setMode("doom");
    } catch {}
    return sound.subscribe(setSoundOn);
  }, []);

  useEffect(() => {
    document.documentElement.dataset.mode = mode;
    try { localStorage.setItem("hud-mode", mode); } catch {}
  }, [mode]);

  // Switching universes plays a glitch/portal transition; the skin swaps while the screen is covered.
  const busy = useRef(false);
  const toggleMode = useCallback(() => {
    if (busy.current) return;
    busy.current = true;
    const to: Mode = document.documentElement.dataset.mode === "doom" ? "stark" : "doom";
    sfx.portal();
    setPortal((p) => ({ n: (p?.n ?? 0) + 1, to }));
    setTimeout(() => setMode(to), 480);
    setTimeout(() => { setPortal(null); busy.current = false; }, 1250);
  }, []);
  const setSound = useCallback((v: boolean) => sound.set(v), []);
  const unibeam = useCallback(() => { sfx.ignite(); setBeam((b) => b + 1); }, []);

  const emp = useCallback(() => {
    if (document.documentElement.classList.contains("emp")) return;
    sfx.boom();
    document.documentElement.classList.add("emp");
    setEmpActive(true);
    setTimeout(() => { document.documentElement.classList.remove("emp"); setEmpActive(false); sfx.boot(); }, 5000);
  }, []);

  // Everything J.A.R.V.I.S. does goes into one running log.
  const narrate = useCallback((text: string, tone: LogLine["tone"] = "info") => {
    const id = ++toastId.current;
    setLog((l) => [...l.slice(-40), { id, at: Date.now(), text, tone }]);
  }, []);

  const replayIntro = useCallback(() => {
    try { sessionStorage.removeItem("suited"); } catch {}
    window.scrollTo(0, 0);
    setIntroDone(false);
    setIntroKey((k) => k + 1);
  }, []);

  useEffect(() => {
    let seq: string[] = [];
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement)?.closest("input, textarea");
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        setJarvisOpen((v) => !v);
      }
      if (e.key === "Escape") { setJarvisOpen(false); setBriefOpen(false); }
      if (!typing) {
        seq = [...seq, e.key].slice(-KONAMI.length);
        if (seq.join() === KONAMI.join()) { unibeam(); seq = []; }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [unibeam]);

  return (
    <Ctx.Provider
      value={{ mode, toggleMode, soundOn, setSound, jarvisOpen, setJarvisOpen, briefOpen, setBriefOpen, unibeam, emp, empActive, narrate, log, introDone, replayIntro }}
    >
      <SmoothScroll />
      <Intro key={introKey} onDone={() => setIntroDone(true)} />
      <ScrollProgress />
      <Reticle />
      <Repulsors />
      <FlightHUD />
      <Nav />
      {children}
      <Jarvis />
      <Snap />
      <RecruiterBrief />
      {portal && <Portal key={portal.n} to={portal.to} />}

      {empActive && (
        <div className="pointer-events-none fixed inset-x-0 top-20 z-[85] flex justify-center">
          <div className="border border-danger/60 bg-void/90 px-5 py-2 font-mono text-xs uppercase tracking-[0.25em] text-danger">
            ⚡ EMP discharged · all systems frozen · rebooting in 5s
          </div>
        </div>
      )}

      {beam > 0 && (
        <div key={beam} className="pointer-events-none fixed inset-0 z-[90] flex items-center justify-center">
          <div className="unibeam h-[40vmin] w-[40vmin] rounded-full bg-white blur-2xl" style={{ boxShadow: "0 0 200px 80px #8fefff" }} />
        </div>
      )}
    </Ctx.Provider>
  );
}
