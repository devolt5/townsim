import { useGameStore } from "@/store/gameStore";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/components/ui/chart";
import type { ChartConfig } from "@/components/ui/chart";
import { Pie, PieChart, Cell } from "recharts";
import { ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PETITIONS } from "@/data/petitions";

interface VotingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const chartConfig = {
  dafuer: {
    label: "Dafür",
    color: "#22c55e",
  },
  unschluessig: {
    label: "Unschlüssig",
    color: "#6b7280",
  },
  dagegen: {
    label: "Dagegen",
    color: "#ef4444",
  },
} satisfies ChartConfig;

// Dummy vote distribution — will be replaced by real calculation later
const DUMMY_VOTES = {
  dafuer: 18,
  unschluessig: 7,
  dagegen: 15,
};

function reactionLabel(support: number): string {
  if (support > 0) return `😊 +${support}`;
  if (support < 0) return `😡 −${Math.abs(support)}`;
  return "😐 0";
}

export function VotingModal({ open, onOpenChange }: VotingModalProps) {
  const {
    turn,
    factions,
    petitionHistory,
    activePetitionId,
    castVote,
    hasVotedThisQuarter,
  } = useGameStore();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const isPhase3 = turn.phase === 3;
  const isPhase2Or3 = turn.phase >= 2;

  // Find the full petition data from the store's activePetitionId
  const currentPetition = activePetitionId
    ? PETITIONS.find((p) => p.id === activePetitionId)
    : null;

  // For the display, we also check the history entry to show the chosen option
  const currentPetitionEntry =
    petitionHistory.length > 0
      ? petitionHistory[petitionHistory.length - 1]
      : null;
  const isCurrentTurnLog =
    currentPetitionEntry?.turn.year === turn.year &&
    currentPetitionEntry?.turn.quarter === turn.quarter;

  const totalSeats = factions.reduce((sum, f) => sum + f.seats, 0);
  const majority = Math.ceil(totalSeats / 2) + 1;

  const voteData = [
    {
      name: "dafuer",
      value: DUMMY_VOTES.dafuer,
      label: "Dafür",
      color: "#22c55e",
    },
    {
      name: "unschluessig",
      value: DUMMY_VOTES.unschluessig,
      label: "Unschlüssig",
      color: "#6b7280",
    },
    {
      name: "dagegen",
      value: DUMMY_VOTES.dagegen,
      label: "Dagegen",
      color: "#ef4444",
    },
  ];

  const dafuerSeats = DUMMY_VOTES.dafuer;
  const hasMajority = dafuerSeats >= majority;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg bg-white border-stone-200 text-stone-900">
        <DialogHeader>
          <DialogTitle className="text-stone-900 flex items-center gap-2 text-lg">
            <span>🗳️</span> Abstimmung im Stadtrat
          </DialogTitle>
          {isPhase2Or3 && isCurrentTurnLog && currentPetitionEntry && (
            <div className="mt-1 flex items-center gap-2">
              <span className="text-sm text-stone-500 font-medium italic">
                Antrag: {currentPetitionEntry.title}
              </span>
              <button
                onClick={() => setDetailsOpen(true)}
                className="text-amber-600 hover:text-amber-700 cursor-pointer flex items-center gap-1 text-xs font-bold"
              >
                <ExternalLink size={12} />
                Details
              </button>
            </div>
          )}
        </DialogHeader>

        <div className="space-y-6">
          {/* Phase hint */}
          {!isPhase3 && (
            <div className="bg-stone-100 border border-stone-200 rounded-md px-4 py-3 text-sm text-stone-500">
              Eine Abstimmung ist nur in{" "}
              <span className="text-amber-600 font-semibold">Phase 3</span>{" "}
              möglich. Aktuell: Jahr {turn.year}, Quartal {turn.quarter}, Phase{" "}
              {turn.phase}.
            </div>
          )}

          {/* Pie chart */}
          <div className="flex flex-col items-center gap-4">
            <ChartContainer config={chartConfig} className="h-52 w-52">
              <PieChart>
                <ChartTooltip
                  content={
                    <ChartTooltipContent
                      nameKey="name"
                      hideLabel
                      className="text-black"
                      formatter={(value, name) => (
                        <span className="text-black">
                          {chartConfig[name as keyof typeof chartConfig]
                            ?.label ?? name}
                          : <strong>{value} Sitze</strong>
                        </span>
                      )}
                    />
                  }
                />
                <Pie
                  data={voteData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={90}
                  strokeWidth={2}
                  stroke="#ffffff"
                >
                  {voteData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ChartContainer>

            {/* Legend */}
            <div className="flex gap-6 text-sm">
              {voteData.map((entry) => (
                <div key={entry.name} className="flex items-center gap-1.5">
                  <span
                    className="inline-block w-3 h-3 rounded-full shrink-0"
                    style={{ backgroundColor: entry.color }}
                  />
                  <span className="text-stone-600">{entry.label}</span>
                  <span className="font-bold text-stone-900">
                    {entry.value}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Majority indicator */}
          <div className="bg-stone-50 border border-stone-200 rounded-md px-4 py-3 flex items-center justify-between text-sm">
            <span className="text-stone-500">
              Erforderliche Mehrheit:{" "}
              <span className="text-stone-900 font-semibold">{majority}</span> /{" "}
              {totalSeats} Sitze
            </span>
            <span
              className={`font-bold ${hasMajority ? "text-green-600" : "text-red-600"}`}
            >
              {hasMajority ? "✓ Mehrheit vorhanden" : "✗ Keine Mehrheit"}
            </span>
          </div>

          {/* Details sub-modal / Dialog */}
          <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
            <DialogContent className="max-w-md bg-amber-50 border-amber-200">
              <DialogHeader>
                <DialogTitle className="text-stone-800">
                  Antragsdetails
                </DialogTitle>
              </DialogHeader>
              {currentPetition && (
                <Card className="border-amber-200 bg-white">
                  <CardHeader className="pb-2 pt-4 px-4">
                    <div className="flex items-start gap-3">
                      {currentPetition.image && (
                        <img
                          src={currentPetition.image}
                          alt={currentPetition.imageAlt ?? "Antragsteller"}
                          className="w-12 h-12 rounded-full object-cover shrink-0 border-2 border-amber-200 shadow-sm"
                        />
                      )}
                      <div className="flex flex-col gap-1 min-w-0">
                        <Badge
                          variant="outline"
                          className="text-amber-700 border-amber-400 bg-amber-100 text-xs w-fit"
                        >
                          📋 Aktueller Antrag
                        </Badge>
                        <CardTitle className="text-sm text-stone-800">
                          {currentPetition.title}
                        </CardTitle>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="px-4 pb-4 space-y-4">
                    <p className="text-xs text-stone-600">
                      {currentPetition.text}
                    </p>

                    <Separator className="bg-amber-100" />

                    <div className="space-y-1">
                      <p className="text-[10px] font-semibold text-stone-500 uppercase tracking-wide">
                        Erwartete Reaktionen
                      </p>
                      {currentPetition.factionReactions.map((r) => {
                        const faction = factions.find(
                          (f) => f.short === r.factionShort,
                        );
                        return (
                          <div
                            key={r.factionShort}
                            className="flex items-center justify-between text-[11px]"
                          >
                            <span className="flex items-center gap-1 text-stone-600">
                              {faction?.icon} {r.factionShort}
                            </span>
                            <span
                              className={
                                r.support > 0
                                  ? "text-emerald-600 font-medium"
                                  : r.support < 0
                                    ? "text-red-600 font-medium"
                                    : "text-stone-400"
                              }
                            >
                              {reactionLabel(r.support)}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {currentPetitionEntry && (
                      <>
                        <Separator className="bg-amber-100" />
                        <div className="text-xs font-bold text-stone-700">
                          Deine Vor-Entscheidung:{" "}
                          {currentPetitionEntry.chosenOption}
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>
              )}
              <Button
                onClick={() => setDetailsOpen(false)}
                className="mt-4 bg-stone-800 hover:bg-stone-700 text-white cursor-pointer transition-colors"
              >
                Schließen
              </Button>
            </DialogContent>
          </Dialog>

          {/* Abstimmen button */}
          <Button
            disabled={!isPhase3 || hasVotedThisQuarter}
            onClick={() => {
              castVote();
              // Optional: short delay or auto-close?
              // For now, let's keep it open or just close it after a brief moment
              setTimeout(() => onOpenChange(false), 500);
            }}
            className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold h-10 border-b-2 border-amber-800 active:border-b-0 active:translate-y-px transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed cursor-pointer"
          >
            {hasVotedThisQuarter
              ? "✓ Abgestimmt"
              : isPhase3
                ? "🗳️ Abstimmen"
                : "Abstimmung nicht möglich"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
