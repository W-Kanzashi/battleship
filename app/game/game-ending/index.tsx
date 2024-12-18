import { Button, Pressable, StyleSheet } from "react-native";

import { Text, View } from "@/components/Themed";
import { Link } from "expo-router";
import React from "react";
import { SafeAreaView } from "react-native-safe-area-context";

export default function GameEnding() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={[styles.title, styles.winnerCase]}>Player 1 name</Text>
        <Text style={styles.winnerFont}>Winner</Text>
        <Text style={styles.title}>Player 2 name</Text>
        <Text style={styles.looserFont}>Looser</Text>
        <Link href="/home" style={styles.pressableButton} asChild>
          <Pressable>
            <Text style={styles.buttonText}>Return to home</Text>
          </Pressable>
        </Link>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 25,
    fontWeight: "bold",
  },
  winnerFont: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#31b540",
    paddingBottom: 25,
  },
  looserFont: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#b02d10",
  },
  winnerCase: {
    borderStyle: "solid",
    borderRadius: 5,
    borderWidth: 2,
    backgroundColor: "#31b540",
    padding: 2,
  },
  pressableButton: {
    backgroundColor: "#3e66bd",
    minWidth: 140,
    padding: 6,
    marginTop: 30,
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
