---
title: Nutzerverwaltung
---

# Nutzerverwaltung

Jeder Beteiligte des Entschuldigungsverfahrens erhält einen eigenen Nutzer-Account in EntE.

Die Nutzer können von eine\*r Administrator\*in verwaltet werden.
Unter dem Menüpunkt "Nutzer" ist eine Liste aller Nutzer der EntE-Instanz zu finden.
Durch Klick auf einen Nutzer in dieser Tabelle öffnet sich eine Maske, in der die Daten des Nutzers angepasst werden können.
Mit einem Klick auf den "+"-Button unten rechts kann ein neue Nutzer erstellt werden.

Es gibt eine [Import-Funktion](./user-import/user-import-from-csv.md), die das Erstellen vieler Nutzer, zum Beispiel am Schuljahresbeginn, deutlich vereinfacht.

## Rollen

Über jeden Nutzer werden die folgenden Daten gespeichert:

- Benutzername (z.b. `max.mustermann`)
- Anzeigename (z.b. `Max Mustermann`)
- E-Mail-Addresse (z.b. `max@mustermann.de`)

Zusätzlich hat jeder Nutzer eine der folgenden Rollen:

### Schüler\*in

Schüler\*innen können neue Einträge erstellen.

Über sie werden zusätzlich folgende Daten erhoben:

- Geburtstdatum (damit bei Volljährigkeit die Unterschrift der Eltern nicht benötigt wird)
- Abiturjahrgang (um die Stufenleiter\*in zuordnen zu können)

### Erziehungsberechtigte\*r

Erziehungsberechtigte müssen die neuen Einträge der zugehörigen Schüler*innen signieren, bevor diese als akzeptiert gelten.
Ist der/die Schüler*in volljährig, entfällt dieser Schritt.
Außerdem können Erziehungsberechtigte im Namen der zugehörigen Schüler\*innen neue Einträge erstellen.

Über sie wird zusätzlich erhoben, welche Schüler\*innen ihnen zugehörig sind.

### Lehrer\*in

Lehrer\*innen können einsehen, welche Schüler\*innen in welchen Stunden bei ihnen gefehlt haben, um dies mit dem Kursheft abzugleichen.
Sie können bei der Erstellung eines neuen Eintrags als Lehrer\*in einer versäumten Stunde angegeben werden.

### Stufenleiter\*in

Ein*e Stufenleiter\*in kann - wie der Lehrer - als Lehrer\*in einer versäumten Stunde angegeben werden.
Außerdem kann er alle Einträge der Schüler*innen seiner Stufe einsehen, um diese zu überprüfen und gegebenenfalls zu signieren.
Er hat Zugriff auf Statistiken über die Fehlzeiten seiner Schüler, die ihm helfen, potenzielle Muster in den Fehlzeiten zu erkennen.

Über ihn wird der Abiturjahrgang der zugehörigen Stufe gespeichert.

### Administrator\*in

Ein\*e Administrator\*in kann alle Einträge, alle versäumten Stunden und alle Statistiken über die einzelnen Abiturjahrgänge einsehen.
Diese Rolle ermöglicht es außerdem, neue Nutzer zu erstellen und die EntE-Instanz zu konfigurieren.
