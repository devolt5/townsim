export type PetitionVariant = "accept" | "reject" | "negotiate";

export interface PetitionOption {
  label: string;
  variant: PetitionVariant;
}

/** Support for the given Petition ranges from -10 to 10 */
export interface FactionReaction {
  factionShort: string;
  support: number;
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
