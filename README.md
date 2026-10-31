# 🕒 BeetTheClock - Seasonal Produce Tracker

<p align="center">
  <img src="./assets/beet.png" width="200" alt="BeetTheClock Logo">
</p>

## Overview

BeetTheClock is a React Native/Expo (TypeScript) app for tracking seasonal produce.

## Features

- **Mainly:** See what's currently in season this month.
- **Favorites**
- **Custom images:** Replace the default app logo on a produce card with an image from the gallery. Items even have rarity levels – 'Gotta catch them all' xd.
- **Shelf availability:** Rarity estimates how hard fresh produce is to find in Polish shops; higher levels mean harder to find.
- **Smart buying & Storage:** Get tips on what to look out for when buying and how to properly store your produce.
- **Languages & Region:** Available in English and Polish. Seasonality estimates currently cover Poland only.
- **Notifications:** Choose monthly, weekly, or daily seasonal reminders, optionally limited to favorites.
- **Nutrition & recipes:** Product details include approximate nutrition references and starter recipes.
- **SMS:** Share seasonal picks with friends... And about the app...

### Road to v1.0 (Ideas)

- Custom notes for products.
- Export/Import for saved data.
- Custom products.

Contributions are welcome! I am open to pull requests, especially for additional
regional seasonality data, nutrition information, recipes, and translations.

The region selector lists the regions available in the selected data folder;
the starter pack currently covers Poland only. Notification reminders can be
scheduled for the start of each month, on a selected weekday, or daily, at a
chosen local time. Nutrition values are approximate USDA FoodData Central
references where available; recipes are starter suggestions.

Seasonality months estimate fresh retail availability in Poland, including
imports, greenhouse crops, and stored domestic produce. `bestMonths` indicates
the domestic fresh-harvest peak when there is a local crop, or a broad
exporter-region peak for import-only produce. These are seasonal estimates,
not guarantees of product origin or availability in every shop; imports and
retail supply vary by year. The estimates are informed by a
[Polish produce seasonality calendar](https://piknikofresh.pl/kalendarz-sezonowosci-warzyw-i-owocow/),
[Statistics Poland agriculture data](https://stat.gov.pl/en/topics/agriculture-forestry/agriculture/),
and [Eurostat Comext trade data](https://ec.europa.eu/eurostat/web/international-trade-in-goods/database).
We have not analyzed product-by-origin monthly import flows; trade and harvest
data do not guarantee availability or origin in a specific shop.

### Tech Stack

- React Native (Expo)
- TypeScript

### Regional seasonal data

The `data/` folder in the repository is the starter data pack. On first launch,
the app automatically copies this pack into its persistent app storage and
loads it; no setup or folder selection is required. The app-owned data directory
has this layout:

```text
locales/
  en.json                 # App UI strings and language name
  pl.json
regions/
  PL.json                 # Region code and language-neutral product data
  PL/
    en.json               # Region and product translations
    pl.json
```

App UI translations use `{ "name": "...", "translations": { "key": "value" } }`.
Region translation files use `{ "name": "...", "produce": { "<product-id>":
{ "name": "...", "selectionGuide": "...", "storageGuide": "...",
"nutritionalInfo": "...", "nutritionNote": "...", "recipes": { "<recipe-id>":
{ "name": "...", "instructions": "..." } } } } }`. Region data files contain
`code` and a `produce` array. Each product needs an `id`, rarity from 1 to 5,
and `seasonality.months` (zero-based: `0` = January, `11` = December);
`bestMonths`, nutrition data, and default recipe IDs are optional.

To add a language, place its app strings in `locales/<language>.json` and add
matching region translations in `regions/<code>/<language>.json`. To add a
product, add it to a region's `produce` array and add its translations under
the same ID. To add a region, add `regions/<code>.json` and its optional
language files under `regions/<code>/`. These additions do not require
rebuilding the app. The app's default data directory is private app storage;
you can add files without leaving the app using the **+** button beside
Language or Region in Settings. The Language button imports app UI language
files named `<language>.json`. The Region button imports either a region data
file named `<code>.json` or translation files named `<language>.json` for the
currently selected region. Multiple JSON files can be selected at once.
When importing a new region, select its region JSON and any translations
together so the app can associate all files with that region. Import app UI
translations separately using the **+** button beside Language.

### Download

1. Go to the [Releases](../../releases) page.
2. Download the `.apk` file from the latest release.
3. Install it on your Android device (you might need to allow "Unknown Sources").

### Run from Source

1. Clone the repository.
2. Run `npm install`.
3. Start the project with `npx expo start`.
