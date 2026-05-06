**TownSim**

Regelwerk - Phase 3: Abstimmung

_Design-Dokument v0.1_

# **1\. Überblick**

Phase 3 simuliert die Abstimmung des Stadtrats über einen zuvor ausgewählten Antrag. Der Spieler verkörpert den Bürgermeister, der keine eigene Stimme im Rat hat, aber durch Kommunikation und politisches Geschick Einfluss nehmen kann.

_Das didaktische Ziel: Der Spieler erlebt, dass demokratische Entscheidungen durch Verhandlung, Kompromiss und das Managen von Erwartungen entstehen - und dass jeder Deal einen Preis hat._

# **2\. Spielaufbau & Startkonstellation**

## **2.1 Stadtratszusammensetzung**

Der Stadtrat besteht aus mehreren Fraktionen. Jede Fraktion hat eine festgelegte Anzahl an Abgeordneten. Für die Abstimmung wird eine absolute Mehrheit der Gesamtsitze benötigt.

## **2.2 Position des Bürgermeisters**

Der Bürgermeister wird direkt von den Bürgern gewählt - unabhängig vom Stadtrat und oft zu einem anderen Zeitpunkt (azyklische Wahl). Daraus ergeben sich drei mögliche Ausgangslagen:

| **Konstellation** | **Koalition & BM**                           | **Schwierigkeit** |
| ----------------- | -------------------------------------------- | ----------------- |
| Rückenwind        | BM-Partei stellt die Ratsmehrheit            | Leicht            |
| Kohabitation      | BM-Partei ist in der Opposition              | Schwer            |
| Gemischte Lage    | BM-Partei ist Juniorpartner in der Koalition | Mittel            |

Die Konstellation wird zu Spielbeginn festgelegt und bestimmt die Grundwahrscheinlichkeit, wie Anträge durch den Rat kommen. Sie kann als Schwierigkeitsgrad-Hebel genutzt werden.

# **3\. Wertestruktur der Abstimmung**

Für jede Fraktion X wird die Anzahl zustimmender Abgeordneter aus drei überlagerten Ebenen berechnet:

**Formel**

Zustimmung(X) = Antragswert(X) + Strukturwert(X) + Σ Aktionswerte ± Zufallswert

→ Der Zufallswert wird durch Spieleraktionen beeinflusst (Korridor-Mechanik, siehe §3.4)

## **3.1 Antragswert (Ebene 1)**

Inhaltliche Meinung einer Fraktion zu einem konkreten Antrag. Wird pro Antrag fest vergeben und spiegelt die politische Nähe der Fraktion zum Thema wider.

- Fixer Wert, unterschiedlich je Antrag
- Kann positiv oder negativ sein
- Beispiel: Radwegeausbau → Terra: +8

## **3.2 Strukturwert (Ebene 2)**

Politische Grundhaltung einer Fraktion gegenüber dem Bürgermeister, abhängig von der Koalitionskonstellation. Gilt für den gesamten Spieldurchlauf.

| **Ring** | **Gruppe**                  | **Grundhaltung**                   | **Strukturwert** |
| -------- | --------------------------- | ---------------------------------- | ---------------- |
| 1        | Eigene Fraktion (BM-Partei) | Loyal, aber nicht blind            | +5 bis +8        |
| 2        | Koalitionspartner           | Kooperativ, mit eigenen Interessen | +2 bis +4        |
| 3        | Konstruktive Opposition     | Inhaltlich manchmal erreichbar     | -1 bis +1        |
| 4        | Kernopposition              | Grundsätzlich skeptisch            | -3 bis -6        |

## **3.3 Aktionswert (Ebene 3)**

Dynamischer Wert, den der Spieler in Phase 2 (Planung) erarbeitet hat. Addiert sich zum Ausgangswert.

Beispiele siehe 4.1.

## **3.4 Zufallswert & Korridor-Mechanik**

Jede Fraktion hat keine feste Zustimmungszahl, sondern eine Spanne. Der Zufallswert bildet die "Unentschiedenen" ab - Abgeordnete, die sich bis zuletzt nicht festlegen.

**Korridor-Prinzip**

Zustimmung(X) = Ausgangswert ± Z

Z = Zufallsbereich (Breite des Korridors)

Hohe Reputation des BM → kleineres Z (mehr Vorhersagbarkeit)

Gebrochene Versprechen → größeres Z (Unberechenbarkeit steigt)

Koalitionsloyalität → Korridor verschiebt sich nach oben

Gut vorbereitete Spieler reduzieren ihr Risiko - aber null Risiko gibt es nie. Das erzeugt bleibende Spannung bis zur letzten Stimme.

# **4\. Einflussnahme des Bürgermeisters**

## **4.1 Reguläre Aktionen**

In Phase 2 stehen dem Spieler verschiedene Aktionen zur Verfügung, die den Aktionswert erhöhen. Jede Aktion kostet Zeit oder politisches Kapital.

| **Aktion**                      | **Zielgruppe**                   | **Effekt**               | **Kosten**                        |
| ------------------------------- | -------------------------------- | ------------------------ | --------------------------------- |
| Mit Fraktion sprechen           | Eine Fraktion                    | +3 Aktionswert           | 1 Zeiteinheit                     |
| Mit Einzelabgeordnetem sprechen | 1 Person                         | +1-2 (individuel)        | 1 Zeiteinheit                     |
| Pressekonferenz                 | Öffentlichkeit / alle Fraktionen | +2 breit gestreut        | 1 Zeiteinheit + Reputationsrisiko |
| Bürgerumfrage                   | Alle Fraktionen                  | +5 fraktionsübergreifend | 2 Zeiteinheiten                   |
| Versprechen geben (Deal)        | Eine Fraktion                    | +4, Korridor↑            | Nächste Runde gebunden            |

