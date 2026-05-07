# Game Store

Zustand-Store (`src/store/gameStore.ts`) — zentraler Spielstand.  
Persistenz via `localStorage` (Key `townsim-save`), DevTools via Redux DevTools Extension.

---

## Wichtiges Designprinzip: kein Bild-Blob im State

Fraktionfotos und Petitionsbilder sind webpack-importierte Assets (Binärdaten). Sie dürfen **nicht** in den Store — das würde die DevTools-Serialisierung verlangsamen und `localStorage` sprengen.

**Regel:** Der Store hält nur primitive Werte. Vollständige Objekte werden über **Selektoren** zusammengebaut:

| Selektor | Gibt zurück | Kombiniert |
|---|---|---|
| `selectFactions(state)` | `Faction[]` | statische `FACTIONS` + `state.factionTrusts` |
| `selectPendingPetitions(state)` | `Petition[]` | statische `PETITIONS` lookup per `state.pendingPetitionIds` |

Verwendung in Komponenten:

```ts
const factions = useGameStore(selectFactions);
const petitions = useGameStore(selectPendingPetitions);
```

---

## State-Felder (Überblick)

| Feld | Typ | Bedeutung |
|---|---|---|
| `basicData` | `BasicGameData` | Stadtname, Spielername |
| `turn` | `Turn` | Aktuelles Jahr (1–5), Quartal (1–4), Phase (1–3) |
| `metrics` | `Metric[]` | budget, reputation, sustainability, economy (je 0–100) |
| `factionTrusts` | `Record<string, number>` | Vertrauenswerte je Fraktion (0–100) |
| `openPromises` | `GamePromise[]` | Aktive Versprechen inkl. Deadline und broken-Flag |
| `pendingPetitionIds` | `string[]` | IDs der 3 Anträge des aktuellen Quartals |
| `activePetitionId` | `string \| null` | Der für Phase 3 ausgewählte Antrag |
| `activeActionModifiers` | `ActionModifier[]` | Aktive Modifikatoren aus Phase-2-Aktionen (§3.3) |
| `lastVoteResult` | `VoteResult \| null` | Ergebnis der letzten Abstimmung; reset bei Quartalswechsel |
| `hasVotedThisQuarter` | `boolean` | Verhindert Doppelabstimmung |

---

## Spielzyklus

```
Phase 1 (Lagebericht)
  └─ advanceTurn() → Phase 2

Phase 2 (Vorbereitung)
  ├─ Spieler wählt Antrag via resolvePetition()
  ├─ Spieler löst Aktionen aus via addActionModifier()
  └─ advanceTurn() → Phase 3

Phase 3 (Abstimmung)
  ├─ castVote()  → ruft votingEngine, schreibt lastVoteResult, passt Metriken an
  └─ advanceTurn() → nächstes Quartal (neues Quartal = drawPetitions, expire modifiers, check promises)
```

---

## Abstimmung

Die Berechnung findet vollständig in `src/game/votingEngine.ts` statt (reines Modul, keine Store-Abhängigkeit).  
`castVote()` im Store:

1. Ruft `resolveVote(petition, factions, modifiers, promises, reputation)`
2. Schreibt `lastVoteResult`
3. Wendet `computeVoteMetricDeltas()` auf `metrics` an
4. Auto-fulfilled passende Versprechen per `tagCondition`

---

## Versprechen

```ts
interface GamePromise {
  faction: string;
  tagCondition?: string;   // Antragstag, der das Versprechen einlöst
  deadline?: { year, quarter };
  fulfilled: boolean;
  broken: boolean;
}
```

Bei `advanceTurn()` werden überfällige Versprechen automatisch auf `broken: true` gesetzt (−5 Reputation je Versprechen).  
Hilfsfunktionen für Deadlines: `src/lib/turnUtils.ts` (`inOneYear`, `endOfYear`, `quartersRemaining`, …).
