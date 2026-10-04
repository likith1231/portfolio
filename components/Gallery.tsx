"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect, useState } from "react";

// Screenshots with a lightbox. Arrow keys move between them, Esc closes.
export default function Gallery({ items }: { items: { src: string; alt: string }[] }) {
  const [open, setOpen] = useState<number | null>(null);
  useEffect(() => {
    if (open === null) return;
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(null);
      if (e.key === "ArrowRight") setOpen((o) => (o === null ? o : (o + 1) % items.length));
      if (e.key === "ArrowLeft") setOpen((o) => (o === null ? o : (o - 1 + items.length) % items.length));
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [open, items.length]);

  return (
    <>
      <div className="grid gap-3 sm:grid-cols-2">
        {items.map((it, i) => (
          <button key={it.src} onClick={() => setOpen(i)} className="hud-panel hud-corners group overflow-hidden text-left">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={it.src} alt={it.alt} loading="lazy" className="aspect-video w-full object-cover object-top opacity-85 transition duration-500 group-hover:scale-[1.03] group-hover:opacity-100" />
            <div className="px-3 py-2 font-mono text-[11px] text-steel-400">{it.alt}</div>
          </button>
        ))}
      </div>
      <AnimatePresence>
        {open !== null && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setOpen(null)}
            className="fixed inset-0 z-[90] flex items-center justify-center bg-black/90 p-4 backdrop-blur" role="dialog" aria-label={items[open].alt}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <motion.img key={open} initial={{ scale: 0.95, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} src={items[open].src} alt={items[open].alt}
              className="max-h-[85vh] max-w-full border border-gold/30" onClick={(e) => e.stopPropagation()} />
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 font-mono text-xs text-steel-300">{items[open].alt} · {open + 1}/{items.length} · ← → · esc</div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
