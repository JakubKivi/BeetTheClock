import type { RegionCode } from "../types";

export type Language = string;
export type LanguageOption = { label: string; value: Language };

export type LocaleResource = {
  name: string;
  translations: Record<string, string>;
};

type TranslationResources = {
  app: Record<Language, LocaleResource>;
  regions: Record<RegionCode, Record<Language, Record<string, string>>>;
};

const resources: TranslationResources = {
  app: {},
  regions: {},
};

let currentLanguage: Language = "en";
let currentRegion: RegionCode | undefined;

export const loadResources = (
  appLocales: Record<Language, LocaleResource>,
  regionLocales: Record<RegionCode, Record<Language, Record<string, string>>>,
) => {
  if (!appLocales.en) {
    throw new Error("The data folder must include locales/en.json.");
  }
  resources.app = appLocales;
  resources.regions = regionLocales;
  if (!resources.app[currentLanguage]) {
    currentLanguage = "en";
  }
};

export const getAvailableLanguages = (): LanguageOption[] =>
  Object.entries(resources.app).map(([value, resource]) => ({
    label: resource.name,
    value,
  }));

export const isLanguage = (value: unknown): value is Language =>
  typeof value === "string" &&
  Object.prototype.hasOwnProperty.call(resources.app, value);

const getTranslation = (
  key: string,
  language: Language,
  region = currentRegion,
): string | undefined => {
  const regionTranslations = region
    ? resources.regions[region]
    : undefined;

  return (
    regionTranslations?.[language]?.[key] ||
    regionTranslations?.en?.[key] ||
    resources.app[language]?.translations[key] ||
    resources.app.en?.translations[key]
  );
};

export const i18n = {
  setLanguage: (lang: Language) => {
    currentLanguage = lang;
  },

  getLanguage: (): Language => currentLanguage,

  setRegion: (region: RegionCode | undefined) => {
    currentRegion = region;
  },

  t: (
    key: string,
    language?: Language,
    region?: RegionCode,
  ): string => getTranslation(key, language || currentLanguage, region) || key,

  tOptional: (
    key: string,
    language?: Language,
    region?: RegionCode,
  ): string | undefined =>
    getTranslation(key, language || currentLanguage, region),
};
