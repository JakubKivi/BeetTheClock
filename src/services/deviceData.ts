import AsyncStorage from "@react-native-async-storage/async-storage";
import { Directory, File, Paths } from "expo-file-system";
import type { Language, LocaleResource } from "./i18n";
import { loadResources } from "./i18n";
import { NUTRIENT_INFO } from "../constants/nutrition";
import type { Produce, RegionCode, RegionalSeasonality } from "../types";

const DATA_DIRECTORY_KEY = "BeetTheClock:dataDirectory";
const DEFAULT_DATA_DIRECTORY_NAME = "BeetTheClock";
const FILE_EXTENSION = ".json";
const CODE_PATTERN = /^[A-Za-z0-9_-]+$/;

const BUNDLED_DATA_FILES: { path: string; contents: unknown }[] = [
  {
    path: "locales/en.json",
    contents: require("../../data/locales/en.json"),
  },
  {
    path: "locales/pl.json",
    contents: require("../../data/locales/pl.json"),
  },
  {
    path: "regions/PL.json",
    contents: require("../../data/regions/PL.json"),
  },
  {
    path: "regions/PL/en.json",
    contents: require("../../data/regions/PL/en.json"),
  },
  {
    path: "regions/PL/pl.json",
    contents: require("../../data/regions/PL/pl.json"),
  },
];

type RegionalProduce = Omit<Produce, "seasonalityByRegion"> & {
  seasonality: RegionalSeasonality;
};

type RegionDataset = {
  code: RegionCode;
  produce: RegionalProduce[];
};

export type DataImportTarget = "app-locale" | "region";

export type RegionOption = {
  code: RegionCode;
};

export type LoadedData = {
  languages: Language[];
  regions: RegionOption[];
  produce: Produce[];
};

export const mergeMissingLocaleTranslations = (
  locale: LocaleResource,
  defaults: LocaleResource,
): LocaleResource => ({
  name: locale.name || defaults.name,
  translations: { ...defaults.translations, ...locale.translations },
});

let loadedData: LoadedData | undefined;

export const getLoadedData = (): LoadedData | undefined => loadedData;

const parseJson = async <Value>(file: File): Promise<Value> => {
  try {
    return JSON.parse(await file.text()) as Value;
  } catch (error) {
    throw new Error(
      `Could not read ${file.name} as JSON: ${
        error instanceof Error ? error.message : String(error)
      }`,
    );
  }
};

const isJsonFile = (entry: Directory | File): entry is File =>
  entry instanceof File && entry.name.endsWith(FILE_EXTENSION);

const isCode = (value: string): boolean => CODE_PATTERN.test(value);

const isRecord = (value: unknown): value is Record<string, unknown> =>
  typeof value === "object" && value !== null && !Array.isArray(value);

const flattenTranslations = (
  value: unknown,
  prefix: string,
  result: Record<string, string>,
) => {
  if (!isRecord(value)) {
    throw new Error(`Translations at "${prefix}" must be an object.`);
  }
  for (const [key, entry] of Object.entries(value)) {
    const translationKey = `${prefix}.${key}`;
    if (typeof entry === "string") {
      result[translationKey] = entry;
    } else if (isRecord(entry)) {
      flattenTranslations(entry, translationKey, result);
    } else {
      throw new Error(`Translation "${translationKey}" must be a string.`);
    }
  }
};

const validateLocale = (locale: unknown, fileName: string): LocaleResource => {
  if (
    !isRecord(locale) ||
    typeof locale.name !== "string" ||
    !isRecord(locale.translations) ||
    !Object.values(locale.translations).every(
      (translation) => typeof translation === "string",
    )
  ) {
    throw new Error(
      `${fileName} must contain a string "name" and string "translations".`,
    );
  }

  return locale as LocaleResource;
};

