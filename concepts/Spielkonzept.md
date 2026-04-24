# TownSim— Game Design Document
>
> Version 0.1 | Serious Games Projekt | Status: Konzeptphase

---

## 1. Projektüberblick

**Titel:** TownSim(Arbeitstitel)
**Genre:** Serious Game / Political Simulation
**Plattform:** Browser (Client-only, kein Backend)
**Zielgruppe:** Schüler ab ca. 14 Jahren, politisch Interessierte, Civic-Education-Kontext
**Spieldauer:** 60+ Minuten (eine Legislaturperiode, Kampagne mit Wahl und Wiederwahl)

### Kernaussage des Spiels
>
> Der Spieler soll *lernen*, warum politische Kompromisse schwer sind — nicht weil das Spiel ihn bestraft, sondern weil er selbst erlebt, dass es keine perfekte Lösung gibt.

---

## 2. Tech-Stack & Entwicklungsbereiche

### Bereich 1 — Prototyp (React + TypeScript + Vite)

Fokus auf Spielmechanik und Lerneffekt. Keine aufwändige Grafik.

| Technologie | Zweck |
|---|---|
| **React 19** | UI-Komponenten, Dialoge, HUD, Tabellen |
| **TypeScript** | Typsicherheit, wartbarer Spielzustand |
| **Vite** | Build-Tool, Hot-Reloading, optimiertes Client-Bundle |
| **Zustand** | Game-State-Management |
| **TailwindCSS** | Schnelles Styling ohne Design-Overhead |

Spielfläche in Bereich 1: Einfache Kartenvisualisierung (SVG oder statisches Bild) + Tabellen + Entscheidungskarten als UI-Overlays.

### Bereich 2 — Visuelle Überarbeitung (Phaser 4)

Sobald Spielmechanik stabil und getestet ist.

| Technologie | Zweck |
|---|---|
| **Phaser 4** | 2D-Rendering, Animationen, Tilemap-Engine |
| **React (weiterhin)** | HUD, Menüs, Dialoge (außerhalb des Canvas) |
| **WebGL / Canvas-Fallback** | Performance-sichere Darstellung |

Phaser 4 läuft framework-agnostisch — React und Phaser teilen sich die Seite: Phaser übernimmt die Spielwelt-Canvas, React die UI-Ebene darüber.

---

## 3. Spielkonzept & Lernziel

### Setting

Fiktive deutsche Mittelstadt **"Neustadt"** (~80.000 Einwohner). Realistisch, aber nicht an eine echte Stadt gebunden. Schauplatz ist der Stadtrat inkl. Bürgermeisteramt.

### Lernziele

- Verstehen, wie kommunalpolitische Entscheidungen entstehen
- Erleben, dass Ressourcen begrenzt sind und Kompromisse nötig
- Nachvollziehen, wie verschiedene gesellschaftliche Gruppen legitime, aber widersprüchliche Interessen haben
- Verstehen, dass kurzfristige Popularität und langfristige Stadtentwicklung oft im Konflikt stehen

### Spielstruktur — eine Legislaturperiode

```
JAHR 1           JAHR 2           JAHR 3           JAHR 4
─────────────────────────────────────────────────────────────
Einarbeitung     Erste Krise      Wahlkampf-        WAHL
+ 3 Projekte     + Kompromisse    Entscheidungen    ↓
                                                   Gewählt? → neue Amtszeit
                                                   Abgewählt? → Reflexion + Neustart
```

Jedes Jahr = **3–4 Entscheidungsrunden** + **1–2 Events (ungesteuert)**

---

## 4. Spielerrolle & Aufbau

### Rolle: Bürgermeister/in

- Trifft finale Entscheidungen nach Ratsabstimmungen
- Muss Mehrheiten organisieren (mind. 3 von 5 Fraktionen)
- Kann Versprechen machen — das Spiel erinnert sich daran
- Ziel: Wiederwahl nach 4 Jahren UND eine lebenswerte Stadt hinterlassen

### Was der Spieler in einer Runde tut

