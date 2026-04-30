import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useGameStore } from "@/store/gameStore";

const FACTION_REACTIONS = [
  { short: "GRÜN", icon: "🌿", reaction: "😊 +18", positive: true },
  { short: "WIRT", icon: "💼", reaction: "😡 −12", positive: false },
  { short: "BÜRG", icon: "🏘️", reaction: "😊 +8", positive: true },
  { short: "HAND", icon: "🔧", reaction: "😐 0", positive: null },
  { short: "KONS", icon: "🏛️", reaction: "😡 −5", positive: false },
];

export function PendingDecision() {
  const decision = useGameStore((s) => s.pendingDecision);

  if (!decision) {
    return (
      <p className="text-xs text-stone-400 italic text-center pt-8">
        Keine offenen Anträge.
      </p>
    );
  }

  return (
    <Card className="border-amber-200 bg-amber-50/50">
      <CardHeader className="pb-2 pt-4 px-4">
        <div className="flex items-start gap-3">
          {decision.image && (
            <img
              src={decision.image}
              alt={decision.imageAlt ?? "Antragsteller"}
              className="w-12 h-12 rounded-full object-cover shrink-0 border-2 border-amber-200 shadow-sm"
            />
          )}
          <div className="flex flex-col gap-1 min-w-0">
            <Badge
              variant="outline"
              className="text-amber-700 border-amber-400 bg-amber-100 text-xs w-fit"
            >
              📋 Antrag
            </Badge>
            <CardTitle className="text-sm text-stone-800">
              {decision.title}
            </CardTitle>
          </div>
        </div>
      </CardHeader>
      <CardContent className="px-4 pb-4 space-y-4">
        <p className="text-xs text-stone-600">{decision.text}</p>

        <Separator className="bg-amber-200" />

        {/* Faction reactions */}
        <div className="space-y-1">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide mb-2">
            Fraktionsreaktionen
          </p>
          {FACTION_REACTIONS.map((f) => (
            <div
              key={f.short}
              className="flex items-center justify-between text-xs"
            >
              <span className="flex items-center gap-1 text-stone-600">
                <span>{f.icon}</span>
                <span>{f.short}</span>
              </span>
              <span
                className={
                  f.positive === true
                    ? "text-emerald-600 font-medium"
                    : f.positive === false
                      ? "text-red-600 font-medium"
                      : "text-stone-400"
                }
              >
                {f.reaction}
              </span>
            </div>
          ))}
        </div>

        <Separator className="bg-amber-200" />

        {/* Action buttons */}
        <div className="flex gap-2 flex-wrap">
          <Button
            size="sm"
            className="bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8"
          >
            ✓ Zustimmen
          </Button>
          <Button
            size="sm"
            className="bg-red-600 hover:bg-red-700 text-white text-xs h-8"
          >
            ✗ Ablehnen
          </Button>
          <Button
            size="sm"
            variant="outline"
            className="text-xs h-8 border-stone-400 text-stone-700"
          >
            ⚖ Verhandeln
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
