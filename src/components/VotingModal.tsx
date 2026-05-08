import { useGameStore, useFactions } from "@/store/gameStore";
import { useMemo, useState, useEffect, useRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ExternalLink } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { PETITIONS } from "@/data/petitions";
import { VOTE_COUNTING_DURATION } from "@/data/ui-data";
import { calculateVotePreview } from "@/game/votingEngine";
import { VoteChart } from "@/components/VoteChart";

interface VotingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

function reactionLabel(support: number): string {
  if (support > 0) return `😊 +${support}`;
  if (support < 0) return `😡 −${Math.abs(support)}`;
  return "😐 0";
}

export function VotingModal({ open, onOpenChange }: VotingModalProps) {
  const {
    turn,
    petitionHistory,
    activePetitionId,
    castVote,
    hasVotedThisQuarter,
    activeActionModifiers,
    openPromises,
    lastVoteResult,
  } = useGameStore();
  const factions = useFactions();
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [votePhase, setVotePhase] = useState<"idle" | "counting" | "result">(
    "idle",
  );
  const countingTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isPhase3 = turn.phase === 3;
  const isPhase2Or3 = turn.phase >= 2;

  // Reset phase when modal closes; clean up timer on unmount
  useEffect(() => {
    if (!open) setVotePhase("idle");
  }, [open]);
  useEffect(() => {
    return () => {
      if (countingTimerRef.current) clearTimeout(countingTimerRef.current);
    };
  }, []);

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
  const majority = Math.floor(totalSeats / 2) + 1;

  // Deterministic preview (no dice). Recomputed when petition or modifiers change.
  const preview = useMemo(() => {
    if (!currentPetition) return null;
    return calculateVotePreview(
      currentPetition,
      factions,
      activeActionModifiers,
      openPromises,
    );
  }, [currentPetition, factions, activeActionModifiers, openPromises]);

  // After the vote, show actual result; before the vote, show the deterministic preview.
  const displayYes = lastVoteResult?.totalYes ?? preview?.totalYes ?? 0;
  const displayUndecided = lastVoteResult
    ? 0 // dice already resolved all undecided
    : (preview?.totalUndecided ?? 0);
  const displayNo = lastVoteResult?.totalNo ?? preview?.totalNo ?? 0;

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

          {/* Ballot animation / vote result */}
          {votePhase === "counting" ? (
            <div className="flex flex-col items-center gap-4 py-2 select-none">
              <style>{`
                @keyframes ballot-drop {
                  0%   { opacity: 0; transform: translateY(-64px) rotate(var(--rot)); }
                  12%  { opacity: 1; }
                  78%  { opacity: 1; transform: translateY(0px) rotate(0deg); }
                  100% { opacity: 0; transform: translateY(0px) rotate(0deg); }
                }
                .ballot { position: absolute; bottom: 28px; animation: ballot-drop 1.5s ease-in infinite; font-size: 1.75rem; }
                .b1 { left: calc(50% - 52px); animation-delay: 0s;     --rot: -22deg; }
                .b2 { left: calc(50% - 14px); animation-delay: 0.5s;   --rot:   6deg; }
                .b3 { left: calc(50% + 24px); animation-delay: 1.0s;   --rot:  18deg; }
              `}</style>
              <div
                className="relative w-full flex justify-center"
                style={{ height: 130 }}
              >
                <span className="ballot b1">📨</span>
                <span className="ballot b2">✉️</span>
                <span className="ballot b3">📩</span>
                <span className="absolute bottom-0 text-8xl leading-none">
                  🗳️
                </span>
              </div>
              <p className="text-stone-500 text-sm font-medium animate-pulse">
                Stimmen werden gezählt…
              </p>
            </div>
          ) : preview || lastVoteResult ? (
            <>
              {votePhase === "result" && (
                <div className="text-center">
                  <span className="text-5xl">
                    {lastVoteResult?.passed ? "🎉" : "📉"}
                  </span>
                  <p
                    className={`text-base font-bold mt-1 ${
                      lastVoteResult?.passed ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {lastVoteResult?.passed
                      ? "Antrag angenommen!"
                      : "Antrag abgelehnt!"}
                  </p>
                </div>
              )}
              <VoteChart
                yes={displayYes}
                undecided={displayUndecided}
                no={displayNo}
                majority={majority}
                totalSeats={totalSeats}
              />
            </>
          ) : null}

          {/* Abstimmen / Beenden button */}
          {votePhase === "result" ? (
            <Button
              onClick={() => onOpenChange(false)}
              className="w-full bg-stone-700 hover:bg-stone-600 text-white font-bold h-10 cursor-pointer transition-colors"
            >
              🎉 Beenden
            </Button>
          ) : (
            <Button
              disabled={
                !isPhase3 || hasVotedThisQuarter || votePhase === "counting"
              }
              onClick={() => {
                castVote();
                setVotePhase("counting");
                countingTimerRef.current = setTimeout(
                  () => setVotePhase("result"),
                  VOTE_COUNTING_DURATION,
                );
              }}
              className="w-full bg-amber-600 hover:bg-amber-500 text-white font-bold h-10 border-b-2 border-amber-800 active:border-b-0 active:translate-y-px transition-all disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed cursor-pointer"
            >
              {votePhase === "counting"
                ? "Zähle Stimmen…"
                : hasVotedThisQuarter
                  ? "✓ Abgestimmt"
                  : isPhase3
                    ? "🗳️ Abstimmen"
                    : "Abstimmung nicht möglich"}
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
