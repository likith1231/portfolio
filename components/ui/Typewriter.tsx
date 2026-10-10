"use client";

import { useEffect, useState } from "react";

// Types `text`, then shows `after` (a short aside) once it finishes. Starts when `start` is true.
export default function Typewriter({ text, after, start = true, speed = 22, className = "" }: { text: string; after?: React.ReactNode; start?: boolean; speed?: number; className?: string }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!start) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) { setN(text.length); return; }
    setN(0);
    const id = setInterval(() => setN((v) => (v >= text.length ? (clearInterval(id), v) : v + 1)), speed);
    return () => clearInterval(id);
  }, [text, start, speed]);
  const done = n >= text.length;
  return (
    <span className={className}>
      <span aria-hidden>{text.slice(0, n)}</span>
      {done && after}
      <span className="ml-0.5 inline-block h-[1em] w-[0.5ch] animate-pulse bg-gold align-[-0.15em]" aria-hidden />
      <span className="sr-only">{text}</span>
    </span>
  );
}