const isRegionalProduce = (value: unknown): value is RegionalProduce => {
  if (
    !isRecord(value) ||
    typeof value.id !== "string" ||
    !isCode(value.id) ||
    typeof value.rarity !== "number" ||
    !Number.isInteger(value.rarity) ||
    value.rarity < 1 ||
    value.rarity > 5 ||
    (value.wikipediaUrl !== undefined &&
      typeof value.wikipediaUrl !== "string") ||
    !isRecord(value.seasonality) ||
    !Array.isArray(value.seasonality.months) ||
    value.seasonality.months.length === 0 ||
    !value.seasonality.months.every(
      (month) => Number.isInteger(month) && month >= 0 && month <= 11,
    ) ||
    (value.seasonality.bestMonths !== undefined &&
      (!Array.isArray(value.seasonality.bestMonths) ||
        !value.seasonality.bestMonths.every(
          (month) => Number.isInteger(month) && month >= 0 && month <= 11,
        ))) ||
    (value.defaultRecipeIds !== undefined &&
      (!Array.isArray(value.defaultRecipeIds) ||
        !value.defaultRecipeIds.every((recipeId) => typeof recipeId === "string"))) ||
    (value.nutritionItems !== undefined &&
      (!Array.isArray(value.nutritionItems) ||
        !value.nutritionItems.every(
          (item) =>
            isRecord(item) &&
            typeof item.nutrient === "string" &&
            Object.prototype.hasOwnProperty.call(NUTRIENT_INFO, item.nutrient) &&
            (item.amount === undefined ||
              (typeof item.amount === "number" &&
                Number.isFinite(item.amount) &&
                item.amount >= 0)) &&
            (item.unit === undefined ||
              item.unit === "g" ||
              item.unit === "kcal"),
        )))
  ) {
    return false;
  }

  return true;
};

const validateRegion = (region: unknown, fileName: string): RegionDataset => {
  if (
    !isRecord(region) ||
    typeof region.code !== "string" ||
    !isCode(region.code) ||
    !Array.isArray(region.produce)
  ) {
    throw new Error(`${fileName} must contain a valid code and produce array.`);
  }

  const ids = new Set<string>();
  const produce = region.produce.map((entry, index) => {
    if (!isRegionalProduce(entry) || ids.has(entry.id)) {
      throw new Error(
        `${fileName} has invalid or duplicate product data at produce[${index}].`,
      );
    }
    ids.add(entry.id);
    return entry;
  });

  return { code: region.code, produce };
};

export const resolveImportDestination = (
  fileName: string,
  content: unknown,
  target: DataImportTarget,
  activeRegion: RegionCode,
  translationRegion = activeRegion,
): string => {
  if (!fileName.endsWith(FILE_EXTENSION)) {
    throw new Error(`${fileName} is not a JSON file.`);
  }
  const code = fileName.slice(0, -FILE_EXTENSION.length);
  if (!isCode(code)) {
    throw new Error(`${fileName} must use a valid language or region code.`);
  }

  if (target === "app-locale") {
    validateLocale(content, fileName);
    return `locales/${code}${FILE_EXTENSION}`;
  }

  if (
    isRecord(content) &&
    typeof content.code === "string" &&
    Array.isArray(content.produce)
  ) {
    const region = validateRegion(content, fileName);
    if (region.code !== code) {
      throw new Error(
        `${fileName} must have the same code in its filename and JSON content.`,
      );
    }
    return `regions/${code}${FILE_EXTENSION}`;
  }

  if (
    !isRecord(content) ||
    typeof content.name !== "string" ||
    !isRecord(content.produce)
  ) {
    throw new Error(
      `${fileName} must contain region translations or a region data file.`,
    );
  }

  const translations: Record<string, string> = {};
  flattenTranslations(content.produce, "produce", translations);
  return `regions/${translationRegion}/${code}${FILE_EXTENSION}`;
};

