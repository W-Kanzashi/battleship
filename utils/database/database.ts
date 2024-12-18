import * as SQLite from 'expo-sqlite';
import { Game } from './databaseTypes';

const db = await SQLite.openDatabaseAsync('battleship.db');

export const createHistoryTable = async (): Promise<void> => {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS history (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      player1 TEXT NOT NULL,
      player2 TEXT NOT NULL,
      date TEXT NOT NULL,
      winner TEXT NOT NULL,
      moves_count INTEGER
    );
  `);
  console.log("Table 'history' créée avec succès.");
};


export const addGameToHistory = async (game: Game): Promise<void> => {
  const { player1, player2, date, winner, movesCount } = game;

  await db.runAsync(
    `INSERT INTO history (player1, player2, date, winner, moves_count) 
     VALUES (?, ?, ?, ?, ?)`,
    [player1, player2, date, winner, movesCount]
  );
  console.log("Partie ajoutée à l'historique.");
};

export const getGameHistory = async (): Promise<Game[]> => {
    const result = await db.getAllAsync<Game>('SELECT * FROM history ORDER BY date DESC');
    return result;
  };
