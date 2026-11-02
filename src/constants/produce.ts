import { Produce } from "../types";
import { themeColors } from "./theme";

export const RARITY_LEVELS: Record<
  1 | 2 | 3 | 4 | 5,
  { label: string; plLabel: string; color: string; darkColor: string }
> = {
  1: {
    label: "Common",
    plLabel: "Powszechny",
    color: themeColors.neutral.grey,
    darkColor: themeColors.neutral.darkGrey,
  },
  2: {
    label: "Uncommon",
    plLabel: "Niezwykły",
    color: themeColors.semantic.uncommon.main,
    darkColor: themeColors.semantic.uncommon[10],
  },
  3: {
    label: "Rare",
    plLabel: "Rzadki",
    color: themeColors.semantic.rare.main,
    darkColor: themeColors.semantic.rare[10],
  },
  4: {
    label: "Epic",
    plLabel: "Epicki",
    color: themeColors.semantic.epic.main,
    darkColor: themeColors.semantic.epic[10],
  },
  5: {
    label: "Legendary",
    plLabel: "Legendarny",
    color: themeColors.semantic.legendary.main,
    darkColor: themeColors.semantic.legendary[10],
  },
};

export const getRarityInfo = (rarity: 1 | 2 | 3 | 4 | 5) =>
  RARITY_LEVELS[rarity];