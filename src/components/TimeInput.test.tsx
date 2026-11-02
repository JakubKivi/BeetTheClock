import React from "react";
import { fireEvent, render } from "@testing-library/react-native";
import TimeInput from "./TimeInput";

describe("TimeInput", () => {
  it("keeps the separator fixed and accepts only two digits per part", () => {
    const onChangeText = jest.fn();
    const { getByTestId, getByText } = render(
      <TimeInput
        accessibilityLabel="Notification time"
        hourAccessibilityLabel="Notification time hour"
        minuteAccessibilityLabel="Notification time minute"
        onChangeText={onChangeText}
        value="09:00"
      />,
    );

    expect(getByText(":")).toBeTruthy();
    fireEvent.changeText(getByTestId("notification-time-hours"), "1x2");

    expect(onChangeText).toHaveBeenLastCalledWith("12:00");
    expect(getByTestId("notification-time-hours").props.maxLength).toBe(2);
  });

  it("updates the minute part independently", () => {
    const onChangeText = jest.fn();
    const { getByTestId } = render(
      <TimeInput
        accessibilityLabel="Notification time"
        hourAccessibilityLabel="Notification time hour"
        minuteAccessibilityLabel="Notification time minute"
        onChangeText={onChangeText}
        value="09:00"
      />,
    );

    fireEvent.changeText(getByTestId("notification-time-minutes"), "45");

    expect(onChangeText).toHaveBeenLastCalledWith("09:45");
  });

  it("pads a single digit when its part loses focus", () => {
    const onChangeText = jest.fn();
    const { getByTestId } = render(
      <TimeInput
        accessibilityLabel="Notification time"
        hourAccessibilityLabel="Notification time hour"
        minuteAccessibilityLabel="Notification time minute"
        onChangeText={onChangeText}
        value="09:00"
      />,
    );
    const hoursInput = getByTestId("notification-time-hours");

    fireEvent.changeText(hoursInput, "7");
    fireEvent(hoursInput, "blur");

    expect(onChangeText).toHaveBeenLastCalledWith("07:00");
  });
});
