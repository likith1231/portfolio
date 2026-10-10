import Reveal from "./Reveal";

// Section heading: a code-tag kicker like < WORKS />, then a big title whose last word is set in italic gold.
// `compact` drops the outer margin, for headings that sit inside a tile.
export default function SectionHead({ code, title, kicker, children, compact = false }: { code: string; title: string; kicker: string; children?: React.ReactNode; compact?: boolean }) {
  const words = title.trim().split(" ");
  const last = words.pop();
  return (
    <Reveal className={compact ? "max-w-3xl" : "mb-14 max-w-3xl"}>
      <div className="mb-5 flex items-center gap-3 font-mono text-xs uppercase tracking-[0.22em]">
        <span className="text-steel-500">{code}</span>
        <span><span className="text-hot">&lt;</span> <span className="text-white">{kicker}</span> <span className="text-gold">/&gt;</span></span>
      </div>
      <h2 className="font-display text-[2.4rem] font-bold leading-[1.02] tracking-tight text-[#f3e6cf] md:text-6xl">
        {words.join(" ")}{words.length ? " " : ""}
        <span className="gold-text font-serif font-normal italic">{last}</span>
      </h2>
      {children && <p className="mt-6 text-base leading-relaxed text-steel-300 md:text-lg">{children}</p>}
    </Reveal>
  );
}
