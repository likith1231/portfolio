"use client";

import { useEffect, useRef, useState } from "react";
import SectionHead from "../ui/SectionHead";
import Reveal from "../ui/Reveal";
import { sfx } from "@/lib/sfx";
import { useHUD } from "../Shell";
import { doom } from "@/data/portfolio";

const BUGS = ["NullPointer", "MemoryLeak", "HTTP 500", "CORS", "Race cond.", "N+1 query", "Flaky test", "OOMKilled", "Deadlock", "Timeout"];
const ROUND = 30;
const RANKS: [number, string][] = [[0, "DUM-E"], [80, "Mark 1"], [200, "Mark 7"], [350, "War Machine"], [550, "Hulkbuster"], [700, "Mark 85"], [900, "Iron Legion"]];
// Doom's trials rank you by title instead of by suit.
const rankFor = (s: number, isDoom = false) => [...(isDoom ? doom.ranks : RANKS)].reverse().find(([min]) => s >= min)![1];
const isDoomNow = () => typeof document !== "undefined" && document.documentElement.dataset.mode === "doom";

type Drone = { x: number; y: number; vx: number; vy: number; r: number; label: string; hp: number; boss: boolean; hit: number };
type Burst = { x: number; y: number; t: number; big: boolean };

export default function TrainingRoom() {
  const { narrate, mode } = useHUD();
  const isDoom = mode === "doom";
  const narrateRef = useRef(narrate);
  narrateRef.current = narrate;
  const canvas = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<"idle" | "play" | "over">("idle");
  const [score, setScore] = useState(0);
  const [time, setTime] = useState(ROUND);
  const [lives, setLives] = useState(3);
  const [best, setBest] = useState(0);
  const [combo, setCombo] = useState(1);
  const game = useRef({ drones: [] as Drone[], bursts: [] as Burst[], score: 0, lives: 3, combo: 1, lastHit: 0, spawn: 0, start: 0, running: false, w: 0, h: 0 });

  useEffect(() => {
    try { setBest(Number(localStorage.getItem("training-best") || 0)); } catch {}
  }, []);

  // draw loop
  useEffect(() => {
    const c = canvas.current;
    if (!c) return;
    const ctx = c.getContext("2d")!;
    let id = 0;
    const resize = () => {
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      const r = c.getBoundingClientRect();
      c.width = r.width * dpr; c.height = r.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      game.current.w = r.width; game.current.h = r.height;
    };
    resize();
    window.addEventListener("resize", resize);
    let prev = performance.now();

    const loop = (t: number) => {
      const g = game.current;
      const dt = Math.min(0.05, (t - prev) / 1000);
      prev = t;
      const { w, h } = g;
      ctx.clearRect(0, 0, w, h);

      // grid floor
      ctx.strokeStyle = "rgba(255,255,255,0.04)";
      for (let x = 0; x < w; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, h); ctx.stroke(); }
      for (let y = 0; y < h; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(w, y); ctx.stroke(); }

      // production core
      const cx = w / 2, cy = h - 40;
      ctx.save();
      ctx.shadowColor = isDoomNow() ? "#3cff9a" : "#8fefff"; ctx.shadowBlur = 30;
      ctx.fillStyle = "#ffffff"; ctx.beginPath(); ctx.arc(cx, cy, 14, 0, Math.PI * 2); ctx.fill();
      ctx.restore();
      ctx.strokeStyle = isDoomNow() ? "rgba(176,141,60,.7)" : "rgba(232,176,74,.7)"; ctx.lineWidth = 2;
      ctx.beginPath(); ctx.arc(cx, cy, 26, 0, Math.PI * 2); ctx.stroke();
      ctx.fillStyle = "rgba(207,200,195,.6)"; ctx.font = "10px monospace"; ctx.textAlign = "center";
      ctx.fillText("PRODUCTION", cx, cy + 44 > h ? cy - 34 : cy + 44);

      if (g.running) {
        const elapsed = (t - g.start) / 1000;
        const left = Math.max(0, ROUND - elapsed);
        setTime(Math.ceil(left));
        g.spawn -= dt;
        if (g.spawn <= 0) {
          const boss = Math.random() < 0.08;
          const x = 30 + Math.random() * (w - 60);
          const speed = (40 + elapsed * 3.2 + Math.random() * 30) * (boss ? 0.6 : 1);
          const ang = Math.atan2(cy - (-20), cx - x);
          g.drones.push({ x, y: -20, vx: Math.cos(ang) * speed * 0.35 + (Math.random() - 0.5) * 40, vy: Math.sin(ang) * speed, r: boss ? 30 : 18, label: boss ? "PROD OUTAGE" : BUGS[Math.floor(Math.random() * BUGS.length)], hp: boss ? 3 : 1, boss, hit: 0 });
          g.spawn = Math.max(0.28, 0.95 - elapsed * 0.022);
        }
        if (left <= 0 || g.lives <= 0) {
          g.running = false;
          setState("over");
          sfx[g.lives <= 0 ? "alert" : "success"]();
          narrateRef.current(g.lives <= 0 ? `Training failed: production went down at ${g.score} points.` : `Training complete: ${g.score} points, rank ${rankFor(g.score, isDoomNow())}.`, g.lives <= 0 ? "bad" : "ok");
          try { const b = Number(localStorage.getItem("training-best") || 0); if (g.score > b) { localStorage.setItem("training-best", String(g.score)); setBest(g.score); } } catch {}
        }
      }

      // drones
      for (const d of g.drones) {
        if (g.running) {
          // steer toward production
          const a = Math.atan2(cy - d.y, cx - d.x);
          d.vx += Math.cos(a) * 20 * dt; d.vy += Math.sin(a) * 6 * dt;
          d.x += d.vx * dt; d.y += d.vy * dt;
          if (d.x < d.r || d.x > w - d.r) d.vx *= -1;
        }
        d.hit = Math.max(0, d.hit - dt * 4);
        ctx.save();
        ctx.translate(d.x, d.y);
        ctx.rotate(t / 600);
        ctx.beginPath();
        for (let k = 0; k < 6; k++) { const aa = (k / 6) * Math.PI * 2; ctx.lineTo(Math.cos(aa) * d.r, Math.sin(aa) * d.r); }
        ctx.closePath();
        ctx.fillStyle = d.hit > 0 ? "#ffffff" : isDoomNow() ? (d.boss ? "rgba(90,40,120,.9)" : "rgba(90,40,120,.55)") : d.boss ? "rgba(204,26,42,.9)" : "rgba(204,26,42,.55)";
        ctx.strokeStyle = isDoomNow() ? (d.boss ? "#b08d3c" : "rgba(200,150,255,.9)") : d.boss ? "#e8b04a" : "rgba(255,120,120,.9)";
        ctx.lineWidth = d.boss ? 3 : 1.5;
        ctx.fill(); ctx.stroke();
        ctx.restore();
        ctx.fillStyle = "#ffe9c4"; ctx.font = `${d.boss ? 11 : 9}px monospace`; ctx.textAlign = "center";
        ctx.fillText(d.label, d.x, d.y - d.r - 6);
      }
      if (g.running) {
        const before = g.drones.length;
        g.drones = g.drones.filter((d) => Math.hypot(d.x - cx, d.y - cy) > 24 && d.y < h + 40);
        const leaked = before - g.drones.length;
        if (leaked > 0) { g.lives -= leaked; g.combo = 1; setLives(Math.max(0, g.lives)); setCombo(1); sfx.alert(); }
      }

      // bursts
      g.bursts = g.bursts.filter((b) => t - b.t < 450);
      for (const b of g.bursts) {
        const k = (t - b.t) / 450;
        ctx.save();
        ctx.globalAlpha = 1 - k;
        ctx.strokeStyle = "#ffffff"; ctx.shadowColor = isDoomNow() ? "#3cff9a" : "#8fefff"; ctx.shadowBlur = 20; ctx.lineWidth = 3;
        ctx.beginPath(); ctx.arc(b.x, b.y, 8 + k * (b.big ? 70 : 40), 0, Math.PI * 2); ctx.stroke();
        ctx.restore();
      }
      if (onScreen) id = requestAnimationFrame(loop);
    };
    // Only animate while the game is on screen.
    let onScreen = false;
    const io = new IntersectionObserver(([e]) => {
      const was = onScreen;
      onScreen = e.isIntersecting;
      if (onScreen && !was) { prev = performance.now(); id = requestAnimationFrame(loop); }
      if (!onScreen) cancelAnimationFrame(id);
    });
    io.observe(c);
    return () => { cancelAnimationFrame(id); io.disconnect(); window.removeEventListener("resize", resize); };
  }, []);

  const start = () => {
    const g = game.current;
    Object.assign(g, { drones: [], bursts: [], score: 0, lives: 3, combo: 1, spawn: 0.3, start: performance.now(), running: true });
    setScore(0); setLives(3); setCombo(1); setTime(ROUND); setState("play");
    sfx.boot();
  };

  const fire = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const g = game.current;
    if (!g.running) return;
    const r = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - r.left, y = e.clientY - r.top;
    const now = performance.now();
    g.bursts.push({ x, y, t: now, big: false });
    let hit = false;
    for (const d of g.drones) {
      if (Math.hypot(d.x - x, d.y - y) < d.r + 14) {
        d.hp--; d.hit = 1; hit = true;
        if (d.hp <= 0) {
          g.combo = now - g.lastHit < 900 ? Math.min(5, g.combo + 1) : 1;
          g.lastHit = now;
          g.score += (d.boss ? 50 : 10) * g.combo;
          g.bursts.push({ x: d.x, y: d.y, t: now, big: true });
        }
        break;
      }
    }
    g.drones = g.drones.filter((d) => d.hp > 0);
    setScore(g.score); setCombo(g.combo);
    if (isDoomNow()) hit ? sfx.hexBig() : sfx.hex();
    else hit ? sfx.boom() : sfx.repulsor();
  };

  return (
    <section id="training" className="relative border-y border-white/[0.05] bg-void-900/40 py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionHead code="05" kicker="training room · mini game" title="Shoot the bugs">
          {isDoom
            ? "Vermin are storming the castle's production servers. Click or tap to cast mystic bolts. Bosses take three hits. You have thirty seconds and three wards."
            : "Bug-drones are heading for production. Click or tap to fire your repulsors. Bosses take three hits. You have thirty seconds and three lives."}
        </SectionHead>

        <Reveal>
          <div className="hud-panel hud-corners overflow-hidden">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/[0.07] px-4 py-3 font-mono text-[11px] uppercase tracking-[0.18em]">
              <span className="text-steel-400">score <span className="text-lg text-white">{score}</span> {combo > 1 && <span className="ml-2 text-gold">×{combo} combo</span>}</span>
              <span className="text-steel-400">time <span className={time <= 5 && state === "play" ? "text-danger" : "text-white"}>{time}s</span></span>
              <span className="text-steel-400">integrity {Array.from({ length: 3 }).map((_, i) => <span key={i} className={i < lives ? "text-hot" : "text-steel-500"}>■</span>)}</span>
              <span className="text-steel-400">best <span className="text-gold">{best}</span></span>
            </div>
            <div className="relative h-[420px] md:h-[480px]">
              <canvas ref={canvas} onPointerDown={fire} className="absolute inset-0 h-full w-full touch-none" data-lock />
              {state !== "play" && (
                <div className="absolute inset-0 grid place-items-center bg-void/70 backdrop-blur-[2px]">
                  <div className="px-4 text-center">
                    {state === "over" ? (
                      <>
                        <div className="hud-label text-gold">{lives <= 0 ? "production is down" : "round complete"}</div>
                        <div className="mt-2 font-display text-6xl font-bold text-white">{score}</div>
                        <div className="mt-2 font-mono text-sm text-steel-300">rank: <span className="text-gold">{rankFor(score, isDoom)}</span>{score >= best && score > 0 ? " · new best!" : ""}</div>
                      </>
                    ) : (
                      <>
                        <div className="hud-label">simulation ready</div>
                        <div className="mt-2 font-display text-3xl font-bold uppercase text-white">{isDoom ? "The trials of Doom" : "Repulsor training"}</div>
                        <div className="mt-2 font-mono text-xs text-steel-400">ranks: {(isDoom ? doom.ranks : RANKS).map(([, r]) => r).join(" → ")}</div>
                      </>
                    )}
                    <button onClick={start} className="btn-hot mt-6">{state === "over" ? "Run it again" : isDoom ? "▶ Begin the trials" : "▶ Start training"}</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
