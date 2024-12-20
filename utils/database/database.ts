import * as SQLite from "expo-sqlite";

class DatabaseManager {
  private db: SQLite.SQLiteDatabase;

  constructor() {
    this.db = SQLite.openDatabaseSync("battle_game.db");
    this.init();
  }

  private init() {
    this.db.execSync(`
      PRAGMA journal_mode = WAL;
      CREATE TABLE IF NOT EXISTS game_history (
        id INTEGER PRIMARY KEY NOT NULL,
        player1 TEXT NOT NULL,
        player2 TEXT NOT NULL,
        date TEXT NOT NULL,
        winner TEXT NOT NULL,
        moves INTEGER
        game_state INTEGER
      );

      CREATE TABLE IF NOT EXISTS game_state (
        id INTEGER PRIMARY KEY NOT NULL,
        game_id INTEGER NOT NULL,
        data TEXT NOT NULL
      );
    `);
  }

  public getGameHistory() {
    const result = this.db.getAllSync("SELECT * FROM game_history");

    return result.map((row: any) => ({
      id: row.id,
      player1: row.player1,
      player2: row.player2,
      date: row.date,
      winner: row.winner,
      movesCount: row.moves,
    }));
  }

  public addGame(
    player1: string,
    player2: string,
    winner: string,
    moves: number,
  ) {
    const date = new Date().toISOString();

    const result = this.db.runSync(
      "INSERT INTO game_history (player1, player2, date, winner, moves) VALUES (?, ?, ?, ?, ?)",
      player1,
      player2,
      date,
      winner,
      moves,
    );
    return result.lastInsertRowId;
  }

  public saveGameState(gameId: number, data: string) {
    this.db.runSync(
      "INSERT INTO game_state (game_id, data) VALUES (?, ?)",
      gameId,
      data,
    );
  }
}

export const db = new DatabaseManager();
