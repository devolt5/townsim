export type PetitionVariant = "accept" | "reject" | "negotiate";

export interface PetitionOption {
  label: string;
  variant: PetitionVariant;
}

/** Trust-delta for one faction, keyed by Faction.short from FACTIONS */
export interface FactionReaction {
  factionShort: string;
  delta: number;
}

export interface Petition {
  id: string;
  title: string;
  text: string;
  image?: string;
  imageAlt?: string;
  factionReactions: FactionReaction[];
}

/** Fixed options available for every petition */
export const PETITION_OPTIONS: PetitionOption[] = [
  { label: "✓ Zustimmen", variant: "accept" },
  { label: "⚖ Verhandeln", variant: "negotiate" },
];
