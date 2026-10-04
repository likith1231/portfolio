"use client";

import { motion } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import SectionHead from "../ui/SectionHead";
import Reveal from "../ui/Reveal";
import { useHUD } from "../Shell";
import { sfx } from "@/lib/sfx";

const MIN = 2, MAX = 8, TARGET = 60, PER_POD = 40, HISTORY = 60;

type Sample = { p95: number; pods: number; cpu: number };

// A toy model of the ResilientCommerce HPA: 2–8 pods at 60% CPU, +2 pods per step up,
// slow scale-down. The "default pool" toggle reproduces the real lesson: requests queue on the
// database, CPU stays low, and the autoscaler never reacts.
function step(users: number, pods: number, tuned: boolean, calm: number) {
  const load = users / (pods * PER_POD);
  let cpu = Math.min(100, load * 100);
  let p95: number;
  if (!tuned) {
    cpu = Math.min(cpu, 6 + Math.random() * 4);
    p95 = 0.06 + Math.max(0, users - 40) * 0.09;
  } else {
    p95 = 0.08 + Math.max(0, load - 0.7) * 5.5;
  }
  p95 = Math.max(0.03, p95 * (0.92 + Math.random() * 0.16));
  cpu = Math.max(1, cpu * (0.95 + Math.random() * 0.1));

  const desired = Math.min(MAX, Math.max(MIN, Math.ceil((pods * cpu) / TARGET)));
  let next = pods;
  let nextCalm = calm;
  if (desired > pods) { next = Math.min(desired, pods + 2); nextCalm = 0; }
  else if (desired < pods) { nextCalm = calm + 1; if (nextCalm >= 6) { next = pods - 1; nextCalm = 0; } }
  else nextCalm = 0;
  return { cpu, p95, pods: next, calm: nextCalm };
}

