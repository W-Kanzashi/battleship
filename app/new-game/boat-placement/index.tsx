import { Button, Pressable, StyleSheet, TextInput } from "react-native";

import { Text, View } from "@/components/Themed";
import { Link } from "expo-router";
import React from "react";
import { AntDesign } from "@expo/vector-icons";
import { Image } from "expo-image";

export default function BoatPlacement() {
  return (
    <View style={styles.container}>
      <Link href="/new-game" style={styles.backButton} asChild>
        <Pressable>
          <AntDesign name="arrowleft" size={24} color="white" />
        </Pressable>
      </Link>
      <Text style={styles.title}>Player name, place your boats</Text>
      <View>
        <Pressable style={styles.pressableButton}>
          <Text style={styles.buttonText}>Confirm placement</Text>
        </Pressable>
        <Image></Image>
      </View>
      <Image></Image>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  title: {
    paddingVertical: 30,
    fontSize: 25,
    fontWeight: "bold",
    textAlign: "center",
    paddingHorizontal: 4,
  },
  backButton: {
    marginTop: 5,
    marginLeft: 5,
    paddingHorizontal: 5,
    paddingVertical: 3,
    alignSelf: "flex-start",
    backgroundColor: "#3e66bd",
    borderRadius: 5,
  },
  pressableButton: {
    backgroundColor: "#3e66bd",
    minWidth: 100,
    paddingVertical: 6,
    paddingHorizontal: 4,
    marginBottom: 20,
    borderStyle: "solid",
    borderWidth: 2,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 15,
  },
});
