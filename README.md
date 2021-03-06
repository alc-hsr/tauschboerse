# Inhaltsverzeichnis
- [Inhaltsverzeichnis](#inhaltsverzeichnis)
- [Tauschbörse](#tauschb%C3%B6rse)
  - [Module/Features](#modulefeatures)
    - [Anforderungen](#anforderungen)
    - [Optionale Ideen](#optionale-ideen)
    - [Implementierte Zusatzmodule/-funktionen](#implementierte-zusatzmodule-funktionen)
  - [Setup](#setup)
    - [Installation](#installation)
    - [Testdaten](#testdaten)
  - [Applikation starten](#applikation-starten)
    - [Entwicklung](#entwicklung)
      - [1) API-Server starten](#1-api-server-starten)
      - [2) Web-Server starten](#2-web-server-starten)
    - [Produktion](#produktion)
      - [1) Vorbereiten](#1-vorbereiten)
      - [2) Web-Server starten](#2-web-server-starten)
  - [Tests](#tests)
    - [a) Unit Tests](#a-unit-tests)
      - [Tests für die Reducers (Redux)](#tests-f%C3%BCr-die-reducers-redux)
      - [Tests für die React-Komponenten](#tests-f%C3%BCr-die-react-komponenten)
      - [Tests für clientseitige Modellklassen](#tests-f%C3%BCr-clientseitige-modellklassen)
    - [b) End-to-End Tests](#b-end-to-end-tests)
      - [WebdriverIO/Selenium](#webdriverioselenium)
      - [Puppeteer](#puppeteer)
    - [c) CSS Style Tests](#c-css-style-tests)
    - [d) Echte Benutzertests](#d-echte-benutzertests)
  - [Implementierungsdetails](#implementierungsdetails)
    - [Use Cases](#use-cases)
      - [Benutzer](#benutzer)
      - [Marktplatz](#marktplatz)
      - [Tauschgeschäfte](#tauschgesch%C3%A4fte)
    - [Zustandsdiagramme](#zustandsdiagramme)
      - [Tauschgeschäft (Trade)](#tauschgesch%C3%A4ft-trade)
      - [Angebot (Offer)](#angebot-offer)
      - [Artikel](#artikel)
    - [Datenhaltung](#datenhaltung)
    - [Logisches Datenmodell](#logisches-datenmodell)
- [Rückblick](#r%C3%BCckblick)
  - [Gut gelöst](#gut-gel%C3%B6st)
  - [Das nächste Mal anders](#das-n%C3%A4chste-mal-anders)
  - [Gelernt](#gelernt)

# Tauschbörse

Online-Tauschbörse im Rahmen des CAS FEE 2017. Ziel des Projekts ist es, eine Web-Applikation zu entwickeln, die es Benutzern ermöglicht, beliebige Artikel untereinander zu tauschen. Dazu wählt man die Artikel aus, die man von einem anderen Benutzer haben möchte, und bietet dafür einen oder mehrere der eigenen Artikeln zum Tausch an. Der angefragte Benutzer kann dann das Tauschgeschäft bestätigen oder ablehnen.

## Module/Features

### Anforderungen

* Registrierung/Login
  * Ein Benutzer kann sich registrieren, um ein Konto zu eröffnen. Dies ist notwendig, um Zugang zu allen Funktionen der Applikation zu bekommen.
  * Sobald der Benutzer registriert ist, kann er sich mit seiner E-Mail-Adresse und seinem Passwort anmelden.

* Benutzerprofil
  * Ein registrierter Benutzer kann sein eigenes Benutzerprofil verwalten (ändern von Benutzerinformationen, wie z.B. Name, Passwort, etc.).
  * Wenn man nicht registriert ist, hat man keinen Zugriff auf dieses Modul.

* Artikelverwaltung
  * Ein registrierter Benutzer kann seine Artikel verwalten (CRUD).
  * Ein Artikel besteht dabei beispielsweise aus den folgenden Informationen:
    * Bezeichnung/Titel
    * Beschreibung
    * Kategorie
    * Foto
  * Wenn man nicht registriert ist, hat man keinen Zugriff auf dieses Modul.

* Marktplatz
  * Auf dem "Marktplatz" kann ein Benutzer nach Artikeln suchen.
  * Dies ist das einzige Modul, welches auch nicht-registrierten Benutzern (Gast) zur Verfügung steht.
  * Ein Gast kann aber nur nach Artikeln suchen und diese anschauen.
  * Hingegen ein registrierter Benutzer hat hier die Möglichkeit, einen Artikel auszuwählen, den er haben möchte und für diesen ein Angebot zu machen.
  * Dieses Angebot besteht aus einem oder mehreren der eigenen Artikeln.

* Tauschgeschäfte
  * Nur registrierte Benutzer haben die Möglichkeit Tauschgeschäfte über den Marktplatz zu starten.
  * In einer Übersicht sieht ein registrierter Benutzer seine Tauschgeschäfte (offen oder abgeschlossen).
  * Offene Tauschanfragen können von beiden Seiten storniert werden.
  * Ist der Empfänger der Tauschanfrage einverstanden, wird das Tauschgeschäft durchgeführt.
  * Ist er aber mit dem Angebot nicht einverstanden, kann er das Tauschgeschäft beenden, oder einen Gegenvorschlag machen.

### Optionale Ideen

Die folgenden Punkte gehören nicht in die Minimalanforderung. Es sind Ideen, die lediglich umgesetzt werden, wenn am Schluss noch genügend Zeit vorhanden ist.

Zusätzliche Module:
* Benutzerübersicht mit einigen Informationen über die Benutzer (z.B. Anzahl Artikel, Anzahl vollzogene Tauschgeschäfte, Konto eröffnet am TT.MM.JJJJ, etc.).
* Ranglisten: Die aktivsten Benutzer (Anzahl Tauschgeschäfte, Anzahl Artikel) werden in einer Rangliste geführt.
* Ranking-System: Nach vollzogenem Tauschgeschäft haben die beiden Benutzer die Möglichkeit, sich gegenseitig zu bewerten.
* Übersichts-/Startseite mit einigen Zufallsartikel, die mich vielleicht interessieren könnten, oder einfach die zuletzt hinzugefügten Artikel.
* Merkliste: In einer Merkliste kann man sich Artikel merken, damit man sie schneller wieder findet.
* Benutzer-Blacklist: Ein registrierter Benutzer kann eine Blacklist mit den Benutzern führen, von denen er keine Tauschanfrage mehr erhalten möchte.

Funktionserweiterungen:
* Gewisse Artikel können nur zusammen gehandelt werden.
* Der angefragte Benutzer kann direkt aus der Tauschanfrage heraus einen alternativen Tausch vorschlagen, wenn er beim anfragenden Benutzer einen Artikel findet, der in der ursprünglichen Anfrage nicht angeboten wurde. Das neue Tauschangebot ersetzt dabei das erste. Dadurch entwickelt sich der Marktplatz zu einem Handelsplatz.
* Login via externem Konto (z.B. Login via Facebook-Account).
* Paging-Mechanismus bei der Suche nach Artikeln (z.B. nächste 50 Artikel laden).
* Administratorrolle zu Supportzwecken.
* E-Mail-Benachrichtigung bei einer Aktivität (z.B. wenn eine Tauschanfrage eingegangen ist).
* Die Applikation wird in mehreren Sprachen angeboten. Über eine Auswahl kann der Benutzer die Sprache für die Anzeige einstellen (z.B. Deutsch, Englisch).

### Implementierte Zusatzmodule/-funktionen

Das Tolle an diesem Projekt ist, dass es fast beliebig erweiterbar mit zusätzlichen Modulen/Funktionen ist. Die folgenden Punkte wurden zusätzlich zu den oben genannten Minimalanforderungen implementiert:

* Module
  * Startseite/Dashboard
    * Die Startseite für einen nicht angemeldeten Benutzer zeigt eine tolle Animation, um die Applikation attraktiv zu machen.
    * Durch die entsprechenden Optionen, was der Benutzer jetzt machen kann, wird er zu den Funktionen der Applikation geführt.
    * Ist der Benutzer angemeldet, erscheint sein persönliches Dashboard.
    * Darauf erscheinen sofort die eingehenden Tauschanfragen, welche er noch nicht beantwortet hat (falls solche vorhanden sind).
    * Mit Hilfe von Pie-Charts hat er einen sofortigen Überblick über den Status seiner Artikel und Tauschgeschäfte.
    * Zudem wird der angemeldete Benutzer per Links zu den weiteren Funktionen geführt.
* Funktionen:
  * Innerhalb seines Artikels sieht ein angemeldeter Benutzer, in welchen Tauschgeschäften dieser Artikel involviert ist. Mit einem Klick kann er direkt in das Tauschgeschäft springen.
  * Ein Paging-Mechanismus wurde in der Trade-Detail-Ansicht und im Trade-Editor für die Artikellisten implementiert.
  * Auf dem Dashboard, auf der Seite der Tauschgeschäfte eines angemeldeten Benutzers und auf der Detailseite eines einzelnen Tauschgeschäfts wurde ein Polling-Mechanismus implementiert, damit Änderungen am Tauschgeschäft (z.B. wenn dieses vom Empfänger angenommen wurde) sofort angezeigt werden. 

## Setup

### Installation

```bash
git clone https://github.com/alc-hsr/tauschboerse.git
cd tauschboerse
npm install
```

(Unter Umständen muss die Installation unter Windows als Administrator ausgeführt werden, d.h. die Windows-Shell muss als Administrator gestartet werden.)

### Testdaten

Wir stellen Testdaten zur Verfügung, welche mit dem folgenden Kommando eingespielt werden können. Achtung: Dabei werden bestehende Daten gelöscht, so dass nur die Testdaten in der Datenbank vorhanden sind. Es wird dringend empfohlen dies bei gestopptem API-Server auszuführen.

```bash
npm run reset-data
```

## Applikation starten

### Entwicklung

#### 1) API-Server starten

```bash
npm run start-server
```

Der API-Server läuft nun auf <code>http://localhost:3001</code>.

#### 2) Web-Server starten

```bash
npm run start
```

Der Web-Server läuft nun auf <code>http://localhost:3000</code> und die Applikation kann über diese Adresse im Browser gestartet werden.

### Produktion

#### 1) Vorbereiten

Anders als beim Starten des Entwicklungsservers muss die Frontend-Anwendung statisch gebündelt werden. Dazu kann der folgende Befehl verwendet werden:

```bash
npm run build
```

Falls Testdaten erwünscht sind, kann mit dem Befehl ...

```bash
npm run reset-data-prod
```

... die Datenbank mit Testdaten initialisiert werden. Mit den Testdaten werden die folgenden fünf Benutzer registriert:
+ calbiez@hsr.ch
+ stephen.atchison@hsr.ch
+ max@mustermann.com
+ jamesbond007@agent.com
+ mgfeller@hsr.ch

Diese Benutzer haben alle das gleiche Passwort, nämlich **1234**.

#### 2) Web-Server starten

```bash
npm run start-server-prod
```

Der Web-Server läuft nun auf <code>http://localhost:3000</code> und die Applikation kann über diese Adresse im Browser gestartet werden.

## Tests

Um ein breites Spektrum von Testvarianten abzudecken, haben wir einige davon implementiert.

### a) Unit Tests

Die Unit Tests decken einzelne Klassen, Funktionen und Komponenten ab. Diese können mit folgendem Kommando ausgeführt werden:

```bash
npm run test
```

Die Unit Tests decken folgenden Bereiche ab:

#### Tests für die Reducers (Redux)

Da die Reducers "pure functions" sind, sind sie mit normalen Unit Tests einfach zu testen.

#### Tests für die React-Komponenten

Es gibt verschiedenste Möglichkeiten, wie man React-Komponenten testen kann. Wir haben sogenannte "shallow" und "snapshot" Tests umgesetzt.

#### Tests für clientseitige Modellklassen

Für die meisten clientseitigen Modellklassen haben wir ebenfalls Unit Tests implementiert.

### b) End-to-End Tests

Mit vollautomatisierten End-to-End Tests kann ein ganzer Workflow von Benutzerinteraktionen ausgeführt und auf richtiges Verhalten getestet werden. Wir haben dazu zwei Möglichkeiten umgesetzt. Erstens mit WebdriverIO/Selenium und zweitens mit Puppeteer.

#### WebdriverIO/Selenium

Mit WebdriverIO/Selenium haben wir den Login- und den Registrierungsprozess abgedeckt.

Folgende Bedingungen müssen erfüllt sein, damit diese Tests funktionieren:
* Die Applikation muss laufen auf <code>http://localhost:3000</code>.
* Der Benutzer mit der E-Mail-Adresse "max@mustermann.com" muss mit dem Passwort "1234" vorhanden sein (dieser wird automatisch mit den Testdaten eingespielt).
* Der Chrome Browser muss installiert sein (die E2E-Tests sind so konfiguriert, dass sie diesen Browser verwenden).
* Eine Java Runtime Environment muss installiert sein (Selenium ist in Java geschrieben und benötigt darum eine Java JRE).

Für die beiden Testfälle wird je ein Browser-Fenster geöffnet, welche nach dem Beenden der Tests automatisch wieder geschlossen werden. Das Interagieren mit diesen Browser-Fenstern (z.B. manuell in ein Eingabefeld klicken) kann zu Fehlern in den Tests führen, weil man damit die Automatisierung aus dem Konzept bringen kann.

Die End-to-End Tests können mit folgendem Kommando ausgeführt werden:

```bash
npm run test-e2e
```

Bei fehlgeschlagenen Tests wird ein Screenshot gemacht und im Verzeichnis <code>./test/wdioErrorShots/</code> gespeichert.

Das folgende Video zeigt einen Testdurchlauf: [Link zum Video (e2e.wmv)](https://github.com/alc-hsr/tauschboerse/blob/master/docs/media/e2e.wmv)

#### Puppeteer

Mit Puppeteer wird auf verschiedene Seiten der Applikation navigiert und jeweils ein Screenshot gemacht, der später mit einem Referenz-Bild verglichen wird. Im Gegensatz zu den WebdriverIO/Selenium-Tests wird bei diesem Test kein Browser-Fenster geöffnet (headless).

Folgende Bedingungen müssen erfüllt sein, damit dieser Tests funktioniert:
* Die Applikation muss laufen auf <code>http://localhost:3000</code>.
* Der Benutzer mit der E-Mail-Adresse "max@mustermann.com" muss mit dem Passwort "1234" vorhanden sein (dieser wird automatisch mit den Testdaten eingespielt) und dieser Benutzer muss genau den initialen Stand aus den Testdaten haben.

```bash
npm run test-ppt
```

### c) CSS Style Tests

Der Inhalt der CSS-Dateien wird mit "Stylelint" geprüft. Webstorm und Visual Studio Code wurden mit den entsprechenden Plugins konfiguriert, damit Stylelint bereits beim Codieren Fehler anzeigt, sobald die definierten Coding Guidelines missachtet werden (Konfigurationsdatei <code>.stylelintrc</code>).
 
Die Stylelint Tests können auch manuell mit folgendem Kommando ausgeführt werden:

```bash
npm run test-css
```

### d) Echte Benutzertests

Wir liessen die Applikation auch von echten Benutzern testen. Folgende Punkte waren das Resultat aus den Benutzertests:
* Eine Testperson fand sich zuerst nicht so zurecht, was er jetzt wo machen kann. Darauf hin haben wir die Benutzerführung verbessert.
* Das Kategorie-Eingabefeld auf der Artikelerfassungsseite hat zuerst die eingegebene Kategorie nur übernommen wenn man die Enter-Taste betätigt hat. Die Testperson hat jedoch nicht die Enter-Taste betätigt, sondern direkt den Speichern-Button geklickt. Somit wurde die Kategorie nicht gespeichert. Wir haben dies dann so geändert, dass die Kategorie beim Verlassen des Feldes (focus lost) übernommen wird.
* Eine Testperson hätte erwartet, dass ein Klick auf das Logo bzw. den Applikationstitel auf die Startseite springt, wie es auch bei anderen Webseiten der Fall ist. Dies war bei uns zu diesem Zeitpunkt noch nicht so.
* Dass ein angemeldeter Benutzer auf dem Marktplatz nach seinen eigenen Artikeln sucht, ist wohl eher unwahrscheinlich, weil er ja seinen eigenen Bereich "Artikelverwaltung" hat. Eine Testperson möchte aber gerne seine Artikel auch über den Marktplatz sehen, um zu schauen, wie sie im "öffentlichen" Bereich der Applikation den anderen Benutzern präsentiert werden.

## Implementierungsdetails

### Use Cases

In den folgenden Diagrammen sind die umgesetzten Use Cases abgebildet.

#### Benutzer

![alt text](https://github.com/alc-hsr/tauschboerse/raw/master/docs/diagrams/useCases_user.png "Use Cases: Benutzer")

<dl>
  <dt>Registrieren</dt>
  <dd>Um Artikel in der Applikation tauschen zu können, muss er sich zuerst registrieren. Dies kann er tun, in dem er seine Benutzerdaten angibt und ein Passwort wählt.</dd>

  <dt>Login</dt>
  <dd>Mit der bei der Registrierung angegebenen E-Mail-Adresse und dem Passwort kann er sich dann in der Applikation anmelden.</dd>

  <dt>Logout</dt>
  <dd>Er kann sich auch wieder abmelden.</dd>

  <dt>Profil bearbeiten</dt>
  <dd>Ein registrierter Benutzer kann jederzeit seine Benutzerdaten und das Passwort ändern.</dd>

  <dt>Artikel verwalten</dt>
  <dd>In seiner Artikelverwaltung kann ein angemeldeter Benutzer neue Artikel erfassen oder bestehende Artikel bearbeiten. Er kann sie auch löschen, sofern sie noch in keinem Tauschgeschäft verwendet werden oder in einem abgeschlossenen Tauschgeschäft verwendet wurden. In diesen Fällen wird der zu löschende Artikel lediglich als gelöscht markiert, damit er nicht mehr auf dem Marktplatz erscheint.</dd>
</dl>

#### Marktplatz

![alt text](https://github.com/alc-hsr/tauschboerse/raw/master/docs/diagrams/useCases_marktplatz.png "Use Cases: Benutzer")

<dl>
  <dt>Artikel suchen</dt>
  <dd>Artikel können mittels Suchbegriffe gesucht werden. Das System stellt eine Liste der Artikel dar, die einen oder mehre Suchbegriffe im Titel und/oder in der Beschreibung haben. Oder falls einer oder mehrere Suchbegriffe Kategorien sind, werden diese ebenfalls angezeigt. Die Suchresultate werden anhand eines Gewichtungssystems sortiert. Die Titel hat die höchste Priorität, dann die Kategorie und dann die Beschreibung.</dd>

  <dt>Artikel anschauen</dt>
  <dd>Die Details eines ausgewählten Artikels können angesehen werden. Dazu muss der Benutzer nicht angemeldet sein.</dd>

  <dt>Tauschgeschäft erstellen</dt>
  <dd>Wenn ein Artikel ausgewählt wird, kann ein neues Tauschgeschäft für diesen Artikel erstellt werden. Bedingung ist, dass der Benutzer eingeloggt ist und der Artikel gehört nicht ihm.</dd>
</dl>

#### Tauschgeschäfte

![alt text](https://github.com/alc-hsr/tauschboerse/raw/master/docs/diagrams/useCases_trades.png "Use Cases: Tauschgeschäfte")

<dl>
  <dt>Tauschgeschäft anschauen</dt>
  <dd>Die Beteiligten eines Tauschgeschäftes dürfen die Details des Tauschgeschäfts anschauen.</dd>

  <dt>Tauschgeschäft bearbeiten</dt>
  <dd>Das Bearbeiten eines Tauschgeschäfts entspricht dem Erstellen oder Bearbeiten eines Angebots. Wenn ein Tauschgeschäft neu erstellt wird, wird es direkt bearbeitet. Bevor das erste Angebot unterbreitet wird, kann das Geschäft bzw. das erste Angebot beliebig bearbeitet werden. Nach dem Senden eines Angebots kann der Empfänger das Geschäft bearbeiten. In diesem Fall wird ein Gegenangebot erstellt. Wird das Angebot vom Empfänger abgelehnt oder wird das Angebot ungültig, darf der Sender das Geschäft bearbeiten. Auch in diesem Fall wird ein Gegenangebot erstellt.</dd>

  <dt>Tauschgeschäft löschen</dt>
  <dd>Ein Tauschgeschäft kann nur gelöscht werden, wenn es in Vorbereitung ist (bevor es gesendet wird). Nur der Ersteller des Angebots kann das Geschäft löschen. Ist noch kein Angebot gesendet worden, wird das ganze Tauschgeschäft physisch gelöscht. Wenn mindestens ein Angebot unterbreitet wurde, wird nur das neu erstellte Gegenangebot gelöscht.</dd>

  <dt>Angebot unterbreiten</dt>
  <dd>Der Ersteller eines Angebots oder eines Gegenangebots kann dieses dem anderen Beteiligten unterbreiten. In diesem Fall übernimmt der Unterbreiter die Rolle als Sender. Der andere Beteiligter wird automatisch zum Empfänger.</dd>

  <dt>Angebot annehmen</dt>
  <dd>Der Empfänger des aktuellen Angebots darf das Angebot anehmen. Wenn das Angebot angenommen wird, gilt das Geschäft als erfolgreich abgeschlossen.</dd>

  <dt>Angebot ablehnen</dt>
  <dd>Der Empfänger des aktuellen Angebots darf das Angebot ablehnen. Wenn das Angebot abgelehnt wird, ist der Sender wieder an der Reihe. Er kann entweder ein Gegenangebot erstellen oder das Geschäft abbrechen.</dd>

  <dt>Gegenangebot erstellen</dt>
  <dd>Ein Gegenangebot kann vom Empfänger des aktuellen Angebots erstellt werden oder vom Sender, falls der Empfänger das Angebot abgelehnt hat oder das Angebot ungültig wird.</dd>

  <dt>Tauschgeschäft abbrechen</dt>
  <dd>Der Sender des aktuellen Angebots kann das Tauschgeschäft abbrechen. Das Tauschgeschäft ist dann beendet und kann nicht mehr weitergeführt werden. Das Tauschgeschäft erscheint bei beiden Beteiligten in der Liste der abgebrochenen Geschäfte.</dd>

  <dt>Artikel zustellen</dt>
  <dd>Wenn ein Tauschgeschäft erfolreich abgeschlossen werden kann, können die Beteiligten im Tauschgeschäft vermerken, dass sie die jeweiligen Artikel den anderen ausgeliefert haben.</dd>
</dl>

### Zustandsdiagramme

Tauschgeschäfte, Angebote und Artikel durchlaufen verschiedene Zustände. In den folgenden Abschnitten sind die entsprechenden Zustandsdiagramme zu sehen.

#### Tauschgeschäft (Trade)

![alt text](https://github.com/alc-hsr/tauschboerse/raw/master/docs/diagrams/stateDiagram_trade.png "Zustandsdiagramm: Tauschgeschäft")

Wenn ein Tauschgeschäft gehandelt wird (IN_NEGOTIATION) kommen die Zustände des aktuellen Angebots zum Tragen. Der Tauschgeschäft-Zustand verlässt IN_NEGOTIATION erst wenn ein Angebot angenommen oder das Geschäft abgebrochen wird.

#### Angebot (Offer)

![alt text](https://github.com/alc-hsr/tauschboerse/raw/master/docs/diagrams/stateDiagram_offer.png "Zustandsdiagramm: Angebot")

Der Zustand eines Angebots wird in erster Linie durch direktes Handeln der beiden Beteiligten geändert. Wenn ein Artikel nicht mehr zur Verfügung steht - weil er gelöscht oder in einem anderen Geschäft erfolgreich getauscht wird - werden alle Tauschgeschäfte mit aktuellen Angeboten, die diesen Artikel enthalten, automatisch ungültig.

#### Artikel

![alt text](https://github.com/alc-hsr/tauschboerse/raw/master/docs/diagrams/stateDiagram_article.png "Zustandsdiagramm: Artikel")

Die Zustände der Artikel werden einerseits durch direktes Handeln der Artikelbesitzer geändert (Löschen), aber auch durch das Aufnehmen und das Wiederentfernen in Tauschangebote (DEALING und DEALED).

### Datenhaltung

Für dieses Projekt wurde viel Gewicht auf eine möglichst einfach aufbaubarer Entwicklungs- und Laufzeitumgebung. Der Einsatz eines DBMS hätte diese von uns gestellte Anforderung zu erreichen erschwert. Wir haben uns für <code>nedb</code> entschieden, da diese einfach gestaltet ist. Wir haben bewusst, auf die komfortableren Funktionen eines DBMS wie das Schützen der Datenintegrität wie auch die Macht von SQL verzichtet.

Nach kurzer Zeit ist uns aufgefallen, dass nedb auf asynchrone Methoden (Callbacks) setzt. Dies hat und dazu gebracht, alle Daten beim Starten des Servers in einer in-memory Cache zu laden und zu halten. Somit konnten Lesezugriffe synchron durchgeführt werden und das Auflösen der Referenzen wird vom Cache automatisch durchgeführt (Startvorgang des Servers).

Datenänderungen werden vom Cache automatisch in nedb persistiert - die Daten werden vom Cache normalisiert und entsprechend in nedb gespeichert.

### Logisches Datenmodell

![alt text](https://github.com/alc-hsr/tauschboerse/raw/master/docs/diagrams/LogicalModel.png "Datenmodell")

Obwohl <code>Offer</code> als Entität dargestellt wird, werden die Angebote jeweils in einem Array-Property der zugehörigen Tauschgeschäft (Trade) gehalten. Darum hat die Entität Offer kein _id Property.

# Rückblick

## Gut gelöst

* **Komponenten-Strukturierung (technisch):**
  * Aufteilung in sinnvolle Komponenten
  * Und dadurch starke Kohäsion (Single Responsibility Prinzip)
  * Umsetzung des Patterns mit Container und Presentational Components
* **Route Protection (Authentication):**
  * Mit generischen Routing-Komponenten sind die Routen abgesichert, so dass nur der richtige Benutzer die Seite anschauen darf.
  * Greift Benutzer auf einen Link zu, dessen Inhalt er nicht sehen darf, erscheint eine Meldung und er wird auf sein Dashboard umgeleitet.
  * Greift ein nicht angemeldeter Benutzer auf einen Link zu, dessen Inhalt er nicht sehen darf, wird er auf die Login-Seite umgeleitet, wo er sich anmelden muss. Meldet er sich nun mit dem richtigen Benutzer an, wird er automatisch auf die ursprüngliche Seite umgeleitet, auf die er nun Zugriff hat.
* **Einsatz von UI-Libraries/Packages (npm):**
  * Man muss das Rad nicht neu erfinden, darum haben wir in einige Fällen (Bildgalerie, Kuchendiagramme, Paging-Mechanismus, Chip-Eingabefeld...) diverse Libraries aus "npm" evaluiert und jeweils die passendsten davon in unserem Projekt eingebungen.
* **Benutzerführung:**
  * Von Beginn weg (Startseite/Dashboard) wird der Benutzer geführt. Es wird ihm erklärt, wo er was machen kann.
  * Je nach Zustand des Tauschgeschäfts wird dem Benutzer erklärt, was er nun machen kann/muss.
* **Lauffähig "out-of-the-box":**
  * Wir haben uns bewusst auf JavaScript/Node.js beschränkt, so dass die Applikation nicht abhängig von weiteren Technologien oder Sprachen ist.
  * Beispielsweise benötigt man keinen zusätzlichen DB-Server (MySQL).
  * Dadurch ist die Applikation einfach zu installieren.
* **Umgang mit Daten (Server):**
  * "Objektstrukturfilterung"
  * Data Cache (zusätzliche "in-memory" Datenbank)
  * Testdaten / DB-Reset

## Das nächste Mal anders

* **Wahl des Frontend-Framework besser auf das Projekt abstimmen:**
  * Material-UI ist ohne Zweifel ein gutes Framework. Dennoch sind wir in die "Pitfalls" von Frontend-Frameworks gefallen. Im Falle vom Material-UI-Framework war es vorallem das Styling von Komponenten. In der verwendeten Version kann man Styles aus externen Stylesheets nur via <code>class</code>-Attribut (bzw. <code>className</code> in React-Applikationen mit JSX) auf die Komponente anwenden, sofern diese alle mit <code>!important</code> versehen sind, was natürlich gar nicht schön ist. Die zweite Variante zum Stylen der Komponenten waren Inline-Styles zum Überschreiben der vordefinierten Styles. Letztere Variante haben wir angewendet. Gemäss Dokumentation von Material-UI wird sich dies in der nächsten Version ändern.
* **Aufteilung der Daten in Redux-Store vs. Component-State besser abwägen:**
  * Wann verwaltet man die Daten lieber im Redux-Store als im lokalen State einer Komponente? Bezüglich Wiederverwendbarkeit/Unabhängigkeit der Komponente muss man sich da gewisse Überlegungen machen.
* **Design/Struktur im Redux-Store:**
  * Auch in welcher Struktur die Daten im Redux-Store abgelegt werden, sollte man sich genug früh überlegen.
* **Design-Vorschläge:**
  * Auch die Design-Vorschläge müssen früh gemacht werden.
  * Und diese sollten keinesfalls unterschätzt oder auf die leichte Schulter genommen werden.

## Gelernt

* **React, Redux, Material-UI, etc.**
* **Teufel steckt nach wie vor im Detail**
* **Aufwand bleibt nach wie vor gross ...**
  * ... um solche Webapplikationen zu erstellen, obwohl inzwischen sehr gute Tools und Technologien vorhanden sind.
