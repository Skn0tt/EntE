---
# Meta
title: "Entwurf und Entwicklung eines E-Government-Systems zur Digitalisierung des Entschuldigungsverfahrens"
subtitle: "Facharbeit Informatik, Ernst-Moritz-Arndt-Gymnasium Bonn"
author: Simon Knott
date: Januar 2018
lang: de

# Settings
papersize: A4
template: eisvogel.latex
bibliography: Paper.bib
toc: true
toc-depth: 3
toc-title: Inhaltsverzeichnis
pagestyle: headings
titlepage: true
titlepage-rule-color: "F5A623"
---

# Vorwort
- Danksagungen

# Einleitung
An meiner Schule, dem Ernst-Moritz-Arndt-Gymnasium in Bonn, herrscht schon länger Unzufriedenheit über das Entschuldigungsverfahren.
Sowohl Schüler, Lehrer als auch Stufenleiter sehen das aktuelle System als zu aufwändig und fehleranfällig an - hier herrscht Nachbesserungsbedarf.
Dieses Problem betrifft nicht nur unsere Schule - versäumte Stunden zu entschuldigen ist ein Prozess, der an jeder Schule durchgeführt werden muss und auch an vielen anderen Schulen sehr ähnlich zu unserem verläuft.

### Status Quo
Aktuell ist das Entschuldigungsverfahren an meiner Schule mithilfe eines kleinen DIN-A4-Zettels gelöst, auf dem sich mehrere Tabellen mit jeweils den folgenden Feldern befinden:

- Datum
- Zeit
- Grund
- Unterschrift d. Eltern
- Unterschrift d. Stufenleiters
- Unterschrift aller Lehrer, deren Unterricht versäumt wurde

Diese Daten trägt man in verschiedene Tabellen ein, abhängig davon ob das Versäumnis durch Krankheit, Beurlaubung oder Schulischen Veranstaltung hervorgerufen wurde, die verschiedenen Typen werden auf dem Zeugnis unterschiedlich vermerkt.

Der Entschuldigungsprozess läuft dann wiefolgt ab:

*Am Tag der Krankheit, nur im Krankheitsfall:*

1. Die Eltern des Schülers (bei Volljährigkeit der Schüler selbst) rufen im Sekretariat an, um den Schüler Krank zu melden

*Nach Wiederkehr des Schülers:*

1. Der Schüler trägt Datum, Zeit, Grund und die Kürzel der betroffenen Lehrer auf seinem Entschuldigungszettel ein
2. Er lässt diesen Eintrag von seinen Eltern unterzeichnen
3. Er lässt diesen Eintrag von seinem Stufenleiter unterzeichnen
4. Er lässt diesen Eintrag von jeder Lehrkraft, deren Unterricht er versäumte, unterzeichnen

Der zweite Teil des Prozesses muss binnen 14 Tagen nach Wiedererscheinen vollendet werden, andernfalls wird der Eintrag vom Stufenleiter nicht akzeptiert.

Als Schüler muss man also pro Eintrag auf seinem Entschuldigungszettel $1 + 1 + n$ Unterschriften sammeln, wobei $n = \text{Versäumte Lehrer}$.
Fehlt man einen Tag lang, so sind das bei $5$ Lehrern schon $7$ Unterschriften.
Jede Unterschrift, die man vergisst, bedeutet für die unentschuldigte Stunde eine Bewertung von null Punkten und kann die Noten erheblich beeinträchtigen.

Verfehlt man die 14-Tägige Frist, sind alle bis dahin nicht unterzeichneten Stunden unentschuldigt und werdem auf dem Zeugnis als solche vermerkt.
Dabei ist es in einigen Fällen gar nicht möglich, diese Frist einzuhalten, zum Beispiel wenn der betroffene Lehrer selbst krank ist.

Das System ist also für den Schüler viel Arbeit und unnötig fehleranfällig.

Der Stufenleiter trägt im Prozess die Aufgabe der Koordinierung und Kontrolle:
Ihm liegen jeden Tag eine Reihe Zettel zur Unterzeichnung vor, die er alle auf ihre Zulässigkeit überprüfen muss.
Dafür muss er bei Krankheit in der mit dem Sekretariat gemeinsam geführten Excel-Tabelle nach dem angegebenen Datum suchen und überprüfen, ob der Schüler am entsprechenden Tag morgens krankgemeldet wurde.
Alleine diese Anfrage an die Tabelle dauert pro Eintrag ca. 10 Sekunden, da die Tabelle zur Synchronisierung auf einem Netzlaufwerk liegt.
Ist dann der Eintrag überprüft, muss bei einigen Schülern noch nach Regelmäßigkeiten oder Auffälligkeiten gesucht werden, die auf gezieltes Verpassen des Unterrichts hindeuten.

