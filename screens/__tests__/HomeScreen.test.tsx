import React from "react";
import { render, fireEvent, waitFor } from "@testing-library/react-native";
import HomeScreen from "../HomeScreen";
import { PRODUCE_DATA } from "../../constants/produce";
import * as storage from "../../services/storage";
import * as newIcon from "../../services/newIcon";
import * as SMS from "expo-sms";

// mock navigation
const navigateMock = jest.fn();
jest.mock("@react-navigation/native", () => ({
  useNavigation: () => ({
    navigate: navigateMock,
  }),
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

    expect(navigateMock).toHaveBeenCalledWith("Details", expect.any(Object));
  });
});
