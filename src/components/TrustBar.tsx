import type { Faction } from "@/data/gameData";

interface TrustBarProps {
  trust: number;
}

export function TrustBar({ trust }: TrustBarProps) {
  const color =
    trust >= 60
      ? "bg-emerald-400"
      : trust >= 40
        ? "bg-amber-400"
        : trust >= 20
          ? "bg-orange-400"
          : "bg-red-500";

  return (
    <div className="h-1 bg-stone-600 rounded-full overflow-hidden w-16 mt-0.5">
      <div
        className={`h-full rounded-full ${color}`}
        style={{ width: `${trust}%` }}
      />
    </div>
  );
}

interface FactionChipProps {
  faction: Faction;
}

export function FactionChip({ faction }: FactionChipProps) {
  return (
    <div className="flex items-center gap-2 text-white shrink-0 cursor-pointer group">
      <img
        src={faction.image}
        alt={faction.short}
        className="w-7 h-7 rounded-full object-cover border border-stone-600"
      />
      <div>
        <div className="flex items-center gap-1">
          <span className="text-xs font-bold group-hover:text-stone-200 transition-colors">
            {faction.short}
          </span>
          <span className="text-stone-400 text-xs">{faction.seats}</span>
        </div>
        <TrustBar trust={faction.trust} />
      </div>
    </div>
  );
}
