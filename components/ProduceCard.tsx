import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Produce } from "../types";

interface Props {
  item: Produce;
  onPress: () => void;
}

const ProduceCard: React.FC<Props> = ({ item, onPress }) => {
  return (
    <View style={styles.card}>
      <View>
        <Text style={styles.name}>{item.name}</Text>
        <Text style={styles.category}>{item.category.toUpperCase()}</Text>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#eee",
  },
  name: { fontSize: 18, fontWeight: "600" },
  category: { fontSize: 12, color: "#666" },
  button: { backgroundColor: "#6b1d52", padding: 8, borderRadius: 5 },
  buttonText: { color: "#fff", fontSize: 12 },
});

export default ProduceCard;
