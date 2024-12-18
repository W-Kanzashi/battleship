import { Button, Pressable, StyleSheet } from "react-native";

import { Text, View } from "@/components/Themed";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Home() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>BattleShip</Text>
        <View
          style={styles.separator}
          lightColor="#eee"
          darkColor="rgba(255,255,255,0.1)"
        />
        <Link href="/new-game" style={styles.pressableButton} asChild>
          <Pressable>
            <Text style={styles.buttonText}>New game</Text>
          </Pressable>
        </Link>
        <Link href="/rules" style={styles.pressableButton} asChild>
          <Pressable>
            <Text style={styles.buttonText}>Rules</Text>
          </Pressable>
        </Link>
        <Link href="/games-history" style={styles.pressableButton} asChild>
          <Pressable>
            <Text style={styles.buttonText}>Games history</Text>
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
    paddingTop: 30,
    fontSize: 35,
    fontWeight: "bold",
  },
  separator: {
    marginVertical: 30,
    height: 1,
    width: "80%",
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
    textTransform: "uppercase",
    fontSize: 18,
  },
});
