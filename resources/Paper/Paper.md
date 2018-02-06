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
header-includes: |
  \usepackage{graphicx}
---

# Vorwort
Viele der in dieser Facharbeit angewandten Methoden und Konzepte habe ich über das Internet gelernt.
Dort findet sich zu fast jedem Thema ein gut verständlicher Blog-Eintrag, ein Vortrag oder eine Online-Dokumentation.
Ich möchte mich deshalb bei allen Blog-Autoren und Tutorial-Websites bedanken, ohne die ich diese Facharbeit niemals hätte schreiben können.
Speziell mit der Frontend-Entwicklung und der Arbeit mit APIs habe ich während meiner Arbeit bei OrbiTeam viel Erfahrung sammeln können, auch dafür möchte ich mich sehr bedanken.

Fast alle im digitalen Entschuldigungverfahren verwendeten Tools und Frameworks sind kostenlos und frei zugänglich.
Die Open-Source-Community ermöglicht, ohne riesigen Kapitaleinsatz großartige Produkte zu entwickeln.
Ich möchte mich deshalb bei allen Open-Source-Contributors sowie den dahinter stehenden Firmen bedanken, dass sie ihre Arbeit unter Open-Source-Lizenzen veröffentlichen.

Des weiteren geht ein großer Dank an meine Schule, das Ernst-Moritz-Arndt-Gymnasium, die mein Interesse an der Informatik schon früh gefördert hat und tollen Informatik-Unterricht gibt.
Im speziellen möchte ich mich bei Thilo Kühn und Jens Liebreich bedanken, die sich für mich viel Zeit genommen haben um mir die Anforderungen an das Entschuldigungsverfahren zu erklären, sowie bei Benjamin Reichelt, der diese Facharbeit betreut hat und mir bei Fragen und Problemen immer zur Seite stand.

\newpage

\tableofcontents

\newpage

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

Seit dem Aufkommen der Computertechnik wurden sowohl in staatlichen als auch privaten Einrichtungen viele dieser administrativen Aufgaben digitalisiert, um einen weniger fehleranfälligen und effizienteren Ablauf gewährleisten zu können.
Diese Entwicklung fasst wird unter dem Begriff *E-Government* zusammengefasst.

Beispiele dafür sind zum Beispiel die Online-Ticketvergabe im Stadthaus, die digitale Steuererklärung via *Elster*[^Elster] oder die Digitale Staatsbürgerschaft in *Estland*[^E-Residency].

