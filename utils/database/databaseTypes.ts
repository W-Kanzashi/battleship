export interface Game {
  id?: number;
  player1: string;
  player2: string;
  date: string;
  winner: string;
  movesCount: number | null;
}