1. **Lage lesen** — Metriken prüfen, aktuelle Events sehen
2. **Antrag annehmen** — Entscheidungskarte erscheint mit 3–4 Optionen
3. **Verhandeln** (optional) — Fraktionen einzeln ansprechen, Deals aushandeln
4. **Entscheiden** — Abstimmung im Rat, Konsequenzen folgen sofort
5. **Event reagieren** — ungesteuertes Ereignis tritt ein, kurzfristige Reaktion nötig
6. **Jahresbilanz** — Metriken aktualisieren sich, Fraktionsvertrauen shiftet

---

## 5. Die Fraktionen

Keine Bösewichte, keine Heldenpartei. Alle haben legitime Interessen.

| Fraktion | Kurzname | Kerninteressen | Hauptangst |
|---|---|---|---|
| 🌿 Grüne Liste | GRÜN | Klimaschutz, Verkehrswende, Grünflächen | Versiegelung, Lärm, Abgase |
| 💼 Wirtschaftsforum | WIRT | Gewerbeansiedlung, niedrige Steuern, Parkplätze | Bürokratie, Verbote, Firmenwegzug |
| 🏘️ Bürgerblock | BÜRG | Bezahlbarer Wohnraum, Schulen, Sicherheit | Gentrifizierung, Sparmaßnahmen |
| 🔧 Handwerk & Soziales | HAND | Lokale Betriebe, Ausbildung, ÖPNV | Großkonzerne, Automatisierung |
| 🏛️ Konservative Mitte | KONS | Ordnung, Tradition, Haushaltsdisziplin | Schulden, Wandel, Chaos |

**Sitzverteilung (Beispiel-Start):**

| Fraktion | Sitze |
|---|---|
| GRÜN | 8 |
| WIRT | 9 |
| BÜRG | 10 |
| HAND | 7 |
| KONS | 6 |
| **Gesamt** | **40** |

Mehrheit = 21 Sitze → Spieler braucht immer Koalition aus mehreren Fraktionen.

---

## 6. Datenmodell & Metriken

### 6.1 Stadtmetriken (globale Werte, 0–100)

Das Herzstück des Spiels. Nur 4 sichtbare Hauptwerte — überschaubar, aber alle abhängig voneinander.

| Metrik | Symbol | Beschreibung | Startwert |
|---|---|---|---|
| **Stadthaushalt** | 💰 | Verfügbares Budget für Projekte & Investitionen | 65 |
| **Bürgerzufriedenheit** | 😊 | Allgemeine Stimmung der Bevölkerung | 55 |
| **Nachhaltigkeits-Index** | 🌱 | Umwelt, Klimaschutz, langfristige Stadtentwicklung | 40 |
| **Wirtschaftskraft** | 📊 | Steuereinnahmen, Gewerbeansiedlung, Arbeitslosigkeit | 60 |

#### Abhängigkeiten zwischen Metriken

```
Wirtschaftskraft ──(+)──► Stadthaushalt    (mehr Gewerbe = mehr Steuern)
Stadthaushalt    ──(+)──► Bürgerzufriedenheit  (Investitionen = Lebensqualität)
Nachhaltigkeits- 
  Index < 20     ──(-)──► Stadthaushalt    (Bußgelder vom Land)
Wirtschaftskraft 
  < 30           ──(-)──► Wirtschaftskraft  (Abwärtsspirale: Firmenwegzug)
Bürgerzufrieden- 
  heit           ──(+)──► Wahlchancen
```

### 6.2 Erweiterte Stadtdaten (im Hintergrund, für Events & Konsequenzen)

Diese Werte werden nicht direkt angezeigt, beeinflussen aber Events und Fraktionsreaktionen:

```typescript
interface CityData {
  // Bevölkerung
  einwohner: number;          // ~80.000 Start
  einwohnerTrend: number;     // Veränderung pro Jahr (-500 bis +1000)
  
  // Verkehr
  pkwDichte: number;          // Autos pro 1000 Einwohner
  oepnvNutzung: number;       // % Bevölkerung nutzt ÖPNV täglich
  radwegeKm: number;          // Radwegenetz in km
  
  // Wohnen
  leerstandsQuote: number;    // % leerstehende Wohnungen
  mietpreisIndex: number;     // Basis 100 = Bundesschnitt
  sozialwohnungen: number;    // Anzahl Sozialwohnungen
  
  // Umwelt
  co2Ausstoss: number;        // Tonnen CO2 pro Einwohner/Jahr
  gruenflaechenHektar: number;
  
  // Wirtschaft
  arbeitslosenquote: number;  // in %
  gewerbesteuerEinnahmen: number; // in Tausend €/Jahr
  
  // Infrastruktur
  schuldenStand: number;      // Stadtschulden in Mio €
  infrastrukturZustand: number; // 0–100, Straßen/Gebäude
}
```

### 6.3 Spieler-/Kampagnendaten

```typescript
interface PlayerState {
  amtszeit: number;           // Aktuelle Amtszeit (1, 2, ...)
  jahr: number;               // 1–4 innerhalb der Amtszeit
  runde: number;              // 1–4 innerhalb des Jahres
  entscheidungsHistory: Decision[];
  versprechen: Promise[];
  politischesKapital: number; // 0–100, verbrauchbar für Sonderaktionen
}
```

---

## 7. Spielregeln & Mechaniken

### 7.1 Entscheidungskarten (Hauptmechanik)

Jede Runde kommt ein Antrag auf den Tisch. Immer mit echtem Konfliktpotenzial.

**Kartenstruktur:**

```
┌─────────────────────────────────────────────────┐
│ 📋 ANTRAG: [Titel]                              │
│ [Kontext in 2–3 Sätzen Alltagssprache]          │
├─────────────────────────────────────────────────┤
│ OPTION A  [Kurzbeschreibung]                    │
│ Effekte: +💰15  +📊12  -🌱18  😊+5             │
│ Reaktionen: GRÜN 😡-20  WIRT 😊+15             │
│                                                 │
│ OPTION B  [Kurzbeschreibung]                    │
│ ...                                             │
│                                                 │
│ OPTION D  [Verhandeln] → Verhandlungsmodus      │
└─────────────────────────────────────────────────┘
```

**Effekt-Formel für Metriken:**

- Werte ändern sich um absolute Punkte (z.B. `+15`, `-8`)
- Änderungen sind sofort sichtbar
- Einige Effekte sind **verzögert** (erscheinen erst nächstes Jahr, angezeigt mit ⏳)

### 7.2 Verhandlungsmodus

Wird durch Option D auf einer Karte aktiviert oder manuell vom Spieler vor einer Abstimmung geöffnet.

**Ablauf:**

1. Spieler sieht aktuelle Stimmung jeder Fraktion zu diesem Antrag
2. Spieler kann jede Fraktion einzeln ansprechen
3. Fraktion nennt ihre **Bedingung** für ein Ja
4. Spieler akzeptiert → wird als **Versprechen** gespeichert
5. Spieler kann maximal 2 Deals pro Karte schließen

**Verhandlungskosten:**

- Deals kosten **Politisches Kapital** (regeneriert langsam)
- Zu viele Deals = Glaubwürdigkeitsverlust

**Versprechen-Typen:**

```
TYPE A — Budgetverpflichtung:   "Wir bauen die Kita im nächsten Haushaltsjahr"
TYPE B — Politische Zusage:     "Beim nächsten Wohnungsprojekt stimmen wir für Sozialquote"
TYPE C — Verfahrenszusage:      "Wir holen eine Bürgeranhörung ein"
```

### 7.3 Abstimmungsregel

- Abstimmung erfolgt nach Sitzen
- **Mehrheit = 21 von 40 Sitzen**
- Fraktionen stimmen geschlossen ab (Vereinfachung)
- Vertrauen < 20 einer Fraktion → stimmt fast immer gegen den Spieler

### 7.4 Vertrauen — Veränderungsregeln

| Situation | Vertrauensänderung |
|---|---|
| Entscheidung im Sinne der Fraktion | +10 bis +25 |
| Entscheidung gegen Kerninteressen | -15 bis -30 |
| Versprechen eingehalten | +20 |
| Versprechen gebrochen | -35 (dauerhafter Malus) |
| Event gut bewältigt (aus Fraktionssicht) | +5 bis +15 |
| Kein Kontakt in einem Jahr | -5 (Vernachlässigung) |