[^Elster]: [Elster: https://www.elster.de](https://www.elster.de)
[^E-Residency]: [Estonia E-Residency: https://e-resident.gov.ee/](https://e-resident.gov.ee/)

### Inhalt dieser Facharbeit
Inhalt dieser Facharbeit ist es, ein neues, digitales Entschuldigungsverfahren zu entwickeln, welches diese Aufgaben automatisiert und so sämtlichen beteiligten Arbeit abnimmt und Fehlern vorbeugt.

Im Rahmen dieser Facharbeit werde ich erläutern, *wie* und *wieso* ich dieses System modelliert und implementiert habe.
Dabei lege ich besonderen Fokus auf folgende Aspekte:

- Skalierbarkeit
- Nutzbarkeit
- Sicherheit

Ich möchte dabei soweit es geht die *Best Practices* der modernen Webentwicklung erfüllen um am Ende im Hinblick auf Sicherheit und Nutzbarkeit ein einsetzbares Produkt in den Händen zu halten.
\newpage

# Hauptteil
## Datenschutz

Die in  Nordrhein-Westfalen geltende "Verordnung über die zur Verarbeitung zugelassenen Daten von Schülerinnen, Schülern und Eltern" besagt:

> Die automatisierte Verarbeitung der personenbezogenen Daten ist zulässig [...] wenn jeweils über die Konfiguration die Vertraulichkeit, Integrität, Verfügbarkeit, Authentizität, Revisionsfähigkeit und Transparenz gemäß §10 des Datenschutzgesetzes Nordrhein-Westfalen gewährleistet sind.
> [@sgvnrw2017]

Für das Digitale Entschuldigungsverfahren bedeutet "Revisionsfähigkeit" insbesondere, dass eine Versionierung erfolgen muss.
Im bisherigen System ist dies nicht erfolgt, über den Zeitpunkt der Unterschriften ist nichts bekannt.

Weiter besagt das Schulgesetz, welche Daten eine Schule speichern darf.
Die für das Entschuldigungsverfahren wichtigen Daten sind aufgeführt:

> - Beurlaubung:
>   - Beginn, Ende, Grund
> - Schulversäumnis:
>   - Beginn, Ende, Grund
> [@sgvnrw2017]

Ab dem 25. Mai 2018 ist die neue Datenschutz-Grundverordnung (DSGVO) umzusetzen.
Von dieser Verordnung sind alle Dienste betroffen, die personenbezogene Daten erfassen.
Da die DSGVO schon IP-Addressen als solche wertet, fällt jeder Online-Dienst darunter - auch das Entschuldigungsverfahren.
Die DSGVO schreibt vor, dass die Sicherheitsmaßnahmen der gesamten Auftragsverarbeitung dokumentiert sein muss und auch sämtliche Vertragspartner eine solche Dokumentation führen.
Darunter fallen auch Hosting-Anbieter, die vormals als unbeteiligte Drittanbieter angesehen wurden.
Aufhorchen sollte man, wenn man Dienste wie Google Analytics verwendet: Auch diese sind dokumentationspflichtig.
Da es für das Entschuldigungsverfahren keine dritten Vertragspartner gibt, beschränkt sich die Einhaltung der DSGVO auf die Kontrolle des Hosting-Anbieters [@iXdsgvo].

## Modellierung
### Prozess
Das digitale Entschuldigungsverfahren ist stark an den alten Entschuldigungszettel angelehnt.

Bei Versäumnis einer Stunde erstellen Schüler oder Eltern einen neuen Entschuldigungsantrag.
Darin steht:

- Startdatum
- Enddatum (Falls das Versäumnis mehrtägig ist)
- Art (Schulisch/Krankheit)
- Bemerkung
- Beliebig viele *Stunden* (Falls das Versäumnis eintägig ist)

Eine *Stunde* entspricht einem Unterrichtsblock, der verpasst wurde.
Darin steht:

- Start, Ende des Blocks (Schulstunde)
- Lehrer

Nachdem dieser Antrag erstellt wurde, bekommt der Stufenleiter diesen angezeigt.
Er kann dann prüfen, ob der Antrag zulässig ist, und den Antrag dementsprechend annehmen oder ablehnen.
Wurde der Eintrag von einem Schüler erstellt, so wird der Antrag zusätzlich den Eltern angezeigt, die diesen dann genehmigen müssen.
Falls die Eltern den Eintrag erstellen, so ist dieser schon bei der Erstellung genehmigt.

Die zeitaufwändige Überprüfung des Antrags in der Excel-Tabelle entfällt, genauso wie die Krankmeldung im Sekretariat:
Sinn dieser ist es, sicherzustellen dass der Schüler die Schule von seinem Versäumnis unterrichtet.
Dies tut er innerhalb dieses Prozesses durch die Erstellung des Antrags.

Die Lehrer sind aus dem Prozess erst einmal enthalten: Interaktion ihrerseits ist nicht nötig, um einen Entschuldigungsantrag zu validieren.
Sie haben allerdings Zugriff auf alle *Stunden*, die bei ihnen versäumt wurden und sehen, ob der zugehörige Entschuldigungsantrag erfolgreich angenommen wurde.
Am Ende jeder Woche erhalten alle Lehrer eine Benachrichtigung, in der die versäumten Stunden der letzten Woche aufgeführt sind.
Auf dieser Basis können dann die Kurshefte auf den aktuellen Stand gebracht werden.

### System
#### Architektur
Das neue Entschuldigungsverfahren soll als Web-Anwendung umgesetzt werden.
Jeder Nutzer des Systems (Schüler, Eltern, Lehrer, Stufenleiter und Administratoren) erhalten eigene Zugangsdaten, mit denen sie die für sie relevanten Daten einsehen und damit interagieren können.
Solche Aktionen sind zum Beispiel das Erstellen, Einsehen oder Unterzeichnen eines Antrags.

Dem Benutzer muss also von seiner Rolle im Prozess verschiedene Information angezeigt werden.
Zur Umsetzung dessen gibt es zwei beliebte Architekturen:

1. Dynamisches Generieren der angezeigten Seite auf dem Server (z.B. mit PHP, Ruby on Rails, ...)
2. Dynamisches Rendern der Daten auf Client-Seite (mit Browser-seitigem JavaScript)

Der Unterschied ist klein aber äußerst relevant:
Bei der ersten Architektur muss der Server bei jeder Seitenanfrage für den anfragenden Client eine HTML-Seite zusammenbauen.
Fragt zum Beispiel ein Schüler seine Übersichtsseite an, so werden aus der Datenbank die $n$ letzten Einträge dieses Schülers abgefragt und in eine kleine HTML-Tabelle eingetragen.
Die Seite wird dann vielleicht noch durch einen Header, den sich alle Seiten teilen, erweitert und dem Nutzer zurückgesendet.
Die Last auf dem Server steigt also mit der Anzahl der Nutzer.
Der Server hat dabei bei jeder Anfrage sowohl die Arbeit, die Daten aus der Datenbank abzufragen, als auch die Seite aufzubauen.

Beim Zweiten Ansatz liefert der Server dem Client jedes mal die gleiche HTML-Seite aus.
Diese Seite enthält nun JavaScript-Code, der vom Client aus HTTP-Anfragen an eine Entwicklerschnittstelle[^API] schickt.
Diese API liefert dem Client die relevanten Daten zurück, dieser zeigt diese über Veränderungen in der DOM[^DOM] dem Nutzer an.
Fragt zum Beispiel ein Schüler seine Übersichtsseite an, so wird ihm zuerst die Standard-HTML-Seite ausgeliefert.
Der JavaScript-Code auf dieser Seite fragt nun bei der *API* die letzten $5$ Entschuldigungsanträge an, wartet auf die Antwort und erweitert die Anzeige um die Ergebnisse der Anfrage.

[^API]: Von nun an als *API* bezeichnet
[^DOM]: Document Object Model

Auf den ersten Blick erscheint die zweite, Client-seitige Methode, als unnötiger Mehraufwand - schließlich müssen zwei Anfragen getätigt werden, um die gewollten Daten anzuzeigen.
Tatsächlich hat sie aber andere Vorteile: Da die HTML-Seite an sich immer die gleiche ist, lässt sich diese statisch ausliefern und lokal zwischenspeichern.
Man kann CDN-Dienste wie Cloudflare[^Cloudflare] benutzen, um die Auslieferungszeiten möglichst gering zu halten.
Um die Datenübertragung noch weiter zu reduzieren, kann man diese Seite Cachen und so die Menge der übertragenen Daten auf ein Minimum reduzieren.
Die *Time-To-First-Draw*, also die Zeit, bis der Nutzer etwas von der Seite sieht, ist minimal: Sobald die HTML-Seite fertig geladen hat, zeigt der Browser schon Daten an.
Man muss somit nicht mehr auf langsame Datenbankanfragen im Server warten und sieht sofort eine Benutzeroberfläche, dies verbessert die User Experience ungemein.
Des weiteren kann dadurch der Server stark entlastet werden: er muss mit diesem Ansatz nur noch die Datenbankanfragen beantworten und nicht die HTML-Seiten zusammenbauen.

[^Cloudflare]: [Cloudflare: https://www.cloudflare.com](https://www.cloudflare.com)

Der zweite Ansatz eignet sich insbesondere für Web-Apps, die kleine Datensätze anzeigen.
Lassen sich die Daten dann noch Cachen, kann man mit dieser Architektur viel Performance rausholen.

Nicht sehr gut geeignet ist dieser Ansatz für Webseiten, die auf statischen Daten aufbauen, z.B. Blogs oder Magazine.
Diese werden dann auch besser statisch ausgeliefert und verzichten ganz auf 
Daneben müssen alle Clients für die zweite Architektur ihrerseits performant genug sein muss bzw. überhaupt erst einmal JavaScript-Support bieten sollte.

Für das Entschuldigungsverfahren habe ich mich für den Zweiten Ansatz entschieden, da er sehr gut zum Konzept passt: Ich habe kleine Datensätze (Entschuldigungen, Nutzer) und eine gleichbleibende Website.
Alle Ziel-Clients (PCs, Smartphones) haben JavaScript-Support und sind performant genug, um die Seite Client-Seitig zu rendern.

### Datenbank

\ref{erd}

- Entity-Relationship-Diagramm
- Wieso ist sie so modelliert?

### API
Die anzuzeigenden Daten erhält der Client von einer API.
Diese ist nach dem REST-Prinzip [@rest] aufgebaut und zeichnet sich insbesondere durch die Darstellung der Daten als *Ressourcen* sowie die *Zustandslosigkeit* des Protokolls aus.

#### Routen
Die Modellierung auf *Ressourcen*-Basis bedeutet, dass die Pfade der API jeweils einer Ressource bzw. einem Datensatz entsprechen.

Es existieren zum Beispiel folgende Pfade:

- `GET /users` (Alle Nutzer anfragen)
- `GET /entries` (Alle Einträge anfragen)
- `GET /slots` (Alle Stunden anfragen)

Möchte man nur eine bestimmte Ressource anfragen, spezifiziert man deren ID:

- `GET /users/[userId]` (Speziellen Nutzer anfragen)
- `GET /entries/[entryId]` (Speziellen Eintrag anfragen)
- `GET /slots/[slotsId]` (Spezielle Stunde anfragen)

Als ID werden die von der MongoDB vergebenen Dokumenten-IDs verwendet.

Möchte man auf diesen Ressourcen Aktionen ausführen, so verwendet man andere HTTP-Verben:

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

Dies steht im Gegensatz zu traditionellen Ansätzen, in denen sich der Nutzer zu Beginn einer Session beim Server anmeldet.
Dieser speichert eine Kennung des Clients und liefert bei der nächsten Anfrage passende Daten aus.

Bei zustandslosen Architekturen sind Anfragen dagegen in sich selbst geschlossen und können so unabhängig von vorhergegangenen Anfragen bearbeitet werden.
Man kann nun den selben Server-Dienst mehrmals auf unterschiedlichen Rechnern ausführen und jede Anfrage an einen anderen Server schicken.

Dies ermöglicht unter anderem Versions-Aktualisierungen ohne Downtime oder horizontales Skalieren, um kurzfristige Lastspitzen abzufangen.
Erläuterungen hierzu finden sich im Appendix.

#### Sicherheit
Die API muss gegen unbefugten Zugriff gesichert sein.
Hierzu gibt es verschiedenste Ansätze, einige davon werden im Anhang vorgestellt.
Um den Entwicklungsaufwand in dieser Hinsicht gering zu halten, habe ich für das Entschuldigungsverfahren *Basic Auth* verwendet: Dabei schickt der Client einfach bei jeder Anfrage Nutzernamen und Passwort im Klartext mit.

Mit Software wie WireShark[^Wireshark] lassen sich die Netzwerkpakete allerdings leicht abfangen, dann kann man problemlos das Passwort auslesen.
*Basic Auth* darf daher niemals über unverschlüsselten Kommunikationswege verwendet werden!
Sämtlicher Netzwerkverkehr wird über das **T**ransport-**L**evel-**S**ecurity-Protokoll [@tls] verschlüsselt.
Die dafür notwendigen Zertifikate kauft man traditionell bei Certificate-Authorities wie [Symantec](https://www.symantec.com/de/de/ssl-sem-page/), seit einigen Jahren kann man diese auch kostenlos über Community-Zertifizierer wie Let's Encrypt erhalten.

[^Wireshark]: [Wireshark: https://www.wireshark.org/](https://www.wireshark.org/)

## Umsetzung

### Stack
Mein Software-Stack basiert im groben auf dem *MERN*[^MERN]-Stack:

- MongoDB (Datenbank)
- Express (API-Framework)
- React (UI-Library)
- Node.js (Server-Side JavaScript)

[^MERN]: [MERN: http://mern.io/](http://mern.io/)

Daneben werden noch folgende andere Bibliotheken/Tools verwendet:

**Docker** ist ein Container-Ökosystem mithilfe dessen das Entschuldigungsverfahren ausgeliefert wird. Siehe Anhang.  
**Immutable.js** ist eine Bibliothek für unveränderliche Datenstrukturen in JavaScript. Wurde von Facebook entwickelt.  
**Redux** ist eine Implementierung der Flux-Architektur [@flux] für One-Way-Dataflow in Javascript.
**Bcrypt** ist ein Hashing-Algorithmus, der speziell für Passwörter entwickelt wurde.  
Mit **MJML** lassen sich responsive Emails erzeugen, die in jedem Email-Client gut aussehen.  
**Mongoose** bietet Schema-Validierung und eine schönere API für die arbeit mit MongoDB.  
**Sentry** sammelt alle Fehlermeldungen inklusive Stack-Traces und sammelt diese anonymisiert, damit man Fehler erkannt werden.  
**Nodemailer** ermöglicht Node.js-Anwendunge, über SMTP Emails zu verschicken.  

### Passwörter
Jeder Nutzer meldet sich im System mit Passwort und Benutzername an.
Die API braucht daher eine Möglichkeit, das Passwort auf seine Gültigkeit zu überprüfen.
Die Passwörter müssen also in der Datenbank gespeichert werden, dabei aber so sicher wie möglich abgelegt werden.

Die sicherlich trivialste Möglichkeit ist es, die Passwörter bei der Nutzererstellung im Klartext zu speichern.
Dann kann bei der Anmeldung einfach das übergebene Passwort verglichen werden.
Kommt nun jedoch irgendjemand an die Inhalte der Datenbank, sei es ein böswilliger Hacker oder ein neugieriger Admininstrator, sind dort die Passwörter einfach sichtbar.
Dieses Risiko sollte man niemals eingehen.

Möglichkeit zwei ist es, die Passwörter verschlüsselt zu speichern.
Nutzt man Algorithmen wie RSA oder AES hat ein Hacker wenig Chancen und die Datenbank ist vor ihm sicher.
Allerdings muss ein verschlüsseltes Passwort zur Überprüfung entschlüsselt werden - und wenn das Entschuldigungsverfahren dies kann, kann dies auch jeder andere, der den privaten Schlüssel kennt - ein Administrator kann also immernoch auf alle Passwörter zugreifen.

Den besten Umgang mit Passwörtern erreicht man, wenn man Hash-Funktionen verwendet:
Dann kennt weder Datenbank, Server noch Administrator die Passwörter seiner Nutzer, da man nur den Hash des Passworts abspeichert.
Möchte man einen Nutzer autentifizieren, so berechnet man den Hash des übermittelten Passworts und vergleicht diesen mit dem in der Datenbank hinterlegten.

Für Passwörter benutzt man sehr gerne den Bcrypt-Algorithmus [@bcrypt].
Bei diesem kann man durch einen zusätzlichen Parameter die Laufzeit einstellen, um den Algorithmus langsamer zu machen.
Dieser Rechenaufwand macht in der Anwendung keinen großen Unterschied, Brute-Force-Angriffe sind dadurch aber deutlich aufwändiger.

\newpage

# Fazit

Im Laufe dieser Facharbeit habe ich viel über die Entwicklung komplexer Websysteme gelernt.
Jedes große Thema der Webentwicklung wurde kurz angekratzt: API-Entwicklung, Datenbank-Systeme, WebApps, Authentifizierungsmethoden, TLS-Verschlüsselung, automatisierte E-Mails...
Dabei habe ich in viele der Konzepte gute Einblicke erhalten und bin sicher in deren Entwicklung.

Ich denke, dass das Produkt, welches am Ende entstanden ist, das Potenzial hat das Entschuldigungsverfahren an unserer Schule deutlich zu verbessern.
Es bleiben einige Schönheitsfehler wie die fehlende Versionierung, die den Produktiveinsatz erschweren - diese lassen sich jedoch relativ einfach beheben.
Interessant wird es sein zu sehen, welche Fehler im Produktiveinsatz dann tatsächlich auftreten - es gibt immer Fälle, an die man vorher nicht gedacht hat.

Wenn ich das Tool jetzt noch einmal schreiben würde, hätte ich von Beginn an auf eine SQL-Datenbank gesetzt, um größere Datenintegrität gewährleisten zu können.

Einige Lehrern zeigen großes Interesse am digitalen Entschuldigungsverfahren - bleibt zu hoffen, dass auch die Schulleitung diese sieht.

\newpage

# Appendix

\appendix

![Entity-Relationship-Diagramm DB\label{erd}](DB.pdf)

\section{}


## Containerisierung
- Kurze Erklärung Docker
- Erläuterung: Vorzüge Stateless Architecture
- Distributed Deployments mit Kubernetes
  - Erklärung des Konzepts: Redundanz und *Horizontal Scaling* statt *Monolithischem Vertical Scaling*

\newpage
# Bibliographie

