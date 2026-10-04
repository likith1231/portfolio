"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

const LINES = [
  ["hud", "initialising heads-up display", "ok"],
  ["k8s", "kubectl get pods -n portfolio", "8/8 ready"],
  ["argo", "argocd app sync portfolio", "healthy"],
  ["crew", "ghostops agents online", "3/3"],
  ["otel", "telemetry pipeline attached", "ok"],
  ["arc", "reactor output", "100%"],
] as const;

// A short boot sequence, once per browser session. Click or press any key to skip.
export default function Boot() {
  const [show, setShow] = useState(false);
  const [n, setN] = useState(0);

  useEffect(() => {
    try {
      if (sessionStorage.getItem("booted")) return;
      sessionStorage.setItem("booted", "1");
    } catch {}
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setShow(true);
    document.documentElement.style.overflow = "hidden";
    const timers = LINES.map((_, i) => setTimeout(() => setN(i + 1), 220 + i * 260));
    const done = setTimeout(() => setShow(false), 220 + LINES.length * 260 + 650);
    const skip = () => setShow(false);
    window.addEventListener("keydown", skip);
    window.addEventListener("pointerdown", skip);
    return () => {
      timers.forEach(clearTimeout);
      clearTimeout(done);
      window.removeEventListener("keydown", skip);
      window.removeEventListener("pointerdown", skip);
    };
  }, []);

  useEffect(() => {
    if (!show) document.documentElement.style.overflow = "";
  }, [show]);

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="fixed inset-0 z-[95] flex items-center justify-center bg-void px-6"
          exit={{ opacity: 0, scale: 1.04, filter: "blur(8px)" }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="scanlines pointer-events-none absolute inset-0" />
          <div className="w-full max-w-md font-mono text-[12px] sm:text-[13px]">
            <div className="mb-6 flex items-center gap-3">
              <span className="relative flex h-3 w-3">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-arc opacity-60" />
                <span className="relative inline-flex h-3 w-3 rounded-full bg-arc" />
              </span>
              <span className="tracking-[0.3em] text-arc">LIKITH-L // SYSTEM BOOT</span>
            </div>
            {LINES.slice(0, n).map(([tag, text, res]) => (
              <motion.div key={tag} initial={{ opacity: 0, x: -8 }} animate={{ opacity: 1, x: 0 }} className="flex gap-3 py-1">
                <span className="w-10 text-steel-500">[{tag}]</span>
                <span className="flex-1 truncate text-steel-200">{text}</span>
                <span className="text-ok">{res}</span>
              </motion.div>
            ))}
            <div className="mt-6 h-px w-full overflow-hidden bg-white/10">
              <motion.div className="h-full bg-arc" initial={{ width: 0 }} animate={{ width: `${(n / LINES.length) * 100}%` }} />
            </div>
            <p className="mt-4 text-steel-500">“Sometimes you gotta run before you can walk.”</p>
            <p className="mt-8 text-[10px] uppercase tracking-[0.3em] text-steel-500">press any key to skip</p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
