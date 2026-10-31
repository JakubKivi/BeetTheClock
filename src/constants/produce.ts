import { Produce } from "../types";
import { themeColors } from "./theme";

export const RARITY_LEVELS: Record<
  1 | 2 | 3 | 4 | 5,
  { label: string; plLabel: string; color: string }
> = {
  1: {
    label: "Common",
    plLabel: "Powszechny",
    color: themeColors.neutral.grey,
  },
  2: {
    label: "Uncommon",
    plLabel: "Niezwykły",
    color: themeColors.semantic.uncommon.main,
  },
  3: {
    label: "Rare",
    plLabel: "Rzadki",
    color: themeColors.semantic.rare.main,
  },
  4: {
    label: "Epic",
    plLabel: "Epicki",
    color: themeColors.semantic.epic.main,
  },
  5: {
    label: "Legendary",
    plLabel: "Legendarny",
    color: themeColors.semantic.legendary.main,
  },
};

export const getRarityInfo = (rarity: 1 | 2 | 3 | 4 | 5) =>
  RARITY_LEVELS[rarity];