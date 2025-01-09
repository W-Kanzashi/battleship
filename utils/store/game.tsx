import { useState, createContext, useContext, useEffect } from "react";
import { useRouter } from "expo-router";
import { db } from "@/utils/database/database";

type Ship = {
  x: number;
  y: number;
  state: boolean;
};

type precedentShip = {
  x: number;
  y: number;
  length: number;
  direction: "horizontal" | "vertical";
};

type ShipSetup = {
  length: number;
  direction: "horizontal" | "vertical";
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
    length: 2,
  },
  2: {
    length: 3,
  },
  3: {
    length: 4,
  },
  4: {
    length: 5,
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
  updateGameBoard: (x: number, y: number) => void;
  validateShipPlacement: () => void;
  setBoatLength: (length: number) => void;
  turnBoatplacement: (direction: "horizontal" | "vertical") => void;
  updateBoatPlacement: (x: number, y: number) => void;
  changePlayerTurn: () => void;
  getGameState: () => void;
  setBoatPlacement: (state: boolean) => void;
} | null>(null);

function GameBoardProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [playerTurn, setPlayerTurn] = useState<number>(0);
  const [gameBoard, setGameBoard] = useState<Record<string, Player> | null>(
    null,
  );
  const [gameState, setGameState] = useState<
    {
      player: number;
      move: {
        x: number;
        y: number;
      };
      isShip: boolean;
    }[]
  >([]);
  const [boatPlacement, setBoatPlacement] = useState(true);
  const [precedentBoat, setPrecedentBoat] = useState<precedentShip | null>(
    null,
  );
  const [boatSetupParameters, setBoatSetupParameters] =
    useState<ShipSetup | null>({ length: 2, direction: "horizontal" });

  function initializeGame(players: Player["name"][], size = 10) {
    setPrecedentBoat(null);
    setBoatSetupParameters({ length: 2, direction: "horizontal" });

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

  //check the cells around the selected cell to avoid close placement
  function checkCellValidity(x: number, y: number): boolean {
    if (!boatPlacement) {
      return false;
    }

    if (!gameBoard) {
      return false;
    }
    const playerData = {
      ...gameBoard[playerTurn],
    };

    if (x > 9 || y > 9) {
      return false;
    }

    if (
      playerData.board[x - 1 < 0 ? x : x - 1][y] === 1 ||
      playerData.board[x][y - 1] === 1 ||
      playerData.board[x + 1 > 9 ? x : x + 1][y] === 1 ||
      playerData.board[x][y + 1] === 1
    ) {
      return false;
    } else {
      return true;
    }
  }

  const validateShipPlacement = () => {
    if (!boatPlacement) {
      return false;
    }

    if (!gameBoard) {
      return false;
    }
    const playerData = {
      ...gameBoard[playerTurn],
    };

    //use the precedent placed boat and convert all his cells values from -1 to 1
    if (precedentBoat) {
      for (let i = 0; i < precedentBoat.length; i++) {
        // NOTE: Check the direction of the ship
        if (precedentBoat.direction === "horizontal") {
          if (playerData.board[precedentBoat.x][precedentBoat.y + i] === -1) {
            playerData.board[precedentBoat.x][precedentBoat.y + i] = 1;
          }
        } else {
          if (playerData.board[precedentBoat.x + i][precedentBoat.y] === -1) {
            playerData.board[precedentBoat.x + i][precedentBoat.y] = 1;
          }
        }
      }
    }
    setPrecedentBoat(null);
  };

  //configure the current ship length
  const setBoatLength = (length: number) => {
    setBoatSetupParameters({
      length: length,
      direction: precedentBoat!.direction,
    });
  };

  const turnBoatplacement = (direction: "horizontal" | "vertical") => {
    if (!gameBoard) {
      return;
    }

    const playerData = {
      ...gameBoard[playerTurn],
    };

    setBoatSetupParameters({
      length: precedentBoat!.length,
      direction: direction,
    });

    //check if all of the ship's cells are in a valid placement before rotating the ship
    if (precedentBoat) {
      for (let i = 1; i < precedentBoat.length; i++) {
        if (precedentBoat.direction === "horizontal") {
          if (playerData.board[precedentBoat.x][precedentBoat.y + i] === -1) {
            if (!checkCellValidity(precedentBoat.x + i, precedentBoat.y)) {
              console.log("turn error");
              return;
            }
          }
        } else {
          if (playerData.board[precedentBoat.x + i][precedentBoat.y] === -1) {
            if (!checkCellValidity(precedentBoat.x, precedentBoat.y + i)) {
              console.log("turn error");
              return;
            }
          }
        }
      }
      //rotate the ship cell by cell
      for (let i = 1; i < precedentBoat.length; i++) {
        // NOTE: Check the direction of the ship
        if (precedentBoat.direction === "horizontal") {
          if (playerData.board[precedentBoat.x][precedentBoat.y + i] === -1) {
            if (checkCellValidity(precedentBoat.x + i, precedentBoat.y)) {
              playerData.board[precedentBoat.x][precedentBoat.y + i] = 0;
              playerData.board[precedentBoat.x + i][precedentBoat.y] = -1;
            }
          } else {
            console.log("turn error");
            return;
          }
        } else {
          if (playerData.board[precedentBoat.x + i][precedentBoat.y] === -1) {
            if (checkCellValidity(precedentBoat.x, precedentBoat.y + i)) {
              playerData.board[precedentBoat.x + i][precedentBoat.y] = 0;
              playerData.board[precedentBoat.x][precedentBoat.y + i] = -1;
            }
          } else {
            console.log("turn error");
            return;
          }
        }
      }
      // playerData.board[precedentBoat.x][precedentBoat.y] = 0;

      setGameBoard({
        ...gameBoard,
        [playerTurn]: {
          ...playerData,
        },
      });

      setPrecedentBoat({
        x: precedentBoat.x,
        y: precedentBoat.y,
        length: precedentBoat.length,
        direction: direction,
      });
    }
  };

  const updateBoatPlacement = (x: number, y: number) => {
    if (!boatPlacement) {
      return;
    }

    if (!gameBoard) {
      return;
    }

    const playerData = {
      ...gameBoard[playerTurn],
    };

    if (playerData.board[x][y] === 1) {
      console.log("wrong placement");
      return;
    }

    for (let i = 0; i < boatSetupParameters!.length; i++) {
      if (boatSetupParameters!.direction === "horizontal") {
        if (!checkCellValidity(x, y + i)) {
          console.log("placement error");
          return;
        }
      } else {
        if (!checkCellValidity(x + i, y)) {
          console.log("placement error");
          return;
        }
      }
    }
    //display current boat on the grid
    for (let i = 0; i < boatSetupParameters!.length; i++) {
      // NOTE: Check the direction of the ship
      if (boatSetupParameters!.direction === "horizontal") {
        //check all free cases around the current one
        if (checkCellValidity(x, y + i)) {
          playerData.board[x][y + i] = -1;
        } else {
          console.log("placement error");
          return;
        }
      } else {
        if (checkCellValidity(x + i, y)) {
          playerData.board[x + i][y] = -1;
        } else {
          console.log("placement error");
          return;
        }
      }
    }

    //delete precedent ship of the grid
    if (precedentBoat) {
      for (let i = 0; i < precedentBoat.length; i++) {
        // NOTE: Check the direction of the ship
        if (precedentBoat.direction === "horizontal") {
          if (playerData.board[precedentBoat.x][precedentBoat.y + i] === -1) {
            playerData.board[precedentBoat.x][precedentBoat.y + i] = 0;
          }
        } else {
          if (playerData.board[precedentBoat.x + i][precedentBoat.y] === -1) {
            playerData.board[precedentBoat.x + i][precedentBoat.y] = 0;
          }
        }
      }
    }

    setGameBoard({
      ...gameBoard,
      [playerTurn]: {
        ...playerData,
      },
    });

    if (boatSetupParameters) {
      setPrecedentBoat({
        x: x,
        y: y,
        length: boatSetupParameters?.length,
        direction: boatSetupParameters?.direction,
      });
    }
  };

  /**
   * Update the game board
   * The game board is a 2D array
   * The first dimension is the row
   * The second dimension is the column
   *
   * The value of the array is the state of the cell
   * 0 - Empty
   * 1 - Ship
   * 2 - Destroyed
   * 3 - Destroyed and ship
   */
  const updateGameBoard = (x: number, y: number) => {
    if (boatPlacement) {
      return;
    }

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

  return (
    <GameContext.Provider
      value={{
        players: gameBoard,
        playerTurn: 0,
        placeShip,
        initializeGame,
        updateGameBoard,
        updateBoatPlacement,
        validateShipPlacement,
        setBoatLength,
        turnBoatplacement,
        changePlayerTurn,
        setBoatPlacement,
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
