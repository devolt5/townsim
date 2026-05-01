export type DecisionVariant = "accept" | "reject" | "negotiate";

export interface DecisionOption {
  label: string;
  variant: DecisionVariant;
}

/** Trust-delta for one faction, keyed by Faction.short from FACTIONS */
export interface FactionReaction {
  factionShort: string;
  delta: number;
}

export interface Decision {
  id: string;
  title: string;
  text: string;
  image?: string;
  imageAlt?: string;
  factionReactions: FactionReaction[];
}

/** Fixed options available for every decision */
export const DECISION_OPTIONS: DecisionOption[] = [
  { label: "✓ Zustimmen", variant: "accept" },
  { label: "✗ Ablehnen", variant: "reject" },
  { label: "⚖ Verhandeln", variant: "negotiate" },
];
