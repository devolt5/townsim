import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Delegate } from "@/data/types/delegate";

const FACTION_BADGE_COLORS: Record<string, string> = {
  Terra: "bg-green-600 text-white",
  Syndikat: "bg-blue-600 text-white",
  Bürger: "bg-orange-600 text-white",
  "Union der Gilden": "bg-red-500 text-white",
  "Der Bund": "bg-neutral-700 text-white",
};

interface DelegateInfoProps {
  delegate: Delegate | null;
}

export function DelegateInfo({ delegate }: DelegateInfoProps) {
  if (!delegate) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-stone-400 gap-2 py-8">
        <span className="text-4xl">🏛️</span>
        <p className="font-medium text-stone-500 text-sm">
          Kein Delegierter gewählt
        </p>
        <p className="text-xs text-center px-4">
          Klicke auf einen Sitz im Parlament, um Details zu sehen.
        </p>
      </div>
    );
  }

  const badgeClass =
    FACTION_BADGE_COLORS[delegate.faction] ?? "bg-stone-500 text-white";

  return (
    <Card className="border-stone-200">
      <CardHeader className="pb-2 pt-3 px-4">
        <div className="flex flex-row items-center gap-3">
          <img
            src={delegate.imageUrl}
            alt={delegate.name}
            className="w-12 h-12 rounded-full object-cover ring-2 ring-amber-400 shrink-0"
          />
          <div className="flex flex-col gap-1 min-w-0">
            <CardTitle className="text-sm text-stone-800 leading-tight">
              {delegate.name}
            </CardTitle>
            <span className="text-[10px] text-stone-500">{delegate.title}</span>
            <Badge
              className={`self-start text-[10px] px-1.5 py-0 ${badgeClass}`}
            >
              {delegate.faction}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4 pt-1">
        <p className="text-sm text-stone-600 leading-relaxed">{delegate.bio}</p>
        <div className="flex flex-col gap-0.5 mt-3 text-[10px] text-stone-400">
          <span>
            <span className="font-semibold text-stone-500">Reihe:</span>{" "}
            {delegate.row + 1}
          </span>
          <span>
            <span className="font-semibold text-stone-500">Sitz:</span>{" "}
            {delegate.seatIndex + 1}
          </span>
        </div>
        <Button className="mt-4 w-full cursor-pointer rounded-full h-auto py-2 bg-green-600 hover:bg-green-700 text-white font-semibold text-sm shadow-none">
          📞 Anrufen
        </Button>
      </CardContent>
    </Card>
  );
}
