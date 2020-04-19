# Verplaatsbewijs

## Samenvatting

Mocht ter bestrijding van het coronavirus **opschaling van maatregelen** nodig zijn omdat de huidige 'blijf thuis' afspraken op een gegeven moment bijvoorbeeld niet meer houdbaar blijken en het beleid strenger gemaakt moet worden, is een mogelijkheid om vergunningssysteem op te tuigen om mensen toe te staan zich enkel tussen bepaalde adressen te verplaatsen.

In de basis genereert het hieronder beschreven systeem een document waarbij via een QR-code gewaarborgd kan worden dat dit document niet is aangepast. Het document bevat een lijst met adressen waartussen de persoon zich mag bewegen. Bij controle kan een beambte aan de hand van de QR-code verifiëren of de persoon zich aan alle restricties houdt. Het document wordt door de burger zelf opgesteld en door middel van een eenmalig door de overheid verstrekte code ondertekend. Er worden geen naar de persoon herleidbare gegevens teruggestuurd aan de overheid en tegelijkertijd kan de burger na ondertekening het document niet meer aanpassen.

Deze oplossing biedt een situatie tussen 'blijf thuis' en 'onderneem enkel noodzakelijke reizen naar winkel of ziekenhuis' en kan daarmee de noodzaak van een volledige lock-down voorkomen. Ook is hetzelfde principe toepasbaar om bijvoorbeeld een 'coronapaspoort' uit te geven als mensen na een test immuun blijken.

## Aannamen

De beschreven methode heeft de voorkeur boven het gebruik van 'officieel briefpapier', omdat wanneer lokale instanties als gemeenten deze documenten af moeten geven zij ook belast worden met het werk van het aanmaken hiervan. Daarnaast is de kans op namaak groter bij fysieke documenten en bestaat er ook geen mogelijkheid om fraude te detecteren of (kwijtgeraakte) documenten in te trekken.

Een Verplaatsbewijs gaat hoe dan ook de vrijheid van individuen beperken. De hier beschreven methode voorkomt dat een centrale instantie toegang krijgt tot de plaatsen waar men zich wil begeven en bied in die zin relatief meer vrijheid dan een systeem waar dit in een centrale database staat.

## Demonstratie

1. Ga naar https://www.verplaatsbewijs.nl/
1. Klik op **Verplaatsbewijs aanmaken**
1. Vul alle velden in en klik op **Verplaatsbewijs aanmaken**
   * Bij een daadwerkelijke implementatie zal tijdens deze stap `Code 1` bestaande uit `Uitnodigingscode` en `Volledige naam` vergeleken worden met wat in de database beschikbaar is, en de aangemaakte `Code 2` in de database worden weggeschreven. In deze demonstratie zelf aangeven worden met 'OK' dat dit het geval is of met 'Annuleren' dat er een fout is opgetreden.
1. Print of sla de QR-code op.
1. Open een QR-code scanner.
1. Scan de QR-code van het Verplaatsbewijs.
1. Open de link, er wordt nu getoond of het document geldig is of niet.

Mogelijke manieren om hier van af te wijken en andere scenario's te testen:

* Pas na het scannen en openen van de QR-code, de link aan en open de nieuwe link. Het kan nodig zijn om de webpagina te herladen (F5). Elke wijziging in de link resulteert in een scherm dat toont dat het Verplaatsbewijs ongeldig is.

## Vereisten

* Burger:
   * Smartphone met internettoegang of een computer met printer. Als burger niet hier over beschikt, kunnen gemeenten dit faciliteren via bijvoorbeeld wijkcentra of bezoeken aan de voordeur.
* Beambte:
   * Smartphone met camera, internettoegang en webbrowser.
   * Optioneel: App die QR-codes kan scannen.
* Overheid:
   * Database met lijst voor- en achternamen van alle inwoners in Nederland, aangevuld met een unieke `Uitnodigingscode`, een hieruit gegenereerde `Code 1`, en voor personen die al een Verplaatsbewijs hebben aangemaakt, een `Code 2`.
   * Webserver infrastructuur met hoge beschikbaarheid.

## Processchema

Hieronder staat beschreven hoe een verplaatsbewijs wordt aangemaakt en hoe controle daarna plaats dient te vinden.