export const resolveImportRegion = (
  files: { parsed: unknown }[],
  target: DataImportTarget,
  activeRegion: RegionCode,
): RegionCode => {
  const importedRegions = files.filter(
    ({ parsed }) =>
      isRecord(parsed) &&
      typeof parsed.code === "string" &&
      Array.isArray(parsed.produce),
  );
  if (target !== "region") return activeRegion;
  if (importedRegions.length > 1) {
    throw new Error("Import one region data file at a time with its translations.");
  }
  if (importedRegions.length === 0) return activeRegion;

  const parsed = importedRegions[0].parsed;
  if (!isRecord(parsed)) {
    throw new Error("The selected region file has no valid region code.");
  }
  return validateRegion(parsed, "selected region file").code;
};

export const importDataFiles = async (
  directoryUri: string,
  target: DataImportTarget,
  activeRegion: RegionCode,
): Promise<{ data: LoadedData; importedCount: number } | null> => {
  const selection = await File.pickFileAsync({
    multipleFiles: true,
    mimeTypes: ["application/json"],
  });
  if (selection.canceled) return null;

  const directory = new Directory(directoryUri);
  const parsedFiles = await Promise.all(
    selection.result.map(async (sourceFile) => {
      const contents = await sourceFile.text();
      let parsed: unknown;
      try {
        parsed = JSON.parse(contents);
      } catch (error) {
        throw new Error(
          `Could not read ${sourceFile.name} as JSON: ${
            error instanceof Error ? error.message : String(error)
          }`,
        );
      }
      return { fileName: sourceFile.name, parsed, contents };
    }),
  );

  const translationRegion = resolveImportRegion(parsedFiles, target, activeRegion);
  const pendingFiles = parsedFiles.map(({ fileName, parsed, contents }) => ({
    path: resolveImportDestination(
      fileName,
      parsed,
      target,
      activeRegion,
      translationRegion,
    ),
    contents,
  }));

  const destinations = new Set<string>();
  for (const pendingFile of pendingFiles) {
    if (destinations.has(pendingFile.path)) {
      throw new Error(`More than one selected file targets ${pendingFile.path}.`);
    }
    destinations.add(pendingFile.path);
  }

  const backups: {
    file: File;
    existed: boolean;
    contents?: string;
  }[] = [];

  try {
    for (const pendingFile of pendingFiles) {
      const segments = pendingFile.path.split("/");
      const fileName = segments.pop();
      if (!fileName) {
        throw new Error(`Invalid import destination: ${pendingFile.path}`);
      }
      const parentDirectory = new Directory(directory, ...segments);
      parentDirectory.create({ idempotent: true, intermediates: true });
      const destination = new File(parentDirectory, fileName);
      const existed = destination.exists;
      backups.push({
        file: destination,
        existed,
        contents: existed ? await destination.text() : undefined,
      });
      destination.create({ intermediates: true, overwrite: true });
      await destination.write(pendingFile.contents);
    }

    const data = await loadData(directory);
    loadedData = data;
    return { data, importedCount: pendingFiles.length };
  } catch (error) {
    const rollbackErrors: string[] = [];
    for (const backup of backups.reverse()) {
      try {
        if (backup.existed) {
          backup.file.create({ intermediates: true, overwrite: true });
          await backup.file.write(backup.contents ?? "");
        } else if (backup.file.exists) {
          backup.file.delete();
        }
      } catch (rollbackError) {
        rollbackErrors.push(
          rollbackError instanceof Error
            ? rollbackError.message
            : String(rollbackError),
        );
      }
    }

    if (rollbackErrors.length > 0) {
      throw new Error(
        `Import failed: ${
          error instanceof Error ? error.message : String(error)
        }. Restoring previous files also failed: ${rollbackErrors.join("; ")}`,
      );
    }
    throw error;
  }
};

