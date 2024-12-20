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
  /**
   * A Record of ships placed on the board
   *
   * The form of a record is like this
   * {
   *   1: [
   *     {
   *       x: number;
   *       y: number;
   *       state: boolean;
   *     }
   *   ],
   *   2: [
   *     {
   *       x: number;
   *       y: number;
   *       state: boolean;
   *     }
   *   ],
   *   3: [
   *     {
   *       x: number;
   *       y: number;
   *       state: boolean;
   *     }
   *   ]
   * }
   */
  ships: Record<string, Ship[]>;
};

/**
 * This is the ship data
 * NOTE: Add more data to it if needed
 */
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

const gameBoardArray: number[][] = Array(10)
  .fill(0)
  .map(() => Array(10).fill(0));

const GameContext = createContext<{
  /**
   * The players object contains the player data
   * like the name, the current boar and all ships placed on the board
   */
  players: Record<string, Player> | null;
  /**
   * Save the current player turn
   */
  playerTurn: number;
  /**
   * Initialize the game board with minimal data
   */
  initializeGame: (player1: Player["name"], player2: Player["name"]) => void;
  placeShip: (
    name: 1 | 2 | 3 | 4,
    start: {
      x: number;
      y: number;
    },
    direction: "horizontal" | "vertical",
  ) => void;
  updateGameBoard: (x: number, y: number) => void;
  changePlayerTurn: () => void;
} | null>(null);

function GameBoardProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [playerTurn, setPlayerTurn] = useState<number>(0);
  const [gameBoard, setGameBoard] = useState<Record<string, Player> | null>(
    null,
  );

  // WARN: Delete this if the implementation of initializeGame is done
  // This is a temporary implementation
  useEffect(() => {
    if (!gameBoard) {
      initializeGame("Player 1", "Player 2");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  /**
   * Place a ship on the board
   * The ship will be place on the board with ether horizontal or vertical direction
   */
  function placeShip(
    name: keyof typeof shipArray,
    start: {
      x: number;
      y: number;
    },
    direction: "horizontal" | "vertical" = "horizontal",
  ) {
    if (!gameBoard) {
      return;
    }

    const playerData = {
      ...gameBoard[playerTurn],
    };

    // NOTE: Place a new ship on the board without the coordinates
    playerData.ships = {
      ...playerData.ships,
      [name]: [],
    };

    // NOTE: Place the ship coordinates on the board
    for (let i = 0; i < shipArray[name].length; i++) {
      // NOTE: Check the direction of the ship
      if (direction === "horizontal") {
        playerData.ships[name][i] = { x: start.x, y: start.y + i, state: true };
        playerData.board[start.x][start.y + i] = 1;

        continue;
      }

      playerData.ships[name][i] = { x: start.x + i, y: start.y, state: true };
      playerData.board[start.x + i][start.y] = 1;
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

      const ships = Object.entries(playerData.ships)
        .find(
          ([_key, value]) =>
            value.find((p) => p.x === x) && value.find((p) => p.y === y),
        )?.[1]
        .find((p) => p.x === x && p.y === y);

      if (ships) {
        ships.state = false;

        if (
          Object.entries(playerData.ships).every(([_, p]) =>
            p.every((k) => k.state === false),
          )
        ) {
          router.push("/game/end");
        }
      }
    }

    setGameBoard({
      ...gameBoard,
      [playerTurn]: {
        ...playerData,
      },
    });
  };

  // TODO: Make this function dynamic to be able to play with different number of players
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
