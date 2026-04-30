import { useState } from "react";
import { Settings2 } from "lucide-react";
import { MetricBar } from "@/components/MetricBar";
import { METRICS, BASIC_GAME_DATA, updateBasicGameData } from "@/data/gameData";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function Header({ onCityOverview }: { onCityOverview?: () => void }) {
  const [showSettings, setShowSettings] = useState(false);
  const [cityName, setCityName] = useState(BASIC_GAME_DATA.cityName);
  const [playerName, setPlayerName] = useState(BASIC_GAME_DATA.playerName);

  // Displayed city name reflects saved state
  const [displayedCityName, setDisplayedCityName] = useState(
    BASIC_GAME_DATA.cityName,
  );

  function handleOpenSettings() {
    setCityName(BASIC_GAME_DATA.cityName);
    setPlayerName(BASIC_GAME_DATA.playerName);
    setShowSettings(true);
  }

  function handleSave() {
    updateBasicGameData({ cityName, playerName });
    setDisplayedCityName(cityName);
    setShowSettings(false);
  }

  return (
    <>
      <header className="bg-stone-800 text-white px-4 py-2 flex items-center gap-4 shadow-md shrink-0 h-14">
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-lg font-bold">🏙 {displayedCityName}</span>
          <span className="text-stone-400 text-sm">· Jahr 1</span>
          <button
            onClick={handleOpenSettings}
            className="cursor-pointer text-stone-400 hover:text-white transition-colors p-1 rounded"
            title="Einstellungen"
          >
            <Settings2 size={15} />
          </button>
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

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowSettings(false)}>
              Abbrechen
            </Button>
            <Button onClick={handleSave}>Speichern</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