const createDefaultDataDirectory = async (): Promise<Directory> => {
  const directory = new Directory(Paths.document, DEFAULT_DATA_DIRECTORY_NAME);
  directory.create({ idempotent: true, intermediates: true });

  for (const bundledFile of BUNDLED_DATA_FILES) {
    const segments = bundledFile.path.split("/");
    const fileName = segments.pop();
    if (!fileName) {
      throw new Error(`Invalid bundled data file path: ${bundledFile.path}`);
    }

    const parentDirectory = new Directory(directory, ...segments);
    parentDirectory.create({ idempotent: true, intermediates: true });
    const file = new File(parentDirectory, fileName);
    if (file.exists) continue;

    file.create({ intermediates: true });
    await file.write(`${JSON.stringify(bundledFile.contents, null, 2)}\n`);
  }

  return directory;
};

const copyJsonFiles = async (
  source: Directory,
  destination: Directory,
): Promise<void> => {
  destination.create({ idempotent: true, intermediates: true });

  for (const entry of source.list()) {
    if (entry instanceof Directory) {
      await copyJsonFiles(
        entry,
        new Directory(destination, entry.name),
      );
      continue;
    }
    if (!(entry instanceof File) || !entry.name.endsWith(FILE_EXTENSION)) {
      continue;
    }

    const target = new File(destination, entry.name);
    target.create({ intermediates: true, overwrite: true });
    await target.write(await entry.text());
  }
};

const migrateDataDirectory = async (
  sourceUri: string,
  destination: Directory,
): Promise<void> => {
  const source = new Directory(sourceUri);
  if (!source.exists) {
    throw new Error("The previously selected data folder is no longer available.");
  }

  for (const section of ["locales", "regions"]) {
    const sourceSection = new Directory(source, section);
    if (!sourceSection.exists) continue;
    await copyJsonFiles(
      sourceSection,
      new Directory(destination, section),
    );
  }
};

const updateBundledLocaleTranslations = async (
  directory: Directory,
): Promise<void> => {
  for (const bundledFile of BUNDLED_DATA_FILES) {
    if (!bundledFile.path.startsWith("locales/")) continue;
    const fileName = bundledFile.path.slice("locales/".length);
    const file = new File(new Directory(directory, "locales"), fileName);
    const defaults = validateLocale(bundledFile.contents, bundledFile.path);
    const current = validateLocale(
      await parseJson(file),
      bundledFile.path,
    );
    const hasMissingTranslations = Object.keys(defaults.translations).some(
      (key) => !Object.prototype.hasOwnProperty.call(current.translations, key),
    );
    if (!hasMissingTranslations) continue;

    const merged = mergeMissingLocaleTranslations(current, defaults);
    await file.write(`${JSON.stringify(merged, null, 2)}\n`);
  }
};

export const composeLoadedData = (
  appLocales: Record<Language, LocaleResource>,
  regionDatasets: RegionDataset[],
  regionLocales: Record<
    RegionCode,
    Record<Language, Record<string, string>>
  >,
): LoadedData => {
  loadResources(appLocales, regionLocales);

  const produceById = new Map<string, Produce>();
  for (const region of regionDatasets) {
    for (const { seasonality, ...product } of region.produce) {
      const existing = produceById.get(product.id);
      if (existing) {
        existing.seasonalityByRegion[region.code] = seasonality;
      } else {
        produceById.set(product.id, {
          ...product,
          seasonalityByRegion: { [region.code]: seasonality },
        });
      }
    }
  }

  const data = {
    languages: Object.keys(appLocales),
    regions: regionDatasets.map(({ code }) => ({ code })),
    produce: [...produceById.values()],
  };
  loadedData = data;
  return data;
};

