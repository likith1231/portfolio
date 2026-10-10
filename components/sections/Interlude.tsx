"use client";

import { useEffect, useState } from "react";
import DotMatrix from "../ui/DotMatrix";
import Reveal from "../ui/Reveal";
import { quote } from "@/data/portfolio";

// How long the visitor has been here, as MM:SS, counting only while the tab is visible.
function TimeHere() {
  const [s, setS] = useState(0);
  useEffect(() => {
    const id = setInterval(() => { if (document.visibilityState === "visible") setS((v) => v + 1); }, 1000);
    return () => clearInterval(id);
  }, []);
  const p = (n: number) => String(n).padStart(2, "0");
  return <DotMatrix value={`${p(Math.min(99, Math.floor(s / 60)))}:${p(s % 60)}`} dot={8} className="max-w-full" />;
}

// The site's one line from the films, beside a live counter of time spent on the page.
export default function Interlude() {
  const words = quote.text.split(" ");
  const last = words.pop();
  return (
    <section className="px-3 pb-6 md:px-6" aria-label="Interlude">
      <div className="mx-auto grid max-w-[1400px] gap-3 lg:grid-cols-12">
        <Reveal className="tile p-6 md:p-10 lg:col-span-8">
          <span className="tile-label">following in the footsteps of {quote.by}</span>
          <p className="mt-6 font-display text-3xl font-bold leading-tight text-[#f3e6cf] md:text-5xl">
            “{words.join(" ")} <span className="gold-text font-serif font-normal italic">{last}</span>”
          </p>
          <p className="mt-4 font-mono text-[11px] uppercase tracking-[0.2em] text-steel-500">{quote.by} · {quote.film}</p>
        </Reveal>
        <Reveal delay={0.1} className="tile flex flex-col justify-between gap-6 lg:col-span-4">
          <span className="tile-label">you&apos;ve spent [ in minutes ]</span>
          <TimeHere />
          <span className="tile-label">on this website</span>
        </Reveal>
      </div>
    </section>
  );
}