**Vertrauensstufen:**

```
80–100  Verbündeter   → unterstützt aktiv, gibt Bonusinfos
60–79   Wohlgesonnen  → stimmt meist zu
40–59   Neutral       → fallabhängig, verhandelbar
20–39   Skeptisch     → stimmt meist dagegen
0–19    Feindlich     → blockiert aktiv, kann Misstrauensvotum stellen
```

### 7.5 Haushalt & Budget

- Jede Entscheidung kostet oder bringt Budget
- Am Jahresende: Bilanzierung
- **Haushalt < 0**: Notkredit nötig → -10 Bürgerzufriedenheit, +Schuldenstand
- **Schuldenstand > 50 Mio**: Land greift ein → Entscheidungsfreiheit eingeschränkt (1 Jahr gesperrt: freie Projekte)

### 7.6 Politisches Kapital

- Startet bei 50
- Wird verbraucht durch: Verhandlungen, Sonderaktionen, Veto-Einsatz
- Regeneriert: +10 pro Jahr, +5 bei hoher Bürgerzufriedenheit
- Bei 0: Spieler kann keine Deals mehr schließen bis zur Regeneration

---

## 8. Events

Einmal pro Jahr tritt ein **ungesteuertes Event** ein. Der Spieler hat keine Kontrolle über *welches*, nur über *wie er reagiert*.

### Event-Typen

| Event | Soforteffekt | Entscheidung |
|---|---|---|
| 🌊 Starkregen / Hochwasser | -💰15 (Notfall) | Reparatur sofort oder Rücklagen-Kredit? |
| 📈 Energiepreise +40% | -😊10, ÖPNV-Nachfrage ↑ | ÖPNV ausbauen oder Haushaltshilfe? |
| 🏗️ Neues Bundesgesetz (z.B. Wärmepummpflicht) | Stadtgebäude betroffen | Sofort umrüsten oder klagen? |
| 📰 Lokaler Skandal (Vorgänger-Ära) | -😊15 sofort | Transparenz zeigen oder abwiegeln? |
| 🎓 Uni plant Erweiterung | Chancen-Event | Fläche bereitstellen oder abwägen? |
| 🏭 Großunternehmen droht Wegzug | -📊15 wenn nichts passiert | Subventionen, Gespräch, Rücktritt hinnehmen? |
| 🌡️ Hitzesommer (Extremwetter) | -🌱5, -😊5 | Notfall-Grünflächen oder Brunnen? |
| 🚧 Brücke gesperrt (Infrastruktur) | -😊8, Verkehrschaos | Sofortinvestition oder Umleitung? |

### Event-Reaktionskarte (Format)

```
⚡ EVENT: [Titel]
[Kontext: was ist passiert, warum ist es ein Problem]

SOFORTREAKTION (innerhalb dieser Runde):
  → Option A: [schnelle Lösung, teuer]
  → Option B: [günstig, aber Risiko]
  → Option C: [abwarten, Gefahr der Eskalation]
```

---

## 9. Wahlsystem

### Wahlformel

Am Ende von Jahr 4 wird die Wahlchance berechnet:

```
Wahlchancen (%) =
  (😊 Bürgerzufriedenheit × 0.40)
  + (📊 Wirtschaftskraft × 0.25)
  + (NachhaltigkeitsBewertung × 0.15)    ← Versprechen eingehalten?
  - (gebrocheVersprechen × 10)            ← Malus pro gebrochenem Versprechen
  + (EventBonus)                          ← bis +15 bei gut gelösten Events
```

Ergebnis ≥ 55 → Wiederwahl
Ergebnis < 55 → Abwahl

### Reflexionsbildschirm (nach Abwahl)

Abgewählt zu werden ist kein Scheitern im Sinne von "Game Over". Der Spieler sieht:

