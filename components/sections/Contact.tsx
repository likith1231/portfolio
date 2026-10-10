"use client";

import { useState } from "react";
import SectionHead from "../ui/SectionHead";
import Reveal from "../ui/Reveal";
import { profile } from "@/data/portfolio";

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({ name: "", msg: "" });

  const copy = async () => {
    try { await navigator.clipboard.writeText(profile.email); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch {}
  };
  const mailto = `mailto:${profile.email}?subject=${encodeURIComponent(`Hello from ${form.name || "your portfolio"}`)}&body=${encodeURIComponent(form.msg)}`;

  return (
    <section id="contact" className="relative px-3 py-20 md:px-6">
      <div className="mx-auto max-w-[1400px]">
        <div className="tile mb-3 px-6 py-8 md:px-10">
          <SectionHead code="10" kicker="contact" title="Let's build something that stays up" compact />
        </div>

        <div className="grid gap-3 lg:grid-cols-12">
          <Reveal className="tile flex flex-col justify-between gap-10 p-6 md:p-10 lg:col-span-7">
            <div>
              <p className="font-display text-4xl font-bold text-gold md:text-5xl">[ Comm channel open ]</p>
              <p className="mt-3 font-display text-2xl font-bold text-[#f3e6cf] md:text-3xl">Hiring a DevOps, Full Stack or AI/ML engineer?</p>
              <p className="mt-6 max-w-xl text-steel-300">I&apos;m always up for a chat about self-healing infrastructure, AI agents that open their own pull requests, or your next project. Email is the fastest way to reach me.</p>
            </div>
            <div className="hud-label flex items-center gap-2 text-ok">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-ok" />{profile.available}
            </div>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-5">
            <form className="tile h-full space-y-4" onSubmit={(e) => { e.preventDefault(); window.location.href = mailto; }}>
              <div className="tile-label">quick transmission</div>
              <input value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} placeholder="Your name / company" aria-label="Your name or company"
                className="w-full rounded-xl border border-white/10 bg-void px-4 py-3 text-sm text-white outline-none placeholder:text-steel-500 focus:border-gold/60" />
              <textarea value={form.msg} onChange={(e) => setForm({ ...form, msg: e.target.value })} rows={5} placeholder="What are we building?" aria-label="Message"
                className="w-full resize-none rounded-xl border border-white/10 bg-void px-4 py-3 text-sm text-white outline-none placeholder:text-steel-500 focus:border-gold/60" />
              <button type="submit" className="btn-primary w-full justify-center">Transmit via email →</button>
              <p className="text-[11px] text-steel-500">Opens your email app with the message filled in.</p>
            </form>
          </Reveal>

          <Reveal className="tile tile-hover lg:col-span-12">
            <button onClick={copy} className="group flex w-full flex-wrap items-center gap-4 text-left" aria-label="Copy email address">
              <span className="text-2xl text-gold">⇢</span>
              <span className="break-all font-display text-2xl font-bold uppercase text-white transition-colors group-hover:text-gold md:text-4xl">
                {profile.email.split("@")[0]}<span className="text-gold">@{profile.email.split("@")[1]}</span>
              </span>
              <span className="ml-auto tile-label">{copied ? "✓ copied to clipboard" : "click to copy"}</span>
            </button>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