### Verplaatsbewijs aanmaken

1. Burger ontvangt brief van overheid met een willekeurig gegenereerde `Uitnodigingscode`.
1. Burger gaat naar https://www.verplaatsbewijs.nl/, kiest voor **Verplaatsbewijs aanmaken** en vult de volgende gegevens in:
   * De `Uitnodigingscode`;
   * De **volledige voor- en achternaam** zoals geschreven op identiteitsbewijs;
   * **Postcode en huisnummer** van huidige verblijfplaats;
   * **Postcode en huisnummer** van plaatsen waar de persoon tussen wil kunnen reizen;
1. Apparaat van burger genereert nu automatisch een `Willekeurige Code`.
1. Burger klikt op **Verplaatsbewijs aanmaken**.
1. Apparaat van burger genereert twee codes via een SHA512/256-hash:
   * `Code 1`: SHA512_256(`Uitnodigingscode` + **Volledige naam**)
   * `Code 2`: SHA512_256(`Code 1` + **Volledige naam** + **Lijst postcodes** + `Willekeurige Code`)
1. Alleen `Uitnodigingscode`, `Code 1` en `Code 2` worden teruggestuurd naar https://www.verplaatsbewijs.nl/
   * Aan de hand van `Code 1` valideert https://www.verplaatsbewijs.nl/ dat de juiste persoon dit heeft ingevuld. Als `Code 1` juist is, wordt `Code 2` opgeslagen in deze centrale database.
1. Apparaat van burger toont een **document met QR-code** waar de **volledige naam**, **alle postcode en huisnummercombinaties** plus `Uitnodigingscode`, `Code 1` en `Code 2` in verwerkt zijn.
   * Dit document kan worden afgedrukt of op een mobiel apparaat worden opgeslagen.

## Verplaatsbewijs controleren

1. Bij controle toont burger het **document met QR-code** en een **identificatiebewijs** aan beambte. 
1. Beambte gebruikt een app op de eigen telefoon om de QR-code te scannen of gaat naar https://www.verplaatsbewijs.nl/ en kiest voor **Verplaatsbewijs scannen**.
1. Het apparaat van beambte opent nu de link die uit de QR-code is gelezen.
1. Beambte controleert dat het adres in de browser begint met https://www.verplaatsbewijs.nl/.
1. Het apparaat van beambte controleert via website in centrale database of Code 2 overeenkomt met de opgeslagen versie die hoort bij Uitnodigingscode en toont een waarschuwing wanneer dit niet zo is.
1. Het apparaat van beambte controleert of de `Uitnodigingscode` en **volledige naam** leiden tot een juiste `Code 1` en toont een waarschuwing wanneer dit niet zo is.
1. Het apparaat van beambte controleert of `Code 1`, **volledige naam**, **lijst met postcodes** en `Willekeurige Code` samen leiden tot een juiste `Code 2` en toont een waarschuwing wanneer dit niet zo is.
1. Beambte controleert of de **volledige naam** die wordt getoond op het scherm overeenkomt met de **naam op het identificatiebewijs**.
1. Beambte stelt vast dat burger reist tussen twee van de opgegeven adressen.

## Technische details QR-code

De door dit systeem gegenereerde QR-code bevat een hyperlink in het volgende formaat:

* Voorbeeld:
   * https://www.verplaatsbewijs.nl/ABCDEFGHJKMNPQRS/5f1deb75d37f72114e74414bbdd72ba9ef0acdfe2f018403fe555e58d94e25d9/#7630a5476f214b5ec72b4c92c6f7c7d5ea4a85ae834fadc1eefbd80005b80e2d/e6646259ab11c19f9e06be862b703c75e1ecd8cb14a02f7382a1a8d8451bc37e/JANJANSEN/1000AA1/2000AA22/3000AA333/4000AA444A/5000AA555BIS
* Uitwerking:
   * https://www.verplaatsbewijs.nl/`Uitnodigingscode`/`Code 2`/#`Code 1`/`Willekeurige code`/`Volledige naam`/`Postcode en huisnummer 1`/`Postcode en huisnummer 2`/`Postcode en huisnummer 3`/`Postcode en huisnummer 4`/`Postcode en huisnummer 5`
