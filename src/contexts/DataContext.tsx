import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { Alert, AppState, Platform, Text, TouchableOpacity, View } from "react-native";
import {
  getSavedDataDirectory,
  importDataFiles,
  loadDefaultDataDirectory,
  loadSavedDataDirectory,
  refreshLoadedData,
  selectDataDirectory,
} from "../services/deviceData";
import type {
  DataImportTarget,
  LoadedData,
} from "../services/deviceData";
import { DEFAULT_SETTINGS, getSettings, saveSettings } from "../services/storage";
import { i18n } from "../services/i18n";
import { DEFAULT_REGION } from "../services/produceSeasonality";
import { themeColors } from "../constants/theme";
import type { Produce, RegionCode } from "../types";

type DataContextValue = {
  languages: string[];
  regions: RegionCode[];
  produce: Produce[];
  activeRegion: RegionCode;
  setActiveRegion: (region: RegionCode) => void;
  importFiles: (target: DataImportTarget) => Promise<number>;
};

const DataContext = createContext<DataContextValue | undefined>(undefined);

type DataStatus = "loading" | "error" | "ready";

const resolveActiveRegion = async (data: LoadedData): Promise<RegionCode> => {
  const savedSettings = await getSettings();
  const savedRegion = savedSettings?.regionCode;
  const region = data.regions.find(({ code }) => code === savedRegion)?.code;
  const resolvedRegion = region ?? data.regions[0]?.code ?? DEFAULT_REGION;

  if (savedRegion !== resolvedRegion) {
    await saveSettings({
      ...DEFAULT_SETTINGS,
      ...savedSettings,
      regionCode: resolvedRegion,
    });
  }

  return resolvedRegion;
};

const DataFolderGate = ({
  status,
  error,
  onChooseDirectory,
}: {
  status: Exclude<DataStatus, "ready">;
  error: string | null;
  onChooseDirectory: () => void;
}) => (
  <View
    style={{
      flex: 1,
      justifyContent: "center",
      padding: 28,
      backgroundColor: themeColors.neutral.lightGrey,
    }}
  >
    <Text style={{ fontSize: 22, fontWeight: "700", marginBottom: 12 }}>
      Beet The Clock
    </Text>
    <Text style={{ fontSize: 16, marginBottom: 16 }}>
      {status === "loading"
        ? "Loading app data..."
        : "App data could not be loaded. You can choose another data folder."}
    </Text>
    {error ? (
      <Text accessibilityRole="alert" style={{ marginBottom: 16, color: "red" }}>
        {error}
      </Text>
    ) : null}
    {status === "error" && Platform.OS !== "web" ? (
      <TouchableOpacity
        accessibilityRole="button"
        onPress={onChooseDirectory}
        style={{
          backgroundColor: themeColors.primary[25],
          padding: 14,
          borderRadius: 8,
        }}
      >
        <Text style={{ color: themeColors.neutral.white, fontWeight: "700" }}>
          Choose data folder
        </Text>
      </TouchableOpacity>
    ) : null}
    {Platform.OS === "web" ? (
      <Text>Reading a data folder is supported in the Android and iOS apps.</Text>
    ) : null}
  </View>
);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [status, setStatus] = useState<DataStatus>("loading");
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<LoadedData | null>(null);
  const [dataDirectoryUri, setDataDirectoryUri] = useState("");
  const [activeRegion, setActiveRegionState] = useState<RegionCode>(DEFAULT_REGION);
  const isImportingRef = useRef(false);

  const applyData = useCallback(async (nextData: LoadedData) => {
    const region = await resolveActiveRegion(nextData);
    i18n.setRegion(region);
    setActiveRegionState(region);
    setData(nextData);
    setStatus("ready");
    setError(null);
  }, []);

  const refreshData = useCallback(async () => {
    if (!dataDirectoryUri) {
      throw new Error("Choose a data folder before refreshing.");
    }
    const nextData = await refreshLoadedData(dataDirectoryUri);
    await applyData(nextData);
  }, [applyData, dataDirectoryUri]);

  const importFiles = useCallback(
    async (target: DataImportTarget) => {
      if (!dataDirectoryUri) {
        throw new Error("App data is not ready for importing files.");
      }
      if (isImportingRef.current) {
        throw new Error("A data file import is already in progress.");
      }

      isImportingRef.current = true;
      try {
        const result = await importDataFiles(
          dataDirectoryUri,
          target,
          activeRegion,
        );
        if (!result) return 0;
        await applyData(result.data);
        return result.importedCount;
      } finally {
        isImportingRef.current = false;
      }
    },
    [activeRegion, applyData, dataDirectoryUri],
  );

  const chooseDataDirectory = useCallback(async () => {
    try {
      const selected = await selectDataDirectory();
      const region = await resolveActiveRegion(selected.data);
      i18n.setRegion(region);
      setActiveRegionState(region);
      setDataDirectoryUri(selected.uri);
      setData(selected.data);
      setStatus("ready");
      setError(null);
    } catch (reason) {
      const message =
        reason instanceof Error ? reason.message : String(reason);
      console.warn("Failed to load the selected data folder", reason);
      setError(message);
      setStatus(data ? "ready" : "error");
      if (data) {
        Alert.alert(i18n.t("settings.errorTitle"), message);
      }
    }
  }, [data]);

  useEffect(() => {
    let isActive = true;
    const initialize = async () => {
      try {
        const savedUri = await getSavedDataDirectory();
        const initialized = await loadDefaultDataDirectory(savedUri ?? undefined);
        const { uri, data: loaded } = initialized;
        const region = await resolveActiveRegion(loaded);
        if (!isActive) return;
        i18n.setRegion(region);
        setActiveRegionState(region);
        setDataDirectoryUri(uri);
        setData(loaded);
        setStatus("ready");
      } catch (reason) {
        const message =
          reason instanceof Error ? reason.message : String(reason);
        console.warn("Failed to load the saved data folder", reason);
        if (isActive) {
          setError(message);
          setStatus("error");
        }
      }
    };
    void initialize();
    return () => {
      isActive = false;
    };
  }, []);

  useEffect(() => {
    if (!dataDirectoryUri || !data) return;
    const subscription = AppState.addEventListener("change", (nextState) => {
      if (nextState !== "active" || isImportingRef.current) return;
      void refreshData().catch((reason: unknown) => {
        const message =
          reason instanceof Error ? reason.message : String(reason);
        console.warn("Failed to refresh data from phone storage", reason);
        setError(message);
      });
    });
    return () => subscription.remove();
  }, [data, dataDirectoryUri, refreshData]);

  const setActiveRegion = useCallback(
    (region: RegionCode) => {
      if (!data?.regions.some(({ code }) => code === region)) {
        throw new Error(`Unknown region: ${region}`);
      }
      i18n.setRegion(region);
      setActiveRegionState(region);
    },
    [data],
  );

  const value = useMemo<DataContextValue | undefined>(() => {
    if (status !== "ready" || !data) return undefined;
    return {
      languages: data.languages,
      regions: data.regions.map(({ code }) => code),
      produce: data.produce,
      activeRegion,
      setActiveRegion,
      importFiles,
    };
  }, [
    activeRegion,
    data,
    importFiles,
    setActiveRegion,
    status,
  ]);

  if (!value) {
    return (
      <DataFolderGate
        status={status === "ready" ? "error" : status}
        error={error}
        onChooseDirectory={() => void chooseDataDirectory()}
      />
    );
  }

  return <DataContext.Provider value={value}>{children}</DataContext.Provider>;
};

export const useAppData = (): DataContextValue => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error("useAppData must be used after DataProvider has loaded data.");
  }
  return context;
};
