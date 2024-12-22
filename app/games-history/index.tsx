import React, { useEffect, useState } from "react";
import { FlatList, View, Text, StyleSheet, Button } from "react-native";
import { db } from "@/utils/database/database";
import { SafeAreaView } from "react-native-safe-area-context";
import { useSQLiteContext } from "@/utils/database/provider";
import { Link } from "expo-router";

const GameHistoryScreen = () => {
  const [gameHistory, setGameHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const { saveGame } = useSQLiteContext();

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

  // Fonction pour générer des données factices
  const generateFakeData = async () => {
    const fakeGames = [
      { player1: "Alice", player2: "Bob", winner: "Alice", moves: 12 },
      { player1: "Charlie", player2: "David", winner: "David", moves: 8 },
      { player1: "Eve", player2: "Frank", winner: "Eve", moves: 15 },
      { player1: "Grace", player2: "Heidi", winner: "Grace", moves: 10 },
      { player1: "Ivan", player2: "Judy", winner: "Judy", moves: 20 },
    ];

    const fakeGamesHistory = {
      id: 1,
      data: [
        {
          player: 0,
          move: {
            x: 1,
            y: 1,
          },
          isShip: false,
        },
        {
          player: 1,
          move: {
            x: 1,
            y: 1,
          },
          isShip: false,
        },
        {
          player: 0,
          move: {
            x: 5,
            y: 8,
          },
          isShip: true,
        },
        {
          player: 1,
          move: {
            x: 3,
            y: 6,
          },
          isShip: false,
        },
      ],
    } satisfies {
      id: number;
      data: {
        player: number;
        move: {
          x: number;
          y: number;
        };
        isShip: boolean;
      }[];
    };

    try {
      for (const game of fakeGames) {
        db.addGame(game.player1, game.player2, game.winner, game.moves);
      }

      saveGame(fakeGamesHistory);

      // Rafraîchir l'historique des jeux après l'ajout
      const history = db.getGameHistory();

      setGameHistory(history);
    } catch (error) {
      console.error("Error generating fake data:", error);
    }
  };

  // Si les données sont en cours de chargement
  if (loading) {
    return (
      <View style={styles.center}>
        <Text>Chargement...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView
      style={{
        flex: 1,
      }}
    >
      <View style={styles.container}>
        {/* Bouton pour générer des données factices */}
        <Button
          title="Générer des parties factices"
          onPress={generateFakeData}
        />

        <FlatList
          data={gameHistory}
          keyExtractor={(item) => item.id.toString()}
          renderItem={({ item }) => (
            <Link href={`/games-history/${item.id}`} style={styles.card}>
              <View>
                <Text style={styles.cardTitle}>
                  {item.player1} vs {item.player2}
                </Text>
                <Text>Date: {item.date}</Text>
                <Text>Gagnant: {item.winner}</Text>
                <Text>Nombre de coups: {item.movesCount}</Text>
              </View>
            </Link>
          )}
        />
      </View>
    </SafeAreaView>
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
