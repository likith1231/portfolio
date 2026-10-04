"use client";

import { useEffect, useState } from "react";
import Clock from "./ui/Clock";
import { useHUD } from "./Shell";
import { profile, socials } from "@/data/portfolio";

// Session uptime counts only while the tab is visible.
function Uptime() {
  const [s, setS] = useState(0);
  useEffect(() => {
    const id = setInterval(() => { if (document.visibilityState === "visible") setS((v) => v + 1); }, 1000);
    return () => clearInterval(id);
  }, []);
  const hh = String(Math.floor(s / 3600)).padStart(2, "0");
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, "0");
  const ss = String(s % 60).padStart(2, "0");
  return <span className="text-arc">{hh}:{mm}:{ss}</span>;
}

export default function Footer() {
  const { setPaletteOpen } = useHUD();
  return (
    <footer className="border-t border-white/[0.06] px-4 py-10 md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 font-mono text-[11px] text-steel-500 md:flex-row md:items-center md:justify-between">
        <div className="space-y-1">
          <div className="text-steel-300">{profile.name} © {new Date().getFullYear()}</div>
          <div>session uptime <Uptime /> · 0 incidents · it's <span className="text-steel-300"><Clock seconds={false} /></span> in Bengaluru</div>
          <div>Built with Next.js. Set in Chakra Petch, Inter and JetBrains Mono.</div>
        </div>
        <div className="flex flex-wrap items-center gap-5 uppercase tracking-[0.18em]">
          <button onClick={() => setPaletteOpen(true)} className="hover:text-arc">Terminal /</button>
          <a href={socials.github} target="_blank" rel="noreferrer" className="hover:text-arc">GitHub</a>
          <a href={socials.linkedin} target="_blank" rel="noreferrer" className="hover:text-arc">LinkedIn</a>
          <a href="#top" className="hover:text-arc">Back to top ↑</a>
        </div>
      </div>
      <p className="mx-auto mt-6 max-w-7xl font-mono text-[10px] text-steel-500/60">psst: ↑ ↑ ↓ ↓ ← → ← → B A</p>
    </footer>
  );
}
