import { useState } from "react";
import { Settings2 } from "lucide-react";
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

export function Header({ onCityOverview }: { onCityOverview?: () => void }) {
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
          <span className="text-lg font-bold">🏙 {basicData.cityName}</span>
          <span className="text-stone-400 text-sm">· Jahr {turn.year}</span>
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
              <Button variant="outline" onClick={() => setShowSettings(false)}>
                Abbrechen
              </Button>
              <Button onClick={handleSave}>Speichern</Button>
            </div>
            <Button
              variant="destructive"
              className="w-full"
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
