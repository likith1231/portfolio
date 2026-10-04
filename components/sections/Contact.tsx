"use client";

import { useState } from "react";
import SectionHead from "../ui/SectionHead";
import Reveal from "../ui/Reveal";
import SocialButtons from "../ui/SocialButtons";
import { profile } from "@/data/portfolio";

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({ name: "", msg: "" });

  const copy = async () => {
    try { await navigator.clipboard.writeText(profile.email); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch {}
  };
  const mailto = `mailto:${profile.email}?subject=${encodeURIComponent(`Hello from ${form.name || "your portfolio"}`)}&body=${encodeURIComponent(form.msg)}`;

  return (
    <section id="contact" className="relative overflow-hidden py-28">
      <div className="pointer-events-none absolute bottom-0 left-1/2 h-[420px] w-[820px] -translate-x-1/2 rounded-full bg-gold/[0.06] blur-3xl" />
      <div className="relative mx-auto max-w-7xl px-4 md:px-8">
        <SectionHead code="08" kicker="open a comm channel" title="Let's build something that stays up">
          Hiring a DevOps, Full Stack or AI/ML engineer? Email is the fastest way to reach me.
        </SectionHead>

        <div className="grid gap-8 lg:grid-cols-[1.1fr_1fr]">
          <Reveal>
            <button onClick={copy} className="group block w-full text-left" aria-label="Copy email address">
              <span className="hud-label">{copied ? "✓ copied to clipboard" : "click to copy"}</span>
              <span className="mt-2 block break-all font-display text-3xl font-bold text-white transition-colors group-hover:text-gold md:text-5xl">
                {profile.email}
              </span>
            </button>
            <div className="mt-10"><SocialButtons /></div>
            <div className="mt-10 hud-label flex items-center gap-2 text-ok">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ok" />{profile.available}
            </div>
          </Reveal>

          <Reveal delay={0.1}>
            <form className="hud-panel hud-corners space-y-4 p-6" onSubmit={(e) => { e.preventDefault(); window.location.href = mailto; }}>
              <div className="hud-label">quick transmission</div>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name / company"
                className="w-full border border-white/10 bg-void px-4 py-3 text-sm text-white outline-none placeholder:text-steel-500 focus:border-gold/60" />
              <textarea value={form.msg} onChange={(e) => setForm({ ...form, msg: e.target.value })} rows={5} placeholder="What are we building?"
                className="w-full resize-none border border-white/10 bg-void px-4 py-3 text-sm text-white outline-none placeholder:text-steel-500 focus:border-gold/60" />
              <button type="submit" className="btn-primary w-full justify-center">Transmit via email →</button>
              <p className="text-[11px] text-steel-500">Opens your email app with the message filled in.</p>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
