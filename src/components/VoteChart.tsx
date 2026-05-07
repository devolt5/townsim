// Pure SVG donut chart — no Recharts, no D3, no large bundle.
// Replaces the previous Recharts PieChart to avoid 500 KB D3 parse-blocking the main thread.

const SLICES = [
  { key: "yes" as const, label: "Dafür", color: "#22c55e" },
  { key: "undecided" as const, label: "Unschlüssig", color: "#6b7280" },
  { key: "no" as const, label: "Dagegen", color: "#ef4444" },
];

interface VoteChartProps {
  yes: number;
  undecided: number;
  no: number;
  majority: number;
  totalSeats: number;
}

function donutPath(
  cx: number,
  cy: number,
  r: number,
  innerR: number,
  startDeg: number,
  endDeg: number,
): string {
  const toRad = (deg: number) => ((deg - 90) * Math.PI) / 180;
  const s = toRad(startDeg);
  const e = toRad(endDeg);
  const large = endDeg - startDeg > 180 ? 1 : 0;
  const ox1 = cx + r * Math.cos(s),
    oy1 = cy + r * Math.sin(s);
  const ox2 = cx + r * Math.cos(e),
    oy2 = cy + r * Math.sin(e);
  const ix1 = cx + innerR * Math.cos(e),
    iy1 = cy + innerR * Math.sin(e);
  const ix2 = cx + innerR * Math.cos(s),
    iy2 = cy + innerR * Math.sin(s);
  return `M${ox1},${oy1} A${r},${r} 0 ${large},1 ${ox2},${oy2} L${ix1},${iy1} A${innerR},${innerR} 0 ${large},0 ${ix2},${iy2} Z`;
}

export function VoteChart({ yes, undecided, no }: VoteChartProps) {
  const total = yes + undecided + no || 1;
  const values = { yes, undecided, no };

  const arcs: { key: string; label: string; color: string; path: string }[] =
    [];
  let angle = 0;
  for (const slice of SLICES) {
    const val = values[slice.key];
    const span = (val / total) * 360;
    if (span > 0) {
      arcs.push({
        key: slice.key,
        label: slice.label,
        color: slice.color,
        path: donutPath(100, 100, 90, 55, angle, angle + span),
      });
    }
    angle += span;
  }

  return (
    <div className="flex flex-col items-center gap-4 w-full">
      <svg viewBox="0 0 200 200" className="h-52 w-52" aria-hidden>
        {arcs.map((arc) => (
          <path
            key={arc.key}
            d={arc.path}
            fill={arc.color}
            stroke="#fff"
            strokeWidth={2}
          />
        ))}
        <text
          x="100"
          y="95"
          textAnchor="middle"
          fontSize={13}
          fill="#57534e"
          fontWeight={600}
        >
          {yes}
        </text>
        <text x="100" y="112" textAnchor="middle" fontSize={10} fill="#a8a29e">
          Dafür
        </text>
      </svg>

      {/* Legend */}
      <div className="flex gap-6 text-sm">
        {SLICES.map((s) => (
          <div key={s.key} className="flex items-center gap-1.5">
            <span
              className="inline-block w-3 h-3 rounded-full shrink-0"
              style={{ backgroundColor: s.color }}
            />
            <span className="text-stone-600">{s.label}</span>
            <span className="font-bold text-stone-900">{values[s.key]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
