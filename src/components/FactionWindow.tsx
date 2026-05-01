import { useState } from "react";
import { useGameStore } from "@/store/gameStore";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

export function FactionWindow() {
  const [open, setOpen] = useState(false);
  const factions = useGameStore((state) => state.factions);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Fraktionen</Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Fraktionsübersicht</DialogTitle>
          <DialogDescription>
            Aktuelle Informationen zu allen Fraktionen in der Stadt
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 mt-4">
          {factions.map((faction) => (
            <Card key={faction.short} className="p-4">
              <div className="flex items-start gap-4">
                {/* Icon und Name */}
                <div className="flex flex-col items-center flex-shrink-0">
                  <div className="text-3xl mb-2">{faction.icon}</div>
                  <h3 className="font-semibold text-sm text-center">
                    {faction.short}
                  </h3>
                </div>

                {/* Infos */}
                <div className="flex-grow">
                  {/* Trust */}
                  <div className="mb-3">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-sm font-medium">Vertrauen</span>
                      <span className="text-sm text-gray-600">
                        {faction.trust}%
                      </span>
                    </div>
                    <Progress value={faction.trust} className="h-2" />
                  </div>

                  {/* Seats */}
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium">Sitze:</span>
                    <span className="text-sm text-gray-600">
                      {faction.seats}
                    </span>
                  </div>
                </div>

                {/* Faction Image */}
                <div className="flex-shrink-0">
                  <img
                    src={faction.image}
                    alt={faction.short}
                    className="w-20 h-20 object-cover rounded"
                  />
                </div>
              </div>
            </Card>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
