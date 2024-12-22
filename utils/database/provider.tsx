import { ReactNode, createContext, useContext } from "react";
import * as SQLite from "expo-sqlite";
import { z } from "zod";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";

const gameHistorySchema = z.object({
  id: z.number(),
  player1: z.string(),
  player2: z.string(),
  date: z.string(),
  winner: z.string(),
});

type GameHistory = z.infer<typeof gameHistorySchema>;

const gameStateSchema = z.object({
  id: z.number(),
  data: z.array(
    z.object({
      player: z.coerce.number(),
      move: z.object({
        x: z.coerce.number(),
        y: z.coerce.number(),
      }),
      isShip: z.coerce.boolean(),
    }),
  ),
});

type DatabaseContext = {
  getGameHistoryById: (id: string) => GameHistory | null;
  getGame: (id: string) => GameState | null;
  saveGame: (data: GameState) => {
    code: number;
    message: string;
  };
};

type GameState = z.infer<typeof gameStateSchema>;

const databaseContext = createContext<DatabaseContext | null>(null);

export function useSQLiteContext() {
  const context = useContext(databaseContext);

  if (!context) {
    throw new Error("Database context not found");
  }

  return context;
}

export function SQLiteDatabaseProvider({ children }: { children: ReactNode }) {
  const db = SQLite.useSQLiteContext();
  useDrizzleStudio(db);

  const getGameHistoryById = (id: string) => {
    const data = db.getFirstSync(
      `SELECT * FROM game_history WHERE id = ${id} LIMIT 1`,
    );

    const validatedData = gameHistorySchema.safeParse(data);

    if (!validatedData.success) {
      return null;
    }

    return validatedData.data;
  };

  const saveGame = (data: GameState) => {
    const validatedData = gameStateSchema.safeParse(data);

    if (!validatedData.success) {
      throw new Error("Invalid data");
    }

    db.runSync(
      "INSERT INTO game_state (game_id, data) VALUES (?, ?)",
      validatedData.data.id,
      JSON.stringify(validatedData.data.data),
    );

    return {
      code: 200,
      message: "Game saved successfully",
    };
  };

  const getGame = (id: string) => {
    const result = db.getFirstSync(
      `SELECT * FROM game_state WHERE game_id = ${id} LIMIT 1`,
    );

    const validatedData = gameStateSchema.safeParse({
      // NOTE: Prevent TS from complaining about the type
      // @ts-expect-error - Don't need to type this. It's going to be validated
      id: result.game_id,
      // @ts-expect-error - Don't need to type this either
      data: JSON.parse(result.data),
    });

    if (!validatedData.success) {
      return null;
    }

    return validatedData.data;
  };

  return (
    <databaseContext.Provider value={{ getGameHistoryById, getGame, saveGame }}>
      {children}
    </databaseContext.Provider>
  );
}
