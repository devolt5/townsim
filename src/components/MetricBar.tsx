import type { Metric } from "@/data/gameData";

interface MetricBarProps {
  metric: Metric;
}

export function MetricBar({ metric }: MetricBarProps) {
  return (
    <div className="flex items-center gap-1.5 min-w-36">
      <span className="text-base leading-none">{metric.icon}</span>
      <div className="flex-1 min-w-0">
        <div className="flex justify-between text-xs text-stone-300 mb-0.5">
          <span className="truncate">{metric.label}</span>
          <span className="font-bold ml-1">{metric.value}</span>
        </div>
        <div className="h-1.5 bg-stone-600 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full ${metric.color}`}
            style={{ width: `${metric.value}%` }}
          />
        </div>
      </div>
    </div>
  );
}
