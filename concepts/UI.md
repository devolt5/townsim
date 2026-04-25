# TownSim — UI-Architektur

> Version 0.1 | Status: Konzeptphase

---

## Grundprinzip

Das UI besteht aus **React-Komponenten als feste Shell** rund um einen **Phaser-Canvas in der Mitte**. Die Shell ist unveränderlich — der Spieler orientiert sich immer am gleichen Layout. Nur der Inhalt der Panels und des Canvas wechselt.

```
┌─────────────────────────────────────────────────────────────┐
│                        HEADER (fest)                        │
├──────────────┬──────────────────────────┬───────────────────┤
│              │                          │                   │
│  LINKES      │     PHASER CANVAS        │   RECHTES         │
│  PANEL       │     (Spielwelt, fest     │   PANEL           │
│  (mit Tabs)  │      in der Größe)       │   (mit Tabs)      │
│              │                          │                   │
├──────────────┴──────────────────────────┴───────────────────┤
│                        FOOTER (fest)                        │
└─────────────────────────────────────────────────────────────┘
```

---

## Zonen im Detail

### Header

- Schmal (ca. 48–56 px)
- Zeigt: **Stadtname · Jahr · Runde**
- Zeigt: **4 Hauptmetriken** als kompakte Balkengrafiken (💰 😊 🌱 📊)
- Keine Tabs, keine Navigation — nur Statusanzeige

### Linkes Panel

Breite: ~280–320 px, volle Höhe zwischen Header und Footer.

Tabs (fest, immer sichtbar):

| Tab | Inhalt |
|---|---|
| **Stadtbild** | Infos zum aktuell angeklickten Stadtteil (aus Phaser-Klick) |
| **Ereignisse** | Log der letzten Ereignisse und Events dieser Amtszeit |
| **Jahresbilanz** | Zusammenfassung des abgelaufenen Jahres (erscheint automatisch) |

### Phaser Canvas (Mitte)

- Feste Pixelgröße — passt sich **nicht** an Fenstergröße an
- Der Canvas ist immer sichtbar, Panels legen sich links/rechts daneben
- **Navigation im Canvas:**
  - **Drag & Drop** zum Verschieben der Kartenansicht (Kamera-Pan)
  - **Scroll / Pinch** zum Zoomen
- Stadtteile bleiben anklickbar → triggern linkes Panel (Tab "Stadtbild")

### Rechtes Panel

Breite: ~320–360 px, volle Höhe zwischen Header und Footer.

Tabs (fest, immer sichtbar):

| Tab | Inhalt |
|---|---|
| **Antrag** | Aktuelle Entscheidungskarte mit Optionen (Hauptmechanik) |
| **Verhandlung** | Verhandlungsmodus mit einzelnen Fraktionen |
| **Versprechen** | Liste offener und eingehaltener Versprechen |

Der Tab **Antrag** wird automatisch aktiviert, wenn eine neue Entscheidungskarte eingeht.

### Footer

- Schmal (ca. 52 px)
- Zeigt: **Fraktionsleiste** — alle 5 Fraktionen mit Icon, Kurzname, Sitzanzahl und Vertrauensbalken
- Klick auf eine Fraktion → öffnet Fraktions-Detailansicht im rechten Panel (Tab "Verhandlung")
- Zeigt rechts: **Mehrheitsindikator** (z. B. "Aktuelle Koalition: 24 / 40 Sitze")

---

## Modale Ereignisfenster

Wichtige Events erscheinen als **Modal-Overlay mittig über dem Phaser-Canvas** — nicht als Panel, sondern als Unterbrechung. Damit ist dem Spieler klar: *Jetzt muss ich reagieren.*

### Wann ein Modal erscheint

- Ungesteuertes Ereignis tritt ein (Hochwasser, Energiekrise, Skandal …)
- Jahresende-Übergang
- Wahl (Ende Jahr 4)
- Kritischer Schwellenwert wurde unterschritten (z. B. Haushalt < 0)

### Modal-Verhalten

- Blockiert **nicht** den Rest der UI — Header und Footer bleiben sichtbar
- Hat immer **1–3 Reaktionsoptionen** mit sichtbaren Effekten
- Schließt sich erst, wenn der Spieler eine Option gewählt hat
- Canvas dahinter wird leicht abgedunkelt (Overlay-Ebene)

### Modal-Struktur

```
┌─────────────────────────────────────────┐
│  ⚡ [Event-Icon]   EREIGNISTITEL         │
│  ─────────────────────────────────────  │
│  Kontexttext (2–3 Sätze, Alltagssprache)│
│                                         │
│  → Option A   [Effekte]                 │
│  → Option B   [Effekte]                 │
│  → Option C   [Effekte]                 │
│                                         │
│                          [Entscheiden]  │
└─────────────────────────────────────────┘
```

---

## State-Management (UI-Ebene)

Alle Panel-Inhalte und der Modal-Zustand werden über einen zentralen UI-Store verwaltet (Zustand).

```typescript
interface UIState {
  leftTab: 'stadtbild' | 'ereignisse' | 'bilanz';
  rightTab: 'antrag' | 'verhandlung' | 'versprechen';
  modal: ModalConfig | null;
  selectedDistrict: District | null;
}
```

Phaser kommuniziert mit React ausschließlich über **Callbacks** (kein direkter DOM-Zugriff aus Phaser heraus).

---

## Designprinzipien für die UI

- **Kein Fenster-Chaos** — das Layout ist unveränderlich, der Spieler muss nie suchen
- **Tabs statt Popups** — Informationen wechseln innerhalb der festen Panels
- **Modals sparsam** — nur für echte Unterbrechungen, nicht für Routineinfos
- **Canvas bleibt immer sichtbar** — der Spieler verliert nie den Bezug zur Stadtkarte
- **Mobile-Kompatibilität** vorerst nicht im Fokus — Zielplattform ist Desktop-Browser

## 10. UI & Visuelles Design

### Designreferenzen

- **Crusader Kings III / Victoria 3** (Paradox Interactive): Referenz für Stil der Fraktionsportraits, Beziehungsanzeigen, Event-Popups, Entscheidungsdialoge. Charaktergetrieben, historisches Feeling, klare Hierarchie in Informationsdarstellung.
- **Sim City (klassisch)**: Referenz für die Stadtansicht von oben — statischer als ein echtes Sim City, aber ähnliche Top-Down-Perspektive als Hauptansicht.

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