TODO: Kühn fragen, ob das alles ist

Laut Angaben von *Thilo Kühn*, einem der Stufenleiter am Ernst-Moritz-Arndt-Gymnasium, nimmt diese Arbeit jede Woche gut zwei Stunden in Anspruch.
Diese Arbeit fällt jeweils für jede der drei Stufen an, vier mal im Monat.

Lehrer haben änhlichen Aufwand:
Sie bekommen so gut wie jede Stunde Entschuldigungszettel ihrer Schüler, die sie dann in ihrem Kursheft als entschuldigt markieren müssen.
Dafür nutzen die meisten Lehrer Einzelarbeitsphasen, in denen sie dann allerdings keinen Schülern helfen können oder anderweitig ihrem Bildungsauftrag nachkommen können.
Der Arbeitsaufwand für diese Zettel ist nicht so hoch wie für die Stufenleiter, birgt allerdings eine hohe Fehleranfälligkeit:
Wird ein Entschuldigungszettel unterschrieben, aber der Eintrag im Kursheft nicht als "Entschuldigt" markiert, so gilt diese Stunde immer noch als "Unentschuldigt" - der Schüler denkt aber, der Prozess sei für ihn abgeschlossen.

Fehler geschehen dort häufig.
Auch mir selbst ist es schon passiert, dass auf meinem Entschuldigungszettel mehr versäumte Stunden vermerkt waren als dann tatsächlich auf meinem Zeugnis standen.
Dies liegt dann unter anderem an der Nachlässigkeit der Stufenleitung, die nicht jeden einzelnen Zettel penibel kontrolliert.
Grund dafür ist, dass es dann noch mehr Arbeit werden würde, alle Zettel zu kontrollieren.
So werden aktuell nur Einträge von auffälligen Schülern wirklich genau überprüft.

### Was ist E-Government?
Das aktuelle Verfahren beruht auf vielen manuellen, repetitiven Arbeitsschritten.
Viele davon sind sehr gut automatisierbar:

- Krankmeldung am Morgen des Versäumnis-Tages (aktuell: durch Eltern & Sekretariat)
- Überprüfung der Zulässigkeit eines Antrags anhand des Datums (aktuell: durch Stufenleiter)
- Lehrer von Antrag in Kenntnis setzen (aktuell: durch Schüler, viele Laufwege)
- Zusammenzählen der Versäumnisse am Ende eines Halbjahres (aktuell: manuell durch Lehrer)

Seit dem Aufkommen der Computertechnik wurden sowohl in staatlichen als auch privaten Einrichtungen viele dieser administrativen Aufgaben digitalisiert, um einen weniger fehleranfälligen und auch effizienteren Ablauf gewährleisten zu können.
Diese Entwicklung fasst man unter dem Begriff *E-Government* zusammen.

Beispiele dafür sind zum Beispiel die Online-Ticketvergabe im Stadthaus, die digitale Steuererklärung via *Elster*[^1] oder der Digitale Pass in *Estland*[^2].

[^1]: TODO: Elster
[^2]: TODO: Recherchieren (War es das? War es doch ein anderes Land?)

Inhalt dieser Facharbeit ist es, ein neues, digitales Entschuldigungsverfahren zu entwickeln, welches diese Aufgaben automatisiert und so sämtlichen beteiligten Arbeit abnimmt und Fehlern vorbeugt.

Im Rahmen dieser Facharbeit werde ich erklären, *wie* und *wieso* ich dieses System modelliert und implementiert habe.
Dabei lege ich besonderen Fokus auf folgende Aspekte:

- Skalierbarkeit
- Nutzbarkeit
- Sicherheit

Ich möchte dabei soweit es geht die *Best Practices* der Webentwicklung erfüllen um am Ende vor allem in Hinblick auf Sicherheit und Nutzbarkeit ein einsetzbares Produkt in den Händen zu halten.

- Definitionen
  - Was ist E-Government?

//TODO: Bleibt das wirklich drin?
## Vor- und Nachteile der Digitalisierung
Welche Probleme können durch Digitalisierung...

- ...behoben werden?
- ...entstehen?

# Hauptteil
//TODO: Recherchieren
## Datenschutz
- Was darf ich überhaupt speichern?
- Was muss beachtet werden (Deutsches Recht)

## Modellierung
### System
#### Architektur
Das neue Entschuldigungsverfahren soll als Web-Anwendung umgesetzt werden.
Jeder Nutzer des Systems (Schüler, Eltern, Lehrer, Stufenleiter und Administratoren) erhalten eigene Zugangsdaten, mit denen sie die für sie relevanten Daten einsehen und damit interagieren können.
Solche Aktionen sind zum Beispiel das Erstellen, Einsehen oder Unterzeichnen eines Antrags.

