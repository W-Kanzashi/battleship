import { Pressable, StyleSheet, View, Alert } from "react-native";
import { Text } from "@/components/Themed";
import { SafeAreaView } from "react-native-safe-area-context";
import { useState, useEffect } from "react";
import { useGameBoard } from "@/utils/store/game";

export default function GameScreen() {
  const { players, playerTurn, updateGameBoard, changePlayerTurn } = useGameBoard();

  if (!players) return <Text>Chargement du jeu...</Text>;

  const opponent = playerTurn === 0 ? 1 : 0;
  const opponentBoard = players[opponent]?.board ?? [];
  const currentPlayerName = players[playerTurn]?.name || `Player ${playerTurn + 1}`;
  const opponentName = players[opponent]?.name || `Player ${opponent + 1}`;

  const [selectedCell, setSelectedCell] = useState<{ x: number; y: number } | null>(null);
  const [message, setMessage] = useState(`C'est à ${currentPlayerName} de jouer`);
  const [refreshKey, setRefreshKey] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [sunkShips, setSunkShips] = useState<number>(0);

  useEffect(() => {
    setMessage(`C'est à ${currentPlayerName} de jouer`);
  }, [playerTurn, currentPlayerName]);

  const handleSelectCell = (x: number, y: number) => {
    if (opponentBoard[x][y] === 1 || opponentBoard[x][y] === 3) {
      return;
    }
    setSelectedCell({ x, y });
  };

  const handleFire = (): void => {
    if (gameOver) {
      return;
    }
    if (gameOver) return;
    if (!selectedCell) {
      setGameOver(true);
        Alert.alert("Erreur", "Veuillez sélectionner une case avant de tirer");
      return;
    }

    const { x, y } = selectedCell;
    const cellValue = opponentBoard[x][y];
    updateGameBoard(x, y);
      if (cellValue === 2) {
        const allShipsSunk = opponentBoard.flat().every(cell => cell !== 2);
        if (allShipsSunk) {
          setGameOver(true);
          Alert.alert(
            "Victoire !",
            `${currentPlayerName} a gagné la partie en coulant tous les bateaux de ${opponentName} !`
          );
          return;
        }
      }

    if (cellValue === 2) {
      updateGameBoard(x, y);
      setMessage(`${currentPlayerName} a touché un bateau de ${opponentName} !`);

      // Vérifie si tous les bateaux ont été coulés
      const allShipsSunk = opponentBoard.flat().every(cell => cell !== 2);

      if (allShipsSunk) {
        setGameOver(true);
        setGameOver(true);
        Alert.alert(
          "Victoire !",
          `${currentPlayerName} a gagné la partie en coulant tous les bateaux de ${opponentName} !`
        );
        setMessage(`${currentPlayerName} a gagné la partie en coulant tous les bateaux de ${opponentName} !`);
        Alert.alert(
          "Victoire !",
          `${currentPlayerName} a gagné la partie en coulant tous les bateaux de ${opponentName} !`
        );
      }
    } else {
      setMessage(`${currentPlayerName} a manqué sa cible !`);
      if (!gameOver) {
      changePlayerTurn();
      setTimeout(() => changePlayerTurn(), 1000);
    }
    }

    setSelectedCell(null);
    setRefreshKey(prev => prev + 1);
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View style={styles.container}>
        <Text style={styles.title}>Bataille Navale</Text>
        <Text style={styles.message}>{message}</Text>

        <View style={styles.boardContainer} key={refreshKey}>
          <Text style={styles.boardLabel}>Plateau de {opponentName}</Text>
          <View style={styles.grid}>
            {opponentBoard.map((row, x) => (
              <View key={x} style={styles.row}>
                {row.map((cellValue, y) => (
                  <Pressable
                    key={y}
                    style={[styles.cell, selectedCell?.x === x && selectedCell?.y === y ? styles.selectedCell : null]}
                    onPress={() => handleSelectCell(x, y)}
                    disabled={cellValue === 1 || cellValue === 3}
                  >
                    <Text style={styles.cellText}>{cellValue === 3 ? "X" : cellValue === 1 ? "·" : ""}</Text>
                  </Pressable>
                ))}
              </View>
            ))}
          </View>
        </View>

        <Pressable 
          style={[styles.fireButton, !selectedCell && styles.disabledButton]} 
          onPress={handleFire}
          disabled={!selectedCell}
        >
          <Text style={styles.buttonText}>FIRE !!!</Text>
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: "#f0f0f0" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10 },
  message: { fontSize: 16, marginBottom: 15, fontStyle: "italic" },
  boardContainer: { alignItems: "center", marginVertical: 10 },
  boardLabel: { fontSize: 16, fontWeight: "600", marginBottom: 10 },
  grid: { borderWidth: 2, borderColor: "#333", backgroundColor: "#fff" },
  row: { flexDirection: "row" },
  cell: { width: 32, height: 32, borderWidth: 1, alignItems: "center", justifyContent: "center" },
  selectedCell: { backgroundColor: "#ffff99", borderColor: "#ff9900", borderWidth: 2 },
  fireButton: { backgroundColor: "#e74c3c", padding: 12, borderRadius: 5, alignItems: "center" },
  disabledButton: { backgroundColor: "#ccc" },
  buttonText: { color: "#ffffff", fontSize: 18, fontWeight: "bold" },
  cellText: { fontWeight: "bold", fontSize: 20 }
});
