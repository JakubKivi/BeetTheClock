import {
  getAvailableLanguages,
  i18n,
  isLanguage,
  loadResources,
} from "./i18n";

const appLocales = {
  en: {
    name: "English",
    translations: {
      "app.title": "Beet The Clock",
      "settings.language": "Language",
    },
  },
  pl: {
    name: "Polski",
    translations: {
      "app.title": "Beet The Clock",
      "settings.language": "Język",
    },
  },
};

describe("i18n", () => {
  beforeEach(() => {
    loadResources(appLocales, {
      PL: {
        en: {
          "regions.PL": "Poland",
          "produce.1.name": "Beetroot",
        },
        pl: {
          "regions.PL": "Polska",
          "produce.1.name": "Burak",
        },
      },
    });
    i18n.setRegion("PL");
    i18n.setLanguage("en");
  });

  it("exposes language options from runtime locale files", () => {
    expect(getAvailableLanguages()).toEqual([
      { label: "English", value: "en" },
      { label: "Polski", value: "pl" },
    ]);
    expect(isLanguage("pl")).toBe(true);
    expect(isLanguage("de")).toBe(false);
  });

  it("resolves app and regional translations independently", () => {
    expect(i18n.t("settings.language", "pl")).toBe("Język");
    expect(i18n.t("app.title", "pl")).toBe("Beet The Clock");
    expect(i18n.t("regions.PL", "pl")).toBe("Polska");
    expect(i18n.t("produce.1.name", "pl")).toBe("Burak");
    expect(i18n.t("missing.translation", "pl")).toBe("missing.translation");
  });

  it("falls back to the English region translation when a locale is missing", () => {
    expect(i18n.t("produce.1.name", "de")).toBe("Beetroot");
  });
});
