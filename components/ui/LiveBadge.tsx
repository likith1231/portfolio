export default function LiveBadge({ live }: { live: string | null }) {
  return live ? (
    <span className="inline-flex items-center gap-1.5 border border-ok/40 bg-ok/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-ok">
      <span className="h-1.5 w-1.5 rounded-full bg-ok" /> Live
    </span>
  ) : (
    <span className="inline-flex items-center gap-1.5 border border-caution/40 bg-caution/10 px-2 py-0.5 font-mono text-[10px] uppercase tracking-[0.18em] text-caution">
      <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-caution" /> Deploying
    </span>
  );
}
