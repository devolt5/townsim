import { Separator } from "@/components/ui/separator";
import { FactionChip } from "@/components/TrustBar";
import { useGameStore } from "@/store/gameStore";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";

export function Footer() {
  const { factions, advanceTurn } = useGameStore();
  const TOTAL_SEATS = factions.reduce((sum, f) => sum + f.seats, 0);
  const MAJORITY = Math.ceil(TOTAL_SEATS / 2) + 1;
  return (
    <footer className="bg-stone-800 px-4 py-2 flex items-center gap-4 border-t border-stone-700 shrink-0 min-h-13">
      <div className="flex flex-col shrink-0">
        <span className="text-stone-500 text-[10px] font-bold uppercase tracking-wider">
          Fraktionen
        </span>
        <div className="text-stone-400 text-[10px] whitespace-nowrap">
          Mehrheit: <span className="text-stone-200 font-bold">{MAJORITY}</span>{" "}
          / {TOTAL_SEATS}
        </div>
      </div>
      <Separator orientation="vertical" className="h-8 bg-stone-600 shrink-0" />
      <div className="flex items-center gap-5 flex-1 overflow-x-auto flex-nowrap scrollbar-none">
        {factions.map((f) => (
          <FactionChip key={f.short} faction={f} />
        ))}
      </div>
      <Separator orientation="vertical" className="h-8 bg-stone-600 shrink-0" />
      <Button
        onClick={advanceTurn}
        size="sm"
        className="bg-amber-600 cursor-pointer hover:bg-amber-500 text-white font-bold px-4 h-9 shadow-lg shadow-amber-900/20 border-b-2 border-amber-800 active:border-b-0 active:translate-y-[1px] transition-all flex gap-2 group"
      >
        <span>Nächste Phase</span>
        <ChevronRight
          size={16}
          className="group-hover:translate-x-0.5 transition-transform"
        />
      </Button>
    </footer>
  );
}