```
Du wurdest abgewählt.

Was gut lief:
  ✓ Haushalt fast immer ausgeglichen
  ✓ Wirtschaftsforum als starker Partner

Was schwierig war:
  ✗ Nordpark-Genehmigung hat 40% der Umweltwähler verloren
  ✗ Versprechen zur Kita (2022) nie eingelöst

Deine Stadt heute:
  Nachhaltigkeits-Index: 34 → langfristige Klimaprobleme möglich
  Schuldenstand: 18 Mio. → noch im Rahmen
  Einwohner: +820 in 4 Jahren
  
[Nochmal versuchen] [Andere Strategie wählen]
```

---

## 10. UI & Visuelles Design

### Designreferenzen

- **Crusader Kings III / Victoria 3** (Paradox Interactive): Referenz für Stil der Fraktionsportraits, Beziehungsanzeigen, Event-Popups, Entscheidungsdialoge. Charaktergetrieben, historisches Feeling, klare Hierarchie in Informationsdarstellung.
- **Sim City (klassisch)**: Referenz für die Stadtansicht von oben — statischer als ein echtes Sim City, aber ähnliche Top-Down-Perspektive als Hauptansicht.

### Layout-Konzept

```
┌──────────────────────────────────────────────────────────┐
│  HEADER: Stadtname | Jahr/Runde | 4 Metriken als Balken  │
├──────────────────┬───────────────────────────────────────┤
│                  │                                       │
│   STADTANSICHT   │         AKTIVES PANEL                 │
│   (Top-Down,     │   (Entscheidungskarte / Event /       │
│    2D Karte)     │    Verhandlungsdialog / Jahresbilanz) │
│                  │                                       │
├──────────────────┴───────────────────────────────────────┤
│  FOOTER: Fraktionsleiste (5 Icons + Vertrauensanzeige)   │
└──────────────────────────────────────────────────────────┘
```

### Stadtansicht (Phase 1 → Phase 2)

- **Phase 1**: Statisches SVG oder Raster-Bild der Stadt, Stadtteile anklickbar, zeigen lokale Daten
- **Phase 2 (Phaser)**: Animierte Tilemap, Stadtveränderungen sichtbar (neues Gewerbegebiet erscheint, Radwege wachsen), Tag/Nacht-Zyklus optional

### Event- & Entscheidungsfenster (CK3-Stil)

```
┌─────────────────────────────────┐
│  [Portrait/Icon]  ANTRAGSTITEL  │
│  ─────────────────────────────  │
│  Kontexttext in 2–3 Sätzen.     │
│  Alltagssprache, kein Jargon.   │
│                                 │
│  ○ Option A   [Effekte]         │
│  ○ Option B   [Effekte]         │
│  ○ Option C   [Effekte]         │
│  ○ Verhandeln                   │
│                                 │
│              [Entscheiden]      │
└─────────────────────────────────┘
```

### Fraktionsleiste (Fußzeile)

Für jede Fraktion:

- Kleines Icon / Fraktionsfarbe
- Vertrauensbalken (0–100)
- Aktuelles Stimmungs-Emoji
- Anzahl Sitze
- Klick → öffnet Fraktions-Detailpanel mit offenen Versprechen

---

## 11. Designprinzipien

### Was bewusst enthalten ist

- ✅ Echte Konsequenzen — keine symbolischen Ja/Nein-Klicks ohne Wirkung
- ✅ Nachverfolgbare Versprechen — das Spiel erinnert sich
- ✅ Systemische Abhängigkeiten — Metriken beeinflussen sich gegenseitig
- ✅ Mehrere legitime Lösungen — keine eindeutig "richtige" Antwort
- ✅ Reflexionsmoment nach Abwahl

### Was bewusst weggelassen wird

- ❌ Gesetzestexte — nur Alltagssprache
- ❌ Zahlenfriedhöfe — max. 4 Metriken gleichzeitig sichtbar
- ❌ Micromanagement — keine Parzellen-Planung
- ❌ Tutorial-Overload — Jahr 1 ist bewusst ruhig, Mechaniken werden schrittweise eingeführt
- ❌ Moralische Wertung — das Spiel kommentiert keine Entscheidung als "falsch"
