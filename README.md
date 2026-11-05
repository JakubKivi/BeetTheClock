# Beet The Clock

<p align="center">
  <img src="./assets/beet_outline.png" width="160" alt="Beet The Clock logo">
</p>

<p align="center">
  <a href="./README.md"><img src="https://img.shields.io/badge/English-401B32?style=for-the-badge" alt="English"></a>
  <a href="./README_PL.md"><img src="https://img.shields.io/badge/Polski-47502B?style=for-the-badge" alt="Polski"></a>
</p>

Beet The Clock is a mobile guide to seasonal fruit and vegetables. Check what's
in season, save favorites, and get practical information about choosing and
storing produce.

Built with React Native, Expo, and TypeScript. The starter data covers Poland;
the interface is available in English and Polish.

## Features

- **Seasonal produce:** Browse what's available in the selected region.
- **Product guides:** Find buying and storage tips, nutrition information, and
  recipes.
- **Personal notes and recipes:** Add your own notes and recipes to products.
- **Reminders:** Get optional monthly, weekly, or daily notifications with
  seasonal picks, newly in-season favorites, and occasional end-of-season
  reminders.
- **More languages and regions:** Import language translations and regional
  produce data.

## Seasonality

Seasonality estimates for Poland draw on [Statistics Poland agricultural data](https://stat.gov.pl/en/topics/agriculture-forestry/agriculture/),
the [Statistical Yearbook of Agriculture](https://stat.gov.pl/en/topics/statistical-yearbooks/statistical-yearbooks/statistical-yearbook-of-agriculture-2025,6,20.html),
and [Eurostat Comext trade statistics](https://ec.europa.eu/eurostat/web/international-trade-in-goods/database).

Nutrition values are approximate raw-food references per 100 g from [USDA
FoodData Central](https://fdc.nal.usda.gov/) where available. Values vary by
variety and growing conditions; micronutrient highlights are qualitative, not
complete quantitative profiles. General produce-selection and safe-handling
guidance references the FDA's [Selecting and Serving Produce Safely](https://www.fda.gov/food/buy-store-serve-safe-food/selecting-and-serving-produce-safely);
storage guidance also references the USDA [FoodKeeper](https://www.foodsafety.gov/keep-food-safe/foodkeeper-app).
Numeric nutrition is included only when a matching reference is available;
missing values are not estimated.

## Data format

The `data/` directory contains example language and regional JSON files:

```text
locales/
  en.json                 # App interface translations
  pl.json
regions/
  PL.json                 # Region code and product data
  PL/
    en.json               # Region and product translations
    pl.json
```

An app-language file has a `name` and a `translations` object:

```json
{
  "name": "English",
  "translations": {
    "app.title": "Beet The Clock"
  }
}
```

A region file has a `code` and a `produce` array. Each product requires an
`id`, `rarity` (an integer from 1 to 5), and `seasonality.months` (zero-based:
`0` is January and `11` is December). `bestMonths`, `wikipediaUrl`,
`nutritionItems`, and `defaultRecipeIds` are optional.
When used, `bestMonths` should be a concise peak of at most four months within
`months`; omit it if no distinct peak is supported, rather than forcing one for
year-round produce.

For example:

```json
{
  "code": "PL",
  "produce": [
    {
      "id": "beetroot",
      "rarity": 1,
      "seasonality": {
        "months": [8, 9, 10, 11],
        "bestMonths": [8, 9, 10, 11]
      },
      "nutritionItems": [
        { "nutrient": "energy", "amount": 43, "unit": "kcal" }
      ],
      "defaultRecipeIds": ["roasted-beetroot"]
    }
  ]
}
```

Regional translation files have a `name` and a `produce` object keyed by
product ID. Each product can have a translated `name`, `selectionGuide`,
`storageGuide`, `nutritionalInfo`, and `recipes`. Recipe entries have a `name`
and `instructions`. The shared nutrition disclaimer is the
`details.nutritionNote` key in each app-language file, not a per-product field.
Files with invalid JSON structure or field types are rejected when loaded or
imported.

```json
{
  "name": "Poland",
  "produce": {
    "beetroot": {
      "name": "Beetroot",
      "selectionGuide": "Choose firm roots with smooth skin.",
      "storageGuide": "Keep unwashed in the fridge.",
      "recipes": {
        "roasted-beetroot": {
          "name": "Roasted beetroot",
          "instructions": "Roast until tender."
        }
      }
    }
  }
}
```

See the [example data files](https://github.com/JakubKivi/BeetTheClock/tree/main/data)
for complete examples.

## Download

1. Open the [latest GitHub release](https://github.com/JakubKivi/BeetTheClock/releases).
2. Download the `.apk` file and install it on an Android device. Android may
   ask you to allow installation from unknown sources.

## Run from source

Requirements: Node.js and npm.

```sh
git clone https://github.com/JakubKivi/BeetTheClock.git
cd BeetTheClock
npm install
npx expo start
```

Run tests with `npm test`.

## Contributing

Contributions are welcome, especially additional regional seasonality data and
translations.
