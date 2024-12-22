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

type GameState = {
  player: number;
  move: {
    x: number;
    y: number;
  };
  isShip: boolean;
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
  initializeGame: (players: Player["name"][], size?: number) => void;
  placeShip: (
    name: keyof typeof shipArray,
    start: {
      x: number;
      y: number;
    },
    direction: "horizontal" | "vertical",
  ) => void;
  updateGameBoard: (x: number, y: number, isPlacedShip?: boolean) => void;
  changePlayerTurn: () => void;
  getGameState: () => GameState[];
  handleReplayMode: ({ mode }: { mode: "game" | "replay" }) => void;
} | null>(null);

function GameBoardProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isReplay, setIsReplay] = useState<boolean>(false);
  const [playerTurn, setPlayerTurn] = useState<number>(0);
  const [gameBoard, setGameBoard] = useState<Record<string, Player> | null>(
    null,
  );
  const [gameState, setGameState] = useState<GameState[]>([]);

  // WARN: Delete this if the implementation of initializeGame is done
  // This is a temporary implementation
  useEffect(() => {
    if (!gameBoard) {
      initializeGame(["Player 1", "Player 2"]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleReplayMode({ mode }: { mode: "game" | "replay" }) {
    if (mode === "replay") {
      setIsReplay(true);
    }
  }

  function initializeGame(players: Player["name"][], size = 10) {
    const gameBoardArray: number[][] = Array(size)
      .fill(0)
      .map(() => Array(size).fill(0));

    let index = 0;

    const generateGame = players.reduce(
      (acc, player) => {
        acc[index] = {
          name: player,
          board: gameBoardArray,
          ships: {},
        };

        index++;

        return acc;
      },
      {} as Record<string, Player>,
    );

    setGameBoard(generateGame);

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
        playerData.ships[name][i] = {
          x: start.x,
          y: start.y + i,
          state: true,
        };
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

  /**
   * Update the game board
   * The game board is a 2D array
   * The first dimension is the row
   * The second dimension is the column
   *
   * The value of the array is the state of the cell
   * 0 - Empty
   * 1 - Missile lauched
   * 2 - Ship
   * 3 - Destroyed and ship
   */
  const updateGameBoard = (
    x: number,
    y: number,
    /**
     * This is for the replay mode
     * it set if the selected cell is a ship
     */
    isPlacedShip: boolean = false,
  ) => {
    if (!gameBoard) {
      return;
    }

    const playerData = {
      ...gameBoard[playerTurn],
    };

    let isShip = false;

    if (playerData.board[x][y] === 0) {
      playerData.board[x][y] = 1;
    }

    if (playerData.board[x][y] === 2) {
      playerData.board[x][y] = 3;

      const ships = Object.entries(playerData.ships)
        .find(
          ([_key, value]) =>
            value.find((p) => p.x === x) && value.find((p) => p.y === y),
        )?.[1]
        .find((p) => p.x === x && p.y === y);

      if (ships) {
        ships.state = false;
        isShip = true;

        if (
          Object.entries(playerData.ships).every(([_, p]) =>
            p.every((k) => k.state === false),
          )
        ) {
          router.push("/game/game-ending");
        }
      }
    }

    if (isReplay && isPlacedShip) {
      playerData.board[x][y] = 3;
    }

    setGameBoard({
      ...gameBoard,
      [playerTurn]: {
        ...playerData,
      },
    });

    setGameState([
      ...gameState,
      {
        player: playerTurn,
        move: {
          x: x,
          y: y,
        },
        isShip: isShip,
      },
    ]);
  };

  // TODO: Make this function dynamic to be able to play with different number of players
  const changePlayerTurn = () => {
    setPlayerTurn(playerTurn === 0 ? 1 : 0);
  };

  const getGameState = () => {
    return gameState;
  };

  return (
    <GameContext.Provider
      value={{
        players: gameBoard,
        playerTurn: 0,
        placeShip,
        initializeGame,
        getGameState,
        updateGameBoard,
        changePlayerTurn,
        handleReplayMode,
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
