import { useGameStore } from "@/store/gameStore";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface FactionWindowProps {
  factionShort: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FactionWindow({
  factionShort,
  open,
  onOpenChange,
}: FactionWindowProps) {
  const factions = useGameStore((state) => state.factions);
  const faction = factionShort
    ? factions.find((f) => f.short === factionShort)
    : null;

  if (!faction) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <div className="flex items-start gap-4">
          <img
            src={faction.image}
            alt={faction.short}
            className="w-16 h-16 object-cover rounded shrink-0"
          />
          <DialogHeader className="grow">
            <DialogTitle>{faction.short}</DialogTitle>
          </DialogHeader>
        </div>

        <Card className="p-4">
          <div className="space-y-4">
            <p className="text-sm text-muted-foreground leading-relaxed">
              {faction.description}
            </p>

            <div>
              <div className="flex justify-between items-center mb-2 mt-4">
                <span className="text-sm font-medium">Vertrauen</span>
                <span className="text-sm font-semibold">{faction.trust}%</span>
              </div>
              <Progress value={faction.trust} className="h-2" />
            </div>

            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Sitze im Rat</span>
              <span className="text-sm font-semibold">{faction.seats}</span>
            </div>
          </div>
        </Card>
      </DialogContent>
    </Dialog>
  );
}
