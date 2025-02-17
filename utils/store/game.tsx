import { useState, createContext, useContext, useEffect } from "react";
import { useRouter } from "expo-router";

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
  updateGameBoard: (x: number, y: number, isPlacedShip?: boolean) => void;
  validateShipPlacement: () => void;
  setBoatLength: (length: number) => void;
  turnBoatplacement: (
    length: number,
    direction: "horizontal" | "vertical",
  ) => void;
  updateBoatPlacement: (x: number, y: number) => void;
  changePlayerTurn: () => void;
  getGameState: () => GameState[];
  handleReplayMode: ({ mode }: { mode: "game" | "replay" }) => void;
  setBoatPlacement: (state: boolean) => void;
} | null>(null);

function GameBoardProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [isReplay, setIsReplay] = useState<boolean>(false);
  const [playerTurn, setPlayerTurn] = useState<number>(0);
  const [gameBoard, setGameBoard] = useState<Record<string, Player> | null>(
    null,
  );
  const [gameState, setGameState] = useState<GameState[]>([]);
  const [boatPlacement, setBoatPlacement] = useState(true);
  const [precedentBoat, setPrecedentBoat] = useState<precedentShip | null>(
    null,
  );
  const [boatSetupParameters, setBoatSetupParameters] =
    useState<ShipSetup | null>({ length: 2, direction: "horizontal" });

  function handleReplayMode({ mode }: { mode: "game" | "replay" }) {
    if (mode === "replay") {
      setIsReplay(true);
    }
  }

  function initializeGame(players: Player["name"][], size = 10) {
    setPrecedentBoat(null);
    setBoatSetupParameters({ length: 2, direction: "horizontal" });
    setPlayerTurn(0);

    let index = 0;

    const generateGame = players.reduce(
      (acc, player) => {
        acc[index] = {
          name: player,
          board: Array(size)
            .fill(0)
            .map(() => Array(size).fill(0)),
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
  
    //use the precedent placed boat and convert all his cells values from -1 to 2
    if (precedentBoat) {
      for (let i = 0; i < precedentBoat.length; i++) {
        // NOTE: Check the direction of the ship
        if (precedentBoat.direction === "horizontal") {
          if (playerData.board[precedentBoat.x][precedentBoat.y + i] === -1) {
            playerData.board[precedentBoat.x][precedentBoat.y + i] = 2; // Changé de 1 à 2
          }
        } else {
          if (playerData.board[precedentBoat.x + i][precedentBoat.y] === -1) {
            playerData.board[precedentBoat.x + i][precedentBoat.y] = 2; // Changé de 1 à 2
          }
        }
      }
    }
    
    // Mettre à jour le plateau avec les nouvelles données
    setGameBoard({
      ...gameBoard,
      [playerTurn]: playerData
    });
    
    setPrecedentBoat(null);
    
    return true;
  };

  //configure the current ship length
  const setBoatLength = (length: number) => {
    setBoatSetupParameters({
      length: length,
      direction: precedentBoat!.direction,
    });
  };

  const turnBoatplacement = (
    length: number,
    direction: "horizontal" | "vertical",
  ) => {
    if (!gameBoard) {
      return;
    }

    const playerData = {
      ...gameBoard[playerTurn],
    };

    setBoatSetupParameters({
      length: length,
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
      for (let i = 1; i < length; i++) {
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
    } else {
      setBoatSetupParameters({ length, direction });
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

    console.log("playerdata : " + playerData.board);

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
    console.log("player : " + playerTurn);
  };

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
  const updateGameBoard = (x: number, y: number) => {
    console.log(`Tir sur la case (${x}, ${y})`);
    
    if (boatPlacement) {
      console.log("Phase de placement en cours, tir non autorisé.");
      return;
    }
    
    if (!gameBoard) {
      console.log("Erreur : gameBoard non défini");
      return;
    }
    
    const opponent = playerTurn === 0 ? 1 : 0;
    const opponentData = JSON.parse(JSON.stringify(gameBoard[opponent])); // Deep Copy
    
    let isShip = false;
    
    if (opponentData.board[x][y] === 0) {
      console.log("Tir manqué !");
      opponentData.board[x][y] = 1; // Missed shot
    } else if (opponentData.board[x][y] === 2) {
      console.log("Tir touché !");
      opponentData.board[x][y] = 3; // Hit
      isShip = true;
      
      // Vérifier si le bateau entier est détruit
      const shipsEntry = Object.entries(opponentData.ships)
        .find(([_, value]) => Array.isArray(value) && value.some((p: Ship) => p.x === x && p.y === y));
      
      const ships: Ship[] | undefined = shipsEntry ? (shipsEntry[1] as Ship[]) : undefined;
      
      if (ships) {
        const hitShip = ships.find((p: Ship) => p.x === x && p.y === y);
        if (hitShip) {
          hitShip.state = false;
        }
        
        // Vérifier si tout le bateau est coulé
        const isSunk = ships.every((p: Ship) => !p.state);
        if (isSunk) {
          console.log("Bateau coulé !");
        }
        
        // Vérifier si la partie est terminée
        const allShipsSunk = Object.values(opponentData.ships)
          .every((ship) => Array.isArray(ship) && ship.every((cell: Ship) => !cell.state));
        
        if (allShipsSunk) {
          console.log("Le joueur " + (playerTurn + 1) + " a gagné !");
          router.push("/game/game-ending");
        }
      }
    } else {
      console.log("Case déjà touchée, action ignorée.");
      return;
    }
    
    setGameBoard(prevGameBoard => {
      if (!prevGameBoard) {
        return prevGameBoard;
      }
      const newBoard = { ...prevGameBoard, [opponent]: opponentData }; // Nouvelle référence
      console.log("Mise à jour du gameBoard :", newBoard);
      return newBoard;
    });
    
    setGameState(prevGameState => {
      const newGameState = [...prevGameState, { player: playerTurn, move: { x, y }, isShip }];
      console.log("Nouvel état du jeu :", newGameState);
      return newGameState;
    });
    
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
        playerTurn,
        initializeGame,
        getGameState,
        updateGameBoard,
        updateBoatPlacement,
        validateShipPlacement,
        setBoatLength,
        turnBoatplacement,
        changePlayerTurn,
        handleReplayMode,
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