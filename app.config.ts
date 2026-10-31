import type { ConfigContext } from "expo/config";
import themeColors from "./src/constants/theme-colors.json";

export default ({ config }: ConfigContext) => {
  const configWithSplash = config as typeof config & {
    splash?: { backgroundColor?: string };
  };

  return {
    ...configWithSplash,
    splash: {
      ...configWithSplash.splash,
      backgroundColor: themeColors.neutral.white,
    },
    android: {
      ...config.android,
      adaptiveIcon: {
        ...config.android?.adaptiveIcon,
        backgroundColor: themeColors.neutral.white,
      },
    },
  };
};
