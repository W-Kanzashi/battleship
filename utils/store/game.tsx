import { useState, createContext, useContext, useEffect } from "react";
import { useRouter } from "expo-router";

type Ship = {
  x: number;
  y: number;
  state: boolean;
};

type Player = {
  name: string;
  board: number[][];
  ships: Record<string, Ship[]>;
};

const shipArray = {
  1: {
    length: 5,
  },
  2: {
    length: 4,
  },
  3: {
    length: 3,
  },
  4: {
    length: 2,
  },
} as const;

const gameBoardArray: number[][] = Array(11)
  .fill(0)
  .map((_, index) => Array(11).fill(index === 3 ? 1 : 0));

const GameContext = createContext<{
  players: Record<string, Player> | null;
  playerTurn: number;
  initializeGame: (player1: Player["name"], player2: Player["name"]) => void;
  placeShip: (x: number, y: number) => void;
  updateGameBoard: (x: number, y: number) => void;
  changePlayerTurn: () => void;
} | null>(null);

function GameBoardProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [playerTurn, setPlayerTurn] = useState<number>(0);
  const [gameBoard, setGameBoard] = useState<Record<string, Player> | null>(
    null,
  );

  useEffect(() => {
    if (!gameBoard) {
      initializeGame("Player 1", "Player 2");
    }
  }, []);

  function initializeGame(player1: Player["name"], player2: Player["name"]) {
    if (!gameBoard) {
      setGameBoard({
        [playerTurn]: {
          name: playerTurn === 0 ? player1 : player2,
          board: gameBoardArray,
          ships: {},
        },
        [playerTurn === 0 ? 1 : 0]: {
          name: playerTurn === 0 ? player2 : player1,
          board: gameBoardArray,
          ships: {},
        },
      });
    }

    return;
  }

  function placeShip(
    name: 1 | 2 | 3 | 4,
    start: {
      x: number;
      y: number;
    },
    end: {
      x: number;
      y: number;
    },
  ) {
    if (!gameBoard) {
      return;
    }

    const playerData = {
      ...gameBoard[playerTurn],
    };

    // NOTE: Place all ships on the board
    for (let i = 0; i < shipArray[name].length; i++) {
      playerData.ships[name][i] = { x: start.x, y: start.y, state: true };
    }

    setGameBoard({
      ...gameBoard,
      [playerTurn]: {
        ...playerData,
      },
    });
  }

  const updateGameBoard = (x: number, y: number) => {
    if (!gameBoard) {
      return;
    }

    const playerData = {
      ...gameBoard[playerTurn],
    };

    if (playerData.board[x][y] === 1) {
      playerData.board[x][y] = 2;

      const ships = Object.entries(playerData.ships).find(
        ([_key, value]) => value.x === x && value.y === y,
      );

      if (ships) {
        ships[1].state = false;
      }

      if (ships[1].state === false) {
        router.push("/game/end");
      }
    }

    setGameBoard({
      ...gameBoard,
      [playerTurn]: {
        ...playerData,
      },
    });
  };

  const changePlayerTurn = () => {
    setPlayerTurn(playerTurn === 0 ? 1 : 0);
  };

  return (
    <GameContext.Provider
      value={{
        players: gameBoard,
        playerTurn: 0,
        placeShip,
        initializeGame,
        updateGameBoard,
        changePlayerTurn,
      }}
    >
      {children}
    </GameContext.Provider>
  );
}

const useGameBoard = () => {
  const gameBoard = useContext(GameContext);

  if (!gameBoard) {
    throw new Error("Game Board  must be in Game provider");
  }

  return gameBoard;
};

export type { Player };

export { useGameBoard, GameBoardProvider };
