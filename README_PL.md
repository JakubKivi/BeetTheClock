# Beet The Clock

<p align="center">
  <img src="./assets/beet_outline.png" width="160" alt="Logo Beet The Clock">
</p>

<p align="center">
  <a href="./README.md"><img src="https://img.shields.io/badge/English-401B32?style=for-the-badge" alt="English"></a>
  <a href="./README_PL.md"><img src="https://img.shields.io/badge/Polski-47502B?style=for-the-badge" alt="Polski"></a>
</p>

Beet The Clock to mobilny przewodnik po sezonowych warzywach i owocach.
Sprawdź, co jest w sezonie, zapisuj ulubione produkty i korzystaj z praktycznych
wskazówek dotyczących wyboru oraz przechowywania.

Aplikacja korzysta z React Native, Expo i TypeScript. Startowy zestaw danych
obejmuje Polskę, a interfejs jest dostępny po polsku i angielsku.

## Funkcje

- **Sezonowe produkty:** przeglądaj produkty dostępne w wybranym regionie.
- **Poradniki:** sprawdź, jak wybierać i przechowywać produkty, oraz poznaj ich
  wartości odżywcze i przepisy.
- **Własne notatki i przepisy:** dodawaj je do poszczególnych produktów.
- **Powiadomienia:** ustaw przypomnienia miesięczne, cotygodniowe lub codzienne
  z sezonowymi propozycjami, nowymi ulubionymi i okazjonalnymi informacjami
  o kończącym się sezonie.
- **Dodatkowe języki i regiony:** importuj tłumaczenia oraz dane sezonowe.

## Sezonowość

Miesiące sezonu szacują dostępność świeżych produktów w polskich sklepach,
uwzględniając import, uprawy szklarniowe i krajowe zapasy. Aplikacja oznacza także
szacowany szczyt krajowych zbiorów albo — dla produktów dostępnych wyłącznie
z importu — przybliżony szczyt sezonu w regionach eksportujących. Szacunki nie
gwarantują pochodzenia ani dostępności produktu w konkretnym sklepie.

Oficjalne źródła to [dane rolnicze GUS](https://stat.gov.pl/obszary-tematyczne/rolnictwo-lesnictwo/)
i [Rocznik Statystyczny Rolnictwa](https://stat.gov.pl/en/topics/statistical-yearbooks/statistical-yearbooks/statistical-yearbook-of-agriculture-2025,6,20.html);
[Eurostat Comext](https://ec.europa.eu/eurostat/web/international-trade-in-goods/database)
udostępnia miesięczne przepływy handlowe według produktu i kraju partnera.
Źródła te opisują produkcję krajową i handel, a nie dostępność w sklepach.
Klasyfikacje handlowe mogą łączyć różne produkty (np. świeżą marchew i rzepę),
a szczyt importu nie dowodzi, że świeży produkt znajduje się na sklepowej półce.
Kalendarz ma więc charakter orientacyjny i nie jest zweryfikowanym zestawieniem
dostępności detalicznej dla każdego produktu i miesiąca.

Wartości odżywcze to przybliżone dane dla surowych produktów na 100 g,
pochodzące z [USDA FoodData Central](https://fdc.nal.usda.gov/), gdy są
dostępne. Wartości różnią się zależnie od odmiany i warunków uprawy; wyróżnione
mikroskładniki mają charakter jakościowy i nie są pełnymi profilami ilościowymi.
Ogólne wskazówki dotyczące przechowywania opierają się również na bazie
[USDA FoodKeeper](https://www.foodsafety.gov/keep-food-safe/foodkeeper-app).
Ogólne wskazówki wyboru i bezpiecznego obchodzenia się z produktami uwzględniają
wytyczne FDA [Selecting and Serving Produce Safely](https://www.fda.gov/food/buy-store-serve-safe-food/selecting-and-serving-produce-safely).
Dane liczbowe są podawane tylko wtedy, gdy dostępne jest dopasowane źródło;
brakujących wartości nie szacujemy.

## Format danych

Katalog `data/` zawiera przykładowe pliki JSON z tłumaczeniami i danymi
regionalnymi:

```text
locales/
  en.json                 # Tłumaczenia interfejsu aplikacji
  pl.json
regions/
  PL.json                 # Kod regionu i dane produktów
  PL/
    en.json               # Tłumaczenia regionu i produktów
    pl.json
```

Plik języka aplikacji zawiera pola `name` i `translations`:

```json
{
  "name": "Polski",
  "translations": {
    "app.title": "Beet The Clock"
  }
}
```

Plik regionu zawiera `code` oraz tablicę `produce`. Każdy produkt wymaga pól
`id`, `rarity` (liczba całkowita od 1 do 5) i `seasonality.months` (miesiące
numerowane od zera: `0` to styczeń, `11` to grudzień). Pola `bestMonths`,
`wikipediaUrl`, `nutritionItems` i `defaultRecipeIds` są opcjonalne.
Jeśli podano `bestMonths`, powinno obejmować zwięzły szczyt trwający najwyżej
cztery miesiące i zawierać się w `months`. Należy je pominąć, gdy nie ma
uzasadnionego, wyraźnego szczytu, zamiast wymuszać go dla produktu dostępnego
przez cały rok.

Przykład:

```json
{
  "code": "PL",
  "produce": [
    {
      "id": "burak",
      "rarity": 1,
      "seasonality": {
        "months": [8, 9, 10, 11],
        "bestMonths": [8, 9, 10, 11]
      },
      "nutritionItems": [
        { "nutrient": "energy", "amount": 43, "unit": "kcal" }
      ],
      "defaultRecipeIds": ["pieczony-burak"]
    }
  ]
}
```

Plik tłumaczeń regionu zawiera pola `name` i `produce` — obiekt z tłumaczeniami
przypisanymi do identyfikatorów produktów. Produkt może mieć przetłumaczone
pola `name`, `selectionGuide`, `storageGuide`, `nutritionalInfo` i `recipes`.
Wpis przepisu zawiera `name` oraz `instructions`. Wspólna informacja o danych
odżywczych znajduje się w kluczu `details.nutritionNote` pliku języka
aplikacji, a nie osobno przy każdym produkcie. Pliki z nieprawidłową strukturą
JSON lub typami pól są odrzucane podczas wczytywania lub importu.

```json
{
  "name": "Polska",
  "produce": {
    "burak": {
      "name": "Burak",
      "selectionGuide": "Wybieraj jędrne korzenie o gładkiej skórce.",
      "storageGuide": "Przechowuj nieumyte buraki w lodówce.",
      "recipes": {
        "pieczony-burak": {
          "name": "Pieczony burak",
          "instructions": "Piecz do miękkości."
        }
      }
    }
  }
}
```

Zobacz [przykładowe pliki danych](https://github.com/JakubKivi/BeetTheClock/tree/main/data),
aby poznać pełny format.

## Pobieranie

1. Otwórz [najnowsze wydanie na GitHubie](https://github.com/JakubKivi/BeetTheClock/releases).
2. Pobierz plik `.apk` i zainstaluj go na urządzeniu z Androidem. Może być
   konieczne zezwolenie na instalowanie aplikacji z nieznanych źródeł.

## Uruchomienie ze źródeł

Wymagane: Node.js i npm.

```sh
git clone https://github.com/JakubKivi/BeetTheClock.git
cd BeetTheClock
npm install
npx expo start
```

Testy uruchomisz poleceniem `npm test`.

## Współtworzenie

Zapraszamy do współtworzenia, szczególnie danych o sezonowości w kolejnych
regionach i tłumaczeń.
