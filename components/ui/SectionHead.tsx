import Reveal from "./Reveal";

export default function SectionHead({ code, title, kicker, children }: { code: string; title: string; kicker: string; children?: React.ReactNode }) {
  return (
    <Reveal className="mb-12 max-w-3xl">
      <div className="hud-label mb-4 flex items-center gap-3">
        <span className="text-arc">{code}</span>
        <span className="h-px w-10 bg-arc/40" />
        <span>{kicker}</span>
      </div>
      <h2 className="font-display text-4xl font-semibold uppercase tracking-tight text-white md:text-6xl">{title}</h2>
      {children && <p className="mt-5 text-base leading-relaxed text-steel-300 md:text-lg">{children}</p>}
    </Reveal>
  );
}
