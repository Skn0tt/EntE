# EntE für neue Stufenleiter / Lehrer

Sie haben gerade Zugriff auf ihren neuen EntE-Server erhalten und möchten ihn nun für ihre Schule einrichten.
Was tun?

Eine neue Software einzurichten, kann nervenaufreibend sein.
Der Einrichtungsprozess wird gerne vernachlässigt - Tools und Workflows, die diesen vereinfachen, fehlen entweder ganz oder sind nicht ausreichend dokumentiert.
Um es EntE-Verantwortlichen einfacher zu machen, soll dieses Dokument als Leitfaden für die Einführung an ihrer Schule dienen.
Ein Einstieg für Stufenleitung, Admins oder interessierte Power-User:

## Admin-Account erstellen

Melden Sie sich zu Beginn mit den Standard-Nutzerdaten (User `admin`, Passwort `root`) an.
Als erstes sollten Sie sich einen eigenen Admin-Account erstellen.
Dies tun sie über einen Klick auf das `+` unten rechts im _Nutzer_-Tab.
Löschen Sie danach den Standard-Account (Klick auf den Tabellen-Eintrag des Nutzers `admin`, oben rechts auf _Nutzer löschen_) und melden Sie sich mit ihrem eigenen Admin-Account an.

## Server-Einstellungen

Rufen Sie nun die _Admin_-Seite auf.
Dort können Sie einige Server-Weite Einstellungen tätigen:

- Welche Sprache ist standardmäßig für neue Nutzer eingestellt?
- Nach wie vielen Tagen endet die Eintragserstellungsfrist? Liegt die _Eintragserstellungsfrist_ etwa bei 7 Tagen, so müssen SuS ihre Fehlstundenanträge binnen 7 Tagen nach Ende des Eintrages erstellen. Mit Überschreitung der Frist kann der Eintrag zwar weiterhin erstellt werden, enthält aber eine entsprechende Bemerkung, sodass das Versäumnis Eltern und Stufenleitung schnell auffällt.
- Wie viele Tage haben Eltern Zeit, einen Eintrag zu unterschreiben?
- Nach wie vielen Tagen sollen Eltern eine Erinnerungs-Email erhalten, falls ein Eintrag noch nicht unterschrieben wurde?
- Welcher Text soll auf dem Anmeldebildschirm angezeigt werden? Beispielsweise "Willkommen auf der 🦆 des Heinrich-Hertz-Gymnasiums". Für "Profis": Hier kann beliebiges HTML verwendet werden, seien sie kreativ!

Das nachträgliche Verändern einiger Einstellungen sollte mit Vorsicht bedacht sein:
So wird die Standard-Sprache zum Beispiel lediglich bei der Erstellung neuer Nutzer verwendet, bestehende Nutzer behalten ihre bisherige Sprache.
Verändern Sie die Eintragserstellungsfrist, wird der neue Wert auch auf bereits erstellte Einträge angewendet - ehemals fristgerechte Einträge könnten also auf einmal angekreidet werden (und anders herum).
Gleiches gilt für die elterliche Unterschriftsfrist.
Für die Anzahl der Tage, nach dem eine Erinnerungs-Email versandt wird, ist der eingestellte Wert zum Zeitpunkt der Erstellung relevant.
Falls Sie auf Nummer sicher gehen wollen: Führen Sie die Änderungen zu Beginn der Ferien durch, wenn der Puffer groß genug ist.

## Nutzer anlegen

Ein kurzer Überblick über die verschiedenen Rollen, die ein Nutzer einnehmen kann:

### Schüler\*in

Kann Einträge erstellen und bisherige Einträge einsehen.
Es wird Stufe bzw. Stammkurs gespeichert, über welchen die Zuordnung zur verantwortlichen Stufenleitung geschieht.
Außerdem wird das Geburtsdatum gespeichert, denn bei volljährigen SuS ist die Unterschrift der Erziehungsberechtigten nicht notwendig.

Tipp: Verwenden Sie für Stufe / Stammkurs einen unveränderlichen Wert, z.B. das Abschlussjahr (_2042_).
So muss dieser bei Versetzung nicht aktualisiert werden, und Sie ersparen sich ein lästiges aktualisieren der Nutzer bei Schuljahresbeginn.

