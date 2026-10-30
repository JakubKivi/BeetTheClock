import React from "react";
import {
  StyleProp,
  StyleSheet,
  Text as NativeText,
  TextInput as NativeTextInput,
  TextInputProps,
  TextProps,
  TextStyle,
} from "react-native";
import { FONTS } from "../constants/theme";

const getFontFamily = (style: StyleProp<TextStyle>) => {
  const flattenedStyle = StyleSheet.flatten(style);
  if (flattenedStyle?.fontFamily) return flattenedStyle.fontFamily;

  const fontWeight = flattenedStyle?.fontWeight;
  return fontWeight === "bold" ||
    (typeof fontWeight === "string" && Number(fontWeight) >= 600)
    ? FONTS.bodyBold
    : FONTS.body;
};

export const AppText: React.FC<TextProps> = ({ style, ...props }) => (
  <NativeText
    {...props}
    style={[style, { fontFamily: getFontFamily(style) }]}
  />
);

export const AppTextInput: React.FC<TextInputProps> = ({ style, ...props }) => (
  <NativeTextInput
    {...props}
    style={[style, { fontFamily: getFontFamily(style) }]}
  />
);
