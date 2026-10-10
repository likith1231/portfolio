import Reveal from "./Reveal";

// Editorial section heading: numbered badge, kicker, a big title whose last word is set in italic gold.
export default function SectionHead({ code, title, kicker, children }: { code: string; title: string; kicker: string; children?: React.ReactNode }) {
  const words = title.trim().split(" ");
  const last = words.pop();
  return (
    <Reveal className="mb-14 max-w-3xl">
      <div className="mb-5 flex items-center gap-3 font-mono text-[11px] uppercase tracking-[0.28em] text-gold">
        <span className="grid h-7 min-w-7 place-items-center rounded-full border border-hot/60 px-2 text-hot">{code}</span>
        <span>{kicker}</span>
      </div>
      <h2 className="font-display text-[2.6rem] font-bold leading-[1.02] tracking-tight text-[#f3e6cf] md:text-6xl">
        {words.join(" ")}{words.length ? " " : ""}
        <span className="gold-text font-serif font-normal italic">{last}</span>
      </h2>
      {children && <p className="mt-6 text-base leading-relaxed text-steel-300 md:text-lg">{children}</p>}
    </Reveal>
  );
}