Dem Benutzer muss also von seiner Rolle im Prozess verschiedene Information angezeigt werden.
Zur Umsetzung dessen gibt es zwei beliebte Architekturen:

1. Dynamisches Generieren der angezeigten Seite auf dem Server (z.B. mit PHP, Ruby on Rails, ...) TODO: Namen suchen
2. Dynamisches Rendern der Daten auf Client-Seite (mit Browser-seitigem JavaScript) TODO: Namen suchen

Der Unterschied ist klein aber äußerst relevant:
Bei der ersten Architektur muss der Server bei jeder Seitenanfrage für den anfragenden Client eine HTML-Seite zusammenbauen.
Fragt zum Beispiel ein Schüler seine Übersichtsseite an, so werden aus der Datenbank die $n$ letzten Einträge dieses Schülers abgefragt und in eine kleine HTML-Tabelle eingetragen.
Die Seite wird dann vielleicht noch durch einen Header, den sich alle Seiten teilen, erweitert und dem Nutzer zurückgesendet.
Die Last auf dem Server steigt also mit der Anzahl der Nutzer.
Der Server hat dabei bei jeder Anfrage sowohl die Arbeit, die Daten aus der Datenbank abzufragen, als auch die Seite aufzubauen.

Beim Zweiten Ansatz liefert der Server dem Client jedes mal die gleiche HTML-Seite aus.
Diese Seite enthält nun JavaScript-Code, der vom Client aus HTTP-Anfragen an eine Entwicklerschnittstelle[^4] schickt.
Diese API liefert dem Client die relevanten Daten zurück, dieser zeigt diese über Veränderungen in der DOM[^5] dem Nutzer an.
Fragt zum Beispiel ein Schüler seine Übersichtsseite an, so wird ihm zuerst die Standard-HTML-Seite ausgeliefert.
Der JavaScript-Code auf dieser Seite fragt nun bei der *API* die letzten $5$ Entschuldigungsanträge an, wartet auf die Antwort und erweitert die Anzeige um die Ergebnisse der Anfrage.

[^4]: Von nun an als *API* bezeichnet
[^5]: Document Object Model TODO: Ist das richtig?

Auf den ersten Blick sieht die zweite, Client-seitige Methode, wie ein unnötiger Mehraufwand aus - schließlich müssen zwei Anfragen getätigt werden, um die gewollten Daten anzuzeigen.
Tatsächlich hat sie aber andere Vorteile: Da die HTML-Seite an sich immer die gleiche ist, lässt sich diese statisch ausliefern.
Man kann CDN-Dienste benutzen, um die Auslieferungszeiten möglichst gering zu halten.
Um die Datenübertragung noch weiter zu reduzieren, kann man diese Seite Cachen und so die Menge der übertragenen Daten auf ein Minimum reduzieren.
Die *Time-To-First-Draw*, also die Zeit, bis der Nutzer etwas von der Seite sieht, ist minimal: Sobald die HTML-Seite fertig geladen hat, zeigt der Browser schon Daten an.
Man muss somit nicht mehr auf langsame Datenbankanfragen im Server warten und sieht sofort eine Benutzeroberfläche, dies verbessert die User Experience ungemein.
Des weiteren kann dadurch der Server stark entlastet werden: er muss mit diesem Ansatz nur noch die Datenbankanfragen beantworten und nicht die HTML-Seiten zusammenbauen.

Der zweite Ansatz eignet sich insbesondere für Web-Apps, die kleine Datensätze anzeigen.
Lassen sich die Daten dann noch Cachen, kann man mit dieser Architektur viel Performance rausholen.

Nicht sehr gut geeignet ist dieser Ansatz für Webseiten die auf statischen Daten aufbauen, z.B. Blogs oder Magazine.
Hier liefern viele Anfragen die gleichen Antworten werden besser gecached.
Daneben müssen alle Clients für die zweite Architektur ihrerseits performant genug sein muss bzw. überhaupt erst einmal JavaScript-Support bieten sollte.

Für das Entschuldigungsverfahren habe ich mich für den Zweiten Ansatz entschieden, da er sehr gut zum Konzept passt: Ich habe kleine Datensätze (Entschuldigungen, Nutzer) und eine gleichbleibende Website.
Alle Ziel-Clients (PCs, Smartphones) haben JavaScript-Support und sind performant genug, um die Seite Client-Seitig zu rendern.

#### Stack
Mein Software-Stack basiert im groben auf dem *MERN*[^7]-Stack:

