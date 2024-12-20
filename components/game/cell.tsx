import { useGameBoard } from "@/utils/store/game";
import { Pressable, StyleSheet } from "react-native";

type CellProps = {
  row: number;
  col: number;
  colData: number;
};

export function Cell(props: CellProps) {
  const { updateGameBoard } = useGameBoard();

  return (
    <Pressable
      onPress={() => updateGameBoard(props.row, props.col)}
      style={[
        styles.cell,
        props.colData === 1 && styles.cellLaunch,
        props.colData === 3 && styles.cellDestroy,
      ]}
    ></Pressable>
  );
}

const styles = StyleSheet.create({
  cell: {
    width: 30,
    aspectRatio: 1,
    borderWidth: 1,
    borderColor: "black",
  },
  cellLaunch: {
    backgroundColor: "yellow",
  },
  cellDestroy: {
    backgroundColor: "red",
  },
});
