"use client";

import { useCallback, useEffect, useState } from "react";
import SectionHead from "../ui/SectionHead";
import Reveal from "../ui/Reveal";
import { missions, otherBuilds, projects } from "@/data/portfolio";

type Check = { ok: boolean; ms: number };
const services = [
  ...projects.map((p) => ({ name: p.name, live: p.live, repo: p.repo, flagship: true })),
  ...otherBuilds.map((b) => ({ name: b.name, live: b.live, repo: b.repo, flagship: false })),
];

async function ping(url: string): Promise<Check> {
  const t0 = performance.now();
  const ctrl = new AbortController();
  const timer = setTimeout(() => ctrl.abort(), 8000);
  try {
    // no-cors gives an opaque response, but it only resolves if the host answered.
    await fetch(url, { mode: "no-cors", cache: "no-store", signal: ctrl.signal });
    return { ok: true, ms: Math.round(performance.now() - t0) };
  } catch {
    return { ok: false, ms: 0 };
  } finally {
    clearTimeout(timer);
  }
}

// A status page for the projects. Live ones are pinged from the visitor's browser.
export default function StatusBoard() {
  const [checks, setChecks] = useState<Record<string, Check[]>>({});
  const [busy, setBusy] = useState(false);

  const runChecks = useCallback(async () => {
    setBusy(true);
    const live = services.filter((s) => s.live);
    const results = await Promise.all(live.map(async (s) => [s.name, await ping(s.live!)] as const));
    setChecks((c) => {
      const n = { ...c };
      for (const [name, r] of results) n[name] = [...(n[name] ?? []), r].slice(-24);
      return n;
    });
    setBusy(false);
  }, []);

  useEffect(() => {
    runChecks();
    const id = setInterval(runChecks, 30000);
    return () => clearInterval(id);
  }, [runChecks]);

  const liveCount = services.filter((s) => s.live).length;
  const allOk = services.filter((s) => s.live).every((s) => checks[s.name]?.at(-1)?.ok !== false);

  return (
    <section id="status" className="relative border-y border-white/[0.05] bg-void-900/40 py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionHead code="04" kicker="live · checked from your browser" title="System status">
          A status page for everything I've built. Live projects are pinged from your browser right now; the rest are on their way to the cloud.
        </SectionHead>

        <Reveal>
          <div className={`mb-4 flex flex-wrap items-center justify-between gap-3 border px-5 py-4 ${allOk ? "border-ok/30 bg-ok/[0.06]" : "border-caution/30 bg-caution/[0.06]"}`}>
            <div className="flex items-center gap-3">
              <span className={`h-2.5 w-2.5 rounded-full ${allOk ? "bg-ok" : "bg-caution"} animate-pulse`} />
              <span className="font-display text-lg font-semibold uppercase text-white">
                {allOk ? `${liveCount} live systems responding` : "Some systems are not responding"}
              </span>
            </div>
            <button onClick={runChecks} disabled={busy} className="font-mono text-[11px] uppercase tracking-[0.18em] text-arc hover:underline disabled:opacity-50">
              {busy ? "checking…" : "↻ re-check now"}
            </button>
          </div>

          <div className="hud-panel divide-y divide-white/[0.06]">
            {services.map((s) => {
              const hist = checks[s.name] ?? [];
              const last = hist.at(-1);
              return (
                <div key={s.name} className="grid items-center gap-3 px-5 py-4 md:grid-cols-[220px_1fr_170px]">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-display font-semibold uppercase text-white">{s.name}</span>
                      {s.flagship && <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-arc">flagship</span>}
                    </div>
                    <a href={s.live ?? s.repo} target="_blank" rel="noreferrer" className="font-mono text-[11px] text-steel-500 hover:text-arc">
                      {(s.live ?? s.repo).replace(/^https:\/\//, "")}
                    </a>
                  </div>

                  <div className="flex h-7 items-end gap-[3px]" aria-hidden>
                    {s.live
                      ? Array.from({ length: 24 }).map((_, i) => {
                          const c = hist[i - (24 - hist.length)];
                          return <span key={i} className={`h-full flex-1 ${!c ? "bg-white/[0.05]" : c.ok ? "bg-ok/70" : "bg-danger/70"}`} />;
                        })
                      : !s.flagship ? <span className="h-full flex-1 border border-dashed border-white/[0.06]" />
                      : Array.from({ length: 24 }).map((_, i) => (
                          <span key={i} className="h-full flex-1 bg-caution/20" style={{ animation: `pulse 2s ${i * 0.06}s infinite` }} />
                        ))}
                  </div>

                  <div className="text-left font-mono text-[11px] md:text-right">
                    {!s.live && s.flagship ? (
                      <span className="text-caution">◌ deploying soon</span>
                    ) : !s.live ? (
                      <span className="text-steel-500">○ source only</span>
                    ) : !last ? (
                      <span className="text-steel-500">checking…</span>
                    ) : last.ok ? (
                      <span className="text-ok">● operational · {last.ms}ms</span>
                    ) : (
                      <span className="text-danger">● unreachable</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-10 grid gap-4 md:grid-cols-[1fr_1.4fr]">
            <div>
              <div className="hud-label mb-3">mission log</div>
              <p className="text-sm leading-relaxed text-steel-400">What's done, what's running, what's next. The deploys are the current sprint.</p>
            </div>
            <ul className="hud-panel divide-y divide-white/[0.06] font-mono text-[12px]">
              {missions.map((m) => (
                <li key={m.label} className="flex items-center gap-4 px-4 py-3">
                  <span className={`w-20 shrink-0 uppercase tracking-[0.15em] ${m.state === "done" ? "text-ok" : m.state === "running" ? "text-arc" : "text-steel-500"}`}>
                    {m.state === "done" ? "✓ done" : m.state === "running" ? "▶ running" : "… queued"}
                  </span>
                  <span className={m.state === "done" ? "text-steel-400 line-through decoration-white/20" : "text-steel-100"}>{m.label}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
      <style>{`@keyframes pulse { 0%,100% { opacity: .35 } 50% { opacity: 1 } }`}</style>
    </section>
  );
}
