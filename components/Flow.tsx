"use client";

import { motion } from "framer-motion";
import type { FlowNode } from "@/data/portfolio";

const tone = (t?: FlowNode["tone"]) =>
  t === "red" ? "border-hot/70 text-hot" : t === "gold" ? "border-gold/60 text-gold" : "border-white/15 text-steel-100";

// A pipeline diagram: nodes joined by a line with a data packet travelling along it.
export default function Flow({ nodes, title, note }: { nodes: FlowNode[]; title: string; note?: string }) {
  return (
    <figure className="hud-panel hud-corners p-5" aria-label={title}>
      <figcaption className="hud-label mb-5 flex items-center justify-between">
        <span>{title}</span>
        <span className="text-gold">● live</span>
      </figcaption>
      <ol className="relative flex flex-col gap-3 md:flex-row md:items-stretch md:gap-0">
        {nodes.map((n, i) => (
          <li key={n.label} className="relative flex md:flex-1 md:flex-col md:items-center">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.12 }}
              className={`relative z-10 w-full border bg-void-800 px-3 py-2.5 md:w-[92%] ${tone(n.tone)}`}
            >
              <div className="font-mono text-[10px] text-steel-500">0{i + 1}</div>
              <div className="font-display text-sm font-semibold leading-tight">{n.label}</div>
              {n.sub && <div className="mt-0.5 text-[11px] leading-snug text-steel-400">{n.sub}</div>}
            </motion.div>
            {i < nodes.length - 1 && (
              <>
                <span className="absolute left-4 top-full h-3 w-px bg-gold/30 md:hidden" />
                <span className="absolute right-[-4%] top-1/2 hidden h-px w-[8%] overflow-hidden bg-gold/25 md:block">
                  <span className="absolute inset-y-0 w-1/2 bg-gold" style={{ animation: `packet 1.6s linear ${i * 0.25}s infinite` }} />
                </span>
              </>
            )}
          </li>
        ))}
      </ol>
      {note && <p className="mt-5 border-t border-white/[0.06] pt-4 text-[13px] leading-relaxed text-steel-400">{note}</p>}
      <style>{`@keyframes packet { from { transform: translateX(-100%) } to { transform: translateX(200%) } }`}</style>
    </figure>
  );
}