### Erziehungsberechtigte\*r

Kann Einträge der Kinder einsehen und unterschreiben.
Kann außerdem neue Einträge im Namen der Kinder erstellen.
Zusätzlich zu den normalen Nutzerdaten wird ein Verweis auf die Kinder des Nutzers gespeichert.

### Lehrkraft

Kann bei der Erstellung eines Eintrags als Lehrperson einer Fehlstunde ausgewählt werden und Fehlstunden im eigenen Unterricht einsehen.
Kann außerdem _Fehlstundenvoranmeldungen_ treffen, die SuS dann in ihren Einträgen aufnehmen müssen.

### Stufenleitung

Der mächtigste aller Nutzer.
Kann Einträge von SuS des zugehörigen Stammkurses / Jahrgangs unterschreiben sowie deren Statistiken einsehen.
Hat darüber hinaus alle Fähigkeiten einer Lehrkraft.

Unabhängig von diesen Rollen kann ein Nutzer außerdem _Administrator_ sein.
Damit erhält er Zugriff auf Server-Einstellungen sowie die Nutzerverwaltung.

Nachdem Sie den Server im vorigen Schritt richtig eingestellt haben, sollen nun die Nutzer anlegt werden.
Dies können Sie im Nutzer-Erstellungsdialog im Nutzer-Tab händisch durchführen, bei mehreren hundert Nutzern ist ein Massenimport aber die angenehmere Lösung.
Dafür gibt es im Admin-Tab die Funktion _Nutzer importieren_, mit deren Hilfe Sie Massenimporte über zwei Formate durchführen können:

- CSV: Erstellen Sie eine große Tabelle ihrer Nutzer, z.B. In Excel, und importieren Sie diese. [Weitere Informationen](user-import/user-import-from-csv.md)
- SchiLD: Falls ihre Schule SchiLD verwendet, können Sie die Schüler mithilfe der EntE-Schild-Exportvorlage importieren. [Weitere Informationen](user-import/user-import-from-schild.md) (Sie verwenden eine andere Schulverwaltungssoftware? Vermutlich kann auch dafür ein Import-Tool entwickelt werden.)

Übrigens: Auch wenn EntE ihnen die Möglichkeit gibt, ihren Nutzern ein Initialpasswort zu vergeben - tun Sie dies am besten nicht!
Ein Nutzer, der bei Erstellung noch kein Passwort besitzt, erhält eine Einladungs-Mail, über welche er sein Passwort selber festlegen kann.
So sparen Sie sich das Austeilen von Initialpasswörtern.

