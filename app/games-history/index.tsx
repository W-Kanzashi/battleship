import React, { useEffect, useState } from "react";
import { FlatList, View, Text, StyleSheet } from "react-native";
import { db } from "@/utils/database/database";
import { useGameBoard } from "@/utils/store/game";

const GameHistoryScreen = () => {
  const {} = useGameBoard();
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchGameHistory = async () => {
      try {
        const history = db.getGameHistory();
        setGameHistory(history);
      } catch (error) {
        console.error("Error fetching game history:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchGameHistory();
  }, []); // Ce useEffect se lance une fois lors du montage du composant

  // Si les données sont en cours de chargement
  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={gameHistory}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.cardTitle}>
              {item.player1} vs {item.player2}
            </Text>
            <Text>Date: {item.date}</Text>
            <Text>Gagnant: {item.winner}</Text>
            <Text>Nombre de coups: {item.movesCount}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: "#f9f9f9",
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  cardTitle: {
    fontWeight: "bold",
    fontSize: 16,
    marginBottom: 8,
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default GameHistoryScreen;
