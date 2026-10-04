import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Flow from "@/components/Flow";
import Reveal from "@/components/ui/Reveal";
import LiveBadge from "@/components/ui/LiveBadge";
import Footer from "@/components/Footer";
import { profile, projects } from "@/data/portfolio";

export function generateStaticParams() {
  return projects.map((p) => ({ slug: p.slug }));
}

export function generateMetadata({ params }: { params: { slug: string } }): Metadata {
  const p = projects.find((x) => x.slug === params.slug);
  if (!p) return {};
  return { title: `${p.name} · ${profile.name}`, description: `${p.tagline} ${p.summary}` };
}

export default function CaseStudy({ params }: { params: { slug: string } }) {
  const i = projects.findIndex((x) => x.slug === params.slug);
  if (i < 0) notFound();
  const p = projects[i];
  const next = projects[(i + 1) % projects.length];

  return (
    <main className="pt-24">
      <div className="grid-bg pointer-events-none absolute inset-x-0 top-0 h-[70vh] [mask-image:linear-gradient(black,transparent)]" />
      <article className="relative mx-auto max-w-5xl px-4 md:px-8">
        <Link href="/#work" className="hud-label hover:text-arc">← all suits</Link>

        <Reveal className="mt-10">
          <div className="hud-label flex flex-wrap items-center gap-3">
            <span className="text-arc">{p.mark}</span><span>· {p.episode}</span><LiveBadge live={p.live} />
          </div>
          <h1 className="mt-4 font-display text-5xl font-bold uppercase text-white md:text-7xl">{p.name}</h1>
          <p className="mt-3 font-serif text-2xl italic text-steel-200 md:text-3xl">{p.tagline}</p>
          <p className="mt-6 max-w-3xl text-lg leading-relaxed text-steel-300">{p.summary}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <a href={p.repo} target="_blank" rel="noreferrer" className="btn-primary">Source on GitHub ↗</a>
            {p.live ? <a href={p.live} target="_blank" rel="noreferrer" className="btn-ghost">Live demo ↗</a>
              : <span className="btn border-dashed border-white/10 text-steel-500">Live demo: deploying soon</span>}
          </div>
        </Reveal>

        <Reveal className="mt-14">
          <div className="flex flex-col gap-4 border-y border-white/[0.07] py-8 md:flex-row md:items-center md:gap-10">
            <span className="font-display text-5xl font-bold text-white md:text-6xl">{p.stat.value}</span>
            <span className="max-w-lg text-steel-400">{p.stat.label}</span>
          </div>
        </Reveal>

        <section className="mt-16 grid gap-10 md:grid-cols-[200px_1fr]">
          <div className="hud-label pt-1">01 · the problem</div>
          <Reveal><p className="text-lg leading-relaxed text-steel-200">{p.problem}</p></Reveal>
        </section>

        <section className="mt-16 grid gap-10 md:grid-cols-[200px_1fr]">
          <div className="hud-label pt-1">02 · how it works</div>
          <ol className="space-y-5">
            {p.how.map((h, k) => (
              <Reveal key={k} delay={k * 0.05}>
                <li className="flex gap-4">
                  <span className="font-mono text-sm text-arc">0{k + 1}</span>
                  <span className="leading-relaxed text-steel-300">{h}</span>
                </li>
              </Reveal>
            ))}
          </ol>
        </section>

        <Reveal className="mt-16"><Flow nodes={p.flow} title={p.flowTitle} note={p.flowNote} /></Reveal>

        <section className="mt-16 grid gap-10 md:grid-cols-[200px_1fr]">
          <div className="hud-label pt-1">03 · flight log</div>
          <ul className="space-y-3 font-mono text-[13px]">
            {p.highlights.map((h) => (
              <li key={h} className="flex gap-3 border-l border-arc/30 pl-4 text-steel-300"><span className="text-arc">›</span>{h}</li>
            ))}
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
          <div className="hud-label pt-1">04 · built with</div>
          <div className="flex flex-wrap gap-1.5">{p.stack.map((s) => <span key={s} className="chip">{s}</span>)}</div>
        </section>

        <Link href={`/work/${next.slug}`} className="group mt-24 mb-16 block border-t border-white/[0.07] pt-10">
          <div className="hud-label">next suit · {next.mark}</div>
          <div className="mt-2 font-display text-4xl font-bold uppercase text-steel-400 transition-colors group-hover:text-arc md:text-6xl">{next.name} →</div>
        </Link>
      </article>
      <Footer />
    </main>
  );
}
