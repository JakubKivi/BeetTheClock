import {
  composeLoadedData,
  mergeMissingLocaleTranslations,
  resolveImportDestination,
  resolveImportRegion,
} from "./deviceData";
import { i18n } from "./i18n";

const appLocales = {
  en: { name: "English", translations: { "app.title": "Beet The Clock" } },
};

const product = {
  id: "shared",
  rarity: 1 as const,
  seasonality: { months: [0] as (0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11)[] },
};

describe("phone data loading", () => {
  it("adds missing bundled translations without replacing custom values", () => {
    expect(
      mergeMissingLocaleTranslations(
        {
          name: "Custom English",
          translations: {
            "settings.close": "Done",
            "custom.key": "Custom value",
          },
        },
        {
          name: "English",
          translations: {
            "settings.close": "Close",
            "settings.addLanguageTitle": "Add another language",
          },
        },
      ),
    ).toEqual({
      name: "Custom English",
      translations: {
        "settings.close": "Done",
        "settings.addLanguageTitle": "Add another language",
        "custom.key": "Custom value",
      },
    });
  });

  it("routes app language files into the app locales directory", () => {
    expect(
      resolveImportDestination(
        "de.json",
        { name: "Deutsch", translations: {} },
        "app-locale",
        "PL",
      ),
    ).toBe("locales/de.json");
  });

  it("rejects app locale translations that are not strings", () => {
    expect(() =>
      resolveImportDestination(
        "de.json",
        { name: "Deutsch", translations: { "app.title": { value: "Titel" } } },
        "app-locale",
        "PL",
      ),
    ).toThrow('de.json must contain a string "name" and string "translations".');
  });

  it("routes region data and translations to the correct directories", () => {
    expect(
      resolveImportDestination(
        "DE.json",
        { code: "DE", produce: [] },
        "region",
        "PL",
      ),
    ).toBe("regions/DE.json");
    expect(
      resolveImportDestination(
        "de.json",
        { name: "Deutschland", produce: {} },
        "region",
        "DE",
      ),
    ).toBe("regions/DE/de.json");
    expect(
      resolveImportDestination(
        "pl.json",
        { name: "Polski", produce: {} },
        "region",
        "PL",
        "DE",
      ),
    ).toBe("regions/DE/pl.json");
  });

  it("rejects malformed regional product and recipe translations", () => {
    expect(() =>
      resolveImportDestination(
        "de.json",
        {
          name: "Deutschland",
          produce: { apple: { name: 42 } },
        },
        "region",
        "PL",
      ),
    ).toThrow('invalid "name" translation for "apple"');

    expect(() =>
      resolveImportDestination(
        "de.json",
        {
          name: "Deutschland",
          produce: {
            apple: {
              recipes: {
                pie: { name: "Apfelkuchen" },
              },
            },
          },
        },
        "region",
        "PL",
      ),
    ).toThrow('invalid recipe translations for "apple.pie"');
  });

  it("rejects invalid region product data before it can be imported", () => {
    expect(() =>
      resolveImportDestination(
        "DE.json",
        {
          code: "DE",
          produce: [
            {
              id: "apple",
              rarity: 1,
              seasonality: { months: [12] },
            },
          ],
        },
        "region",
        "PL",
      ),
    ).toThrow("invalid or duplicate product data");
  });

  it("rejects mismatched region codes", () => {
    expect(() =>
      resolveImportDestination(
        "DE.json",
        { code: "PL", produce: [] },
        "region",
        "PL",
      ),
    ).toThrow("same code");
  });

  it("uses the imported region data file to route multiple translations", () => {
    expect(
      resolveImportRegion(
        [
          { parsed: { code: "DE", produce: [] } },
          { parsed: { name: "English", produce: {} } },
          { parsed: { name: "Deutsch", produce: {} } },
        ],
        "region",
        "PL",
      ),
    ).toBe("DE");
  });

  it("rejects importing multiple region datasets together", () => {
    expect(() =>
      resolveImportRegion(
        [
          { parsed: { code: "DE", produce: [] } },
          { parsed: { code: "FR", produce: [] } },
        ],
        "region",
        "PL",
      ),
    ).toThrow("one region data file");
  });

  it("loads additional regions and merges products with the same ID", () => {
    const data = composeLoadedData(
      appLocales,
      [
        { code: "PL", produce: [product] },
        {
          code: "DE",
          produce: [{ ...product, seasonality: { months: [5] } }],
        },
      ],
      {
        PL: { en: { "regions.PL": "Poland", "produce.shared.name": "Apple" } },
        DE: { en: { "regions.DE": "Germany", "produce.shared.name": "Apfel" } },
      },
    );

    expect(data.regions.map(({ code }) => code)).toEqual(["PL", "DE"]);
    expect(data.produce).toHaveLength(1);
    expect(data.produce[0].seasonalityByRegion).toEqual({
      PL: { months: [0] },
      DE: { months: [5] },
    });

    i18n.setRegion("DE");
    expect(i18n.t("regions.DE")).toBe("Germany");
    expect(i18n.t("produce.shared.name")).toBe("Apfel");
  });
});
