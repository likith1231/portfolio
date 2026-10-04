"use client";

import { createContext, useCallback, useContext, useEffect, useState } from "react";
import Boot from "./Boot";
import Nav from "./Nav";
import Reticle from "./ui/Reticle";
import ScrollProgress from "./ui/ScrollProgress";
import SmoothScroll from "./ui/SmoothScroll";
import CommandPalette from "./CommandPalette";
import RecruiterBrief from "./RecruiterBrief";

type Mode = "stealth" | "mark";
type HUD = {
  mode: Mode;
  toggleMode: () => void;
  paletteOpen: boolean;
  setPaletteOpen: (v: boolean) => void;
  briefOpen: boolean;
  setBriefOpen: (v: boolean) => void;
  unibeam: () => void;
};

const Ctx = createContext<HUD | null>(null);
export const useHUD = () => {
  const c = useContext(Ctx);
  if (!c) throw new Error("useHUD outside Shell");
  return c;
};

const KONAMI = ["ArrowUp", "ArrowUp", "ArrowDown", "ArrowDown", "ArrowLeft", "ArrowRight", "ArrowLeft", "ArrowRight", "b", "a"];

export default function Shell({ children }: { children: React.ReactNode }) {
  const [mode, setMode] = useState<Mode>("stealth");
  const [paletteOpen, setPaletteOpen] = useState(false);
  const [briefOpen, setBriefOpen] = useState(false);
  const [beam, setBeam] = useState(0);

  useEffect(() => {
    try {
      const saved = localStorage.getItem("hud-mode");
      if (saved === "mark" || saved === "stealth") setMode(saved);
    } catch {}
  }, []);

  useEffect(() => {
    document.documentElement.dataset.mode = mode;
    try { localStorage.setItem("hud-mode", mode); } catch {}
  }, [mode]);

  const toggleMode = useCallback(() => setMode((m) => (m === "stealth" ? "mark" : "stealth")), []);
  const unibeam = useCallback(() => setBeam((b) => b + 1), []);

  useEffect(() => {
    let seq: string[] = [];
    const onKey = (e: KeyboardEvent) => {
      const typing = (e.target as HTMLElement)?.closest("input, textarea");
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
      if (e.key === "Escape") { setPaletteOpen(false); setBriefOpen(false); }
      if (!typing) {
        seq = [...seq, e.key].slice(-KONAMI.length);
        if (seq.join() === KONAMI.join()) { unibeam(); seq = []; }
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [unibeam]);

  return (
    <Ctx.Provider value={{ mode, toggleMode, paletteOpen, setPaletteOpen, briefOpen, setBriefOpen, unibeam }}>
      <SmoothScroll />
      <Boot />
      <ScrollProgress />
      <Reticle />
      <Nav />
      {children}
      <CommandPalette />
      <RecruiterBrief />
      {beam > 0 && (
        <div key={beam} className="pointer-events-none fixed inset-0 z-[90] flex items-center justify-center">
          <div className="unibeam h-[40vmin] w-[40vmin] rounded-full bg-arc blur-2xl" />
        </div>
      )}
    </Ctx.Provider>
  );
}
