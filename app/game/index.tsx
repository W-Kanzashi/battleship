import { Pressable, StyleSheet } from "react-native";

import { Text, View } from "@/components/Themed";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";
import { Board, BoardGrid, BoardInfo } from "@/components/game/board";

export default function TabOneScreen() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Link href="/" style={styles.backButton} asChild>
          <Pressable>
            <AntDesign name="arrowleft" size={24} color="white" />
          </Pressable>
        </Link>
        <View style={styles.subContainer}>
          <View style={styles.twoColumnsView}>
            <Text style={styles.playerName}>Player 1</Text>
            <Text style={styles.playerName}>Player 2</Text>
          </View>
          <View style={styles.twoColumnsView}>
            <Pressable style={styles.pressableButton}>
              <Text style={styles.buttonText}>Switch grid</Text>
            </Pressable>
            <Pressable style={styles.pressableButton}>
              <Text style={styles.buttonText}>FIRE !!!</Text>
            </Pressable>
          </View>
        </View>

        <Board>
          <BoardInfo type="alpha" />
          <BoardGrid>
            <BoardInfo
              style={{
                flexDirection: "column",
                marginLeft: 0,
              }}
            />
          </BoardGrid>
        </Board>
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
  playerName: {
    fontSize: 20,
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
  pressableButton: {
    backgroundColor: "#3e66bd",
    minWidth: 100,
    paddingVertical: 6,
    paddingHorizontal: 4,
    borderStyle: "solid",
    borderWidth: 2,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 15,
  },
  subContainer: {
    width: "100%",
  },
  twoColumnsView: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingBottom: 10,
  },
});
