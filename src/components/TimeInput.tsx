import React, { useEffect, useRef, useState } from "react";
import {
  StyleProp,
  StyleSheet,
  TextInput as NativeTextInput,
  View,
  ViewStyle,
} from "react-native";
import { AppText, AppTextInput } from "./Typography";
import { themeColors } from "../constants/theme";

type TimeInputProps = {
  accessibilityLabel: string;
  hourAccessibilityLabel: string;
  minuteAccessibilityLabel: string;
  onChangeText: (value: string) => void;
  onEndEditing?: () => void;
  onFocus?: () => void;
  style?: StyleProp<ViewStyle>;
  value: string;
};

const getTimeParts = (value: string) => {
  const [hours = "", minutes = ""] = value.split(":");
  return { hours, minutes };
};

const TimeInput: React.FC<TimeInputProps> = ({
  accessibilityLabel,
  hourAccessibilityLabel,
  minuteAccessibilityLabel,
  onChangeText,
  onEndEditing,
  onFocus,
  style,
  value,
}) => {
  const { hours: initialHours, minutes: initialMinutes } = getTimeParts(value);
  const [hours, setHours] = useState(initialHours);
  const [minutes, setMinutes] = useState(initialMinutes);
  const minutesInputRef =
    useRef<React.ComponentRef<typeof NativeTextInput>>(null);
  const inputFocusedRef = useRef(false);

  useEffect(() => {
    const parts = getTimeParts(value);
    setHours(parts.hours);
    setMinutes(parts.minutes);
  }, [value]);

  const emitTime = (nextHours: string, nextMinutes: string) => {
    onChangeText(`${nextHours}:${nextMinutes}`);
  };

  const handleBlur = (
    part: "hours" | "minutes",
    currentHours: string,
    currentMinutes: string,
  ) => {
    inputFocusedRef.current = false;
    const nextHours =
      part === "hours" && currentHours.length === 1
        ? `0${currentHours}`
        : currentHours;
    const nextMinutes =
      part === "minutes" && currentMinutes.length === 1
        ? `0${currentMinutes}`
        : currentMinutes;

    if (nextHours !== currentHours) setHours(nextHours);
    if (nextMinutes !== currentMinutes) setMinutes(nextMinutes);
    if (nextHours !== currentHours || nextMinutes !== currentMinutes) {
      emitTime(nextHours, nextMinutes);
    }

    setTimeout(() => {
      if (!inputFocusedRef.current) onEndEditing?.();
    }, 0);
  };

  return (
    <View
      accessibilityLabel={accessibilityLabel}
      style={[styles.container, style]}
    >
      <AppTextInput
        accessibilityLabel={hourAccessibilityLabel}
        keyboardType="number-pad"
        maxLength={2}
        onBlur={() => handleBlur("hours", hours, minutes)}
        onChangeText={(text) => {
          const nextHours = text.replace(/\D/g, "").slice(0, 2);
          setHours(nextHours);
          emitTime(nextHours, minutes);
          if (nextHours.length === 2) minutesInputRef.current?.focus();
        }}
        onFocus={() => {
          inputFocusedRef.current = true;
          onFocus?.();
        }}
        selectTextOnFocus
        style={styles.partInput}
        testID="notification-time-hours"
        value={hours}
      />
      <AppText style={styles.separator}>:</AppText>
      <AppTextInput
        ref={minutesInputRef}
        accessibilityLabel={minuteAccessibilityLabel}
        keyboardType="number-pad"
        maxLength={2}
        onBlur={() => handleBlur("minutes", hours, minutes)}
        onChangeText={(text) => {
          const nextMinutes = text.replace(/\D/g, "").slice(0, 2);
          setMinutes(nextMinutes);
          emitTime(hours, nextMinutes);
        }}
        onFocus={() => {
          inputFocusedRef.current = true;
          onFocus?.();
        }}
        selectTextOnFocus
        style={styles.partInput}
        testID="notification-time-minutes"
        value={minutes}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: "center",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    width: 58,
    height: 37,
    borderWidth: 1,
    borderColor: themeColors.neutral.grey,
    borderRadius: 4,
    paddingHorizontal: 4,
    backgroundColor: themeColors.neutral.white,
  },
  partInput: {
    width: 19,
    padding: 0,
    color: themeColors.neutral.black,
    fontSize: 14,
    textAlign: "center",
  },
  separator: {
    color: themeColors.neutral.black,
    fontSize: 14,
  },
});

export default TimeInput;
