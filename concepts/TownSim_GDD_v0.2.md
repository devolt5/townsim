# TownSim — Game Design Document

> Version 0.2 | Serious Games Projekt | Status: Konzeptphase und Prototyp

---

## 1. Projektüberblick

**Titel:** TownSim (Arbeitstitel)
**Genre:** Serious Game / Political Simulation
**Plattform:** Browser (Client-only, kein Backend)
**Zielgruppe:** Schüler ab ca. 14 Jahren, politisch Interessierte, Civic-Education-Kontext
**Spieldauer:** 60+ Minuten (eine Legislaturperiode mit Wahl am Ende)

### Kernaussage des Spiels

> Der Spieler soll *lernen*, warum politische Kompromisse schwer sind — nicht weil das Spiel ihn bestraft, sondern weil er selbst erlebt, dass es keine perfekte Lösung gibt.

---

## 2. Setting & Lernziele

### Setting

Fiktive deutsche Mittelstadt **„Neustadt"** (~80.000 Einwohner). Realistisch, aber nicht an eine echte Stadt gebunden. Schauplatz ist der Stadtrat inkl. Bürgermeisteramt.

### Lernziele

- Verstehen, wie kommunalpolitische Entscheidungen entstehen
- Erleben, dass Ressourcen begrenzt sind und Kompromisse nötig
- Nachvollziehen, wie verschiedene gesellschaftliche Gruppen legitime, aber widersprüchliche Interessen haben
- Verstehen, dass kurzfristige Popularität und langfristige Stadtentwicklung oft im Konflikt stehen

---

## 3. Spielerrolle

### Rolle: Bürgermeister/in

- Trifft Entscheidungen und bringt Anträge zur Ratsabstimmung
- Hat **kein Stimmrecht** im Stadtrat
- Muss Mehrheiten organisieren (mind. 21 von 40 Sitzen)
- Kann Versprechen machen — das Spiel erinnert sich daran
- Ziel: Wiederwahl nach 5 Jahren UND eine lebenswerte Stadt hinterlassen

---

## 4. Spielstruktur

### Übersicht

- **5 Jahre** insgesamt (= eine Legislaturperiode)
- Jedes Jahr hat **4 Quartale**
- Jedes Quartal durchläuft **3 Phasen**

```
Jahr 1–5
 └── Quartal 1–4
      └── Phase 1: Lagebericht
      └── Phase 2: Vorbereitung
      └── Phase 3: Abstimmung im Rat
```

Am Ende von Jahr 5 folgt die **Wahlnacht** als Abschlusssequenz.

### Die 3 Phasen eines Quartals

**Phase 1 — Lagebericht**
Ereignisse, Presseanfragen und Ergebnisse des letzten Quartals erscheinen. Außerdem wird eine **Ereigniskarte** gezogen, die die Ausgangslage des Quartals verändert (positiv, negativ oder beides, je nach Perspektive). Der Spieler liest die Lage und prüft die Metriken.

**Phase 2 — Vorbereitung**
Der Spieler hat eine begrenzte Anzahl an **Aktionspunkten** (s. Abschnitt 6) und wählt frei, wofür er sie einsetzt: Gespräche, Expertenrat, Bürgerversammlungen, Pressearbeit u. a. Hier werden Deals vorbereitet und Informationen gesammelt.

**Phase 3 — Abstimmung im Rat**
Ein Antrag kommt zur Abstimmung. Der Spieler legt eine Option vor, kann Versprechen machen und schaut dem Beschluss zu. Bei Ablehnung ist **einmalig** eine Nachverhandlung möglich.

---

## 5. Die Fraktionen

Keine Bösewichte, keine Heldenpartei. Alle haben legitime Interessen.

