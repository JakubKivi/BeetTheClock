import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { Produce } from "../types";

type Props = {
  item: Produce;
  iconUri?: string;
  onPickImage: (id: string) => void;
  onResetIcon?: (id: string) => void;
  onPress: () => void;
};

const ICON_SIZE = 40;

const ProduceCard: React.FC<Props> = ({ item, iconUri, onPickImage, onResetIcon, onPress }) => {
  return (
    <View style={styles.card}>
      <View style={styles.leftContainer}>
        <View style={ styles.iconContainer }>
          <TouchableOpacity 
          testID="pick-image"
          onPress={() => onPickImage(item.id)} style={styles.iconSlot}>
            {iconUri ? (
              <Image source={{ uri: iconUri }} style={styles.iconImage} />
            ) : item.emoji ? (
              <Text style={styles.emoji}>{item.emoji}</Text>
            ) : (
              <View style={styles.emptyIcon} />
            )}
          </TouchableOpacity>

          {iconUri && onResetIcon && (
            <TouchableOpacity
            testID="reset-icon"
              onPress={() => onResetIcon(item.id)}
              style={styles.resetButton}
            >
              <Text style={styles.resetText}>X</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.textContainer}>
          <Text style={styles.name}>{item.name}</Text>
          <Text style={styles.category}>{item.category.toUpperCase()}</Text>
        </View>
      </View>

      <TouchableOpacity 
      testID="share-sms"
      style={styles.button} onPress={onPress}>
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
  leftContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
  },
  iconSlot: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    alignItems: "center",
    justifyContent: "center",
  },
  iconImage: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: 6,
  },
  iconContainer: {
  position: "relative", // <--- bardzo ważne
  width: ICON_SIZE + 10,
  height: ICON_SIZE + 10,
  marginRight: 12,
  justifyContent: "center",
  alignItems: "center",
},
  emptyIcon: {
    width: ICON_SIZE,
    height: ICON_SIZE,
    borderRadius: ICON_SIZE / 2,
    borderWidth: 4,
    borderColor: "#6b1d52",
  },
  emoji: {
    fontSize: 30,
  },
  textContainer: {
    marginLeft: 12,
  },
  name: {
    fontSize: 18,
    fontWeight: "600",
  },
  category: {
    fontSize: 10,
    color: "#666",
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
  resetButton: {
    position: "absolute",
    top: -5,
    right: -5,
    backgroundColor: "red",
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10
  },
  resetText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "bold",
  },
});

export default ProduceCard;
