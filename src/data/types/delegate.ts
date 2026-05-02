export type DelegateFaction =
  | "Terra"
  | "Syndikat"
  | "Bürger"
  | "Union der Gilden"
  | "Der Bund";

export interface Delegate {
  id: string;
  name: string;
  faction: DelegateFaction;
  title: string;
  /** Text shown in the modal body. */
  bio: string;
  /** Path/URL to avatar image. Cycles through available delegate_XX images. */
  imageUrl: string;
  /** Which concentric row (0 = innermost). */
  row: number;
  /** Seat index within the row (0-based, left to right). */
  seatIndex: number;
}
