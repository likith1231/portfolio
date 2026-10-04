"use client";

import { useEffect, useState } from "react";
import { socials } from "@/data/portfolio";

type Day = { date: string; count: number; level: number };
const LEVEL = ["bg-white/[0.04]", "bg-hot/30", "bg-hot/60", "bg-gold/70", "bg-gold"];

// GitHub contributions for the last year, drawn as reactor output. Loaded live; hidden if the API is down.
export default function ReactorActivity() {
  const [days, setDays] = useState<Day[] | null>(null);
  const [total, setTotal] = useState(0);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    const ctrl = new AbortController();
    fetch(`https://github-contributions-api.jogruber.de/v4/${socials.githubUser}?y=last`, { signal: ctrl.signal })
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then((d: { total: Record<string, number>; contributions: Day[] }) => {
        setDays(d.contributions);
        setTotal(d.total.lastYear ?? d.contributions.reduce((a, c) => a + c.count, 0));
      })
      .catch(() => setFailed(true));
    return () => ctrl.abort();
  }, []);

  if (failed) return null;

  const weeks: Day[][] = [];
  if (days) {
    const pad = new Date(days[0].date).getDay();
    const all = [...Array(pad).fill(null), ...days] as (Day | null)[];
    for (let i = 0; i < all.length; i += 7) weeks.push(all.slice(i, i + 7) as Day[]);
  }
  let streak = 0;
  if (days) for (let i = days.length - 1; i >= 0; i--) { if (days[i].count > 0) streak++; else if (i < days.length - 1) break; }

  return (
    <div className="hud-panel hud-corners p-5">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <div className="hud-label">reactor output · github, last 12 months</div>
          <div className="mt-1 font-display text-2xl font-bold text-white">
            {days ? total.toLocaleString() : "…"} <span className="text-base font-normal text-steel-400">contributions</span>
            {streak > 1 && <span className="ml-3 font-mono text-xs text-gold">{streak}-day streak</span>}
          </div>
        </div>
        <a href={socials.github} target="_blank" rel="noreferrer" className="font-mono text-[11px] uppercase tracking-[0.18em] text-gold hover:underline">@{socials.githubUser} ↗</a>
      </div>
      <div className="overflow-x-auto pb-1">
        <div className="flex w-max gap-[3px]">
          {days
            ? weeks.map((w, i) => (
                <div key={i} className="flex flex-col gap-[3px]">
                  {w.map((d, k) => <span key={k} title={d ? `${d.date}: ${d.count}` : ""} className={`h-[11px] w-[11px] ${d ? LEVEL[d.level] : "bg-transparent"}`} />)}
                </div>
              ))
            : Array.from({ length: 53 }).map((_, i) => (
                <div key={i} className="flex flex-col gap-[3px]">{Array.from({ length: 7 }).map((_, k) => <span key={k} className="h-[11px] w-[11px] animate-pulse bg-white/[0.04]" />)}</div>
              ))}
        </div>
      </div>
      <div className="mt-3 flex items-center justify-end gap-1.5 font-mono text-[10px] text-steel-500">
        idle {LEVEL.map((c) => <span key={c} className={`h-[10px] w-[10px] ${c}`} />)} overdrive
      </div>
    </div>
  );
}
