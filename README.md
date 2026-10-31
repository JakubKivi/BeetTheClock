# Beet The Clock

<p align="center">
  <img src="./assets/beet.png" width="160" alt="Beet The Clock logo">
</p>

Beet The Clock is a mobile guide to seasonal fruit and vegetables. Browse what
is available for the selected region, learn how to choose and store produce,
and keep useful recipes and notes together.

The app is built with React Native, Expo, and TypeScript. It currently includes
English and Polish interface translations and a starter data pack for Poland.

## Features

### Browse seasonal produce

- See produce grouped into **Available** and **Unavailable** for the selected
  region and the app's reference month.
- Search the produce list by name and filter it to favorites.
- View seasonal and peak-season months when opening a product.
- Share a seasonal pick through SMS.

### Product details

- Read buying and storage tips where available.
- Browse approximate nutrition information and starter recipes when provided
  by the regional data.
- Add, edit, and delete your own recipes and product notes. These are saved
  with the app's local settings.

### Reminders and settings

- Choose English or Polish, or import additional app-language files.
- Select a region or import regional data and translations.
- Schedule local seasonal reminders monthly, weekly, or daily, choose a time,
  and optionally limit reminders to favorites.

## Seasonality and nutrition

Seasonality months estimate fresh retail availability in Poland, including
imports, greenhouse crops, and stored domestic produce. When available,
`bestMonths` indicates the domestic fresh-harvest peak or, for import-only
produce, a broad peak in exporter regions. These are estimates, not guarantees
of origin or availability in a particular shop; harvests and retail supply vary
by year.

The estimates are informed by a
[Polish produce seasonality calendar](https://piknikofresh.pl/kalendarz-sezonowosci-warzyw-i-owocow/),
[Statistics Poland agriculture data](https://stat.gov.pl/en/topics/agriculture-forestry/agriculture/),
and [Eurostat Comext trade data](https://ec.europa.eu/eurostat/web/international-trade-in-goods/database).
Product-by-origin monthly import flows have not been analyzed, so trade and
harvest data cannot confirm a product's origin or availability in a specific
shop.

Nutrition values are approximate raw-food references per 100 g from USDA
FoodData Central where available. Values vary by variety.

## Data packs

The [`data/`](./data) folder contains the bundled starter data. On first launch,
the app copies it into its private app storage and loads it automatically.
Additional JSON files can be imported from **Settings**; adding data this way
does not require rebuilding the app.

The data directory uses this layout:

```text
locales/
  en.json                 # App interface strings and language name
  pl.json
regions/
  PL.json                 # Region code and language-neutral product data
  PL/
    en.json               # Region and product translations
    pl.json
```

App-language files contain a `name` and a `translations` object:

```json
{
  "name": "English",
  "translations": {
    "app.title": "Beet The Clock"
  }
}
```

A regional data file contains a region `code` and a `produce` array. Each
product needs an `id`, a `rarity` from 1 to 5, and `seasonality.months` using
zero-based month numbers (`0` = January, `11` = December). `bestMonths`,
`nutritionItems`, and `defaultRecipeIds` are optional.

Regional translation files contain a `name` and translations keyed by product
ID. Product translations can include a name, buying and storage guides,
nutrition text, and recipe names and instructions.

To extend the data:

1. **Add a language:** import an app-language file such as
   `locales/de.json`, plus matching translation files for the regions you want
   to support.
2. **Add products:** add product entries to a region file and translations for
   those product IDs under `regions/<code>/<language>.json`.
3. **Add a region:** add `regions/<code>.json` and any regional translation
   files under `regions/<code>/`.

Use the **+** button beside **Language** or **Region** in Settings to import
files. Import app-language files beside Language. Beside Region, import a
region data file and its translations together, or import translations for
the currently selected region. Multiple JSON files can be selected at once.
The [starter data files](https://github.com/JakubKivi/BeetTheClock/tree/main/data)
can be used as examples.

## Download

1. Open the [latest GitHub release](https://github.com/JakubKivi/BeetTheClock/releases).
2. Download its `.apk` file.
3. Install it on an Android device. Android may ask you to allow installation
   from unknown sources.

## Run from source

Requirements: Node.js and npm.

```sh
git clone https://github.com/JakubKivi/BeetTheClock.git
cd BeetTheClock
npm install
npx expo start
```

To run the test suite:

```sh
npm test
```

## Contributing

Contributions are welcome, especially additional regional seasonality data,
nutrition information, recipes, and translations.
