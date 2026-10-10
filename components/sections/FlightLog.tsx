"use client";

import { motion } from "framer-motion";
import SectionHead from "../ui/SectionHead";
import { flightLog } from "@/data/portfolio";

// The journey so far as a timeline, each stop numbered like a suit upgrade.
export default function FlightLog() {
  return (
    <section id="log" className="relative py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionHead code="08" kicker="the flight log" title="Every upgrade, one Mark at a time">
          From pre-university to the suits on this site. Every stop is a new Mark.
        </SectionHead>

        <ol className="relative ml-5 border-l-2 border-dashed border-gold/30 md:ml-6">
          {flightLog.map((e, i) => (
            <motion.li key={e.title} initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.6, delay: 0.04 }} className="relative mb-6 pl-10 last:mb-0 md:pl-14">
              <span className="absolute -left-[21px] top-5 grid h-10 w-10 place-items-center rounded-full border-2 border-gold/70 font-mono text-[10px] font-bold text-white md:-left-[23px] md:h-11 md:w-11"
                style={{ background: "radial-gradient(circle at 35% 30%,#e8323f,#8e0f18)" }}>
                MK{i + 1}
              </span>
              <div className="hud-panel hud-corners p-6">
                <p className="font-mono text-[10px] uppercase tracking-[0.25em] text-gold">{e.when}</p>
                <h3 className="mt-2 font-display text-xl font-bold text-[#f3e6cf] md:text-2xl">{e.title}</h3>
                <p className="mt-1 font-serif text-lg italic text-gold">{e.where}</p>
                <p className="mt-2 leading-relaxed text-steel-300">{e.body}</p>
              </div>
            </motion.li>
          ))}
        </ol>
      </div>
    </section>
  );
}
