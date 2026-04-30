export interface DialogData {
  id: number;
  /** Identifies the dialog partner – used to group conversation history. */
  sender: string;
  title: string;
  text: string;
}

export const allDialogs: DialogData[] = [
  {
    id: 1,
    sender: "Stadtberaterin",
    title: "Willkommen in TownSim",
    text: "Willkommen! Hier beginnt dein Abenteuer als Bürgermeister. Triff kluge Entscheidungen, gewinne das Vertrauen deiner Bürger und forme das Schicksal deiner Stadt.",
  },
  {
    id: 2,
    sender: "Stadtberaterin",
    title: "Erste Schritte",
    text: "Ein guter Anfang! Deine erste Aufgabe:\n\nVerschaffe dir einen **Überblick über die Stadtbezirke**. Jeder hat eigene Bedürfnisse und Problemlagen.\n\nKlicke auf einen Bezirk, um seine Details einzusehen.",
  },
  {
    id: 3,
    sender: "Stadtberaterin",
    title: "Haushaltswarnung",
    text: "**Achtung, Bürgermeister** – die Stadtkasse sendet erste Warnsignale.\n\nÜberprüfe die Ausgaben im *nördlichen Bezirk*, bevor es zu einem **Defizit** kommt.",
  },
];

export const dialogsById: Record<number, DialogData> = Object.fromEntries(
  allDialogs.map((d) => [d.id, d]),
);

/**
 * All dialogs grouped by sender, sorted ascending by id (chronological).
 */
export const dialogsBySender: Record<string, DialogData[]> = allDialogs.reduce<
  Record<string, DialogData[]>
>((acc, d) => {
  (acc[d.sender] ??= []).push(d);
  return acc;
}, {});
