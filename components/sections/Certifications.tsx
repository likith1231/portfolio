"use client";

import { motion } from "framer-motion";
import SectionHead from "../ui/SectionHead";
import { certifications, profile, type Cert } from "@/data/portfolio";

const STATUS: Record<Cert["tier"], string> = { Professional: "Certified", Industry: "Course", Course: "Course" };

// Certifications as a S.H.I.E.L.D. assessment dossier. Every line links to the issuer's own verification page.
export default function Certifications() {
  return (
    <section id="certs" className="relative py-28">
      <div className="mx-auto max-w-7xl px-4 md:px-8">
        <SectionHead code="09" kicker="credentials · verified at the source" title="The Avengers Initiative dossier">
          S.H.I.E.L.D. keeps a file on every candidate. Ranked by what matters most for DevOps, Full Stack and AI/ML roles, and every line links to the issuer's own verification page.
        </SectionHead>

        <motion.article initial={{ opacity: 0, y: 30, rotate: 0.6 }} whileInView={{ opacity: 1, y: 0, rotate: 0 }} viewport={{ once: true }} transition={{ duration: 0.9 }}
          className="relative mx-auto max-w-4xl overflow-hidden rounded-xl px-6 py-10 text-[#1b1414] shadow-[0_50px_100px_-40px_rgba(0,0,0,.95)] md:px-14"
          style={{ background: "radial-gradient(120% 90% at 50% 0%,#f6f0e3,#e8dcc4 70%,#d9c9a8)" }}>
          {/* header */}
          <header className="flex flex-col items-center border-b-2 border-[#1b1414]/70 pb-6 text-center">
            <span className="grid h-14 w-14 place-items-center rounded-full border-2 border-[#1b1414]/80 font-display text-lg font-bold">S.H.</span>
            <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.35em] text-[#6b5f55]">Strategic Homeland Intervention, Enforcement and Logistics Division</p>
            <h3 className="mt-3 font-display text-2xl font-bold uppercase tracking-wide text-[#8e0f18] md:text-3xl">Avengers Initiative · Candidate assessment</h3>
            <p className="mt-2 font-serif text-lg">Subject: <strong>{profile.name}</strong> · Role sought: DevOps · Full Stack · AI/ML</p>
          </header>

          <table className="mt-6 w-full text-left">
            <thead>
              <tr className="font-mono text-[10px] uppercase tracking-[0.2em] text-[#6b5f55]">
                <th className="pb-3 pr-3">#</th><th className="pb-3 pr-3">Credential</th><th className="hidden pb-3 pr-3 md:table-cell">Issued by</th><th className="pb-3 text-right">Verify</th>
              </tr>
            </thead>
            <tbody>
              {certifications.map((c, i) => (
                <tr key={c.name} className="border-t border-dashed border-[#1b1414]/20 align-top">
                  <td className="py-3.5 pr-3 font-mono text-xs text-[#6b5f55]">{String(i + 1).padStart(2, "0")}</td>
                  <td className="py-3.5 pr-3">
                    <p className="font-serif text-lg font-semibold leading-snug">{c.name}</p>
                    <p className="mt-0.5 font-mono text-[10px] uppercase tracking-[0.16em] text-[#6b5f55]">
                      <span className={c.tier === "Professional" ? "text-[#8e0f18]" : ""}>{STATUS[c.tier]}</span>
                      {c.issued ? ` · ${c.issued}` : ""}{c.expires ? ` · valid to ${c.expires}` : ""}<span className="md:hidden"> · {c.issuer}</span>
                    </p>
                    {c.credentialId && <p className="mt-0.5 break-all font-mono text-[10px] text-[#6b5f55]/80">ID {c.credentialId}</p>}
                  </td>
                  <td className="hidden py-3.5 pr-3 font-serif text-lg md:table-cell">{c.issuer}</td>
                  <td className="py-3.5 text-right">
                    <a href={c.url} target="_blank" rel="noreferrer" data-lock
                      className={`inline-flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3 py-1.5 font-mono text-[10px] font-bold uppercase tracking-[0.14em] transition-colors ${c.verifiedVia === "LinkedIn" ? "border-[#1b1414]/30 text-[#1b1414]/70 hover:bg-[#1b1414]/5" : "border-[#1d6b3a] text-[#1d6b3a] hover:bg-[#1d6b3a] hover:text-white"}`}>
                      {c.verifiedVia === "LinkedIn" ? "View ↗" : <>✓ {c.verifiedVia.replace(/ certificate link$/, "").replace("Oracle CertView", "Oracle")} ↗</>}
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <footer className="mt-8 border-t-2 border-[#1b1414]/70 pt-5 font-serif text-lg">
            <p>DevOps engineer: <strong className="text-[#1d6b3a]">Recommended.</strong></p>
            <p>Full stack developer: <strong className="text-[#1d6b3a]">Recommended.</strong></p>
            <p>AI/ML engineer: <strong className="text-[#1d6b3a]">Recommended.</strong></p>
          </footer>

          <span className="pointer-events-none absolute right-6 top-8 rotate-[14deg] rounded-md border-[3px] border-[#c9182a]/80 px-3 py-1 font-display text-lg font-bold uppercase tracking-[0.2em] text-[#c9182a]/80 md:right-12 md:top-10 md:text-2xl">
            Classified
          </span>
        </motion.article>
      </div>
    </section>
  );
}