## **4.2 Das Versprechen - Kerndynamik**

Der Spieler kann einer Fraktion anbieten: "Wenn ihr zustimmt, behandeln wir als nächstes Antrag X." Dies ist das politische Junktim aus der Kommunalpolitik und das didaktische Herzstück des Spiels.

- Versprechen sind bindend: Der nächste Antrag der Reihe wird durch das Junktim beeinflusst
- Der Spieler sieht die Warteschlange der kommenden Anträge - er weiß, was er zusagt
- Erfülltes Versprechen: Loyalitätswert der Fraktion steigt leicht
- Gebrochenes Versprechen: Loyalitätswert sinkt, Zufallskorridor verbreitert sich
- Mehrere offene Versprechen gleichzeitig: Reputation des BM sinkt

## **4.3 Der Joker: Loyalitätsappell**

Bei kritischen Anträgen kann der Bürgermeister einmalig an die Loyalität der Koalition appellieren. Diese Sonderaktion übersteuert normale Einflusskanäle - aber mit Preis.

| **Eigenschaft** | **Regelung**                                                             |
| --------------- | ------------------------------------------------------------------------ |
| Verfügbarkeit   | Maximal 1× Jahr                                                          |
| Effekt          | Koalitions-Korridor verschiebt sich stark nach oben (+8 bis +12)         |
| Kosten          | Loyalitätswert der Koalition sinkt danach leicht (Gefallen eingefordert) |
| Bedingung       | Erfordert Reputationswert ≥ Schwellenwert                                |
| Risiko          | Bei zu niedriger Reputation: Joker schlägt fehl oder kehrt sich um       |

# **5\. Reputationssystem**

Der Reputationswert des Bürgermeisters ist ein globaler Wert, der alle Aktionen überlagert. Er bestimmt, wie stark Einflussnahmen wirken und wie breit der Zufallskorridor ausfällt.

| **Ereignis**                            | **Reputationseffekt** |
| --------------------------------------- | --------------------- |
| Antrag erfolgreich verabschiedet        | +2                    |
| Versprechen eingehalten                 | +3                    |
| Versprechen gebrochen                   | -5                    |
| Joker gespielt (erfolgreich)            | -1                    |
| Pressekonferenz (gutes Ergebnis)        | +1                    |
| Antrag abgelehnt (knappe Niederlage)    | -1                    |
| Antrag abgelehnt (deutliche Niederlage) | -3                    |

**Schwellenwert-Regel**

Reputation ≥ 70 → Zufallskorridor klein, Joker voll wirksam

Reputation 40-69 → Normalbetrieb

Reputation < 40 → Korridor verbreitert sich, Joker riskant

Reputation < 20 → Joker nicht verfügbar

# **6\. Beispieldurchlauf**

Antrag: Ausbau des Radwegenetzes (40 Stadtratsmandate, Mehrheit = 21)

| **Fraktion** | **Sitze** | **Antragswert** | **Strukturwert**   | **Aktionswert**  | **Ausgangswert** | **Zufallskorr.** |
| ------------ | --------- | --------------- | ------------------ | ---------------- | ---------------- | ---------------- |
| Terra        | 8         | +7              | +5 (Koalition)     | +3 (Gespräch)    | 15 / 8 mögl.     | ±1 → 7-8         |
| Union        | 10        | +3              | +3 (Koalition)     | +5 (Umfrage)     | 13 / 10 mögl.    | ±2 → 6-8         |
| Bund         | 12        | -2              | -4 (Opposition)    | 0                | −6 / 12 mögl.    | ±3 → 0-3         |
| Syndikat     | 6         | -1              | +2 (kl. Koalition) | +3 (Versprechen) | 7 / 6 mögl.      | ±1 → 5-6         |
|              |           |                 |                    | Σ Ja-Stimmen     | 18-25            | Mehrheit: 21     |

In diesem Beispiel ist der Ausgang offen: Je nach Zufallswerten kann der Antrag knapp bestehen oder scheitern. Der Spieler hat durch Gespräch (+3 Terra) und Versprechen (+3 Syndikat) den Korridor nach oben verschoben.

# **Glossar**

| **Begriff**           | **Bedeutung**                                            |
| --------------------- | -------------------------------------------------------- |
| Antragswert           | Inhaltliche Meinung einer Fraktion zu einem Antrag (fix) |
| Strukturwert          | Politische Grundhaltung einer Fraktion (fix pro Partie)  |
| Aktionswert           | Durch Spieleraktionen erarbeiteter Bonus (dynamisch)     |
| Zufallskorridor       | Spanne möglicher Stimmen um den Ausgangswert             |
| Junktim / Versprechen | Bindende Zusage: "Stimmt ihr zu, folgt Antrag X"         |
| Joker                 | Einmalig einsetzbarer Loyalitätsappell an die Koalition  |
| Reputation            | Globaler BM-Wert, beeinflusst alle Einflussaktionen      |
| Azyklische Wahl       | BM-Wahl unabhängig vom Zeitpunkt der Stadtratswahl       |
| Kohabitation          | BM-Partei ist in der Minderheit im Stadtrat              |
