"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import SectionHead from "../ui/SectionHead";
import Reveal from "../ui/Reveal";

type Line = { t: number; agent: string; text: string; tone?: "ok" | "bad" | "warn" };
type Scenario = {
  id: string;
  label: string;
  fault: string;
  alert: string;
  lines: Line[];
  file: string;
  diff: { kind: " " | "+" | "-"; text: string }[];
  outcome: "pr" | "abort";
  outcomeText: string;
};

const SCENARIOS: Scenario[] = [
  {
    id: "leak",
    label: "Memory leak",
    fault: "Hammer /leak until the cache grows without bound",
    alert: "ALERT PodMemoryHigh · sample-app · 91% of limit · firing",
    lines: [
      { t: 0, agent: "alertmanager", text: "webhook → POST /incidents (PodMemoryHigh)", tone: "bad" },
      { t: 500, agent: "reasoner", text: "pulling 15m of metrics, logs, and app.py" },
      { t: 1200, agent: "reasoner", text: "memory rises linearly with requests to /leak" },
      { t: 1900, agent: "reasoner", text: "root cause: module-level dict `_cache` never evicts", tone: "warn" },
      { t: 2600, agent: "patcher", text: "writing minimal diff: bound the cache with an LRU" },
      { t: 3300, agent: "validator", text: "sandbox up · applying patch · pytest -q" },
      { t: 4100, agent: "validator", text: "12 passed in 1.84s", tone: "ok" },
      { t: 4600, agent: "validator", text: "opa eval data.ghostops.allow → true", tone: "ok" },
      { t: 5200, agent: "github", text: "opened PR: fix(app): bound request cache with LRU", tone: "ok" },
    ],
    file: "sample-app/app.py",
    diff: [
      { kind: " ", text: "from flask import Flask" },
      { kind: "+", text: "from functools import lru_cache" },
      { kind: " ", text: "" },
      { kind: "-", text: "_cache = {}" },
      { kind: "-", text: "def lookup(key):" },
      { kind: "-", text: "    _cache[key] = expensive(key)" },
      { kind: "-", text: "    return _cache[key]" },
      { kind: "+", text: "@lru_cache(maxsize=1024)" },
      { kind: "+", text: "def lookup(key):" },
      { kind: "+", text: "    return expensive(key)" },
    ],
    outcome: "pr",
    outcomeText: "Patch proven in a sandbox. PR opened for a human to merge.",
  },
  {
    id: "ci",
    label: "Failing CI test",
    fault: "Ship a `+` where a `*` belongs",
    alert: "CI FAILED · test_multiply · expected 12, got 7",
    lines: [
      { t: 0, agent: "ci-webhook", text: "workflow_run failed → POST /incidents", tone: "bad" },
      { t: 500, agent: "reasoner", text: "reading pytest output and the last diff" },
      { t: 1200, agent: "reasoner", text: "assert multiply(3, 4) == 12  →  7", tone: "warn" },
      { t: 1900, agent: "reasoner", text: "root cause: math_utils.multiply returns a + b" },
      { t: 2600, agent: "patcher", text: "one-character diff in math_utils.py" },
      { t: 3300, agent: "validator", text: "sandbox up · applying patch · pytest -q" },
      { t: 4100, agent: "validator", text: "8 passed in 0.41s", tone: "ok" },
      { t: 4600, agent: "validator", text: "file is on the OPA allowlist", tone: "ok" },
      { t: 5200, agent: "github", text: "opened PR: fix(math): multiply should multiply", tone: "ok" },
    ],
    file: "sample-app/math_utils.py",
    diff: [
      { kind: " ", text: "def multiply(a, b):" },
      { kind: "-", text: "    return a + b" },
      { kind: "+", text: "    return a * b" },
    ],
    outcome: "pr",
    outcomeText: "One character, proven by the test suite, handed to a human.",
  },
  {
    id: "risky",
    label: "Risky patch",
    fault: "Let the model try to “fix” it by disabling auth",
    alert: "ALERT HighErrorRate · /api/orders · 38% 401s · firing",
    lines: [
      { t: 0, agent: "alertmanager", text: "webhook → POST /incidents (HighErrorRate)", tone: "bad" },
      { t: 500, agent: "reasoner", text: "401s spiked after token rotation at 14:02" },
      { t: 1200, agent: "patcher", text: "proposed: skip auth middleware on /api/orders", tone: "warn" },
      { t: 1900, agent: "validator", text: "sandbox up · applying patch · pytest -q" },
      { t: 2600, agent: "validator", text: "tests pass, so checking policy next" },
      { t: 3300, agent: "validator", text: "opa eval → deny: touches auth/ (protected path)", tone: "bad" },
      { t: 4000, agent: "ghostops", text: "aborted. incident logged with evidence for on-call", tone: "bad" },
    ],
    file: "backend/routes/orders.py",
    diff: [
      { kind: "-", text: "@router.get('/orders', dependencies=[Depends(require_user)])" },
      { kind: "+", text: "@router.get('/orders')" },
      { kind: " ", text: "async def list_orders(...):" },
    ],
    outcome: "abort",
    outcomeText: "Passing tests aren't enough. Policy said no, so nothing reached GitHub.",
  },
];

