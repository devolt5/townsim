import { Separator } from "@/components/ui/separator";
import { FactionChip } from "@/components/TrustBar";
import { useGameStore } from "@/store/gameStore";

export function Footer() {
  const factions = useGameStore((s) => s.factions);
  const TOTAL_SEATS = factions.reduce((sum, f) => sum + f.seats, 0);
  const MAJORITY = Math.ceil(TOTAL_SEATS / 2) + 1;
  return (
    <footer className="bg-stone-800 px-4 py-2 flex items-center gap-4 border-t border-stone-700 shrink-0 min-h-13">
      <span className="text-stone-500 text-xs font-bold uppercase tracking-wider shrink-0">
        Fraktionen
      </span>
      <Separator orientation="vertical" className="h-6 bg-stone-600 shrink-0" />
      <div className="flex items-center gap-5 flex-1 overflow-x-auto flex-nowrap scrollbar-none">
        {factions.map((f) => (
          <FactionChip key={f.short} faction={f} />
        ))}
      </div>
      <Separator orientation="vertical" className="h-6 bg-stone-600 shrink-0" />
      <div className="text-stone-400 text-xs shrink-0">
        Mehrheit: <span className="text-stone-200 font-bold">{MAJORITY}</span> /{" "}
        {TOTAL_SEATS} Sitze
      </div>
    </footer>
  );
}