Im _Nutzer Importieren_-Dialog werden Sie eine Reihe von Einstellungen finden.
Diese können Sie für den Erstimport ignorieren, sie werden [später nochmal wichtig](#nach-einem-jahr-neue-nutzer-importieren)

### Was kann schiefgehen? Was mache ich dann?

Die Nutzer sind nun zwar angelegt, aber für gewöhnlich gehen beim ersten Import trotzdem zwei Dinge schief:

1. Ihre Datenquelle hat Fehler: Falsche / unvollständige E-Mail-Adressen, Daten der Elternteile vertauscht, usw ... Ihre Nutzer werden sich bei ihnen melden, wenn sie Probleme damit haben. Beheben Sie diese einfach von Hand im Nutzer-Tab, dort können Sie z. B. Benutzernamen oder E-Mail-Adressen im Nachhinein anpassen.

2. Der E-Mail-Versand an einzelne Adressen funktioniert nicht. Etwa aufgrund von Tippfehlern, zu sensiblen Spam-Filtern, oder einfach weil in ihren Stammdaten veraltete E-Mail-Adressen enthalten sind. Einige dieser Fehler werden in den Aktivitätslogs des E-Mail-Providers aufgeführt, über andere werden sich die Nutzer bei ihnen beklagen. Überprüfen Sie dann einfach die Adresse und bitten um eine Überprüfung des Spam-Ordners. Falls das Problem behoben werden konnte, können Sie die Einladungs-Mail über den Nutzer-Tab erneut versenden.

## EntE in der täglichen Benutzung

Nachdem die Nutzer eingerichtet und anfängliche Probleme behoben sind, geht es so langsam in die tägliche Nutzung über.
Die grundlegenden EntE-Features sind selbsterklärend - Eintrags-Tab öffnen, noch nicht unterschriebene Einträge öffnen, überprüfen und gegebenenfalls unterschreiben.
Aber darüber hinaus gibt es noch viele Funktionen, die ihnen die Arbeit erleichtern können:

- Sowohl der Eintrags- als auch Stunden-Tab kann mithilfe von Filtern an ihre Bedürfnisse angepasst werden. Beispielsweise können Sie lediglich Einträge der letzten Woche oder lediglich Einträge, bei denen die Eltern bereits unterschrieben haben, anzeigen. Besonders hilfreich kann der Filter _Ausstehend_ sein - damit verwandelt sich die Tabelle in eine _Inbox_, in der Sie bereits bearbeitete Einträge abhaken können.
- Falls Sie Rückfragen zu einem Eintrag haben, können Sie auf das Briefumschlags-Symbol drücken. Dann öffnet ihr Mail-Client eine neue Mail an die betroffene Schüler\*in. Einträge, bei denen Sie auf diesen Button gedrückt haben, werden ab sofort mit einem kleinen Briefumschlag gekennzeichnet.
- Falls SuS einen fehlerhaften Eintrag erstellt haben, können Sie diesen als Stufenleitung löschen. Die Beteiligten werden darüber per E-Mail informiert.
- Falls Sie einen Eintrag fälschlicherweise unterschrieben habe, können Sie ihre Unterschrift als Stufenleitung zurückziehen. Die Beteiligten werden darüber per E-Mail informiert.
- In der Eintrags-Ansicht gibt es unten ein Notiz-Feld. Dieses bezieht sich auf den/die jeweilige Schüler\*in, _nicht_ auf den Eintrag - falls ein SuS also häufig fehlt, tragen Sie bspw. `Fehlt häufig, im Auge behalten` ein, um beim nächsten Eintrag daran erinnert zu werden.
- Über den Tab _Stufe_ können Stufenleiter die Statistiken ihrer SuS einsehen. Per Klick auf eine Zeile können die erweiterten Statistiken geöffnet werden. Interessant ist hierbei insbesondere die _Stundenrate_: Dies ist die Zahl der Fehlstunden geteilt durch die Zahl der Fehltage. Beispiel: Liegt diese bei 6, so hat diese Schüler\*in also für gewöhnlich sechs Unterrichtsstunden am Tag gefehlt.Die Statistiken können Sie übrigens auch als Übersicht über die gesamte Stufe betrachten.

## Nach einem Jahr: Neue Nutzer importieren

Das erste Jahr ist vorüber, nun sollen Nutzer für die neuen Oberstufen-SuS angelegt werden - doch nicht alle SuS der Stufe benötigen einen neuen Account, einzelne haben z.B. eine Klasse wiederholt und besitzen bereits einen Account.
Um den Nutzerimport trotzdem unkompliziert zu halten, hat EntE den klassischen "Import" um eine Update-Funktion erweitert.
Diese greift für importierte Nutzer, deren Nutzername bereits im System vorliegt:
Für diese wird _kein_ neuer Account erstellt, sondern lediglich der bestehende mit den Daten des Imports aktualisiert (In der Datenbank-Terminologie nennt man das _Upsert_: ein _Insert_ mit _Update_ bei Konflikt).
Achtung: Bei Nutzernamen-Dopplung wie \*max.müller” kann dies zu Fehlern führen, überprüfen Sie solche Fälle von Hand auf Richtigkeit.

Des Weiteren hat die Import-Funktion ein paar Zusatz-Einstellungen, die zu Beginn des neuen Schuljahrs hilfreich sein können:

- Alle Nutzer löschen: bestehende Nutzer, die nicht im Import enthalten sind, werden gelöscht. Kann z.B. verwendet werden, um die EntE-Datenbank auf einen Stand mit der Schulverwaltungssoftware zu bringen.
- Schüler und Eltern löschen: ähnlich, aber hier werden nur Schüler und Eltern gelöscht. Lehrer bleiben erhalten. Ist nützlich, wenn man z.B. den SchiLD-Import verwendet.
- Alle Einträge löschen: Sämtliche bestehende Einträge werden gelöscht.
