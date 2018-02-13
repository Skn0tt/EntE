---
# Meta
title: "Entwurf und Entwicklung eines E-Government-Systems zur Digitalisierung des Entschuldigungsverfahrens"
subtitle: "Facharbeit Informatik, Ernst-Moritz-Arndt-Gymnasium Bonn"
author: Simon Knott
date: Februar 2018
lang: de

# Settings
papersize: A4
bibliography: Paper.bib
fontsize: 12pt
mainfont: Times New Roman
linestretch: 1.5
toc-depth: 3
toc-title: Inhaltsverzeichnis
pagestyle: headings
titlepage: true
titlepage-rule-color: "F5A623"
numbersections: true
---

TODO:
- Ausformulierung der Erleichterung

\section*{Danksagung}
Viele der in dieser Facharbeit angewandten Methoden und Konzepte habe ich über das Internet gelernt.
Dort findet sich zu fast jedem Thema ein gut verständlicher Blog-Eintrag, Vortrag oder Tutorial.
Ich möchte mich deshalb bei allen Blog-Autoren und Tutorial-Websites bedanken, ohne die ich diese Facharbeit nur mit sehr viel Mühe hätte schreiben können.

Die Open-Source-Community ermöglicht es, großartige Produkte zu entwickeln.
Fast alle im digitalen Entschuldigungverfahren verwendeten Tools und Frameworks sind kostenlos und frei zugänglich.
Ich möchte mich deshalb bei allen Mitgliedern der Open-Source-Community sowie den dahinter stehenden Unternehmen bedanken, die ihre Arbeit unter Open-Source-Lizenzen veröffentlichen und sie der Allgemeinheit zugänglich machen.

Des weiteren möchte ich mich bei Thilo Kühn und Jens Liebreich bedanken, die sich für mich viel Zeit genommen haben um mir die Anforderungen an das Entschuldigungsverfahren zu erklären, sowie bei Benjamin Reichelt, der diese Facharbeit betreut hat und mir bei Fragen und Problemen immer zur Seite stand.
Ich möchte mich auch bei meinen Kolleginnen und Kollegen bei OrbiTeam für ihre Tipps und Ratschläge bedanken.
Dort konnte ich während meiner Arbeit viel Erfahrung bei der Frontend-Entwicklung sammeln.

\newpage

\tableofcontents

\newpage

# Einleitung
An jeder Schule müssen die Fehlzeiten der Schüler nachgehalten werden.
Dabei ist es wichtig, schulisch oder durch Krankheit bedingte Versäumnisse sowie unentschuldigte Fehlzeiten zu erfassen, da diese auf dem Zeugnis vermerkt werden müssen und auch Noten beeinflussen.

Dieses Verfahren wird an vielen Schulen auf Papier-Basis durchgeführt, so auch am Ernst-Moritz-Arndt-Gymnasium.
Sowohl Schüler, Lehrer als auch Stufenleiter sehen das aktuelle System jedoch als zu aufwändig und fehleranfällig an - hier herrscht Nachbesserungsbedarf.

## Status Quo
Aktuell ist das Entschuldigungsverfahren der Oberstufe an unserer Schule durch den Entschuldigungszettel gelöst, auf dem der Schüler zu entschuldigenden Stunden einträgt (siehe Abbildung \ref{entschuldigungs-zettel}).

Der Entschuldigungsprozess läuft wie folgt ab:

*Am Tag der Krankheit, nur im Krankheitsfall:*

1. Die Eltern des Schülers (bei Volljährigkeit der Schüler selbst) rufen im Sekretariat an, um den Schüler krankzumelden.

Zweck des Anrufes ist es, die Schule über den Krankheitsfall zu unterrichten.
So werden versäumte Stunden nur entschuldigt, wenn die Schule zuvor eine Meldung erhalten hat, versäumte Klausuren dürfen ohne diese Mitteilung nicht nachgeschrieben werden.

*Nach Wiederkehr des Schülers sind folgende Schritte notwendig:*

1. Der Schüler trägt Datum, Zeit, Grund und die Kürzel der betroffenen Lehrer auf seinem Entschuldigungszettel ein.
2. Er lässt diesen Eintrag von seinen Eltern unterzeichnen (entfällt bei Volljährigkeit).
3. Er lässt diesen Eintrag von seinem Stufenleiter unterzeichnen.
4. Er lässt diesen Eintrag von jeder Lehrkraft, deren Unterricht er versäumte, unterzeichnen.

Der zweite Teil des Prozesses muss innerhalb von 14 Tagen nach Rückkehr in den Unterricht vollendet werden, andernfalls wird der Eintrag vom Stufenleiter nicht akzeptiert.