const loadData = async (directory: Directory): Promise<LoadedData> => {
  const localesDirectory = new Directory(directory, "locales");
  const regionsDirectory = new Directory(directory, "regions");
  if (!localesDirectory.exists || !regionsDirectory.exists) {
    throw new Error(
      "The selected folder must contain both locales/ and regions/ folders.",
    );
  }

  const appLocales: Record<Language, LocaleResource> = {};
  for (const file of localesDirectory.list().filter(isJsonFile)) {
    const language = file.name.slice(0, -FILE_EXTENSION.length);
    if (!isCode(language)) {
      throw new Error(`Invalid language code in ${file.name}.`);
    }
    appLocales[language] = validateLocale(
      await parseJson(file),
      `locales/${file.name}`,
    );
  }
  if (!appLocales.en) {
    throw new Error("The locales folder must contain an en.json fallback.");
  }

  const regionFiles = regionsDirectory.list().filter(isJsonFile);
  if (regionFiles.length === 0) {
    throw new Error("The regions folder must contain at least one region JSON.");
  }

  const regionDatasets: RegionDataset[] = [];
  const regionLocales: Record<
    RegionCode,
    Record<Language, Record<string, string>>
  > = {};
  const regionCodes = new Set<string>();

  for (const file of regionFiles) {
    const fileCode = file.name.slice(0, -FILE_EXTENSION.length);
    if (!isCode(fileCode)) {
      throw new Error(`Invalid region code in ${file.name}.`);
    }
    const region = validateRegion(
      await parseJson(file),
      `regions/${file.name}`,
    );
    if (region.code !== fileCode || regionCodes.has(region.code)) {
      throw new Error(
        `Region code in regions/${file.name} must match its unique filename.`,
      );
    }
    regionCodes.add(region.code);
    regionDatasets.push(region);
    regionLocales[region.code] = {};

    const translationsDirectory = new Directory(regionsDirectory, region.code);
    if (!translationsDirectory.exists) continue;

    for (const translationFile of translationsDirectory
      .list()
      .filter(isJsonFile)) {
      const language = translationFile.name.slice(
        0,
        -FILE_EXTENSION.length,
      );
      if (!isCode(language)) {
        throw new Error(
          `Invalid language code in regions/${region.code}/${translationFile.name}.`,
        );
      }

      const localization: unknown = await parseJson(translationFile);
      if (!isRecord(localization)) {
        throw new Error(
          `regions/${region.code}/${translationFile.name} must contain an object.`,
        );
      }
      if (
        (localization.name !== undefined &&
          typeof localization.name !== "string") ||
        (localization.produce !== undefined &&
          !isRecord(localization.produce))
      ) {
        throw new Error(
          `regions/${region.code}/${translationFile.name} has an invalid name or produce section.`,
        );
      }

      const translations: Record<string, string> = {};
      if (typeof localization.name === "string") {
        translations[`regions.${region.code}`] = localization.name;
      }
      if (localization.produce !== undefined) {
        flattenTranslations(localization.produce, "produce", translations);
      }
      regionLocales[region.code][language] = translations;
    }
  }

  return composeLoadedData(appLocales, regionDatasets, regionLocales);
};

export const getSavedDataDirectory = (): Promise<string | null> =>
  AsyncStorage.getItem(DATA_DIRECTORY_KEY);

export const loadSavedDataDirectory = async (
  uri: string,
): Promise<LoadedData> => {
  const data = await loadData(new Directory(uri));
  loadedData = data;
  return data;
};

export const loadDefaultDataDirectory = async (
  previousDirectoryUri?: string,
): Promise<{
  uri: string;
  data: LoadedData;
}> => {
  const directory = await createDefaultDataDirectory();
  if (previousDirectoryUri && previousDirectoryUri !== directory.uri) {
    await migrateDataDirectory(previousDirectoryUri, directory);
  }
  await updateBundledLocaleTranslations(directory);
  const data = await loadData(directory);
  await AsyncStorage.setItem(DATA_DIRECTORY_KEY, directory.uri);
  loadedData = data;
  return { uri: directory.uri, data };
};

export const selectDataDirectory = async (): Promise<{
  uri: string;
  data: LoadedData;
}> => {
  const directory = await Directory.pickDirectoryAsync();
  const data = await loadData(directory);
  await AsyncStorage.setItem(DATA_DIRECTORY_KEY, directory.uri);
  loadedData = data;
  return { uri: directory.uri, data };
};

export const refreshLoadedData = async (
  uri: string,
): Promise<LoadedData> => loadSavedDataDirectory(uri);