const STAGES = [
  { id: "detect", label: "Detect", agents: ["alertmanager", "ci-webhook"] },
  { id: "diagnose", label: "Diagnose", agents: ["reasoner"] },
  { id: "patch", label: "Patch", agents: ["patcher"] },
  { id: "validate", label: "Validate", agents: ["validator"] },
  { id: "ship", label: "Ship", agents: ["github", "ghostops"] },
];

const toneClass = (t?: Line["tone"]) => (t === "ok" ? "text-ok" : t === "bad" ? "text-danger" : t === "warn" ? "text-caution" : "text-steel-200");

// A scripted replay of the GhostOps pipeline. Visitors pick a fault and watch the agents handle it.
export default function IncidentDrill() {
  const [sc, setSc] = useState<Scenario>(SCENARIOS[0]);
  const [shown, setShown] = useState(0);
  const [running, setRunning] = useState(false);
  const [done, setDone] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const logRef = useRef<HTMLDivElement>(null);

  const clear = () => { timers.current.forEach(clearTimeout); timers.current = []; };
  useEffect(() => clear, []);
  useEffect(() => { logRef.current?.scrollTo({ top: logRef.current.scrollHeight, behavior: "smooth" }); }, [shown]);

  const run = (s: Scenario) => {
    clear();
    setSc(s); setShown(0); setDone(false); setRunning(true); setElapsed(0);
    s.lines.forEach((l, i) => timers.current.push(setTimeout(() => { setShown(i + 1); setElapsed(l.t); }, l.t + 300)));
    const end = s.lines[s.lines.length - 1].t + 900;
    timers.current.push(setTimeout(() => { setRunning(false); setDone(true); }, end));
  };

  const visible = sc.lines.slice(0, shown);
  const lastAgent = visible[visible.length - 1]?.agent;
  const stageIdx = STAGES.findIndex((s) => s.agents.includes(lastAgent ?? ""));
  const reached = (i: number) => shown > 0 && i <= stageIdx;

  return (
    <section id="drill" className="relative border-y border-white/[0.05] bg-void-900/40 py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionHead code="02" kicker="interactive · incident drill" title="Break something">
          Pick a fault and inject it. Watch an agent pipeline, modelled on GhostOps, detect it, find the root cause, write a patch, and prove it in a sandbox before anything reaches GitHub. One of these is supposed to fail.
        </SectionHead>

        <Reveal>
          <div className="mb-6 grid gap-2 sm:grid-cols-3">
            {SCENARIOS.map((s) => (
              <button
                key={s.id}
                onClick={() => run(s)}
                disabled={running}
                className={`group w-full border px-4 py-3 text-left transition-all disabled:opacity-40 ${sc.id === s.id && (running || done) ? "border-danger/70 bg-danger/10" : "border-white/10 hover:border-danger/50"}`}
              >
                <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-danger">⚠ inject fault</div>
                <div className="mt-1 font-display text-base font-semibold uppercase text-white">{s.label}</div>
                <div className="mt-0.5 text-xs text-steel-400">{s.fault}</div>
              </button>
            ))}
          </div>

          <div className="hud-panel hud-corners overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/[0.07] px-4 py-3">
              <div className="flex items-center gap-2 font-mono text-[11px]">
                <span className="h-2.5 w-2.5 rounded-full bg-hot/70" /><span className="h-2.5 w-2.5 rounded-full bg-warm/70" /><span className="h-2.5 w-2.5 rounded-full bg-ok/70" />
                <span className="ml-2 text-steel-400">ghostops://incident-drill</span>
              </div>
              <div className="font-mono text-[11px] text-steel-400">
                t+<span className="text-arc">{(elapsed / 1000).toFixed(1)}s</span>
              </div>
            </div>

            <div className="grid grid-cols-5 border-b border-white/[0.07]">
              {STAGES.map((s, i) => (
                <div key={s.id} className={`relative px-2 py-3 text-center font-mono text-[10px] uppercase tracking-[0.15em] transition-colors sm:text-[11px] ${reached(i) ? (done && sc.outcome === "abort" && i >= 3 ? "text-danger" : "text-arc") : "text-steel-500"}`}>
                  {s.label}
                  <span className={`absolute inset-x-0 bottom-0 h-0.5 transition-all duration-500 ${reached(i) ? (done && sc.outcome === "abort" && i >= 3 ? "bg-danger" : "bg-arc") : "bg-transparent"}`} />
                </div>
              ))}
            </div>

            <div className="grid lg:grid-cols-[1.2fr_1fr]">
              <div ref={logRef} className="h-[320px] overflow-y-auto border-b border-white/[0.07] p-4 font-mono text-[12px] leading-relaxed lg:border-b-0 lg:border-r">
                {shown === 0 && !running ? (
                  <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-steel-500">
                    <span className="text-3xl">⚡</span>
                    <span>Pick a fault above to start the drill.</span>
                  </div>
                ) : (
                  <>
                    <div className="mb-3 border border-danger/40 bg-danger/10 px-3 py-2 text-danger">{sc.alert}</div>
                    {visible.map((l, i) => (
                      <motion.div key={`${sc.id}-${i}`} initial={{ opacity: 0, x: -6 }} animate={{ opacity: 1, x: 0 }} className="flex gap-3">
                        <span className="w-12 shrink-0 text-steel-500">{(l.t / 1000).toFixed(1)}s</span>
                        <span className="w-24 shrink-0 text-arc/80">{l.agent}</span>
                        <span className={toneClass(l.tone)}>{l.text}</span>
                      </motion.div>
                    ))}
                    {running && <span className="ml-[9.5rem] inline-block h-3.5 w-2 animate-pulse bg-arc align-middle" />}
                  </>
                )}
              </div>

              <div className="flex flex-col p-4">
                <div className="hud-label mb-2 flex justify-between"><span>proposed diff</span><span className="normal-case tracking-normal text-steel-500">{shown > 4 ? sc.file : ""}</span></div>
                <div className="flex-1 overflow-x-auto bg-void p-3 font-mono text-[12px] leading-relaxed">
                  {shown > 4 ? sc.diff.map((d, i) => (
                    <motion.div key={`${sc.id}-d${i}`} initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: i * 0.05 }}
                      className={`whitespace-pre ${d.kind === "+" ? "bg-ok/10 text-ok" : d.kind === "-" ? "bg-danger/10 text-danger" : "text-steel-400"}`}>
                      {d.kind} {d.text}
                    </motion.div>
                  )) : <span className="text-steel-500">waiting for the patch generator…</span>}
                </div>
                <AnimatePresence>
                  {done && (
                    <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}
                      className={`mt-3 border px-4 py-3 ${sc.outcome === "pr" ? "border-ok/40 bg-ok/10" : "border-danger/40 bg-danger/10"}`}>
                      <div className={`font-display text-sm font-semibold uppercase ${sc.outcome === "pr" ? "text-ok" : "text-danger"}`}>
                        {sc.outcome === "pr" ? "✓ Pull request opened" : "✕ Aborted by policy"}
                      </div>
                      <div className="mt-1 text-xs text-steel-300">{sc.outcomeText}</div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>
          <p className="mt-4 text-xs text-steel-500">
            A scripted replay, so it runs in your browser with no API keys. The real pipeline uses CrewAI and Claude, and opened{" "}
            <a className="text-arc hover:underline" href="https://github.com/likith1231/ghostops/pull/3" target="_blank" rel="noreferrer">PR #3</a> and{" "}
            <a className="text-arc hover:underline" href="https://github.com/likith1231/ghostops/pull/4" target="_blank" rel="noreferrer">PR #4</a> on its own.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