### Aufwandsabschätzung
Als Schüler ist es also pro Eintrag notwendig, $1 + 1 + n$ Unterschriften zu sammeln, wobei $n = \text{Versäumte Lehrer}$.
Fehlt man einen Tag lang, so sind das bei $5$ Lehrern schon $7$ Unterschriften.
Jede Unterschrift, die man vergisst, bedeutet für die unentschuldigte Stunde eine Null-Bewertung und kann die Zeugnis-Note erheblich beeinträchtigen.

Verfehlt ein Schüler die 14-tägige Frist, sind alle bis dahin nicht unterzeichneten Stunden unentschuldigt und auf dem Zeugnis als solche vermerkt.
Dabei ist es in einigen Fällen gar nicht möglich, diese Frist einzuhalten, zum Beispiel wenn der betroffene Lehrer selbst krank ist.
Das aktuelle System ist also aufgrund der genannten Punkte für Schüler viel Arbeit und fehleranfällig.

Der Stufenleiter ist innerhalb des Verfahrens die koordinierende und kontrollierende Instanz:
Ihm liegt jeden Tag eine große Anzahl an Zetteln zur Unterzeichnung vor, die er auf ihre Zulässigkeit überprüfen muss.
Dafür muss er bei Krankheit in einer gemeinsam mit dem Sekretariat geführten Excel-Tabelle nach dem angegebenen Datum suchen und überprüfen, ob der Schüler am entsprechenden Tag morgens krankgemeldet wurde.
Alleine die Anfrage an die Tabelle dauert pro Eintrag einige Zeit, da die Tabelle sehr groß ist.
Ist dann der Eintrag überprüft, muss bei einigen Schülern noch nach Regelmäßigkeiten oder Auffälligkeiten gesucht werden, die auf gezieltes Verpassen des Unterrichts hindeuten.

TODO: Kühn fragen, ob das alles, richtig ist; fragen, ob ihm die Nennung recht ist

Laut Angaben von *Thilo Kühn*, einem der Stufenleiter am Ernst-Moritz-Arndt-Gymnasium, nimmt diese Arbeit jede Woche gut zwei Stunden in Anspruch und fällt für jede der drei Stufen an.

Auch die Fachlehrer haben einen großen Aufwand:  
Ihnen werden in jeder Stunde Entschuldigungszettel vorgelegt, die sie dann in ihrem Kursheft als entschuldigt markieren müssen.
Dafür nutzen die meisten Lehrer Einzelarbeitsphasen, in denen sie dann weder Schülern helfen noch anderen Aufgaben nachkommen können.
Der Arbeitsaufwand für diese Zettel ist nicht so hoch wie für die Stufenleiter, birgt allerdings eine hohe Fehleranfälligkeit:
Wird ein Entschuldigungszettel unterschrieben, aber der Eintrag im Kursheft nicht als "Entschuldigt" markiert, so gilt diese Stunde immer noch als "Unentschuldigt" - der Schüler denkt aber, der Prozess sei für ihn abgeschlossen.

Das aktuelle Verfahren beruht auf vielen repetitiven, manuellen Arbeitsschritten.
Viele davon sind sehr gut automatisierbar:

- Krankmeldung am Morgen des Tags der Versäumnis (aktuell: durch Eltern & Sekretariat)
- Überprüfung der Zulässigkeit eines Antrags anhand des Datums (aktuell: durch Stufenleiter)
- Lehrer von Antrag in Kenntnis setzen (aktuell: durch Schüler, viele Laufwege)
- Zusammenzählen der Versäumnisse am Ende eines Halbjahres (aktuell: manuell durch Lehrer)

Zusammenfassend lässt sich sagen, dass das aktuelle Verfahren für alle Beteiligten viel Arbeit bedeutet und außerdem sehr fehleranfällig ist.

## Was ist E-Government?

Mit dem Aufkommen der Computertechnik werden sowohl in staatlichen als auch privaten Einrichtungen immer mehr dieser administrativen Aufgaben digitalisiert, um einen effizienteren Ablauf gewährleisten zu können.
Diese Entwicklung wird unter dem Begriff *E-Government* zusammengefasst.

Beispiele dafür finden sich in der Online-Ticketvergabe in der Stadtverwaltung, der digitalen Steuererklärung via *Elster* [^Elster] oder der Digitalen Staatsbürgerschaft in *Estland* [^E-Residency].

TODO:
- Historie
- Quellen

