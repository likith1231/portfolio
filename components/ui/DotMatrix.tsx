// Numbers drawn as a 5×7 dot matrix, like an old HUD readout.
const GLYPHS: Record<string, string[]> = {
  "0": ["01110", "10001", "10011", "10101", "11001", "10001", "01110"],
  "1": ["00100", "01100", "00100", "00100", "00100", "00100", "01110"],
  "2": ["01110", "10001", "00001", "00010", "00100", "01000", "11111"],
  "3": ["11110", "00001", "00001", "01110", "00001", "00001", "11110"],
  "4": ["00010", "00110", "01010", "10010", "11111", "00010", "00010"],
  "5": ["11111", "10000", "11110", "00001", "00001", "10001", "01110"],
  "6": ["00110", "01000", "10000", "11110", "10001", "10001", "01110"],
  "7": ["11111", "00001", "00010", "00100", "01000", "01000", "01000"],
  "8": ["01110", "10001", "10001", "01110", "10001", "10001", "01110"],
  "9": ["01110", "10001", "10001", "01111", "00001", "00010", "01100"],
  ":": ["0", "0", "1", "0", "1", "0", "0"],
  ".": ["0", "0", "0", "0", "0", "0", "1"],
  " ": ["0", "0", "0", "0", "0", "0", "0"],
};

export default function DotMatrix({ value, dot = 6, className = "" }: { value: string; dot?: number; className?: string }) {
  const gap = dot * 0.45;
  const step = dot + gap;
  let x = 0;
  const cells: { x: number; y: number; on: boolean }[] = [];
  for (const ch of value) {
    const g = GLYPHS[ch] ?? GLYPHS[" "];
    const w = g[0].length;
    g.forEach((row, r) => [...row].forEach((c, k) => cells.push({ x: x + k * step, y: r * step, on: c === "1" })));
    x += w * step + step * 0.8;
  }
  const W = Math.max(0, x - step * 0.8 - gap), H = 7 * step - gap;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} className={className} role="img" aria-label={value}>
      {cells.map((c, i) => (
        <rect key={i} x={c.x} y={c.y} width={dot} height={dot} rx={dot * 0.3}
          className={c.on ? "fill-gold" : "fill-white/[0.05]"} />
      ))}
    </svg>
  );
}
