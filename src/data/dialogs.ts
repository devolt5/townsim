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
  // ── Tutorial messages (delivered via click-count triggers) ────────────────
  {
    id: 4,
    sender: "Stadtberaterin",
    title: "Fraktionen beachten",
    text: "Du lernst schnell! Vergiss nicht die **Fraktionen** im Stadtrat.\n\nJede Fraktion hat eigene Interessen – ihre Zustimmung entscheidet über Mehrheiten und beeinflusst deinen politischen Spielraum.",
  },
  {
    id: 5,
    sender: "Stadtberaterin",
    title: "Versprechen & Konsequenzen",
    text: "Ein wichtiger Hinweis: Wenn du einer Fraktion etwas **versprichst**, erwartet sie auch, dass du es hältst.\n\nGebrochene Versprechen kosten Vertrauen – und Vertrauen ist die härteste Währung in der Politik.",
  },
  {
    id: 6,
    sender: "Stadtberaterin",
    title: "Du bist bereit",
    text: "Ich glaube, du hast das Wesentliche verstanden. Von hier an liegst du auf dich allein gestellt – aber ich bin natürlich jederzeit für Rückfragen da.\n\n**Viel Erfolg, Bürgermeister!**",
  },
  // ── Timed messages (delivered by year/quarter triggers) ───────────────────
  {
    id: 7,
    sender: "Stadtredakteur",
    title: "Presseanfrage",
    text: "Guten Tag, Bürgermeister!\n\nIch bin Redakteur der *Neustädter Stadtzeitung*. Unsere Leser interessieren sich sehr für Ihre Pläne zum **Stadthaushalt**.\n\nWären Sie bereit für ein kurzes Interview? Ich würde mich über eine Rückmeldung freuen.",
  },
  {
    id: 8,
    sender: "Stadtredakteur",
    title: "Jahresbericht der Presse",
    text: "Bürgermeister, die Halbzeit Ihrer Amtszeit nähert sich.\n\nUnsere Redaktion hat die bisherige Stadtentwicklung analysiert – die **Bürgerzufriedenheit** und die **Wirtschaftskraft** stehen besonders im Fokus unserer Leserschaft.\n\nWir berichten in der nächsten Ausgabe.",
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
