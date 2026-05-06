import { useState } from "react";
import { Settings, Map, Building2 } from "lucide-react";
import { MetricBar } from "@/components/MetricBar";
import { useGameStore } from "@/store/gameStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export function Header({
  onCityOverview,
  onParliament,
}: {
  onCityOverview?: () => void;
  onParliament?: () => void;
}) {
  const { metrics, basicData, turn, updateBasicData, resetGame } =
    useGameStore();
  const [showSettings, setShowSettings] = useState(false);
  const [cityName, setCityName] = useState(basicData.cityName);
  const [playerName, setPlayerName] = useState(basicData.playerName);

  function handleOpenSettings() {
    setCityName(basicData.cityName);
    setPlayerName(basicData.playerName);
    setShowSettings(true);
  }

  function handleSave() {
    updateBasicData({ cityName, playerName });
    setShowSettings(false);
  }

  return (
    <>
      <header className="bg-stone-800 text-white px-4 py-2 flex items-center gap-4 shadow-md shrink-0 h-14">
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-lg font-bold">🏬 {basicData.cityName}</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <div className="flex items-center gap-1.5 px-2 py-1 bg-stone-700/50 rounded-md border border-stone-600/50">
                  <span className="text-stone-100 text-[10px] uppercase font-semibold">
                    📅 {turn.year}
                  </span>
                  <span className="text-stone-500 text-[10px]">|</span>
                  <span className="text-stone-100 text-[10px] uppercase font-semibold">
                    🕒 {turn.quarter}
                  </span>
                  <span className="text-stone-500 text-[10px]">|</span>
                  <span className="text-stone-100 text-[10px] uppercase font-semibold">
                    ⚡{" "}
                    {turn.phase === 1
                      ? "Berichte"
                      : turn.phase === 2
                        ? "Planung"
                        : "Abstimmung"}
                  </span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>
                  Jahr {turn.year}, Quartal {turn.quarter}, Phase {turn.phase}
                </p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger>
                <button
                  onClick={handleOpenSettings}
                  className="cursor-pointer text-stone-400 hover:text-white transition-colors p-1 rounded"
                >
                  <Settings size={25} />
                </button>
              </TooltipTrigger>
              <TooltipContent>
                <p>Einstellungen</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
          <TooltipProvider>
            {onCityOverview && (
              <Tooltip>
                <TooltipTrigger>
                  <button
                    onClick={onCityOverview}
                    className="cursor-pointer text-stone-400 hover:text-white transition-colors p-1 rounded"
                  >
                    <Map size={25} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Stadtübersicht</p>
                </TooltipContent>
              </Tooltip>
            )}
            {onParliament && (
              <Tooltip>
                <TooltipTrigger>
                  <button
                    onClick={onParliament}
                    className="cursor-pointer text-stone-400 hover:text-white transition-colors p-1 rounded"
                  >
                    <Building2 size={25} />
                  </button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Stadtrat</p>
                </TooltipContent>
              </Tooltip>
            )}
          </TooltipProvider>
        </div>
        <div className="flex gap-4 flex-1 overflow-x-auto flex-nowrap justify-end scrollbar-none">
          {metrics.map((m) => (
            <MetricBar key={m.key} metric={m} />
          ))}
        </div>
      </header>

      <Dialog
        open={showSettings}
        onOpenChange={(o) => !o && setShowSettings(false)}
      >
        <DialogContent className="sm:max-w-sm">
          <DialogHeader>
            <DialogTitle>Einstellungen</DialogTitle>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-stone-700">
                Stadtname
              </label>
              <Input
                value={cityName}
                onChange={(e) => setCityName(e.target.value)}
                placeholder="z. B. Neustadt"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-stone-700">
                Dein Name
              </label>
              <Input
                value={playerName}
                onChange={(e) => setPlayerName(e.target.value)}
                placeholder="z. B. Maria Müller"
              />
            </div>
          </div>

          <DialogFooter className="flex-col gap-2 sm:flex-col">
            <div className="flex gap-2 justify-end">
              <Button
                variant="outline"
                className="cursor-pointer"
                onClick={() => setShowSettings(false)}
              >
                Abbrechen
              </Button>
              <Button className="cursor-pointer" onClick={handleSave}>
                Speichern
              </Button>
            </div>
            <Button
              variant="destructive"
              className="w-full cursor-pointer"
              onClick={() => {
                resetGame();
                setShowSettings(false);
              }}
            >
              🗑 Neues Spiel (Spielstand löschen)
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
