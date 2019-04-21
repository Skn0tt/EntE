---
title: An EntE mitarbeiten
---

# An EntE mitarbeiten

👍🎉 Zuerst einmal: Vielen Dank, dass du dir die Zeit nimmst, an EntE mitzuarbeiten! 🎉👍

## Wie kann ich Mithelfen?

Erstelle zuerst ein neues Issue auf Gitlab, in dem du dein Anliegen beschreibst.
Warte auf eine Antwort um sicherzustellen, dass niemand anders bereits an diesem Problem arbeitet.
Erstelle einen Fork des Repos, mache die nötigen Änderungen und teste sie.
Falls möglich: Unit- oder E2E-Test werden gerne gesehen.
Ist ein Bug Gegenstand des Issues, wäre ein Regressions-Test super.
Wenn du mit der Implementation fertig bist, erstelle einen Merge-Request.
Ich werde diesen dann gerne reviewen und mergen! :)

## Was sollte ich wissen?

EntE besteht aus einer Reihe an NPM-Paketen, die von [Lerna](https://github.com/lerna/lerna) verwaltet werden.
Nachdem du das Repo geklont hast, führe `lerna bootstrap` aus, um alle Abhängigkeiten zu installieren und die Pakete untereinander zu verlinken.

Die Pakete sind im `/packages`-Ordner enthalten und nach Zuständigkeitsbereich aufgeteilt:

| Package    | Zweck                                         |
| ---------- | --------------------------------------------- |
| ente-api   | REST-API, stellt Nutzer, Einträge usw. bereit |
| ente-types | Geteilte Typen und Validierungs-Logik         |
| ente-ui    | React SPA die dem Browser ausgeliefert wird   |

Um eine lokale Entwicklungsumgebug zu starten, baue alle Docker-Images mit `make build-docker` und starte sie dann mit dem Skript `/scripts/dev/start.sh`.
Wenn du an der UI arbeitest, führe zusätzlich `yarn watch` in `packages/ente-ui` aus.