export default function RushLab() {
  const { narrate } = useHUD();
  const [users, setUsers] = useState(20);
  const [tuned, setTuned] = useState(true);
  const [pods, setPods] = useState(MIN);
  const [cpu, setCpu] = useState(10);
  const [hist, setHist] = useState<Sample[]>(() => Array.from({ length: HISTORY }, () => ({ p95: 0.08, pods: MIN, cpu: 10 })));
  const [rushing, setRushing] = useState(false);
  const [events, setEvents] = useState<string[]>([]);
  const st = useRef({ users, tuned, pods: MIN, calm: 0, tick: 0 });
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  st.current.users = users;
  st.current.tuned = tuned;

  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setVisible(e.isIntersecting));
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const id = setInterval(() => {
      const s = st.current;
      s.tick++;
      const r = step(s.users, s.pods, s.tuned, s.calm);
      if (r.pods !== s.pods) {
        const msg = `t+${s.tick * 15}s  HPA ${r.pods > s.pods ? "scaled up" : "scaled down"} ${s.pods} → ${r.pods} pods (cpu ${Math.round(r.cpu)}%)`;
        setEvents((ev) => [msg, ...ev].slice(0, 5));
        sfx.servo();
        narrate(`Stress test: autoscaler moved ${s.pods} → ${r.pods} pods`, r.pods > s.pods ? "warn" : "info");
      }
      s.pods = r.pods; s.calm = r.calm;
      setPods(r.pods); setCpu(r.cpu);
      setHist((h) => [...h.slice(1), { p95: r.p95, pods: r.pods, cpu: r.cpu }]);
    }, 500);
    return () => clearInterval(id);
  }, [visible]);

  const rush = () => {
    if (rushing) return;
    sfx.alert();
    narrate("Booking rush incoming: 250 virtual users. Bracing the cluster.", "bad");
    setRushing(true);
    const ramp = [60, 120, 180, 250, 250, 250, 250, 250, 250, 250, 250, 200, 140, 80, 40, 20];
    ramp.forEach((u, i) => setTimeout(() => { setUsers(u); if (i === ramp.length - 1) setRushing(false); }, i * 900));
  };

  const last = hist[hist.length - 1];
  const maxP = Math.max(3, ...hist.map((h) => h.p95));
  const W = 600, H = 160;
  const pts = (f: (s: Sample) => number, max: number) =>
    hist.map((s, i) => `${(i / (HISTORY - 1)) * W},${H - (f(s) / max) * (H - 10) - 4}`).join(" ");

  return (
    <section id="lab" ref={ref} className="relative mx-auto max-w-7xl px-4 py-28 md:px-8">
      <SectionHead code="04" kicker="stress test · rush lab" title="Survive the rush">
        Slots open, and everyone hits “Book Now” at once. This simulator runs a small model of the ResilientCommerce autoscaler: 2 to 8 pods at 60% CPU. Trigger a rush, then switch the database pool to the default and watch what really happened in the first load test.
      </SectionHead>

      <Reveal>
        <div className="grid gap-4 lg:grid-cols-[320px_1fr]">
          <div className="hud-panel hud-corners flex flex-col gap-6 p-5">
            <div>
              <div className="hud-label mb-3 flex justify-between"><span>virtual users</span><span className="text-gold">{users}</span></div>
              <input type="range" min={0} max={300} value={users} onChange={(e) => setUsers(+e.target.value)} disabled={rushing}
                className="w-full accent-[rgb(var(--gold))]" aria-label="Virtual users" />
            </div>

            <button onClick={rush} disabled={rushing} className="btn-primary justify-center disabled:opacity-50">
              {rushing ? "Rush in progress…" : "⚡ Trigger booking rush"}
            </button>

            <div>
              <div className="hud-label mb-3">database pool</div>
              <div className="grid grid-cols-2 border border-white/10">
                {[{ v: false, l: "Default · 5" }, { v: true, l: "Tuned · 20" }].map((o) => (
                  <button key={o.l} onClick={() => setTuned(o.v)}
                    className={`py-2 font-mono text-[11px] uppercase tracking-[0.12em] transition-colors ${tuned === o.v ? (o.v ? "bg-gold/15 text-gold" : "bg-danger/15 text-danger") : "text-steel-400 hover:text-white"}`}>
                    {o.l}
                  </button>
                ))}
              </div>
              <p className="mt-3 text-xs leading-relaxed text-steel-400">
                {tuned
                  ? "Connections keep up, so CPU rises with load and the HPA adds pods."
                  : "Requests queue for a DB connection. Latency explodes at ~0% CPU, so the autoscaler never notices. (Real run: p95 18.89s.)"}
              </p>
            </div>

            <div className="grid grid-cols-3 gap-2 border-t border-white/[0.07] pt-5 text-center">
              <div><div className="hud-label">pods</div><div className="font-display text-2xl font-bold text-white">{pods}</div></div>
              <div><div className="hud-label">cpu</div><div className="font-display text-2xl font-bold text-white">{Math.round(cpu)}%</div></div>
              <div><div className="hud-label">p95</div><div className={`font-display text-2xl font-bold ${last.p95 > 2 ? "text-danger" : last.p95 > 0.8 ? "text-caution" : "text-ok"}`}>{last.p95 < 1 ? `${Math.round(last.p95 * 1000)}ms` : `${last.p95.toFixed(1)}s`}</div></div>
            </div>
          </div>

          <div className="hud-panel hud-corners p-5">
            <div className="hud-label mb-4 flex flex-wrap items-center justify-between gap-2">
              <span>deployment/aethermed · namespace resilientcommerce</span>
              <span>1 tick = 15s</span>
            </div>
            <div className="grid grid-cols-4 gap-2 sm:grid-cols-8">
              {Array.from({ length: MAX }).map((_, i) => {
                const on = i < pods;
                return (
                  <motion.div key={i} animate={{ opacity: on ? 1 : 0.25, scale: on ? 1 : 0.94 }}
                    className={`relative h-20 overflow-hidden border ${on ? "border-gold/50 bg-gold/[0.06]" : "border-dashed border-white/10"}`}>
                    <div className="p-2 font-mono text-[10px] text-steel-400">pod-{i + 1}</div>
                    {on && (
                      <motion.div className={`absolute inset-x-0 bottom-0 ${cpu > 80 ? "bg-danger/45" : cpu > TARGET ? "bg-caution/40" : "bg-gold/35"}`}
                        animate={{ height: `${Math.min(100, cpu)}%` }} transition={{ type: "spring", stiffness: 80, damping: 20 }} />
                    )}
                    <div className={`absolute bottom-1.5 left-2 font-mono text-[10px] ${on ? "text-white" : "text-steel-500"}`}>{on ? "Running" : "—"}</div>
                  </motion.div>
                );
              })}
            </div>

            <div className="mt-6">
              <div className="mb-2 flex gap-5 font-mono text-[10px] uppercase tracking-[0.18em]">
                <span className="text-danger">— p95 latency</span>
                <span className="text-gold">— pods</span>
                <span className="text-steel-500">-- 60% target</span>
              </div>
              <svg viewBox={`0 0 ${W} ${H}`} className="h-40 w-full" preserveAspectRatio="none">
                {[0.25, 0.5, 0.75].map((g) => <line key={g} x1="0" x2={W} y1={H * g} y2={H * g} className="stroke-white/5" />)}
                <polyline points={pts((s) => s.cpu, 100)} fill="none" className="stroke-white/15" strokeWidth="1" />
                <line x1="0" x2={W} y1={H - 0.6 * (H - 10) - 4} y2={H - 0.6 * (H - 10) - 4} className="stroke-steel-500" strokeDasharray="4 6" />
                <polyline points={pts((s) => s.p95, maxP)} fill="none" className="stroke-danger" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                <polyline points={pts((s) => s.pods, MAX)} fill="none" className="stroke-gold" strokeWidth="2" vectorEffect="non-scaling-stroke" />
              </svg>
            </div>

            <div className="mt-4 min-h-[92px] border-t border-white/[0.07] pt-3 font-mono text-[11px] text-steel-400">
              {events.length === 0 ? <span className="text-steel-500">kubectl get events -w · waiting for a scaling event…</span> :
                events.map((e, i) => <div key={e + i} className={i === 0 ? "text-gold" : ""}>{e}</div>)}
            </div>
          </div>
        </div>
      </Reveal>
    </section>
  );
}
