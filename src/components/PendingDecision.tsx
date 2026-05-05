import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { useGameStore } from "@/store/gameStore";
import { DECISION_OPTIONS } from "@/data/types/decision";
import type { DecisionVariant } from "@/data/types/decision";
import { ChevronLeft, ChevronRight } from "lucide-react";

function reactionLabel(delta: number): string {
  if (delta > 0) return `😊 +${delta}`;
  if (delta < 0) return `😡 −${Math.abs(delta)}`;
  return "😐 0";
}

function buttonClass(variant: DecisionVariant): string {
  if (variant === "accept")
    return "bg-emerald-600 hover:bg-emerald-700 text-white text-xs h-8";
  return "text-xs h-8 border-stone-400 text-stone-700";
}

function chosenOptionBadge(chosenOption: string) {
  if (chosenOption.includes("Zustimmen"))
    return (
      <Badge className="text-[10px] bg-emerald-100 text-emerald-700 border-emerald-300 hover:bg-emerald-100">
        ✓ Genehmigt
      </Badge>
    );
  if (chosenOption.includes("Verhandeln"))
    return (
      <Badge className="text-[10px] bg-sky-100 text-sky-700 border-sky-300 hover:bg-sky-100">
        ⚖ Verhandelt
      </Badge>
    );
  return (
    <Badge className="text-[10px] bg-red-100 text-red-700 border-red-300 hover:bg-red-100">
      ✗ Abgelehnt
    </Badge>
  );
}

export function PendingDecision() {
  const turn = useGameStore((s) => s.turn);
  const decisions = useGameStore((s) => s.pendingDecisions);
  const factions = useGameStore((s) => s.factions);
  const resolveDecision = useGameStore((s) => s.resolveDecision);
  const decisionHistory = useGameStore((s) => s.decisionHistory);

  const [currentIndex, setCurrentIndex] = useState(0);

  const hasPending = decisions.length > 0;
  const safeIndex = Math.min(currentIndex, Math.max(0, decisions.length - 1));
  const decision = decisions[safeIndex];
  const total = decisions.length;

  return (
    <div className="space-y-3">
      {/* Pending decisions */}
      {hasPending ? (
        <>
          <p className="text-md font-bold text-stone-800 text-center">
            Wähle einen Antrag aus
          </p>
          {/* Pagination */}
          <div className="flex items-center gap-1 shrink-0 justify-center mb-4">
            <Button
              variant="ghost"
              size="icon"
              className="cursor-pointer h-5 w-5 text-stone-500 hover:text-stone-800 disabled:opacity-30"
              disabled={safeIndex === 0}
              onClick={() => setCurrentIndex((i) => i - 1)}
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </Button>
            <span className="text-xs text-stone-500 tabular-nums">
              {safeIndex + 1} / {total}
            </span>
            <Button
              variant="ghost"
              size="icon"
              className="cursor-pointer h-5 w-5 text-stone-500 hover:text-stone-800 disabled:opacity-30"
              disabled={safeIndex === total - 1}
              onClick={() => setCurrentIndex((i) => i + 1)}
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </Button>
          </div>
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
                {decision.factionReactions.map((r) => {
                  const faction = factions.find(
                    (f) => f.short === r.factionShort,
                  );
                  return (
                    <div
                      key={r.factionShort}
                      className="flex items-center justify-between text-xs"
                    >
                      <span className="flex items-center gap-1 text-stone-600">
                        {faction?.image ? (
                          <img
                            src={faction.image}
                            alt={faction.short}
                            className="w-5 h-5 rounded-full object-cover"
                          />
                        ) : (
                          <span>❓</span>
                        )}
                        <span>{r.factionShort}</span>
                      </span>
                      <span
                        className={
                          r.delta > 0
                            ? "text-emerald-600 font-medium"
                            : r.delta < 0
                              ? "text-red-600 font-medium"
                              : "text-stone-400"
                        }
                      >
                        {reactionLabel(r.delta)}
                      </span>
                    </div>
                  );
                })}
              </div>

              <Separator className="bg-amber-200" />

              {/* Action buttons */}
              <div className="flex gap-2 flex-wrap">
                {DECISION_OPTIONS.map((opt) => (
                  <Button
                    key={opt.variant}
                    size="sm"
                    variant={
                      opt.variant === "negotiate" ? "outline" : "default"
                    }
                    className={buttonClass(opt.variant) + " cursor-pointer"}
                    onClick={() => resolveDecision(decision.id, opt.label)}
                  >
                    {opt.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </>
      ) : (
        turn.phase === 1 && (
          <p className="text-xs text-stone-400 italic text-center pt-8">
            Keine offenen Anträge.
          </p>
        )
      )}

      {/* History list - only visible if phase is not 1 */}
      {decisionHistory.length > 0 && turn.phase !== 1 && (
        <div className="space-y-2 pt-2">
          <p className="text-xs font-semibold text-stone-500 uppercase tracking-wide">
            Bearbeitete Anträge ({decisionHistory.length})
          </p>
          <ul className="space-y-1.5">
            {decisionHistory.map((entry, i) => (
              <li
                key={i}
                className="flex items-center justify-between gap-2 text-xs text-stone-600"
              >
                <span className="truncate">{entry.title}</span>
                {chosenOptionBadge(entry.chosenOption)}
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
