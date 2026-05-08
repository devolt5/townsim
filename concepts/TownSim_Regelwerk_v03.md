# TownSim

**Regelwerk – Phase 3: Abstimmung**
_Design-Dokument v0.3_

---

## 1. Überblick

Phase 3 simuliert die Abstimmung des Stadtrats über einen zuvor ausgewählten Antrag. Der Spieler verkörpert den Bürgermeister, der keine eigene Stimme im Rat hat, aber durch Kommunikation und politisches Geschick Einfluss nehmen kann.

_Das didaktische Ziel: Der Spieler erlebt, dass demokratische Entscheidungen durch Verhandlung, Kompromiss und das Managen von Erwartungen entstehen – und dass jeder Deal einen Preis hat._

---

## 2. Spielaufbau & Startkonstellation

### 2.1 Stadtratszusammensetzung

Der Stadtrat besteht aus mehreren Fraktionen. Jede Fraktion hat eine festgelegte Anzahl an Abgeordneten. Für die Abstimmung wird eine absolute Mehrheit der Gesamtsitze benötigt.

**Aktuelle Spielkonfiguration:** 5 Fraktionen, davon 2 Koalitionspartner, 2 neutrale Fraktionen und 1 Opposition.

### 2.2 Position des Bürgermeisters

Der Bürgermeister wird direkt von den Bürgern gewählt – unabhängig vom Stadtrat und oft zu einem anderen Zeitpunkt (azyklische Wahl). Daraus ergeben sich drei mögliche Ausgangslagen:

| Konstellation | Koalition & BM | Schwierigkeit |
|---|---|---|
| Rückenwind | BM-Partei stellt die Ratsmehrheit | Leicht |
| Kohabitation | BM-Partei ist in der Opposition | Schwer |
| Gemischte Lage | BM-Partei ist Juniorpartner in der Koalition | Mittel |

Die Konstellation wird zu Spielbeginn festgelegt und bestimmt die Grundwahrscheinlichkeit, wie Anträge durch den Rat kommen. Sie kann als Schwierigkeitsgrad-Hebel genutzt werden.

---

## 3. Wertestruktur der Abstimmung

Für jede Fraktion X ergibt sich die Stimmenverteilung aus zwei Schritten:

1. Der **Antragswert** bestimmt über eine Lookup-Tabelle den prozentualen Anteil an Ja-, Nein- und unentschlossenen Stimmen.
2. **Modifikatoren** (Strukturwert, Aktionswert) verschieben die Ja-Stimmen auf Basis dieser Ausgangswerte.

> **Grundregel für alle Modifikatoren:** Jeder Modifikator wirkt unabhängig immer nur auf den Basiswert (die reinen Ja-Stimmen aus dem Antragswert) – Modifikatoren sind nicht additiv miteinander. Jeder Modifikator bewirkt dabei mindestens +1 Stimme, auch wenn der prozentuale Anteil rechnerisch null ergibt.

### 3.1 Antragswert (Ebene 1)

Der Antragswert gibt an, wie eine Fraktion inhaltlich zu einem Antrag steht. Er ist für jeden Antrag fest vorgegeben (Wertebereich: −10 bis +10) und bestimmt über folgende Tabelle die Stimmverteilung:

| Antragswert | Dafür | Unentschlossen | Dagegen |
|---|---|---|---|
| +10 | 90 % | 10 % | 0 % |
| +9 | 80 % | 10 % | 10 % |
| +8 | 70 % | 20 % | 10 % |
| +7 | 60 % | 20 % | 20 % |
| +6 | 50 % | 30 % | 20 % |
| +5 | 50 % | 30 % | 20 % |
| +4 | 50 % | 30 % | 20 % |
| +3 | 40 % | 40 % | 20 % |
| +2 | 25 % | 50 % | 25 % |
| +1 | 25 % | 50 % | 25 % |
| 0 | 25 % | 50 % | 25 % |
| −1 | 25 % | 50 % | 25 % |
| −2 | 25 % | 50 % | 25 % |
| −3 | 20 % | 40 % | 40 % |
| −4 | 20 % | 30 % | 50 % |
| −5 | 20 % | 30 % | 50 % |
| −6 | 20 % | 30 % | 50 % |
| −7 | 20 % | 20 % | 60 % |
| −8 | 10 % | 20 % | 70 % |
| −9 | 10 % | 10 % | 80 % |
| −10 | 0 % | 10 % | 90 % |

