import type { Game } from "phaser";
import { useState } from "react";
import { Separator } from "@/components/ui/separator";
import { FactionChip } from "@/components/TrustBar";
import { useGameStore, useFactions } from "@/store/gameStore";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";
import { VotingModal } from "@/components/VotingModal";

interface FooterProps {
  activeScene: "city" | "district" | "parliament";
  factionOverlay: boolean;
  setFactionOverlay: (visible: boolean) => void;
  gameRef: React.RefObject<Game | null>;
}

export function Footer({
  activeScene,
  factionOverlay,
  setFactionOverlay,
  gameRef,
}: FooterProps) {
  const { advanceTurn, pendingPetitionIds, turn, hasVotedThisQuarter } =
    useGameStore();
  const factions = useFactions();
  const TOTAL_SEATS = factions.reduce((sum, f) => sum + f.seats, 0);
  const MAJORITY = Math.ceil(TOTAL_SEATS / 2) + 1;

  const isPhase3 = turn.phase === 3;
  // Can only advance if:
  // 1. Not in Phase 3 yet AND pendingPetitions resolved
  // 2. OR in Phase 3 AND vote has been cast
  const canAdvance = isPhase3
    ? hasVotedThisQuarter
    : pendingPetitionIds.length === 0;

  const buttonText = isPhase3
    ? hasVotedThisQuarter
      ? "Nächstes Quartal"
      : "Abstimmung"
    : canAdvance
      ? "Nächste Phase"
      : "Entscheidung ausstehend";

  const [votingOpen, setVotingOpen] = useState(false);

  const handleButtonClick = () => {
    if (isPhase3 && !hasVotedThisQuarter) {
      setVotingOpen(true);
    } else {
      advanceTurn();
    }
  };

  return (
    <footer className="bg-stone-800 px-4 py-2 flex items-center gap-4 border-t border-stone-700 shrink-0 min-h-13">
      <div className="flex flex-col shrink-0">
        <span className="text-stone-500 text-[10px] font-bold uppercase tracking-wider">
          Fraktionen
        </span>
        <div className="text-stone-400 text-[10px] whitespace-nowrap">
          Mehrheit: <span className="text-stone-200 font-bold">{MAJORITY}</span>{" "}
          / {TOTAL_SEATS}
        </div>
      </div>
      <Separator orientation="vertical" className="h-8 bg-stone-600 shrink-0" />
      <div className="flex items-center gap-5 flex-1 overflow-x-auto flex-nowrap scrollbar-none">
        {factions.map((f) => (
          <FactionChip key={f.short} faction={f} />
        ))}
      </div>
      <Separator orientation="vertical" className="h-8 bg-stone-600 shrink-0" />
      <Tooltip>
        <TooltipTrigger
          onClick={() => {
            const next = !factionOverlay;
            setFactionOverlay(next);
            const scene = gameRef.current?.scene.getScene("ParliamentScene") as
              | import("@/game/ParliamentScene").ParliamentScene
              | undefined;
            scene?.setFactionOverlay(next);
          }}
          disabled={activeScene !== "parliament"}
          className="cursor-pointer text-xl hover:scale-110 transition-transform disabled:opacity-40 disabled:cursor-not-allowed hover:disabled:scale-100"
        >
          👥
        </TooltipTrigger>
        <TooltipContent side="top">Fraktionen ein-/ausblenden</TooltipContent>
      </Tooltip>
      <Separator orientation="vertical" className="h-8 bg-stone-600 shrink-0" />
      <Button
        onClick={handleButtonClick}
        disabled={!canAdvance && !(isPhase3 && !hasVotedThisQuarter)}
        size="sm"
        className="bg-amber-600 cursor-pointer hover:bg-amber-500 text-white font-bold px-4 h-9 shadow-lg shadow-amber-900/20 border-b-2 border-amber-800 active:border-b-0 active:translate-y-1px transition-all flex gap-2 group disabled:opacity-50 disabled:grayscale disabled:cursor-not-allowed"
      >
        <span>{buttonText}</span>
        <ChevronRight
          size={16}
          className="group-hover:translate-x-0.5 transition-transform"
        />
      </Button>
      <VotingModal open={votingOpen} onOpenChange={setVotingOpen} />
    </footer>
  );
}