[^Elster]: [Elster: https://www.elster.de](https://www.elster.de)
[^E-Residency]: [Estonia E-Residency: https://e-resident.gov.ee/](https://e-resident.gov.ee/)

## Ziel dieser Facharbeit
Ziel dieser Facharbeit ist es, das Entschuldigungsverfahren in einem elektronischen Prozess abzubilden, welches diese Aufgaben automatisiert und so den Beteiligten Arbeit abnimmt sowie Fehlern vorbeugt.

Dabei wird besonderer Fokus auf folgende Eigenschaften des Systems gelegt:

- gute Skalierbarkeit
- intuitive Nutzung
- Standard-konforme Sicherheit

Ich möchte dabei die *Best Practices* der modernen Webentwicklung erfüllen, um am Ende ein nutzbares Produkt zu entwickeln und an die Nutzer am Ernst-Moritz-Arndt-Gymnasium übergeben zu können.

Diese Dokumentation beschränket sich weitestgehend auf Modellierung und Beschreibung des Systems.
Exemplarisch werden einzelne Teile der Implementierung dargestellt.

Die Dokumentation ist als erster Teil der Facharbeit zu verstehen, der zweite Teil besteht aus der fertigen Implementierung, deren Quelltext beigefügt ist.
Der Name des Programms ist "EntE", eine Abkürzung für "**Ent**schuldigung **E**lektronisch".
Das Logo ist in Abbildung \ref{logo} zu sehen.

\newpage
## Datenschutz

Die in Nordrhein-Westfalen geltende "Verordnung über die zur Verarbeitung zugelassenen Daten von Schülerinnen, Schülern und Eltern" besagt:

> Die automatisierte Verarbeitung der personenbezogenen Daten ist zulässig [...] wenn jeweils über die Konfiguration die Vertraulichkeit, Integrität, Verfügbarkeit, Authentizität, Revisionsfähigkeit und Transparenz gemäß §10 des Datenschutzgesetzes Nordrhein-Westfalen gewährleistet sind.
> [@sgvnrw2017]

Für *EntE* bedeutet "Revisionsfähigkeit" insbesondere, dass eine Versionierung erfolgen muss.
Im bisherigen System ist dies nicht erfolgt, über den Zeitpunkt der Unterschriften ist nichts bekannt.

Weiter besagt das Schulgesetz, welche Daten von einer Schule gespeichert werden dürfen.
Die für *EntE* wichtigen Daten sind aufgeführt:

> - Beurlaubung:
>   - Beginn, Ende, Grund
> - Schulversäumnis:
>   - Beginn, Ende, Grund
> [@sgvnrw2017]

Ab dem 25. Mai 2018 ist die neue Datenschutz-Grundverordnung (DSGVO) umzusetzen.
Von dieser Verordnung sind alle Dienste betroffen, die personenbezogene Daten erfassen.
Da die DSGVO schon IP-Addressen als solche wertet, fällt jeder Online-Dienst darunter - auch das hier vorgestellte Entschuldigungsverfahren.
Die DSGVO schreibt vor, dass die Sicherheitsmaßnahmen der gesamten Auftragsverarbeitung dokumentiert sein müssen und auch sämtliche Vertragspartner eine solche Dokumentation führen.
Da es für *EntE* keine dritten Vertragspartner gibt, beschränkt sich die Einhaltung der DSGVO auf die Kontrolle des Hosting-Anbieters [@iXdsgvo].

# Modellierung
## Prozess
*EntE* ist stark an den alten Entschuldigungszettel angelehnt.
Bei Versäumnis einer Stunde erstellen Schüler oder Eltern einen neuen Entschuldigungsantrag, im System als *Entry* bezeichnet.
Dieser enthält:

- Startdatum
- Enddatum (Falls das Versäumnis mehrtägig ist)
- Art (Schulisch/Krankheit)
- Bemerkung
- Beliebig viele *Slots*

Ein *Slot* entspricht einem Unterrichtsblock, der verpasst wurde.
Darin steht:

- Start, Ende des Blocks (Schulstunde)
- Lehrer

(vergleiche Abbildung \ref{class-diagramm})

Sobald ein Antrag erstellt wurde, bekommt der Stufenleiter diesen angezeigt.
Er kann nun die Zulässigkeit des Antrags prüfen und ihn dann entsprechend annehmen oder ablehnen.
Falls die Eltern den Eintrag erstellen, so ist dieser schon bei der Erstellung von ihnen genehmigt.
Wurde der Eintrag von einem Schüler erstellt, so muss er noch von den Eltern genehmigt werden.

Die zeitaufwändige Überprüfung des Antrags in der Excel-Tabelle entfällt, genauso wie die Krankmeldung im Sekretariat:
Die Unterrichtung der Schule über einen Krankheitsfall geschieht mit der Erstellung eines solchen Eintrags.

Die Lehrer sind dem Prozess erst einmal außen vor: Interaktion ihrerseits ist nicht nötig, um einen Entschuldigungsantrag anzunehmen.
Sie haben allerdings Lesezugriff auf alle *Slots*, die bei ihnen versäumt wurden und sehen somit, ob der zugehörige Entschuldigungsantrag erfolgreich angenommen wurde.
Am Ende jeder Woche erhalten alle Lehrer eine Benachrichtigung, in der die versäumten Stunden der letzten Woche aufgeführt sind.
Auf dieser Basis können die Kurshefte auf den aktuellen Stand gebracht werden.

Zur besseren Visualisierung: siehe Abbildung \ref{use-diagram}, Abbildung \ref{activity-diagram}.

## System
### Architektur
*EntE* soll als Web-Anwendung umgesetzt werden.
Jeder Nutzer des Systems (Schüler, Eltern, Lehrer, Stufenleiter und Administratoren) erhält Zugangsdaten, mit denen sie die für sie relevanten Daten einsehen und damit interagieren können.
Solche Aktionen sind zum Beispiel das Erstellen oder Unterzeichnen eines Antrags.

Da jeder Nutzer andere Entschuldigungsanträge sieht, muss die Webseite dynamisch an den zugreifenden Nutzer angepasst werden.
Zur Umsetzung dessen gibt es zwei beliebte Architekturen:

1. Dynamisches Generieren der angezeigten Seite auf dem Server (z.B. mit PHP, Ruby on Rails, ...)
2. Dynamisches Rendern der Daten auf Client-Seite (mit Browser-seitigem JavaScript)

Bei der ersten Architektur muss der Server bei jeder Seitenanfrage für den anfragenden Client eine HTML-Seite zusammenbauen.
Fragt zum Beispiel ein Schüler seine Übersichtsseite an, so werden aus der Datenbank die $n$ letzten Einträge dieses Schülers abgefragt und in eine kleine HTML-Tabelle eingetragen.
Die Seite wird dann vielleicht noch durch einen Header, den sich alle Seiten teilen, erweitert und dem Nutzer zurückgesendet.
Die Last auf dem Server steigt also mit Anzahl der Nutzer und Anfragen.
Der Server hat dabei bei jeder Anfrage sowohl die Arbeit, die Daten aus der Datenbank abzufragen, als auch die Seite aufzubauen.

Beim Zweiten Ansatz liefert der Server dem Client jedes Mal die gleiche HTML-Seite aus.
Diese Seite enthält JavaScript-Code, der vom Client aus HTTP-Anfragen an eine Entwicklerschnittstelle[^API] schickt.
Diese API liefert dem Client die relevanten Daten zurück, dieser zeigt sie über Veränderungen im DOM[^DOM] dem Nutzer an.
Möchte zum Beispiel ein Schüler seine Übersichtsseite sehen, so wird ihm zuerst die Standard-HTML-Seite ausgeliefert.
Der JavaScript-Code auf dieser Seite fragt nun bei der API die letzten $n$ Entschuldigungsanträge an, wartet auf die Antwort und erweitert die Anzeige um die Ergebnisse der Anfrage.

[^API]: Von nun an als *API* bezeichnet
[^DOM]: Document Object Model

Auf den ersten Blick erscheint die zweite, Client-seitige Methode, als unnötiger Mehraufwand - schließlich müssen zwei Anfragen getätigt werden, um die gewollten Daten anzuzeigen.
Tatsächlich hat sie aber große Vorteile: Da die HTML-Seite immer die gleiche ist, lässt sich diese statisch ausliefern und lokal zwischenspeichern.
Man kann CDN-Dienste wie Cloudflare[^Cloudflare] benutzen, um die Auslieferungszeiten möglichst gering zu halten.
Um die Datenübertragung noch weiter zu reduzieren, kann die Seite auf dem Endgerät über einen Cache vorgehalten und so die übertragenen Daten auf ein Minimum reduziert werden.
Die *Time-To-First-Draw*, also die Zeit, bis der Nutzer etwas von der Seite sieht, ist minimal: Sobald die HTML-Seite fertig geladen hat, zeigt der Browser schon Daten an.
Man muss somit nicht mehr auf langsame Datenbankanfragen im Server warten und sieht sofort eine Benutzeroberfläche, dies verbessert die User Experience ungemein.
Für den Server entfällt der Arbeitsschritt des Seiten-Renderns komplett.

[^Cloudflare]: [Cloudflare: https://www.cloudflare.com](https://www.cloudflare.com)

Der zweite Ansatz eignet sich insbesondere für Web-Apps, die kleine, dynamische Datensätze anzeigen.
Nicht sehr gut geeignet ist dieser Ansatz für Webseiten, die auf statischen Daten aufbauen, wie z.B. Blogs oder Magazine.

Für *EntE* ist der Zweite Ansatz besser geeignet: Es gibt kleine Datensätze (Entschuldigungen, Nutzer) und eine gleichbleibende Website.
Alle Ziel-Clients (PCs, Smartphones) haben JavaScript-Support und sind performant genug, um die Anwendung Client-Seitig zu rendern.

### API
Die anzuzeigenden Daten erhält der Client von einer API.
Diese ist nach dem REST-Prinzip [@rest] aufgebaut und zeichnet sich insbesondere durch die Darstellung der Daten als *Ressourcen* sowie die *Zustandslosigkeit* des Protokolls aus.

#### Routen
Die Modellierung auf *Ressourcen*-Basis bedeutet, dass die Pfade der API jeweils einer Ressource bzw. einem Datensatz entsprechen.
Sämtliche Daten werden in normalisierter Form in JSON-Notation zurückgeliefert.

Es existieren zum Beispiel folgende Pfade:

- `GET /users` (Alle Nutzer anfragen)
- `GET /entries` (Alle Einträge anfragen)
- `GET /slots` (Alle Stunden anfragen)

Möchte man nur eine bestimmte Ressource anfragen, spezifiziert man deren ID:

- `GET /users/[userId]` (Speziellen Nutzer anfragen)
- `GET /entries/[entryId]` (Speziellen Eintrag anfragen)
- `GET /slots/[slotsId]` (Spezielle Stunde anfragen)

Als ID werden die von der Datenbank vergebenen Dokumenten-IDs verwendet.

Möchte man auf diesen *Ressourcen* nun Aktionen ausführen, so verwendet man andere HTTP-Verben:

- `POST /users` (Neuen Nutzer erstellen)
- `PATCH /users/[userId]` (Nutzer bearbeiten)
- `PUT /entries/[entryId]/sign` (Eintrag unterschreiben)

Dies ist ein Auszug aus den verfügbaren Routen, die vollständige Dokumentation ist im OpenAPI-Format im beigefügten QuellCode zu finden.

#### Zustandslosigkeit
Jede Anfrage an die API muss alle für die Beantwortung der Anfrage relevanten Daten enthalten.
Dazu gehört:

- Angefragte Ressource
- Anmeldedaten
- Eventuelle Filter

Dies steht im Gegensatz zu traditionellen Ansätzen, in denen sich der Nutzer zu Beginn einer Session beim Server anmeldet und dann Einstellungen wie Filter speichert.

Bei zustandslosen Architekturen dagegen sind Anfragen in sich selbst geschlossen und können so unabhängig von vorhergegangenen Anfragen bearbeitet werden.

### Sicherheit
Die API muss gegen unbefugten Zugriff gesichert sein.
Um den Entwicklungsaufwand in dieser Hinsicht gering zu halten, verwendet *EntE* *Basic Auth*: Dabei überträgt der Client zu jeder Anfrage Nutzernamen und Passwort des Nutzers.

Dies alleine ist aber sehr unsicher, denn mit Software wie WireShark[^Wireshark] lassen sich Netzwerkpakete leicht abfangen.
Hat man ein solches unverschlüsseltes Paket abgefangen, kann man Benutzername und Passwort einfach auslesen.
*Basic Auth* darf daher niemals über unverschlüsselte Kommunikationswege verwendet werden!
Sämtlicher Netzwerkverkehr wird in *EntE* über das **T**ransport-**L**evel-**S**ecurity-Protokoll [@tls] verschlüsselt.

[^Wireshark]: [Wireshark: https://www.wireshark.org/](https://www.wireshark.org/)

# Umsetzung

Die Implementierung des beschriebenen Systems umfasst zum Zeitpunkt der Abgabe ungefähr Acht tausend Zeilen Code und ist vollständig in Typescript[^typescript] geschrieben.
In Abbildung \ref{screenshot-entries} ist ein Screenshot der `/entries`-Seite zu sehen, auf der man eine Übersicht über seine eingereichten Anträge erhält und einen neuen Eintrag erstellen kann.

[^typescript]: [Typescript: https://www.typescriptlang.org/](https://www.typescriptlang.org/)

## Stack
Der Stack basiert auf *MERN*[^MERN]:

- MongoDB (Datenbank)
- Express (API-Framework)
- React (UI-Library)
- Node.js (Server-Side JavaScript)

[^MERN]: [MERN: http://mern.io/](http://mern.io/)

Daneben werden noch folgende andere Bibliotheken/Tools verwendet:

**Docker** ist ein Container-Ökosystem mithilfe dessen *EntE* ausgeliefert wird (Siehe Anhang).  
**Immutable.js** ist eine Bibliothek für unveränderliche Datenstrukturen in JavaScript.  
**Redux** ist eine Implementierung der Flux-Architektur [@flux] für One-Way-Dataflow in Javascript.  
**Bcrypt** ist ein Hashing-Algorithmus, der speziell für Passwörter entwickelt wurde.  
**MJML** erzeugt responsive Emails.  
**Mongoose** bietet Schema-Validierung und eine entwicklerfreundliche API für die Arbeit mit MongoDB.  
**Sentry** sammelt alle Fehlermeldungen inklusive Stack-Traces, damit Fehler frühzeitig erkannt werden können.  
**Nodemailer** ermöglicht Node.js-Anwendungen, über SMTP Emails zu verschicken.  

## API, Datenbankanfragen
Im folgenden wird am Beispiel der Route `GET /entries` der API-Quellcode exemplarisch erläutert.
Den QuellCode finden sie zur Referenz in Listing \ref{getEntriesRoute} im Appendix.

Erreicht die API eine Anfrage, so wird diese durch eine Reihe an *Middlewares* geleitet.
Eine Middleware stellt einen Teil der Route dar und sollte genau eine Funktion erfüllen, unter anderem:

- Authentifizierung
- Autorisierung
- Validierung der Anfrage
- Beantwortung der Anfrage
- Fehlerbehandlung

Eine Middleware erhält folgende Parameter:

1. `request`: Enthält alle Informationen über die Anfrage
2. `response`: Ermöglicht das Beantworten der Anfrage
3. `next`: Beendet die Middleware und leitet die Anfrage an die nächste weiter.

Dabei sollte eine Middleware die Anfrage in jedem Fall beantworten oder `next()` aufrufen, sonst erhält der Client keine Antwort.

Aufgabe der ersten Middleware (Z. 1 - 12) ist es, alle zur Anfragenden passenden `Entry`-Objekte abzurufen.
Relevant dafür ist die Rolle des Nutzers: Ein Administrator erhält alle Einträge zurück, ein Schüler nur seine eigenen, ein Elternteil nur die seiner Kinder.
Im Beispiel wird exemplarisch der Fall gelistet, dass ein Schüler anfragt (Z. 4 - 8).
Es werden nun alle `Entry`-Objekte abgerufen, deren `student`-Feld mit der ID des anfragenden Nutzers übereinstimmt (Z. 6).
Damit auch die nächste Middleware darauf zugreifen kann, werden diese in `request.entries` gespeichert (Z. 5).

Aufgabe der zweiten Middleware (Z. 13 - 38) ist es, sämtliche Abhängigkeiten der zuvor ermittelten `Entry`-Objekte zu ermitteln.
Dies muss passieren, da ein `Entry` alleine nicht sehr aussagekräftig ist.
Einige seiner Felder verweisen über *IDs* auf andere Objekte (siehe Abbildung \ref{class-diagramm}).
Es werden also erst alle den Einträgen zugehörigen `Slot`-Objekte abgefragt (Z. 14 - 20).

Nun werden alle Nutzer angefragt, die durch einen vorher gefundenen `Slot` oder `Entry` referenziert sind (Z. 23 - 30).

Zum Schluss werden alle gefundenen Objekte in *JSON-Notation* zurückgesendet, die Anfrage ist abgeschlossen.

Falls während einer der Middlewares ein Fehler auftritt, wird dieser durch eine `try`/`catch`-Clause abgefangen und an den Error-Handler weitergeleitet (Z. 2, 11 bzw. Z. 13, 37).

## Passwörter
Jeder Nutzer meldet sich im System mit Passwort und Benutzername an, die Passwörter müssen so sicher wie möglich gespeichert werden.

Die sicherlich trivialste Möglichkeit ist es, die Passwörter bei der Nutzererstellung im Klartext zu speichern.
Dann kann bei der Anmeldung das übergebene Passwort verglichen werden.
Kommt nun jemand an die Inhalte der Datenbank, zum Beispiel ein Hacker oder Administrator, sind dort die Passwörter im Klartext sichtbar.
Dieses Risiko darf man niemals eingehen.

Möglichkeit Zwei ist es, die Passwörter verschlüsselt zu speichern:
Nutzt man Algorithmen wie RSA oder AES hat ein Hacker wenig Chancen und die Datenbank ist vor ihm sicher.
Allerdings muss ein verschlüsseltes Passwort zur Überprüfung entschlüsselt werden - und wenn *EntE* Zugriff darauf aht, hat diesen dies auch eine dritte Partei, der den privaten Schlüssel kennt - ein Administrator kann also immernoch auf alle Passwörter zugreifen.

Den besten Umgang mit Passwörtern erreicht man, wenn man Hash-Funktionen verwendet:
Dann kennt weder Datenbank, Server noch Administrator die Passwörter seiner Nutzer, da man nur den Hash des Passworts abspeichert.
Möchte man einen Nutzer authentifizieren, so berechnet man den Hash des übermittelten Passworts und vergleicht diesen mit dem in der Datenbank hinterlegten.

Für Passwörter benutzt man sehr gerne den Bcrypt-Algorithmus [@bcrypt], denn bei diesem kann man durch einen zusätzlichen Parameter den Algorithmus verlangsamen.
Dieser Rechenaufwand macht in der Anwendung keinen großen Unterschied, Brute-Force-Angriffe sind dadurch aber deutlich aufwändiger.

\newpage

# Fazit

Im Laufe dieser Facharbeit habe konnte ich viel über die Entwicklung komplexer Websysteme lernen.
Viele große Themen der Webentwicklung wurden gestreift, darunter API-Entwicklung, Datenbank-Systeme, WebApps, Authentifizierungsmethoden, TLS-Verschlüsselung und automatisierte E-Mails.
Dabei konnten in viele der Konzepte gute Einblicke erhalten werden.

Wenn ich das System jetzt noch einmal entwickeln würde, hätte ich von Beginn an auf eine SQL-Datenbank gesetzt, um größere Datenintegrität gewährleisten zu können.
Dann müsste das Datenbankschema ein wenig abgeändert werden, um es auf SQL-Charakteristika anzupassen.

Ich denke dass das Produkt, welches am Ende entstanden ist, das Potenzial hat das Entschuldigungsverfahren an unserer Schule deutlich zu verbessern.
Es bleiben einige Schönheitsfehler wie die fehlende Versionierung, die den Produktiveinsatz erschweren - diese lassen sich jedoch relativ einfach beheben.
Interessant wird es sein zu sehen, welche Fehler im Produktiveinsatz dann tatsächlich auftreten - es gibt immer Fälle, an die man vorher nicht gedacht hat.

Einige Lehrer und Schüler zeigen großes Interesse an *EntE* - bleibt zu hoffen, dass auch die Schulleitung die Vorteile sieht.

\newpage
# Appendix

![Logo EntE\label{logo}](Entschuldigungszettel.pdf)

![Entschuldigungszettel\label{entschuldigungs-zettel}](Entschuldigungszettel.pdf){ height=700px }

![Klassendiagramm Datenbank\label{class-diagramm}](DB.png){ height=700px }

![Nutzungs-Diagramm\label{use-diagram}](Use.png)

![Aktivitäts-Diagramm\label{activity-diagram}](Activity.png)

![Screenshot `/entries`\label{screenshot-entries}](Screenshot-entries.png)

\lstdefinelanguage{TypeScript}{
  keywords={typeof, new, true, false, catch, function, return, null, catch, switch, var, if, in, while, do, else, case, break, try, catch, const, let, async, await},
  keywordstyle=\color{blue}\bfseries,
  ndkeywords={class, export, boolean, throw, implements, import, this},
  ndkeywordstyle=\color{darkgray}\bfseries,
  identifierstyle=\color{black},
  sensitive=false,
  comment=[l]{//},
  morecomment=[s]{/*}{*/},
  commentstyle=\color{purple}\ttfamily,
  stringstyle=\color{red}\ttfamily,
  morestring=[b]',
  morestring=[b]"
}
\begin{lstlisting}[language=TypeScript, caption=GET /entries, label=getEntriesRoute]
router.get('/entries', async (request, response, next) => {
  try {
    /* ...andere Fälle... */
    if (request.user.role === ROLES.STUDENT) {
      request.entries = await Entry.find({
        student: request.user._id
      });
    }

    return next();
  } catch (error) { return next(error); }
}, async (request, response, next) => {
  try {
    /* collect all slotIds */
    const slotIds: MongoId[] = [];
    request.entries.forEach(entry => slotIds.push(...entry.slots));

    /* request slots */
    const slots = await Slot
      .find({ _id: { $in: slotIds } });
    
    /* collect all userIds */
    const userIds: MongoId[] = [];
    slots.forEach(slot => userIds.push(slot.teacher, slot.student));
    request.entries.forEach(entry => userIds.push(entry.student));

    /* request slots */
    const users = await User
      .find({ _id: { $in: userIds } })
      .select('-password'); // omit Passwords
  
    return response.json({
      slots,
      users,
      entries: request.entries
    });
  } catch (error) { return next(error); }
});
\end{lstlisting}

## Containerisierung
Seit einigen Jahren gibt es in der DevOps-Szene einen Trend weg von virtualisierten, hin zu containerisierten Deployments.
Die Containerisierung lässt sich als logische Evolution der Virtualisierung ansehen.

Beide Ansätze möchten eine Abstraktion der Anwendung vom Host-Computer erreichen, durch die Abhängigkeitsprobleme zwischen verschiedenen Anwenungen beseitigt und die Auslieferung der Applikationen besser automatisiert werden können.
In der Virtualisierung wird dafür ein komplettes Betriebssystem emuliert, inklusive Kernel und eigenem Dateisystem.
Applikationen innerhalb einer Virtuelle Maschine können daher nur auf Dienste innerhalb ihrer Maschine zugreifen, Verbindungen mit dem Host müssen gesondert erstellt werden.
So kann jede Applikation ihre eigenen Abhängigkeiten mitführen, zur Auslieferung muss nur die VM gestartet werden.
Virtualisierung kann also zuvor genannte Probleme beheben, schafft jedoch ein neues: Für jede VM muss ein eigenes Betriebssystem ausgeführt werden.
Diese zusätzliche Last erzeugt viel Overhead und höhere Kosten, die die Vorteile ein Stück weit zunichte machen.

Dieser Nachteil wird durch Containerisierung beseitigt:  
Hier laufen alle Applikationen direkt auf dem Host-Betriebssystem, ohne zwischengeschaltete Gast-VM.
Um die Dienste weiterhin voneinander abzuschirmen, erhält jeder Container mithilfe von Tools wie `chroot` sein eigenes Dateisystem und Netzwerkinterface.
Einzelne Container sind dadurch wie VMs voneinander abgeschirmt, weisen aber nicht deren Overhead vor (siehe Abbildung \ref{containerVsVM}).

![Containers vs. VMs [@Docker:ContainerVsVM]\label{containerVsVM}](ContainerVsVM.jpg)

Ein IBM Research Report aus dem Jahr 2014 hat die Performance-Unterschiede zwischen den beiden Industrie-Standards KVM (Virtualisierung) und Docker (Containerisierung) untersucht.
Dabei war die Performance von Docker-Containern in fast allen Fällen mit gleichauf mit nativen Deployments, KVM zeigt sich in allen Disziplinen bis auf Netzwerk-Latenz und Sequenzielles Lesen deutlich weniger performant [@Docker:ContainerVsVM].

Durch den verschwindend geringen Overhead ermöglicht eine Container-Basierte Anwendung sogennante *Microservice-Architekturen*.
Dabei ist eine Anwendung in mehrere zustandslose Dienste aufgeteilt, die unabängig von einander ausgeliefert werden und über ein platformagnostisches Protokoll wie HTTP oder eine Message Queue miteinander kommunizieren.

Da die Dienste zustandslos sind, kann man diese horizontal skalieren und so zum Beispiel Lastspitzen kurzfristig auszugleichen.
Die gesamte Anwendung kann so sehr genau an die aktuelle Situation angepasst werden und spart so Rechenleistung und Geld.
Durch die horizontale Skalierung wird die Anwendung außerdem resilienter, da ein fehlerhafter Dienst einfach ersetzt werden kann, und es können Rolling-Deployments ohne Downtime durchgeführt werden.

Große Unternehmen setzen schon länger auf vollständig Containerisierte Anwendungen.
So berichtet Netflix von über einer Million gestarteter Container pro Woche [@containersAtNetflix], Google sogar mehr als zwei Millionen [@containersAtGoogle].
Durch Container konnte eine deutlich angenehmere Entwicklerumgebung geschaffen werden, da in Test-Umgebungen dieselben Container wie in Produktiv-Umgebungen verwendet werden und es keine Fehler durch unterschiedliche Versionen der Abhängigkeiten mehr gibt [@containersAtNetflix].

Microservices und Container haben großes Potential, um die Entwicklung großer Applikationen zu vereinfachen und effizient auf Clustern in Cloud-Umgebungen auszuführen.
Das Thema ist in letzter Zeit immer mehr in den Fokus der Open-Source-Community gerückt und es werden großartige Tools wie Kubernetes[^kubernetes] oder OpenStack[^openstack] dafür entwickelt.
Für kleine Projekte wie *EntE* bleibt eine echte Microservice-Architektur zu aufwendig, kann sich aber für größere Projekte auf lange Sicht bezahlt machen.

[^kubernetes]: [Kubernetes: https://kubernetes.io/](https://kubernetes.io/)
[^openstack]: [OpenStack: https://www.openstack.org/](https://www.openstack.org/)

\newpage

# Bibliographie
\bibliography{Paper.bib}
