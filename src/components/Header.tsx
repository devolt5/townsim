import { MetricBar } from "@/components/MetricBar";
import { METRICS } from "@/data/gameData";

export function Header() {
  return (
    <header className="bg-stone-800 text-white px-4 py-2 flex items-center gap-6 shadow-md shrink-0 h-14">
      <div className="flex items-center gap-2 shrink-0">
        <span className="text-lg font-bold">🏙 Neustadt</span>
        <span className="text-stone-400 text-sm">· Jahr 1</span>
      </div>
      <div className="flex gap-5 flex-1 justify-end flex-wrap">
        {METRICS.map((m) => (
          <MetricBar key={m.key} metric={m} />
        ))}
      </div>
    </header>
  );
}
