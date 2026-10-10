"use client";

import { motion } from "framer-motion";
import DotMatrix from "../ui/DotMatrix";
import Reveal from "../ui/Reveal";
import { useGo } from "../Nav";
import { certifications, education, suits } from "@/data/portfolio";

// The narrator's note about the pilot, and a counter of the cards (certificates) he has collected.
export default function PilotNote() {
  const go = useGo();
  const deck = certifications.slice(0, 4);
  return (
    <section className="px-3 pb-6 md:px-6" aria-label="Pilot's note">
      <div className="mx-auto grid max-w-[1400px] gap-3 lg:grid-cols-12">
        <Reveal className="tile p-6 md:p-10 lg:col-span-7">
          <span className="tile-label">pilot&apos;s note</span>
          <p className="mt-6 text-lg leading-relaxed text-steel-200 md:text-xl">
            Since {education.years.split(" ")[0]}, Likith has been studying computer science in Bengaluru and building in public on GitHub: {suits.length} full-stack projects so far, each one shipped first and armored after. He has a habit of breaking his own systems on purpose, just to watch them heal.
          </p>
          <div className="mt-8 flex items-center gap-6 text-gold/70" aria-hidden>
            {Array.from({ length: 7 }).map((_, i) => (
              <motion.span key={i} className="text-sm" animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.18 }}>✦</motion.span>
            ))}
          </div>
        </Reveal>

        <Reveal delay={0.08} className="tile flex flex-col justify-between gap-6 lg:col-span-2">
          <span className="tile-label">cards collected</span>
          <DotMatrix value={String(certifications.length)} dot={9} />
        </Reveal>

        <Reveal delay={0.14} className="tile flex flex-col justify-between gap-6 overflow-hidden lg:col-span-3">
          <p className="text-sm leading-relaxed text-steel-300">With every exam passed, a new card is forged and filed in the S.H.I.E.L.D. dossier.</p>
          {/* a small fanned deck of the top cards */}
          <button onClick={() => go("certs")} className="group relative h-28" aria-label="View the certificate deck">
            {deck.map((c, i) => (
              <span key={c.name}
                className="absolute bottom-0 left-1/2 flex h-24 w-16 flex-col justify-between rounded-lg border border-gold/40 bg-gradient-to-b from-void-700 to-void-900 p-1.5 shadow-lg transition-transform duration-300 group-hover:-translate-y-1"
                style={{ transform: `translateX(calc(-50% + ${(i - 1.5) * 34}px)) rotate(${(i - 1.5) * 9}deg)`, transformOrigin: "50% 120%" }}>
                <span className="font-mono text-[8px] text-gold">{["I", "II", "III", "IV"][i]}</span>
                <span className="text-center font-display text-[9px] font-bold uppercase leading-tight text-white">{c.issuer.replace("Amazon Web Services", "AWS")}</span>
                <span className="text-right font-mono text-[7px] text-steel-400">{c.issued ?? ""}</span>
              </span>
            ))}
          </button>
          <button onClick={() => go("certs")} className="flex items-center gap-2 font-display text-lg font-bold uppercase text-white hover:text-gold">
            <span className="text-gold">⇢</span> View the <span className="text-gold">deck</span>
          </button>
        </Reveal>
      </div>
    </section>
  );
}