[^7]: [MERN](http://mern.io/)

##### **M**ongoDB
MongoDB ist eine NoSQL-Datenbank die speziell für die Verwaltung von Dokumenten gedacht ist.
Ein Service bietet über das *mongodb://*-Protokoll zugriff auf mehrere Datenbanken.
Jede Datenbank sollte einer Anwendung zugeteilt sein.
Dabei enthält eine Datenbank mehrere sogenannte *Collections*, eine simple Anhäufung von Dokumenten.
Im Gegensatz zu SQL-Datenbanken muss hier nicht erst das Schema jeder Tabelle festgelegt werden, darauf achtet MongoDB nicht.
Jedes Dokument kann beliebige Daten enthalten und hat zwingend eine eindeutige ID, mit der man in konstanter Zeit darauf zugreifen kann.

Die Wahl fiel in diesem Fall auf MongoDB, da es dafür sehr gute JavaScript-Treiber gibt.
So kann man einfache Datenbank-Abfragen machen, ohne SQL lernen zu müssen.

In Zukunft ist es durchaus denkbar, auf eine SQL-Datenbank umzustellen - schließlich werden relationale Daten gespeichert.
Für den Anfang funktioniert die MongoDB aber sehr gut.

##### **E**xpress
Express ist ein Framework, um mit Node.js und Javascript HTTP-Dienste zu schreiben.
Es erledigt Aufgaben wie Routing, Error-Handling oder Middlewares und hat eine große Community, die viele Pakete bereitstellt.
Standard-Funktionen einer API wie Authentication, CORS[^CORS] oder Input-Validation können durch bereites bestehende Middlwares für Express gelöst werden.

[^CORS]: Cross-Origin-Request-System, TODO: Find link

##### **R**eact
React ist das Herzstück des Web-Frontends.
Es wurde vor TODO: x Jahren von Facebook entwickelt, um einfach dynamische Single-Page-Webapps schreiben zu können.
React ist inzwischen eines der größten Open-Source-Projekte und wird kontinuierlich verbessert.
Es beschäftigt sich nur mit der eigentlichen Anzeige der Website, alles andere wird von anderen Bibliotheken gemacht.
In React schreibt man einzelne Komponenten mithilfe von JSX, einer HTML-Ähnlichen schreibweise um andere Komponenten zu einer neuen Komponente zu orchestrieren (TODO: besseres wort finden).
Typischer React-Code sieht zum Beispiel so aus:

```tsx
<Grid container justify="center" alignItems="center" >
  <Grid item>
    <Button raised>
      Neuer Eintrag
    </Button>
  </Grid>
  <Grid item>
    <Button raised>
      Meine Einträge
    </Button>
  </Grid>
  <Grid item>
    <Button raised>
      Neuer Nutzer
    </Button>
  </Grid>
</Grid>
```

##### **N**ode.js
Node.js ist eine Laufzeit-Umgebung, die die Ausführung von JavaScript außerhalb des Browsers ermöglicht.
Sie basiert auf Googles V8-Engine die auch in Chrome eingesetzt wird.
Node.js macht JavaScript zur einzigen echten FullStack-Sprache: JavaScript läuft durch sie neben dem Browser auch auf dem Server.

Alle Teile des Entschuldigungsverfahrens sind in JavaScript geschrieben: Das Frontend in React, das Backend in Node.js.
Hierdurch ist der Code sehr einfach zu maintainen (TODO: Anderes wort finden).

##### Sonstige Tools
- Dependencies, benutzte Tools/Frameworks/Libraries
  - Was brauche ich wieso?
  - Wieso dieses Tool statt einem anderen?

#### API
- Denormalisierte Daten
- REST

### Datenbank
- Entity-Relationship-Diagramm
- Wieso ist sie so modelliert?

## Umsetzung
- Interessante Code-Teile erklärt
  - Hashing mit [bcrypt](https://de.wikipedia.org/wiki/Bcrypt)
  - API: DB-Anfragen, denormalisierte Daten
- Kurze Erläuterung der wichtigsten Frameworks:
  - React (Component-Basiertes UI-Framework für Single-Page Webapps)
  - Express (HTTP Framework im Backend)
  - Mongoose (Wrapper für MongoDB, bietet u.A. Client-Side Validation)

## Containerisierung
(Evtl im Appendix, je nach Länge des Rests)

- Kurze Erklärung Docker
- Erläuterung: Vorzüge Stateless Architecture
- Distributed Deployments mit Kubernetes
  - Erklärung des Konzepts: Redundanz und *Horizontal Scaling* statt *Monolithischem Vertical Scaling*
  - Darbietung am Beispiel in der T-Cloud

# Fazit
- Zusammenfassung
- Persönliche Beurteilung
- Ausblick auf weitere Fragestellungen

# Appendix
- Erläuterung Redux (One-Way Data Flow) und Vergleich zum traditionellen MVC-Ansatz