**Beispiel:** Fraktion mit 10 Sitzen, Antragswert +8 → 7 Ja-Stimmen, 2 Unentschlossene, 1 Nein-Stimme

### 3.2 Strukturwert (Ebene 2)

Der Strukturwert beschreibt die politische Grundhaltung einer Fraktion gegenüber dem Bürgermeister. Er ist ein Modifikator, der fix für den gesamten Spieldurchlauf gilt und die Ja-Stimmen aus dem Antragswert prozentual verschiebt.

| Gruppe | Strukturwert | Effekt | Anzahl im Spiel |
|---|---|---|---|
| Koalitionspartner | +5 (+50 %) | Ja-Stimmen × 1,5 (aufgerundet) | 2 Fraktionen |
| Neutrale Fraktionen | 0 (±0 %) | Keine Veränderung | 2 Fraktionen |
| Opposition | −5 (−50 %) | Ja-Stimmen × 0,5 (aufgerundet) | 1 Fraktion |

> Der Wert der Modifikatoren ist einstellbar und kann im Spieldesign angepasst werden.

**Beispiel für Extremfall (volle Ablehnung):**
Fraktion A mit 10 Sitzen, Antragswert −10 → 0 Ja-Stimmen (Basiswert)

- Modifikator Koalition (+50 % auf 0) → rechnerisch 0, aber **Mindestregel: +1 Stimme**
- Modifikator Pressekonferenz (+25 % auf 0) → rechnerisch 0, aber **Mindestregel: +1 Stimme**
- Ergebnis: **2 Ja-Stimmen** trotz vollständiger inhaltlicher Ablehnung

### 3.3 Aktionswert (Ebene 3)

Aktionswerte sind dynamische Modifikatoren, die durch Spieleraktionen in Phase 2 erzeugt werden. Sie wirken immer auf alle Fraktionen gleichzeitig (eine Pressekonferenz erreicht die gesamte Öffentlichkeit, nicht nur eine Fraktion) und sind zeitlich begrenzt auf das aktuelle Quartal oder Jahr.

- **Wertebereich:** max. +2,5 (+25 %) bis min. −2,5 (−25 %)
- **Global:** Jede Aktion gilt für alle Fraktionen gleichermaßen
- **Zeitlich begrenzt:** Wirken nur für das aktuelle Quartal oder Jahr
- **Anwendung:** Immer nur auf den Basiswert (Ja-Stimmen aus Antragswert), nicht auf bereits modifizierte Werte; Mindestregel gilt ebenfalls

| Aktion | Aktionswert | Effekt |
|---|---|---|
| Pressekonferenz (erfolgreich) | +2,5 (+25 %) | Alle Fraktionen: Ja-Stimmen (Basis) × 1,25 |
| Zeitungsinterview | +1,5 (+15 %) | Alle Fraktionen: Ja-Stimmen (Basis) × 1,15 |
| Skandal | −2,5 (−25 %) | Alle Fraktionen: Ja-Stimmen (Basis) × 0,75 |
| _(weitere Aktionen folgen)_ | … | … |

