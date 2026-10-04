import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Flow from "@/components/Flow";
import Reveal from "@/components/ui/Reveal";
import LiveBadge from "@/components/ui/LiveBadge";
import Footer from "@/components/Footer";
import SuitStage from "@/components/SuitStage";
import Gallery from "@/components/Gallery";
import { profile, roman, suits } from "@/data/portfolio";

const ordered = [...suits].sort((a, b) => b.mark - a.mark);

export function generateStaticParams() {
  return suits.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = suits.find((x) => x.slug === params.slug);
  if (!p) return {};
  return { title: `Mark ${roman(p.mark)} · ${p.name} · ${profile.name}`, description: `${p.tagline} ${p.summary}` };
}

export default function CaseStudy({ params }: { params: { slug: string } }) {
  const i = ordered.findIndex((x) => x.slug === params.slug);
  if (i < 0) notFound();
  const p = ordered[i];
  const next = ordered[(i + 1) % ordered.length];

  return (
    <main className="pt-24">
      <div className="grid-bg pointer-events-none absolute inset-x-0 top-0 h-[80vh] [mask-image:linear-gradient(black,transparent)]" />
      <article className="relative mx-auto max-w-6xl px-4 md:px-8">
        <Link href="/#armor" className="hud-label hover:text-gold">← back to the hall of armor</Link>

        <div className="mt-8 grid items-center gap-8 lg:grid-cols-[1.2fr_1fr]">
          <Reveal>
            <div className="hud-label flex flex-wrap items-center gap-3">
              <span className="text-hot">Mark {roman(p.mark)}</span><span>· codename “{p.codename}”</span><LiveBadge live={p.live} />
            </div>
            <h1 className="mt-4 font-display text-5xl font-bold uppercase text-white md:text-7xl">{p.name}</h1>
            <p className="mt-3 font-serif text-2xl italic text-gold md:text-3xl">{p.tagline}</p>
            <p className="mt-6 text-lg leading-relaxed text-steel-300">{p.summary}</p>
            <div className="mt-6">
              <div className="hud-label flex justify-between"><span>power rating</span><span className="text-gold">{p.power}/100</span></div>
              <div className="mt-2 h-2 bg-white/[0.06]"><div className="h-full bg-gradient-to-r from-hot to-gold" style={{ width: `${p.power}%` }} /></div>
            </div>
            <div className="mt-8 flex flex-wrap gap-3">
              <a href={p.repo} target="_blank" rel="noreferrer" className="btn-hot">Source on GitHub ↗</a>
              {p.live ? <a href={p.live} target="_blank" rel="noreferrer" className="btn-primary">Live demo ↗</a>
                : <span className="btn border-dashed border-white/10 text-steel-500">Live demo: deploying soon</span>}
            </div>
          </Reveal>
          <div className="relative h-[380px] md:h-[460px]">
            <div className="pointer-events-none absolute inset-0 rounded-full bg-hot/10 blur-3xl" />
            <SuitStage slug={p.slug} />
            <div className="hud-label absolute bottom-0 left-1/2 -translate-x-1/2 whitespace-nowrap">mark {roman(p.mark)} · turntable</div>
          </div>
        </div>

        <Reveal className="mt-14">
          <div className="flex flex-col gap-4 border-y border-white/[0.07] py-8 md:flex-row md:items-center md:gap-10">
            <span className="font-display text-5xl font-bold text-white md:text-6xl">{p.stat.value}</span>
            <span className="max-w-lg text-steel-400">{p.stat.label}</span>
          </div>
        </Reveal>

        <section className="mt-16 grid gap-10 md:grid-cols-[200px_1fr]">
          <div className="hud-label pt-1">01 · the threat</div>
          <Reveal><p className="text-lg leading-relaxed text-steel-200">{p.problem}</p></Reveal>
        </section>

        <section className="mt-16 grid gap-10 md:grid-cols-[200px_1fr]">
          <div className="hud-label pt-1">02 · how the suit works</div>
          <ol className="space-y-5">
            {p.how.map((h, k) => (
              <Reveal key={k} delay={k * 0.05}>
                <li className="flex gap-4"><span className="font-mono text-sm text-hot">0{k + 1}</span><span className="leading-relaxed text-steel-300">{h}</span></li>
              </Reveal>
            ))}
          </ol>
        </section>

        <Reveal className="mt-16"><Flow nodes={p.flow} title={p.flowTitle} note={p.flowNote} /></Reveal>

        {p.gallery && (
          <section className="mt-16">
            <div className="hud-label mb-4">03 · footage</div>
            <Gallery items={p.gallery} />
          </section>
        )}

        <section className="mt-16 grid gap-10 md:grid-cols-[200px_1fr]">
          <div className="hud-label pt-1">{p.gallery ? "04" : "03"} · flight log</div>
          <ul className="space-y-3 font-mono text-[13px]">
            {p.highlights.map((h) => <li key={h} className="flex gap-3 border-l border-hot/40 pl-4 text-steel-300"><span className="text-gold">›</span>{h}</li>)}
          </ul>
        </section>

        <Reveal className="mt-16">
          <blockquote className="hud-panel hud-corners p-8">
            <div className="hud-label text-hot">lesson learned</div>
            <p className="mt-3 font-display text-2xl font-semibold uppercase text-white">{p.lesson.title}</p>
            <p className="mt-3 font-serif text-xl italic leading-relaxed text-steel-300">{p.lesson.body}</p>
          </blockquote>
        </Reveal>

        <section className="mt-16 grid gap-10 md:grid-cols-[200px_1fr]">
          <div className="hud-label pt-1">built with</div>
          <div className="flex flex-wrap gap-1.5">{p.stack.map((s) => <span key={s} className="chip">{s}</span>)}</div>
        </section>

        <Link href={`/work/${next.slug}`} className="group mb-16 mt-24 block border-t border-white/[0.07] pt-10">
          <div className="hud-label">next suit · mark {roman(next.mark)}</div>
          <div className="mt-2 font-display text-4xl font-bold uppercase text-steel-400 transition-colors group-hover:text-gold md:text-6xl">{next.name} →</div>
        </Link>
      </article>
      <Footer />
    </main>
  );
}