| Fraktion | Kurzname | Kerninteressen | Hauptangst | Sitze |
|---|---|---|---|---|
| 🌿 Grüne Liste | GRÜN | Klimaschutz, Verkehrswende, Grünflächen | Versiegelung, Lärm, Abgase | 8 |
| 💼 Wirtschaftsforum | WIRT | Gewerbeansiedlung, niedrige Steuern, Parkplätze | Bürokratie, Verbote, Firmenwegzug | 9 |
| 🏘️ Bürgerblock | BÜRG | Bezahlbarer Wohnraum, Schulen, Sicherheit | Gentrifizierung, Sparmaßnahmen | 10 |
| 🔧 Arbeiterpartei | HAND | Lokale Betriebe, Ausbildung, ÖPNV | Großkonzerne, Automatisierung | 7 |
| 🏛️ Konservative Mitte | KONS | Ordnung, Tradition, Haushaltsdisziplin | Schulden, Wandel, Chaos | 6 |
| | | | **Gesamt** | **40** |

**Mehrheit = 21 Sitze** → Der Spieler braucht immer eine Koalition aus mehreren Fraktionen.

---

## 6. Ressourcen & Aktionspunkte

### Aktionspunkte (Zeitressource)

Der Spieler hat pro Quartal eine begrenzte Anzahl an Aktionspunkten. Mögliche Aktionen:

| Aktion | Effekt |
|---|---|
| **Gespräch mit Fraktionsvorsitzendem** | Fraktionsinteressen und Bedingungen werden sichtbar |
| **Expertenrat einberufen** | Deckt versteckte Optionen oder Effekte eines Antrags auf |
| **Bürgerversammlung** | Deckt Bürgerinteressen auf, erhöht Bürgerzufriedenheit |
| **Ausschuss gründen** | Verbessert Entscheidungsfähigkeit in einem Bereich für mehrere Runden |
| **Pressekonferenz** | Beeinflusst öffentliche Wahrnehmung, erhöht oder schützt Legitimation |
| **Medienkampagne** | Stärkerer, aber teurerer Effekt auf Bürgerzufriedenheit |

Der Spieler kann **nicht** alle Informationen sammeln und **nicht** alle Fraktionen in einem Quartal überzeugen. Das ist Absicht.

### Politisches Kapital

- Startet bei **50**
- Wird verbraucht durch: Verhandlungen, Sonderaktionen, Veto-Einsatz
- Regeneriert: **+10 pro Jahr**, **+5 bei hoher Bürgerzufriedenheit**
- Bei **0**: Der Spieler kann keine Deals mehr schließen bis zur Regeneration
- Zu viele Deals in kurzer Zeit = Glaubwürdigkeitsverlust

---

## 7. Metriken & Stadtentwicklung

### 7.1 Vier Stadtmetriken (0–100)

| Metrik | Symbol | Beschreibung | Startwert |
|---|---|---|---|
| **Stadthaushalt** | 💰 | Verfügbares Budget für Projekte & Investitionen | 65 |
| **Bürgerzufriedenheit** | 😊 | Allgemeine Stimmung der Bevölkerung | 55 |
| **Nachhaltigkeits-Index** | 🌱 | Umwelt, Klimaschutz, langfristige Stadtentwicklung | 40 |
| **Wirtschaftskraft** | 📊 | Steuereinnahmen, Gewerbeansiedlung, Arbeitslosigkeit | 60 |

### 7.2 Abhängigkeiten

```
Wirtschaftskraft ──(+)──► Stadthaushalt        (mehr Gewerbe = mehr Steuern)
Stadthaushalt    ──(+)──► Bürgerzufriedenheit  (Investitionen = Lebensqualität)
Nachhaltigkeits-Index < 20  ──(-)──► Stadthaushalt    (Bußgelder vom Land)
Wirtschaftskraft < 30       ──(-)──► Wirtschaftskraft  (Abwärtsspirale: Firmenwegzug)
Bürgerzufriedenheit         ──(+)──► Wahlchancen
```

### 7.3 Das Dreieck der Interessen (Visualisierung)

Eine grafische Darstellung zeigt jederzeit das Spannungsfeld der drei übergeordneten Interessensbereiche. Der Spieler ist als Punkt in der Mitte dargestellt und kann die Grafik jederzeit aufrufen, um zu reflektieren, welche Bereiche er stärker bedienen möchte.

```
            🏗️ Wirtschaft & Entwicklung
                        △
                       / \
                      /   \
                     /  ●  \
    🌳 Umwelt &  ◁-----------▷  👥 Soziales &
       Lebensqualität              Gemeinschaft
```

---

## 8. Spielmechaniken

### 8.1 Entscheidungskarten (Hauptmechanik)

