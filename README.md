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
- **Reminders:** Get monthly, weekly, or daily notifications, optionally for
  favorites only.
- **More languages and regions:** Import language translations and regional
  produce data.

## Seasonality

Seasonality months estimate fresh retail availability in Poland, including
imports, greenhouse crops, and stored domestic produce. `bestMonths` indicates
the estimated domestic fresh-harvest peak or, for import-only produce, a broad
peak in exporter regions. These estimates do not guarantee product origin or
availability in a particular shop.

The estimates draw on [Statistics Poland agriculture data](https://stat.gov.pl/en/topics/agriculture-forestry/agriculture/)
and [Eurostat Comext trade data](https://ec.europa.eu/eurostat/web/international-trade-in-goods/database).
Monthly import flows by product and origin have not been analyzed.

Nutrition values are approximate raw-food references per 100 g from USDA
FoodData Central where available. Values vary by variety.

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
`storageGuide`, `nutritionalInfo`, `nutritionNote`, and `recipes`. Recipe
entries have a `name` and `instructions`.

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
