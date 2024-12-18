import { DatabaseManager } from '@/utils/database/database';
import React, { useEffect, useState } from 'react';
import { FlatList, View, Text, StyleSheet, Button } from 'react-native';


const GameHistoryScreen = () => {
  const [gameHistory, setGameHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  
  // Création d'une instance de DatabaseManager
  const dbManager = new DatabaseManager();

  useEffect(() => {
    const fetchGameHistory = async () => {
      try {
        const history = await dbManager.getGameHistory();
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
      { player1: 'Alice', player2: 'Bob', winner: 'Alice', moves: 12 },
      { player1: 'Charlie', player2: 'David', winner: 'David', moves: 8 },
      { player1: 'Eve', player2: 'Frank', winner: 'Eve', moves: 15 },
      { player1: 'Grace', player2: 'Heidi', winner: 'Grace', moves: 10 },
      { player1: 'Ivan', player2: 'Judy', winner: 'Judy', moves: 20 }
    ];

    try {
      for (const game of fakeGames) {
        await dbManager.addGame(game.player1, game.player2, game.winner, game.moves);
      }
      // Rafraîchir l'historique des jeux après l'ajout
      const history = await dbManager.getGameHistory();
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
    <View style={styles.container}>
      {/* Bouton pour générer des données factices */}
      <Button title="Générer des parties factices" onPress={generateFakeData} />

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
    backgroundColor: '#f9f9f9',
    padding: 16,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  cardTitle: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 8,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default GameHistoryScreen;
