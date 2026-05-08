export type PetitionVariant =
  | "accept"
  | "reject"
  | "negotiate"
  | "granted"
  | "declined";

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
  /**
   * Thematic tags used for promise matching (§4.2).
   * Examples: "wirtschaft", "umwelt", "sozial", "infrastruktur", "kultur", "sicherheit", "finanzen"
   */
  tags?: string[];
}

/** Fixed options available for every petition */
export const PETITION_OPTIONS: PetitionOption[] = [
  { label: "✓ Annehmen", variant: "accept" },
  { label: "⚖ Verhandeln", variant: "negotiate" },
];

export interface PendingPetition {
  title: string;
  text: string;
  image?: string;
  imageAlt?: string;
  options: { label: string; variant: "accept" | "reject" | "negotiate" }[];
}