* Parameters:
   * `Uitnodigingscode` - Afgegeven door de overheid en persoonsgebonden.
   * `Code 1` - Verkregen uit formule SHA512_256(`Uitnodigingscode` + `Volledige naam`). Bekend bij overheid. Waarborgt dat `Uitnodigingscode` alleen gebruikt kan worden door de persoon waar deze aan uit is gegeven.
   * `Code 2` - Verkregen uit formule SHA512_256(`Code 1` + `Volledige naam` + `Lijst postcode en huisnummers` + `Willekeurige Code`). Wordt door het apparaat van burger vastgesteld en opgestuurd aan de overheid. Overheid slaat deze code op. Waarborgt dat er geen wijzigingen aangebracht kunnen worden in de overige gegevens.
   * `Willekeurige code` - Vastgesteld door het apparaat van burger. Dient als 'salt'. Waarborgt dat het onmogelijk is voor iemand die bekend is met `Uitnodigingscode`, `Code 1`, `Code 2`, en `Volledige naam` om door middel van brute-force de `Lijst postcode en huisnummers` te achterhalen.
   * `Volledige naam` - Volledige naam van de persoon zoals in het identiteitsbewijs. Bestaat volledig uit hoofdletters. Alle tekens behalve de letters A tot en met Z worden weggefiltert.
   * `Lijst postcodes en huisnummers` - In formaat `1000AA12345bis`. Combinaties worden van elkaar gescheiden door middel van het `/`-teken.

Noot: De broncode behorende bij deze demonstratie is niet aan een database gekoppeld en slaat `Code 2` dus **niet** op. Ook kan het `Code 1` en `Code 2` niet controleren. Bij daadwerkelijke implementatie is van belang dat dit wel gebeurd.

## Privacy- en veiligheidsassessment

Dit systeem stelt burgers volledig in controle over haar eigen data. Behalve `Code 2` welke middels gebruik van de SHA512/256-hash niet te herleiden is tot de verdere ingevulde persoonlijke gegevens, ontvangt de overheid geen gegevens over de burger die zij niet al heeft.

Algemene voorzorgsmaatregelen:

#|Voorzorgsmaatregel
-|------------------
A|Er wordt voorkomen dat de overheid kennis kan nemen van de gekozen `Lijst postcodes en huisnummers` doordat deze gegevens nooit als klare tekst via de digitale weg worden teruggekoppeld. Zo wordt bij het aanmaken van een Verplaatsbewijs enkel `Code 2` opgestuurd aan de overheid. Bij het scannen en controleren van een Verplaatsbewijs wordt de `Lijst postcodes en huisnummers` in de link na het `#`-teken geplaatst. De HTTP standaard zorgt er voor dat gegevens achter het `#`-teken niet naar de server worden gezonden maar alleen door het apparaat van de persoon die deze link opent beschikbaar is. Naleving van deze voorzorgsmaatregel kan ten alle tijden door een ieder worden vastgesteld.

Mogelijke aanvalsmethoden en de genomen voorzorgsmaatregelen bij **Verplaatsbewijs aanmaken**:

