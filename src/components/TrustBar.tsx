import { useState } from "react";
import type { Faction } from "@/data/gameData";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

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
  const [open, setOpen] = useState(false);

  return (
    <>
      <div
        className="flex items-center gap-2 text-white shrink-0 cursor-pointer group"
        onClick={() => setOpen(true)}
      >
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

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <span className="text-3xl">{faction.icon}</span>
              {faction.short}
            </DialogTitle>
            <DialogDescription>Fraktionsinformationen</DialogDescription>
          </DialogHeader>

          <Card className="p-4">
            <div className="space-y-4">
              {/* Faction Image */}
              <img
                src={faction.image}
                alt={faction.short}
                className="w-full h-40 object-cover rounded"
              />

              {/* Trust */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium">Vertrauen</span>
                  <span className="text-sm font-semibold">
                    {faction.trust}%
                  </span>
                </div>
                <Progress value={faction.trust} className="h-2" />
              </div>

              {/* Seats */}
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium">Sitze im Rat</span>
                <span className="text-sm font-semibold">{faction.seats}</span>
              </div>
            </div>
          </Card>
        </DialogContent>
      </Dialog>
    </>
  );
}
