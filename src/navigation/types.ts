import type { Produce, RegionCode } from "../types";

export type RootStackParamList = {
  Home: undefined;
  Settings: undefined;
  Details: {
    item: Produce;
    iconUri?: string;
    region?: RegionCode;
    onPickImage?: (id: string) => Promise<string | null>;
    onResetIcon?: (id: string) => void;
  };
};
