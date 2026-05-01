# Messaging System

## Überblick

Das Messaging-System besteht aus drei Schichten:

1. **Messages** (`src/data/messages.ts`) — kurze Inbox-Einträge, die im Messenger-Tab angezeigt werden
2. **Dialogs** (`src/data/dialogs.ts`) — längere Chat-Verläufe, die beim Anklicken einer Nachricht geöffnet werden
3. **Trigger** (`src/data/timedMessages.ts`, `src/data/tutorialMessages.ts`) — Regeln, wann neue Nachrichten automatisch ausgeliefert werden

---

## Datenstrukturen

### `Message`

```ts
interface Message {
  id: number;
  sender: string;       // Anzeigename im Messenger
  content: string;      // Vorschautext in der Inbox
  timestamp: Date;
  dialogId?: number;    // optional: öffnet bei Klick den zugehörigen Dialog
  read: boolean;
}
```

### `DialogData`

```ts
interface DialogData {
  id: number;
  sender: string;   // muss mit Message.sender übereinstimmen (gruppiert den Chat-Verlauf)
  title: string;    // Chip-Überschrift im Chat-Fenster
  text: string;     // Markdown-Inhalt der Nachricht
}
```

`dialogsBySender` gruppiert alle Dialoge nach Sender, sortiert nach `id`. Das `GameDialog`-Fenster zeigt automatisch den **gesamten Verlauf** des Senders bis einschließlich des angeklickten Dialogs an.

---

## Trigger-Typen

### A) Zeitbasiert — `TimedTrigger`

Datei: `src/data/timedMessages.ts`

```ts
interface TimedTrigger {
  year: number;
  quarter: number;
  key: string;      // eindeutiger Bezeichner zur Deduplizierung
  message: Omit<Message, 'id' | 'timestamp' | 'read'>;
}
```

**Auslösung:** In `advanceTurn()` im Store — nach jedem Quartalswechsel wird geprüft, ob der neue `{ year, quarter }` zu einem Trigger passt. Falls ja und der `key` noch nicht in `deliveredTriggerKeys[]` enthalten ist, wird die Nachricht automatisch in die Inbox eingefügt.

**Beispiele:**

| key | Zeitpunkt | Sender |
|---|---|---|
| `timed-y2-q1-reporter` | Jahr 2, Q1 | Stadtredakteur |
| `timed-y3-q2-reporter` | Jahr 3, Q2 | Stadtredakteur |

---

### B) Tutorial-basiert — `TutorialTrigger`

Datei: `src/data/tutorialMessages.ts`

```ts
interface TutorialTrigger {
  afterClickCount: number;  // feuert nach genau N globalen Interaktionen
  key: string;
  message: Omit<Message, 'id' | 'timestamp' | 'read'>;
}
```

**Auslösung:** `incrementGlobalClicks()` im Store — wird bei jeder bedeutsamen Spielerinteraktion aufgerufen und prüft, ob der neue Zählerstand einen Trigger trifft.

Als Interaktion zählt:

- Nachricht anklicken (Messenger-Tab)
- Chat-Dialog schließen
- Tab-Wechsel im Telefon (Nachrichten / Stadt / Bilanz)
- Bezirk auf der Karte anklicken

**Beispiele:**

| key | Auslöser | Dialog |
|---|---|---|
| `tutorial-click-2` | 2. Interaktion | Stadtberaterin: Fraktionen |
| `tutorial-click-4` | 4. Interaktion | Stadtberaterin: Versprechen |
| `tutorial-click-6` | 6. Interaktion | Stadtberaterin: Du bist bereit |

---

## Store-State

Relevante Felder in `gameStore.ts`:

| Feld | Typ | Zweck |
|---|---|---|
| `messages` | `Message[]` | aktuelle Inbox |
| `globalClickCount` | `number` | zählt Interaktionen für Tutorial-Trigger |
| `deliveredTriggerKeys` | `string[]` | verhindert doppelte Auslieferung nach Reload |

Relevante Actions:

| Action | Beschreibung |
|---|---|
| `addMessage(msg)` | fügt dynamisch eine neue Nachricht hinzu |
| `incrementGlobalClicks()` | erhöht Zähler + prüft Tutorial-Trigger |
| `markMessageRead(id)` | markiert eine Nachricht als gelesen |
| `advanceTurn()` | rückt Spielzeit vor + prüft zeitbasierte Trigger |

Alle drei Felder werden via `persist`-Middleware im LocalStorage gespeichert (Key: `townsim-save`).

---

## Neuen Trigger hinzufügen

**Zeitbasiert:**

1. Dialog in `src/data/dialogs.ts` anlegen (neue ID + Sender + Text)
2. Eintrag in `TIMED_TRIGGERS` in `src/data/timedMessages.ts` ergänzen

**Tutorial:**

1. Dialog in `src/data/dialogs.ts` anlegen
2. Eintrag in `TUTORIAL_TRIGGERS` in `src/data/tutorialMessages.ts` ergänzen

**Neuen Sender mit eigenem Avatar:**

- Bild unter `src/images/` ablegen
- In `src/components/GameDialog.tsx` in die `SENDER_AVATAR`-Map eintragen

---

## Sender-Avatar-Map

Definiert in `GameDialog.tsx`:

```ts
const SENDER_AVATAR: Record<string, string> = {
  Stadtberaterin: guideImage,       // guide.jpg
  Stadtredakteur: delegate01Image,  // delegate_01.jpg
};
```

Unbekannte Sender erhalten `guide.jpg` als Fallback.
