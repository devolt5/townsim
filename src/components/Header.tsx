import { useEffect, useState } from "react";
import { MetricBar } from "@/components/MetricBar";
import { METRICS } from "@/data/gameData";
import { GameDialog } from "@/components/GameDialog";
import { welcomeDialog } from "@/data/dialogs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function Header({ onCityOverview }: { onCityOverview?: () => void }) {
  const [showTutorial, setShowTutorial] = useState(false);
  const [tooltipOpen, setTooltipOpen] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setTooltipOpen(false), 10000);
    return () => clearTimeout(timer);
  }, []);

  const handleOpenTutorial = () => {
    setShowTutorial(true);
    setTooltipOpen(false);
  };

  return (
    <>
      <header className="bg-stone-800 text-white px-4 py-2 flex items-center gap-4 shadow-md shrink-0 h-14">
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-lg font-bold">🏙 Neustadt</span>
          <span className="text-stone-400 text-sm">· Jahr 1</span>
          {onCityOverview && (
            <button
              onClick={onCityOverview}
              className="cursor-pointer text-xs text-stone-300 hover:text-white border border-stone-600 hover:border-stone-400 rounded px-2 py-1 transition-colors"
            >
              🗺 Stadtübersicht
            </button>
          )}
        </div>
        <div className="flex gap-4 flex-1 overflow-x-auto flex-nowrap justify-end scrollbar-none">
          {METRICS.map((m) => (
            <MetricBar key={m.key} metric={m} />
          ))}
        </div>
      </header>
      <GameDialog
        open={showTutorial}
        onClose={() => setShowTutorial(false)}
        data={welcomeDialog}
      />
    </>
  );
}
