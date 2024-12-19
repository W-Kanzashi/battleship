// import * as SQLite from 'expo-sqlite';

// export class DatabaseManager {
//   private db;

//   constructor() {
//     this.db = SQLite.openDatabaseAsync('battle_game.db');
//     this.init();
//   }

//   private async init() {
//     await (await this.db).execAsync(`
//       PRAGMA journal_mode = WAL;
//       CREATE TABLE IF NOT EXISTS game_history (
//         id INTEGER PRIMARY KEY NOT NULL,
//         player1 TEXT NOT NULL,
//         player2 TEXT NOT NULL,
//         date TEXT NOT NULL,
//         winner TEXT NOT NULL,
//         moves INTEGER
//       );
//     `);
//   }

//   public async getGameHistory() {
//     const result = await (await this.db).getAllAsync('SELECT * FROM game_history');
//     return result.map((row: any) => ({
//       id: row.id,
//       player1: row.player1,
//       player2: row.player2,
//       date: row.date,
//       winner: row.winner,
//       movesCount: row.moves,
//     }));
//   }

//   public async addGame(player1: string, player2: string, winner: string, moves: number) {
//     const date = new Date().toISOString();
//     const result = await (await this.db).runAsync(
//       'INSERT INTO game_history (player1, player2, date, winner, moves) VALUES (?, ?, ?, ?, ?)',
//       player1, player2, date, winner, moves
//     );
//     return result.lastInsertRowId;
//   }
// }