> **Aktionen und Zufallseffekte:** Vom Spieler ausgelöste Aktionen sind zunächst immer positiv. Negative Aktionswerte entstehen durch externe Ereignisse, die das Spiel zu festen Zeitpunkten einspielt – etwa „Ölpreis steigt" oder „Haushaltslücke entdeckt". Die Möglichkeit, dass eine eigene Aktion schiefgeht (z. B. „Pressekonferenz war ein Desaster"), kann nachträglich integriert werden.

> **Anzahl der Aktionen:** Pro Phase 2 gibt es eine maximale Anzahl an verfügbaren Aktionen. Einige sind wiederholbar, andere nicht. Details werden separat ausgearbeitet.

### 3.4 Unentschlossene & Würfelmechanik

Nach Anwendung aller Modifikatoren verbleiben Abgeordnete, die sich bis zuletzt nicht festgelegt haben. Diese werden gemeinsam gewürfelt.

**Ablauf:**

1. Unentschlossene Stimmen einer Fraktion werden summiert (z. B. 5 von 10 Sitzen)
2. Ein Zufallswert zwischen 0 % und 100 % wird gewürfelt (z. B. Ergebnis: 30 %)
3. Dieser Basiswürfelwert wird durch den **Reputationsmodifikator** angepasst
4. Das angepasste Ergebnis gibt den Anteil der Unentschlossenen an, die zustimmen

**Reputationseinfluss auf den Würfelwert:**
Der Reputationswert (0–100) fließt als Modifikator in das Würfelergebnis ein, aber nicht direkt 1:1 – ein zu starker Einfluss würde bedeuten, dass Unentschlossene fast immer überzeugt werden. Der genaue Faktor wird noch kalibriert (Kandidaten: Faktor 0,2 oder 0,5).

**Beispiel (Faktor 0,5):**

- 5 unentschlossene Stimmen
- Würfelergebnis: 30 %
- Reputation: 55 von 100
- Anpassung: 30 % + (55 × 0,5) % = 30 % + 27,5 % = 57,5 % → **~3 Unentschlossene stimmen zu**

---

## 4. Einflussnahme des Bürgermeisters

### 4.1 Reguläre Aktionen (Phase 2)

In Phase 2 stehen dem Spieler verschiedene Aktionen zur Verfügung, die Aktionswerte erzeugen. Diese wirken global auf alle Fraktionen und sind zeitlich begrenzt. Die genaue Liste der verfügbaren Aktionen sowie Wiederholbarkeit und Limits werden separat ausgearbeitet.

### 4.2 Das Versprechen – Kerndynamik

Versprechen sind das stärkste Instrument des Bürgermeisters. Sie sind **kein Modifikator**, sondern eine direkte Einigung mit einer Fraktion: Die Fraktion stimmt geschlossen zu – unabhängig von Antragswert, Struktur- oder Aktionswert.

**Spielablauf:**

1. Der Spieler klickt auf „Verhandeln" bei einem Antrag
2. Er wählt eine Fraktion aus und bietet ein konkretes Versprechen an
   - Beispiele: _„Den nächsten Wirtschaftsantrag annehmen"_, _„Grundsteuersenkungen unterstützen"_
3. Die Fraktion stimmt dem Versprechen zu oder lehnt ab
4. Bei Einigung: Die Fraktion stimmt vollständig für den aktuellen Antrag zu (interne Behandlung wie Antragswert +10)
5. Das Versprechen wird auf die **Liste offener Versprechen** gesetzt

**Regeln:**

- Versprechen sind bindend und können nicht einseitig zurückgezogen werden
- Der Spieler sieht die Warteschlange der kommenden Anträge und weiß, was er zusagt
- Anträge werden mit Tags versehen (z. B. „Wirtschaftsantrag"), damit Versprechen eindeutig zugeordnet werden können
- Eingelöstes Versprechen: Positive Auswirkung auf Metriken, vor allem Bürgerzufriedenheit
- Gebrochenes Versprechen: Negative Auswirkung auf Metriken und Loyalitätsverlust bei der betroffenen Fraktion
- Mehrere offene Versprechen gleichzeitig: Reputation des BM sinkt

> **Nicht einlösbare Versprechen:** Es kann vorkommen, dass ein passender Antrag nie erscheint (z. B. weil kein Wirtschaftsantrag in der Pipeline ist). In diesem Fall bleibt das Versprechen offen und schadet langfristig der Reputation. Das ist bewusst so gestaltet – es spiegelt die Realität wider, dass man nicht immer alle Zusagen einhalten kann.

---

## 5. Reputationssystem

Der Reputationswert (Bürgerzufriedenheit) des Bürgermeisters ist ein globaler Wert, der den Ausgang des Würfelns der Unentschlossenen beeinflusst. Ein hoher Wert begünstigt den Antrag; ein niedriger Wert wirkt dagegen.

| Ereignis | Reputationseffekt |
|---|---|
| Antrag erfolgreich verabschiedet | +2 |
| Versprechen eingehalten | +3 |
| Versprechen gebrochen | −5 |
| Pressekonferenz (gutes Ergebnis) | +1 |
| Antrag abgelehnt (knappe Niederlage) | −1 |
| Antrag abgelehnt (deutliche Niederlage) | −3 |

---

## 6. Fraktionsvertrauen (Trust)

Das Vertrauen einer Fraktion in den Bürgermeister ist ein dynamischer Wert (0–100), der widerspiegelt, wie sehr die politischen Entscheidungen (Abstimmungsergebnisse) den Interessen der jeweiligen Fraktion entsprechen.

### 6.1 Dynamik & Berechnung

Jede Fraktion startet mit einem Basisvertrauen von **50 Punkten**. Nach jeder Abstimmung in Phase 3 wird das Vertrauen basierend auf dem **Antragswert (support)** und dem **Ausgang der Wahl** angepasst.

**Die Vertrauens-Formel:**
`Vertrauens-Delta = Antragswert × Richtung`

- **Richtung = +1:** Das Ergebnis entspricht dem Wunsch der Fraktion (Antrag angenommen + support > 0 ODER Antrag abgelehnt + support < 0).
- **Richtung = -1:** Das Ergebnis widerspricht dem Wunsch der Fraktion (Antrag angenommen + support < 0 ODER Antrag abgelehnt + support > 0).

**Beispiele (Multiplikator 1.0):**

- Fraktion ist dafür (+5) und Antrag wird angenommen: **+5 Vertrauen**
- Fraktion ist dagegen (-5) und Antrag wird abgelehnt: **+5 Vertrauen**
- Fraktion ist dafür (+8) und Antrag wird abgelehnt: **-8 Vertrauen**
- Fraktion ist neutral (0): **Keine Änderung**

### 6.2 Visualisierung

Der Spieler sieht das aktuelle Vertrauen direkt in der Benutzeroberfläche über farbige Trust-Bars:

- **0–25 % (Kritisch):** Rot
- **25–75 % (Neutral/Stabil):** Orange
- **75–100 % (Sehr hoch):** Grün

---

## Glossar

| Begriff | Bedeutung |
|---|---|
| Antragswert | Inhaltliche Meinung einer Fraktion zu einem Antrag (−10 bis +10, fix pro Antrag) |
| Strukturwert | Politische Grundhaltung einer Fraktion als Modifikator (fix pro Partie) |
| Aktionswert | Durch Spieleraktionen erzeugter Modifikator (global, zeitlich begrenzt) |
| Basiswert | Ja-Stimmen einer Fraktion gemäß Antragswert-Tabelle, vor Modifikatoren |
| Unentschlossene | Abgeordnete, die nach Tabelle noch nicht festgelegt sind; werden gemeinsam gewürfelt |
| Versprechen / Junktim | Bindende Zusage des BM; bewirkt vollständige Zustimmung einer Fraktion |
| Reputation | Globaler BM-Wert (Bürgerzufriedenheit); beeinflusst den Würfelausgang |
| Fraktionsvertrauen | Bindung einer Fraktion an den BM (0–100); sinkt bei politischer Niederlage, steigt bei Erfolg |
| Azyklische Wahl | BM-Wahl unabhängig vom Zeitpunkt der Stadtratswahl |
| Kohabitation | BM-Partei ist in der Minderheit im Stadtrat |
