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
    title: "Willkommen im Amt!",
    text: "Willkommen, {playerName}! Gratulation zur Wahl. Die nächsten vier Jahre werden eine spannende Reise – mit vielen Herausforderungen, aber auch Chancen für deine Stadt.\n\nIch bin deine Stadtberaterin und werde dich mit Ratschlägen unterstützen. Lass uns gleich loslegen!",
  },
  // ── Tutorial messages (delivered via click-count triggers) ────────────────
  {
    id: 2,
    sender: "Stadtberaterin",
    title: "Erste Schritte",
    text: "### Hier noch einige wichtige Tipps\n#### Stadtbezirke\n\nVerschaffe dir einen Überblick über die Stadtbezirke. Jeder hat eigene Bedürfnisse und Problemlagen.\nKlicke auf einen Bezirk, um seine Details einzusehen.\n#### Smartphone\nProbiere verschiedene Funktionen deines Smartphones aus – dort findest du wichtige Informationen und kannst mit verschiedenen Akteuren in Kontakt treten.\n#### Unterlagen\nRechts siehst du deine Unterlagen, vor allem die Anträge, die du dem Parlament vorlegen kannst. Jeder Antrag wird Auswirkungen auf die Stadtentwicklung haben – und auf deine Beliebtheit bei den Fraktionen im Stadtrat.\n#### Fraktionen\nUnten kannst du mehr über die Fraktionen erfahren – sie sind wichtige Verbündete, aber auch Widersacher. Ihre Unterstützung brauchst du, um deine Pläne durchzusetzen.",
  },
  {
    id: 3,
    sender: "Stadtberaterin",
    title: "Verschiedene Phasen",
    text: "Das Spiel ist in verschiedene Phasen unterteilt:\n\n1. **Berichtsphase**: Hier bekommst du Anträge und Informationen.\n2. **Planungsphase**: In dieser Phase kannst du deine Strategie entwickeln. Du kannst mit verschiedenen Akteuren in Kontakt treten: Abgeordnete, Bürger, Vereine, Wirtschaftsakteure.\n3. **Abstimmungsphase**: Die Fraktionen im Stadtrat entscheiden über deine Anträge. Je nachdem, wie du dich in der Planungsphase positioniert hast, kannst du auf mehr oder weniger Unterstützung zählen.",
  },
  {
    id: 4,
    sender: "Stadtberaterin",
    title: "Was wichtig ist...",
    text: "Du lernst schnell! Versuche immer, deine Werte im **oberen Bereich** im Auge zu behalten – vor allem die **Bürgerzufriedenheit**. Wenn sie zu niedrig wird, könnte es schwierig werden, deine Pläne durchzubringen.\n\nAchte auch auf die **Wirtschaftskraft** der Stadt – sie beeinflusst deine finanziellen Möglichkeiten.\n\nUnd vergiss nicht: Die Fraktionen im Stadtrat beobachten dich genau. Ihre Unterstützung ist entscheidend für deinen Erfolg.",
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
    text: "Ich glaube, du hast das Wesentliche verstanden, {playerName}.\n\nSchaue dich regelmäßig in den Stadtbezirken um. Ab und zu tauchen neue Herausforderungen auf, die du angehen kannst.\n\nViel Erfolg!",
  },
  // ── Timed messages (delivered by year/quarter triggers) ───────────────────
  {
    id: 7,
    sender: "Stadtredakteur",
    title: "Presseanfrage",
    text: "Guten Tag, {playerName}!\n\nIch bin Redakteur der *{cityName} Zeitung*. Unsere Leser interessieren sich sehr für Ihre Pläne zum **Stadthaushalt**.\n\nWären Sie bereit für ein kurzes Interview? Ich würde mich über eine Rückmeldung freuen.",
  },
  {
    id: 8,
    sender: "Stadtredakteur",
    title: "Jahresbericht der Presse",
    text: "{playerName}, die Halbzeit Ihrer Amtszeit nähert sich.\n\nUnsere Redaktion hat die bisherige Stadtentwicklung analysiert – die **Bürgerzufriedenheit** und die **Wirtschaftskraft** stehen besonders im Fokus unserer Leserschaft.\n\nWir berichten in der nächsten Ausgabe.",
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
