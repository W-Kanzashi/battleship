import { ReactNode } from "react";
import { View, Text, StyleSheet, ViewStyle, StyleProp } from "react-native";
import { useGameBoard } from "@/utils/store/game";
import { Cell } from "./cell";

const CELL_SIZE = 30;

function Board(props: { children: ReactNode }) {
  return <View>{props.children}</View>;
}

function BoardGrid(props: { children: ReactNode }) {
  const { playerTurn, players } = useGameBoard();

  if (!players) {
    throw new Error(
      "Player must be in the game board. Check out the initialisation of the game board",
    );
  }

  return (
    <View
      style={{
        flexDirection: "row",
      }}
    >
      {props.children}

      <View>
        {players[playerTurn].board.map((rowArray, row) => {
          return (
            <View key={row} style={styles.row}>
              {rowArray.map((colData, col) => {
                return (
                  <Cell
                    key={`${row}-${col}`}
                    col={col}
                    row={row}
                    colData={colData}
                  />
                );
              })}
            </View>
          );
        })}
      </View>
    </View>
  );
}

type BoardInfoProps = {
  type?: "numeric" | "alpha";
  length?: number;
  style?: StyleProp<ViewStyle>;
};

function BoardInfo({ type = "numeric", length = 10, style }: BoardInfoProps) {
  const rowInfo = Array.from({ length: length }, (_, index) => {
    switch (type) {
      case "numeric":
        return index + 1;
      case "alpha":
        return String.fromCharCode(65 + index);
    }
  });

  return (
    <View
      style={[
        {
          flexDirection: "row",
          marginLeft: CELL_SIZE,
        },
        style,
      ]}
    >
      {rowInfo.map((info, index) => {
        return (
          <View
            key={index}
            style={{
              width: CELL_SIZE,
              aspectRatio: 1,
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Text>{info}</Text>
          </View>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
});

export { Board, BoardGrid, BoardInfo };
