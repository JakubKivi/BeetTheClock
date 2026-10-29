# 🕒 BeetTheClock - Seasonal Produce Tracker

<p align="center">
  <img src="./assets/icon.png" width="200" alt="BeetTheClock Logo">
</p>

## Overview

BeetTheClock is a React Native/Expo (TypeScript) app for tracking seasonal produce.

## Features

- **Mainly:** See what's currently in season this month.
- **Favorites**
- **Custom images:** Replace the default app logo on a produce card with an image from the gallery. Items even have rarity levels – 'Gotta catch them all' xd.
- **Smart buying & Storage:** Get tips on what to look out for when buying and how to properly store your produce.
- **Languages & Region:** Available in English and Polish. Seasonality estimates currently cover Poland only.
- **Notifications:** Choose monthly, weekly, or daily seasonal reminders, optionally limited to favorites.
- **Nutrition & recipes:** Product details include approximate nutrition references and starter recipes.
- **SMS:** Share seasonal picks with friends... And about the app...

### Road to v1.0 (Ideas)

- Custom notes for products.
- Export/Import for saved data.
- Custom products.
- Region selection and seasonal datasets for additional countries.

Contributions are welcome! I am open to pull requests, especially for additional
regional seasonality data, nutrition information, recipes, and translations.

The region selector currently offers Poland only. Notification reminders can
be scheduled for the start of each month, on a selected weekday, or daily, at a
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

Each produce entry stores availability and best months under
`seasonalityByRegion`, keyed by a region code from `REGIONS`. The current
`PL` entries estimate fresh retail availability in Poland. Month values are
zero-based (`0` = January, `11` = December); `bestMonths` is optional for each
region.

To add another region, add its code to `REGIONS` in `src/types/index.ts` and
provide that region's `months` and optional `bestMonths` for each product in
`src/constants/produce.ts`. The list, sorting, cards, and details screens all
read seasonality through the shared region-aware service.

### Download

1. Go to the [Releases](../../releases) page.
2. Download the `.apk` file from the latest release.
3. Install it on your Android device (you might need to allow "Unknown Sources").

### Run from Source

1. Clone the repository.
2. Run `npm install`.
3. Start the project with `npx expo start`.
