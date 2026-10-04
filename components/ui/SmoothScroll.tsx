"use client";

import { useEffect } from "react";
import Lenis from "lenis";

export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    let id = 0;
    const raf = (t: number) => { lenis.raf(t); id = requestAnimationFrame(raf); };
    id = requestAnimationFrame(raf);
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;
    return () => { cancelAnimationFrame(id); lenis.destroy(); };
  }, []);
  return null;
}

export function scrollToId(id: string) {
  const el = document.getElementById(id);
  if (!el) return false;
  const lenis = (window as unknown as { __lenis?: { scrollTo: (t: HTMLElement, o?: object) => void } }).__lenis;
  if (lenis) lenis.scrollTo(el, { offset: -70 });
  else el.scrollIntoView({ behavior: "smooth" });
  return true;
}
