"use client";

import { motion } from "framer-motion";
import SectionHead from "../ui/SectionHead";
import { certifications, type Cert } from "@/data/portfolio";

const TIER: Record<Cert["tier"], { label: string; cls: string }> = {
  Professional: { label: "Certified · exam", cls: "border-gold/60 text-gold" },
  Industry: { label: "Industry course", cls: "border-white/20 text-steel-200" },
  Course: { label: "Course", cls: "border-white/10 text-steel-400" },
};

// Certifications, strongest first. Every card links to the issuer's own verification page.
export default function Certifications() {
  const top = certifications.filter((c) => c.tier === "Professional");
  const others = certifications.filter((c) => c.tier !== "Professional");

  const Verify = ({ c }: { c: Cert }) => c.verifiedVia === "LinkedIn" ? (
    // no issuer verification page for this one: say so honestly
    <a href={c.url} target="_blank" rel="noreferrer" data-lock
      className="inline-flex items-center gap-2 border border-white/15 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-steel-300 transition-colors hover:border-white/40 hover:text-white">
      View on LinkedIn ↗
    </a>
  ) : (
    <a href={c.url} target="_blank" rel="noreferrer" data-lock
      className="inline-flex items-center gap-2 border border-ok/50 bg-ok/10 px-3 py-1.5 font-mono text-[11px] uppercase tracking-[0.16em] text-ok transition-colors hover:bg-ok hover:text-void">
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2.2" aria-hidden><path d="M20 6 9 17l-5-5" /></svg>
      Verify on {c.verifiedVia.replace(/ certificate link$/, "")} ↗
    </a>
  );

  return (
    <section id="certs" className="relative py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionHead code="08" kicker="credentials · verified at the source" title="Certifications">
          Ranked by what matters most for DevOps, Full Stack and AI/ML roles. Every badge opens the issuer's own verification page, so nothing here has to be taken on trust.
        </SectionHead>

        <div className="grid gap-4 lg:grid-cols-3">
          {top.map((c, i) => (
            <motion.article key={c.name} initial={{ opacity: 0, y: 24 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.08 }}
              className="hud-panel hud-corners flex flex-col p-6">
              <div className="flex items-center justify-between gap-3">
                <span className="font-mono text-[11px] uppercase tracking-[0.2em] text-hot">#{i + 1}</span>
                <span className={`border px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.16em] ${TIER[c.tier].cls}`}>{TIER[c.tier].label}</span>
              </div>
              <div className="mt-5 font-mono text-[11px] uppercase tracking-[0.18em] text-steel-400">{c.issuer}</div>
              <h3 className="mt-1 font-display text-2xl font-bold uppercase leading-tight text-white">{c.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-steel-400">{c.why}</p>
              <dl className="mt-5 space-y-1.5 border-t border-white/[0.07] pt-4 font-mono text-[11px]">
                {c.issued && <div className="flex justify-between gap-4"><dt className="text-steel-500">Issued</dt><dd className="text-steel-200">{c.issued}</dd></div>}
                {c.expires && <div className="flex justify-between gap-4"><dt className="text-steel-500">Valid until</dt><dd className="text-ok">{c.expires}</dd></div>}
                {c.credentialId && <div className="flex justify-between gap-4"><dt className="text-steel-500">Credential ID</dt><dd className="truncate text-steel-300" title={c.credentialId}>{c.credentialId}</dd></div>}
              </dl>
              <div className="mt-6 flex-1" />
              <Verify c={c} />
            </motion.article>
          ))}
        </div>

        {others.length > 0 && (
          <div className="hud-panel mt-4 divide-y divide-white/[0.06]">
            {others.map((c, i) => (
              <div key={c.name} className="grid items-center gap-3 px-5 py-4 md:grid-cols-[40px_1fr_auto]">
                <span className="font-mono text-[11px] text-steel-500">#{top.length + i + 1}</span>
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="font-display font-semibold uppercase text-white">{c.name}</span>
                    <span className={`border px-1.5 py-0.5 font-mono text-[9px] uppercase tracking-[0.16em] ${TIER[c.tier].cls}`}>{TIER[c.tier].label}</span>
                  </div>
                  <div className="mt-0.5 font-mono text-[11px] text-steel-400">{c.issuer}{c.issued ? ` · ${c.issued}` : ""} · {c.why}</div>
                </div>
                <Verify c={c} />
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