Jedes Quartal liegt mindestens ein Antrag vor. Immer mit echtem Konfliktpotenzial.

**Kartenstruktur:**

```
┌─────────────────────────────────────────────────┐
│ 📋 ANTRAG: [Titel]                              │
│ [Kontext in 2–3 Sätzen Alltagssprache]          │
├─────────────────────────────────────────────────┤
│ OPTION A  [Kurzbeschreibung]                    │
│ Effekte: +💰15  +📊12  -🌱18  😊+5             │
│ Reaktionen: GRÜN 😡  WIRT 😊                    │
│                                                 │
│ OPTION B  [Kurzbeschreibung]                    │
│ ...                                             │
│                                                 │
│ OPTION D  [Verhandeln] → Verhandlungsmodus      │
└─────────────────────────────────────────────────┘
```

**Effekte:**

- Werte ändern sich um absolute Punkte (z. B. `+15`, `-8`)
- Änderungen sind sofort sichtbar
- Einige Effekte sind **verzögert** und wandern auf eine Umsetzungsleiste (⏳): je nach Komplexität wirken sie erst nach 1–3 Quartalen

### 8.2 Verhandlungsmodus & Koalitionszwang

Wird durch Option D einer Karte oder manuell vom Spieler geöffnet.

**Ablauf:**

1. Spieler sieht aktuelle Stimmung jeder Fraktion zu diesem Antrag
2. Spieler spricht Fraktionen einzeln an
3. Fraktion nennt ihre **Bedingung** für ein Ja
4. Spieler akzeptiert → wird als **Versprechen** gespeichert
5. Spieler kann maximal **2 Deals pro Antrag** schließen

**Koalitionslogik:** Der Spieler kann auch quartalsübergreifende Versprechen machen, z. B.: „Ich unterstütze euren Radweg jetzt, wenn ihr im nächsten Quartal dem Ausbau von Kitaplätzen zustimmt." Das Spiel erinnert sich an alle offenen Versprechen.

**Versprechen-Typen:**

| Typ | Beispiel |
|---|---|
| Budgetverpflichtung | „Wir bauen die Kita im nächsten Haushaltsjahr" |
| Politische Zusage | „Beim nächsten Wohnungsprojekt stimmen wir für die Sozialquote" |
| Verfahrenszusage | „Wir holen eine Bürgeranhörung ein" |

### 8.3 Abstimmungsregel

- Abstimmung erfolgt nach Sitzen
- **Mehrheit = 21 von 40 Sitzen**
- Fraktionen stimmen geschlossen ab (Vereinfachung)
- Vertrauen < 20 einer Fraktion → stimmt fast immer gegen den Spieler
- Bei Ablehnung: **einmalige Nachverhandlung** möglich (kleiner Zusatz, kostet aber Metrikpunkte)

### 8.4 Vertrauen — Veränderungsregeln

| Situation | Vertrauensänderung |
|---|---|
| Entscheidung im Sinne der Fraktion | +10 bis +25 |
| Entscheidung gegen Kerninteressen | -15 bis -30 |
| Versprechen eingehalten | +20 |
| Versprechen gebrochen | -35 (dauerhafter Malus) |
| Event gut bewältigt (aus Fraktionssicht) | +5 bis +15 |
| Kein Kontakt in einem Jahr | -5 (Vernachlässigung) |

**Vertrauensstufen:**

| Bereich | Stufe | Bedeutung |
|---|---|---|
| 80–100 | Verbündeter | Unterstützt aktiv, gibt Bonusinfos |
| 60–79 | Wohlgesonnen | Stimmt meist zu |
| 40–59 | Neutral | Fallabhängig, verhandelbar |
| 20–39 | Skeptisch | Stimmt meist dagegen |
| 0–19 | Feindlich | Blockiert aktiv, kann Misstrauensvotum stellen |

### 8.5 Haushalt & Budget

- Jede Entscheidung kostet oder bringt Budget
- Am Jahresende: Bilanzierung
- **Haushalt < 0**: Notkredit nötig → -10 Bürgerzufriedenheit + Schuldenstand steigt
- **Schuldenstand > 50 Mio.**: Land greift ein → Entscheidungsfreiheit wird eingeschränkt

