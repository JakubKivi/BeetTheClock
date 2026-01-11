import React from "react";
import { render, fireEvent } from "@testing-library/react-native";
import ProduceCard from "../ProduceCard";
import { Produce } from "../../types";

const mockProduce: Produce = {
  id: "1",
  name: "Pumpkin",
  category: "vegetable", // <- WAŻNE
  months: [9, 10],
  emoji: "🎃",
};

describe("ProduceCard", () => {
  it("renders emoji when no iconUri", () => {
    const { getByText } = render(
      <ProduceCard
        item={mockProduce}
        onPickImage={jest.fn()}
        onPress={jest.fn()}
      />
    );

    expect(getByText("🎃")).toBeTruthy();
  });

  it("calls onPickImage when icon pressed", () => {
    const onPickImage = jest.fn();

    const { getByText } = render(
      <ProduceCard
        item={mockProduce}
        onPickImage={onPickImage}
        onPress={jest.fn()}
      />
    );

    fireEvent.press(getByText("🎃"));
    expect(onPickImage).toHaveBeenCalledWith("1");
  });
});
