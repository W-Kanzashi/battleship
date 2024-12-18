import { Button, Pressable, StyleSheet, TextInput } from "react-native";

import { Text, View } from "@/components/Themed";
import { Link } from "expo-router";
import React from "react";
import AntDesign from "@expo/vector-icons/AntDesign";
import { SafeAreaView } from "react-native-safe-area-context";

export default function NewGame() {
  const [playeOneName, onChangePlayerOneName] = React.useState("");
  const [playeTwoName, onChangePlayerTwoName] = React.useState("");

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Link href="/home" style={styles.backButton} asChild>
          <Pressable>
            <AntDesign name="arrowleft" size={24} color="white" />
          </Pressable>
        </Link>
        <Text style={styles.title}>Start a new game</Text>
        <Text style={styles.placeholder}>Enter player 1 name</Text>
        <TextInput
          style={styles.nameInput}
          value={playeOneName}
          maxLength={10}
          onChangeText={onChangePlayerOneName}
          placeholder="Player 1 name"
        />
        <Text style={styles.placeholder}>Enter player 2 name</Text>
        <TextInput
          style={styles.nameInput}
          value={playeTwoName}
          maxLength={10}
          onChangeText={onChangePlayerTwoName}
          placeholder="Player 2 name"
        />

        <Link
          href="/new-game/boat-placement"
          style={styles.pressableButton}
          asChild
        >
          <Pressable>
            <Text style={styles.buttonText}>Start boats placement</Text>
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
    justifyContent: "flex-start",
  },
  title: {
    paddingVertical: 30,
    fontSize: 25,
    fontWeight: "bold",
  },
  placeholder: {
    fontSize: 20,
    marginBottom: 4,
  },
  nameInput: {
    borderStyle: "solid",
    borderWidth: 2,
    borderRadius: 5,
    paddingVertical: 4,
    paddingHorizontal: 2,
    textAlign: "center",
    marginBottom: 15,
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
    minWidth: 180,
    padding: 6,
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
