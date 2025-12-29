import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Produce } from "../types";

interface Props {
  item: Produce;
  onPress: () => void;
}

const ProduceCard: React.FC<Props> = ({ item, onPress }) => {
  const hasEmoji = item.emoji && item.emoji.trim().length > 0;

  return (
    <View style={styles.card}>
      {/* Container for Emoji and Text combined */}
      <View style={styles.leftContainer}>
        {/* WARUNEK: Jeśli jest emoji, pokaż tekst, jeśli nie - kółko */}
        {hasEmoji ? (
          <Text style={styles.emoji}>{item.emoji}</Text>
        ) : (
          <View style={styles.emptyCircle} />
        )}

        {/* Container for Name and Category stacked vertically */}
        <View style={styles.textContainer}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.category}>{item.category.toUpperCase()}</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button} onPress={onPress}>
        <Text style={styles.buttonText}>Share SMS</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 10,
    marginVertical: 8,
    flexDirection: "row", // Horizontal layout for the whole card
    justifyContent: "space-between", // Push left content and button apart
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
  },
  leftContainer: {
    flexDirection: "row", // Horizontal layout for emoji and text block
    alignItems: "center",
    flex: 1, // Take up available space pushing button to the right
  },
  textContainer: {
    marginLeft: 12,
    justifyContent: "center",
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
    color: "#000",
  },
  emoji: {
    fontSize: 30,
  },
  emptyCircle: {
    width: 35,
    height: 35,
    borderRadius: 17.5, // Połowa width/height robi idealne koło
    borderWidth: 4, // Grubość linii
    borderColor: "#6b1d52",
    backgroundColor: "transparent", // Pusty środek
  },
  category: {
    fontSize: 10,
    color: "#666",
    marginTop: 2,
  },
  button: {
    backgroundColor: "#6b1d52",
    padding: 8,
    borderRadius: 5,
    marginLeft: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 12,
  },
});

export default ProduceCard;
