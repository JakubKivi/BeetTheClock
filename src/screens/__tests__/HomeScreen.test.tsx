import React from "react";
import { render, fireEvent, act, waitFor } from "@testing-library/react-native";
import { StyleSheet } from "react-native";
import HomeScreen from "../HomeScreen";
import * as storage from "../../services/storage";
import * as newIcon from "../../services/newIcon";
import * as SMS from "expo-sms";

// mock navigation
const mockNavigate = jest.fn();
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: mockNavigate,
    setOptions: jest.fn(),
  }),
  useFocusEffect: jest.fn(),
}));

jest.mock("../../contexts/LanguageContext", () => ({
  useLanguage: () => ({ language: "en", setLanguage: jest.fn() }),
}));

// provide minimal mocks for dependencies
jest.mock("../../services/storage");
jest.mock("../../services/newIcon");
jest.mock("expo-image-picker", () => ({
  getMediaLibraryPermissionsAsync: jest.fn(async () => ({ status: "granted" })),
  requestMediaLibraryPermissionsAsync: jest.fn(async () => ({ granted: true })),
  launchImageLibraryAsync: jest.fn(async () => ({ canceled: true })),
}));
jest.mock("expo-sms", () => ({
  isAvailableAsync: jest.fn(async () => true),
  sendSMSAsync: jest.fn(),
}));

const mockSettings = { phoneNumber: "123" };

describe("HomeScreen", () => {
  beforeEach(() => {
    (storage.getSettings as jest.Mock).mockResolvedValue(mockSettings);
    (newIcon.getProduceIcons as jest.Mock).mockResolvedValue({});
  });

  it("navigates to details when a card is pressed", async () => {
    const { getAllByTestId } = render(<HomeScreen />);

    // wait for data to load
    await waitFor(() => expect(storage.getSettings).toHaveBeenCalled());

    // at least one card should exist
    const cards = getAllByTestId("card-press");
    expect(cards.length).toBeGreaterThan(0);

    fireEvent.press(cards[0]);

    expect(mockNavigate).toHaveBeenCalledWith("Details", expect.any(Object));
  });

  it("sends an SMS when share button is tapped", async () => {
    const { getAllByTestId } = render(<HomeScreen />);
    await waitFor(() => expect(storage.getSettings).toHaveBeenCalled());
    const shareButtons = getAllByTestId("share-button");
    expect(shareButtons.length).toBeGreaterThan(0);

    await act(async () => {
      fireEvent.press(shareButtons[0]);
    });
    expect(SMS.sendSMSAsync).toHaveBeenCalledWith(
      [mockSettings.phoneNumber],
      expect.stringContaining("is in season"),
    );
  });

  it("filters both sections to favorites when the favorites switch is enabled", async () => {
    (storage.getSettings as jest.Mock).mockResolvedValue({
      ...mockSettings,
      favItems: ["1"],
    });
    const { getByTestId, queryAllByTestId } = render(<HomeScreen />);
    await waitFor(() => expect(storage.getSettings).toHaveBeenCalled());

    expect(queryAllByTestId("card-press").length).toBeGreaterThan(0);
    fireEvent.press(getByTestId("favorites-filter"));

    await waitFor(() =>
      expect(queryAllByTestId("card-press")).toHaveLength(1),
    );
  });

  it("updates a favorite without refreshing the list data", async () => {
    const previousIconLoadCount = (
      newIcon.getProduceIcons as jest.Mock
    ).mock.calls.length;
    const { getAllByTestId } = render(<HomeScreen />);
    await waitFor(() =>
      expect(newIcon.getProduceIcons).toHaveBeenCalledTimes(
        previousIconLoadCount + 1,
      ),
    );

    await act(async () => {
      fireEvent.press(getAllByTestId("favorite-button")[0]);
    });

    await waitFor(() => expect(storage.saveSettings).toHaveBeenCalled());
    expect(newIcon.getProduceIcons).toHaveBeenCalledTimes(
      previousIconLoadCount + 1,
    );
  });

  it("uses a larger favorites filter and a compact section header", async () => {
    const { getByTestId } = render(<HomeScreen />);
    await waitFor(() => expect(storage.getSettings).toHaveBeenCalled());

    const filterStyle = StyleSheet.flatten(
      getByTestId("favorites-filter").props.style,
    );
    const headerStyle = StyleSheet.flatten(
      getByTestId("home-section-header").props.style,
    );

    expect(filterStyle.width).toBe(34);
    expect(filterStyle.height).toBe(34);
    expect(headerStyle.paddingTop).toBe(6);
  });

});
