import { Button, Pressable, StyleSheet } from "react-native";

import { Text, View } from "@/components/Themed";
import { useGameBoard } from "@/utils/store/game";
import { Link } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign } from "@expo/vector-icons";

const CELL_SIZE = 35;

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export default function TabOneScreen() {
  const { playerTurn, players, updateGameBoard } = useGameBoard();

  console.log(">>> players", players, playerTurn);

  if (!players) {
    return null;
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Link href="/home" style={styles.backButton} asChild>
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
        <View>
          {players[playerTurn].board.map((rowArray, row) => {
            return (
              <View key={row} style={styles.row}>
                {rowArray.map((colData, col) => {
                  if (row === 0 && col === 0) {
                    return null;
                  }

                  if (row === 0) {
                    return (
                      <View
                        key={`${row}-${col}`}
                        style={{
                          width: CELL_SIZE,
                          aspectRatio: 1,
                          backgroundColor: "white",
                          alignItems: "flex-end",
                          justifyContent: "center",
                        }}
                      >
                        <Text>{ALPHABET[col - 1]}</Text>
                      </View>
                    );
                  }

                  if (col === 0) {
                    return (
                      <View
                        key={`${row}-${col}`}
                        style={{
                          width: CELL_SIZE,
                          aspectRatio: 1,
                          backgroundColor: "white",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        <Text>{row}</Text>
                      </View>
                    );
                  }

                  return (
                    <Pressable
                      key={`${row}-${col}`}
                      onPress={() => updateGameBoard(row, col)}
                      style={[
                        styles.cell,
                        colData === 1 && styles.cellX,
                        colData === 2 && styles.cellDestroy,
                      ]}
                    ></Pressable>
                  );
                })}
              </View>
            );
          })}
        </View>
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
  row: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  cell: {
    width: CELL_SIZE,
    aspectRatio: 1,
    borderWidth: 1,
    borderColor: "black",
  },
  cellX: {
    backgroundColor: "yellow",
  },
  cellDestroy: {
    backgroundColor: "red",
  },
});
