import { Button, Pressable, StyleSheet } from "react-native";

import { Text, View } from "@/components/Themed";
import { Link } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Rules() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Link href="/home" style={styles.backButton} asChild>
          <Pressable>
            <AntDesign name="arrowleft" size={24} color="white" />
          </Pressable>
        </Link>
        <Text style={styles.title}>Rules</Text>
        <Text style={styles.rules}>
          How do you play Battleship? The game is pretty straightforward. Each
          player places ships on a grid containing vertical and horizontal
          coordinates, but players keep their ships' locations secret from their
          opponent. Players take turns calling out row and column coordinates on
          the other player's grid by selecting a case in an attempt to identify
          a square that contains a ship.
        </Text>
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
  backButton: {
    marginTop: 5,
    marginLeft: 5,
    paddingHorizontal: 5,
    paddingVertical: 3,
    alignSelf: "flex-start",
    backgroundColor: "#3e66bd",
    borderRadius: 5,
  },
  rules: {
    paddingHorizontal: 10,
  },
});
