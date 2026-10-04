"use client";

import { useEffect, useState, type RefObject } from "react";

// Pause a 3D canvas when it scrolls out of view.
export default function useVisible(ref: RefObject<HTMLElement>, margin = "100px") {
  const [v, setV] = useState(false);
  useEffect(() => {
    if (!ref.current) return;
    const io = new IntersectionObserver(([e]) => setV(e.isIntersecting), { rootMargin: margin });
    io.observe(ref.current);
    return () => io.disconnect();
  }, [ref, margin]);
  return v;
}