#|Aanval|Voorzorgsmaatregel
-|------|------------------
1|Aanvaller zou zelf een `Uitnodigingscode` kunnen bedenken.|Elke `Uitnodigingscode` behoort tot een enkel individu. Bij controle van een Verplaatsbewijs wordt gecontroleerd of de opgegeven `Uitnodigingscode` en `Volledige naam` samen leiden tot `Code 1`. Deze `Code 1` zit ook verwerkt in `Code 2` waarvan een kopie is opgeslagen in de database en die ook geverifieerd wordt.
2|Aanvaller zou een `Uitnodigingscode` van iemand anders kunnen gebruiken.|Zelfde scenario en voorzorgsmaatregel als **Aanval 1**.
3|Aanvaller zou de `Volledige naam` in de QR-code kunnen aanpassen.|Zelfde scenario en voorzorgsmaatregel als **Aanval 1**. De `Volledige naam` is verwerkt in `Code 2`. Enige aanpassing zorgt dat `Code 2` niet meer overeen komt met de opgeslagen versie.
4|Aanvaller zou de `Lijst postcodes en huisnummers` aan kunnen passen.|Zelfde scenario en voorzorgsmaatregel als **Aanval 1**. De `Lijst postcodes en huisnummers` is verwerkt in `Code 2`. Enige aanpassing zorgt dat `Code 2` niet meer overeen komt met de opgeslagen versie.
5|Aanvaller zou aanpassingen kunnen maken en alsnog een valide `Code 2` kunnen genereren door de `Willekeurige code` aan te passen.|Dit is in theorie mogelijk. Echter, op dit moment is er een behoorlijke hoeveelheid computerkracht benodigd om met de SHA512/256 functie twee verschillende stukken tekst tot dezelfde uitkomst te laten leiden aangezien elke verandering opnieuw uitgerekend moet worden. De uitkomst van de SHA512/256 methode bestaat uit 64 plaatsen die elk uit 16 verschillende tekens kunnen bestaan, wat zorgt voor 16^64=1,1579208923731619542357098500869e+77 combinaties die maximaal afgelopen dienen te worden.
6|Aanvallers zouden de hand kunnen leggen op de centrale database en zo een lijst met `Uitnodigingscode` en `Volledige naam` kunnen bemachtigen.|In dit geval kan een aanvaller voor elke combinatie een `Code 2` aan kunnen maken. Aanvaller kan geen geldig Verplaatsbewijs voor zichzelf genereren met de gegevens van andere personen, behalve als er iemand anders in de lijst staat met exact dezelfde `Volledige naam`. Mocht een inbreuk worden geregistreerd, kan aan alle inwoners een nieuwe `Uitnodigingscode` toegestuurd worden en de oude buiten werking gesteld.

Mogelijke aanvalsmethoden en de genomen voorzorgsmaatregelen bij **Verplaatsbewijs controleren**:

#|Aanval|Voorzorgsmaatregel
-|------|------------------
7|Aanvaller zou een QR-code aan kunnen maken die met een andere URL begint, om zo de beambte een andere pagina voor te schotelen.|Beamten worden geïnstrueerd om te controleren dat de pagina in de adresbalk begint met https://www.verplaatsbewijs.nl/ na het uitlezen van elke QR-code.
8|Aanvaller zou het identiteitsbewijs van een ander persoon bij zich kunnen dragen.|Beamten zijn opgeleid om echtheidskenmerken van identiteitsbewijzen te controleren. Daarnaast zit in veel identiteitsbewijzen een chip die via bij twijfel met RFID uitgelezen kunnen worden. Deze chip bevat onder meer de naam van de persoon en de foto zoals deze op het identiteitsbewijs zou moeten staan.
9|Aanvaller zou delen van de QR-code aan kunnen passen, zoals `Volledige naam`.|Zelfde scenario en voorzorgsmaatregel als **Aanval 1**. Enige aanpassing zorgt dat `Code 2` niet meer overeen komt met de opgeslagen versie.

Scenario's die mogelijk kunnen leiden tot schending van de privacy:

#|Aanval|Voorzorgsmaatregel
-|------|------------------
10|Centrale database kan uitlekken.|In dit geval wordt alleen een lijst met `Volledige naam` verkregen. Hoewel een schending van de privacy, zijn de personen op de lijst an sich niet te herleiden tot natuurlijke personen.
11|Iemand kan zijn Verplaatsbewijs kwijtraken.|In dit geval kan via contact met een overheidsinstantie, de `Uitnodigingscode` worden ingetrokken en opnieuw worden aangemaakt. Hierna kan de persoon een nieuw Verplaatsbewijs aanvragen en wordt de oorspronkelijke buiten werking gesteld.
12|Iemand vind het Verplaatsbewijs van iemand anders.|De vinder weet nu de `Volledige voornaam` en `Lijst postcodes en huisnummers`. De originele houder van het Verplaatsbewijs kan ontkennen dat dit een door haar opgegeven `Lijst postcodes en huisnummers` is met als argument dat iemand haar `Uitnodigingscode` onderschept moet hebben en zonder medeweten van de originele houder het Verplaatsbewijs uit haar naam moet hebben aangemaakt.

## Licentievoorwaarden

De in dit document beschreven oplossing mag kosteloos worden geïmplementeerd en gebruikt. De beschreven methode en alle beschikbare broncode mag vrij gebruikt en gedeeld worden, in de hoop dat dit kan dienen tot verdere innovatie en oplossing van deze crisis.