---

## 9. Ereigniskarten

Zu Beginn jedes Quartals (Phase 1 — Lagebericht) wird eine Ereigniskarte gezogen. Der Spieler hat keine Kontrolle darüber, *welches* Ereignis eintritt — nur darüber, *wie er reagiert*. Ereignisse können die Ausgangslage positiv, negativ oder je nach Perspektive unterschiedlich verändern.

### Beispiel-Ereignisse

| Ereignis | Soforteffekt | Entscheidung |
|---|---|---|
| 🌊 Starkregen / Hochwasser | -💰15 (Notfall) | Sofortiger Reparatur oder Rücklagen-Kredit? |
| 📈 Energiepreise +40% | -😊10, ÖPNV-Nachfrage ↑ | ÖPNV ausbauen oder Haushaltshilfe? |
| 🏗️ Neues Bundesgesetz | Stadtgebäude betroffen | Sofort umrüsten oder klagen? |
| 📰 Lokaler Skandal (Vorgänger-Ära) | -😊15 sofort | Transparenz zeigen oder abwiegeln? |
| 🎓 Uni plant Erweiterung | Chancen-Event | Fläche bereitstellen oder abwägen? |
| 🏭 Großunternehmen droht Wegzug | -📊15 wenn nichts passiert | Subventionen, Gespräch oder Wegzug akzeptieren? |
| 🌡️ Hitzesommer | -🌱5, -😊5 | Notfall-Grünflächen oder Brunnen? |
| 🚧 Brücke gesperrt | -😊8, Verkehrschaos | Sofortinvestition oder Umleitung? |

### Format einer Ereignis-Reaktionskarte

```
⚡ EVENT: [Titel]
[Kontext: Was ist passiert, warum ist es ein Problem?]

SOFORTREAKTION (innerhalb dieser Phase):
  → Option A: [schnelle Lösung, teuer]
  → Option B: [günstig, aber mit Risiko]
  → Option C: [abwarten, Gefahr der Eskalation]
```

---

## 10. Wahlsystem & Spielende

### Wahlnacht-Sequenz

Am Ende von Jahr 5 gibt es keine weitere Abstimmung, sondern eine **Wahlnacht-Sequenz**: Ergebnisse kommen rein, Hochrechnungen erscheinen. Der Spieler sieht nicht nur, ob er gewonnen hat, sondern **warum**: Welche Gruppe hat ihn gewählt? Welche nicht? Was hat den Ausschlag gegeben?

Abgewählt zu werden ist **kein „Game Over"** — es ist ein Ergebnis mit Erklärung.

### Reflexionsbildschirm

```
Du wurdest abgewählt.

Was gut lief:
  ✓ Haushalt fast immer ausgeglichen
  ✓ Wirtschaftsforum als starker Partner

Was schwierig war:
  ✗ Nordpark-Genehmigung hat 40 % der Umweltwähler verloren
  ✗ Versprechen zur Kita (2022) nie eingelöst

Deine Stadt heute:
  Nachhaltigkeits-Index: 34 → langfristige Klimaprobleme möglich
  Schuldenstand: 18 Mio. → noch im Rahmen
  Einwohner: +820 in 4 Jahren

[Nochmal versuchen]  [Andere Strategie wählen]
```

### Reflexionsfragen

Am Ende stellt das Spiel dem Spieler keine Bewertung, sondern drei offene Fragen:

> „Welche Entscheidung hat mich am meisten überrascht?"
> „Wem habe ich am häufigsten nachgegeben — und warum?"
> „Was hätte ich anders machen können — und was hätte das gekostet?"

---

## 11. Was bewusst fehlt

Um die Komplexität im Rahmen zu halten, werden folgende Dinge **absichtlich weggelassen**:

- Kein detaillierter Haushalt mit Buchführung — nur ein grober Budgetbalken
- Keine Baumenüs oder detaillierte Stadtplanung
- Kein freies Zeitsystem — der Quartalsrhythmus läuft strukturiert
- Kein abruptes „Game Over" — auch schlechte Entscheidungen haben nur Konsequenzen, kein Spielabbruch

---

*TownSim GDD v0.2 — Stand: Konzeptphase*
