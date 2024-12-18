import { Pressable, StyleSheet } from "react-native";

import { Text, View } from "@/components/Themed";
import { useGameBoard } from "@/utils/store/game";

const CELL_SIZE = 35;

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export default function TabOneScreen() {
  const { playerTurn, players, updateGameBoard } = useGameBoard();

  console.log(">>> players", players, playerTurn);

  if (!players) {
    return null;
  }

  return (
    <View style={styles.container}>
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
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
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
