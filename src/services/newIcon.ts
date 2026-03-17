import AsyncStorage from "@react-native-async-storage/async-storage";

const ICONS_KEY = "produce_icons";

export const getProduceIcons = async (): Promise<Record<string, string>> => {
  const json = await AsyncStorage.getItem(ICONS_KEY);
  return json ? JSON.parse(json) : {};
};

export const saveProduceIcon = async (id: string, uri: string) => {
  const icons = await getProduceIcons();
  icons[id] = uri;
  await AsyncStorage.setItem(ICONS_KEY, JSON.stringify(icons));
};
