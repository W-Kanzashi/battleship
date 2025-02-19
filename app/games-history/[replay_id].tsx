import { Board, BoardGrid, BoardInfo } from "@/components/game/board";
import { useSQLiteContext } from "@/utils/database/provider";
import { useGameBoard } from "@/utils/store/game";
import { AntDesign } from "@expo/vector-icons";
import { useQuery } from "@tanstack/react-query";
import { Link, useLocalSearchParams } from "expo-router";
import { useEffect, useState } from "react";
import { Pressable, Text, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function ReplayScreen() {
  const { replay_id } = useLocalSearchParams<{ replay_id: string }>();
  const [start, setStart] = useState<boolean>(false);
  const [move, setMove] = useState<number>(0);
  const { getGameHistoryById, getGame } = useSQLiteContext();
  const {
    players,
    handleMode,
    initializeGame,
    updateGameBoard,
    changePlayerTurn,
  } = useGameBoard();
  const { data: game, isLoading } = useQuery({
    queryKey: ["gameHistory", replay_id],
    queryFn: () => {
      handleMode({ mode: "replay" });

      const gameHistory = getGameHistoryById(replay_id);
      const game = getGame(replay_id);

      if (!gameHistory || !game) {
        throw new Error("Game not found");
      }

      return [gameHistory, game] as const;
    },
  });

  useEffect(() => {
    if (game?.[1] && start) {
      const runGame = setInterval(() => {
        updateGameBoard(
          game[1].data[move].move.x,
          game[1].data[move].move.y,
          game[1].data[move].isShip,
        );
        changePlayerTurn();

        if (move + 1 === game[1].data.length) {
          setStart(false);
          return;
        }

        setMove((prev) => prev + 1);
      }, 1000);
      return () => clearInterval(runGame);
    }
  });

  if (isLoading) {
    return (
      <SafeAreaView>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  if (!game) {
    return (
      <SafeAreaView
        style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
      >
        <View>
          <Text>Game not found</Text>
        </View>
      </SafeAreaView>
    );
  }

  console.log(">>> data", move, game[1].data.length);

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View
        style={{
          gap: 10,
        }}
      >
        <Link
          href="/games-history"
          style={{
            marginTop: 5,
            marginLeft: 5,
            paddingHorizontal: 5,
            paddingVertical: 3,
            alignSelf: "flex-start",
            backgroundColor: "#3e66bd",
            borderRadius: 5,
          }}
          asChild
        >
          <Pressable>
            <AntDesign name="arrowleft" size={24} color="white" />
          </Pressable>
        </Link>

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            paddingHorizontal: 16,
          }}
        >
          <Text style={{ fontSize: 24 }}>Joueur 1 : {game[0]?.player1}</Text>
          <Text style={{ fontSize: 24 }}>Joueur 2 : {game[0]?.player2}</Text>
        </View>

        <View
          style={{
            paddingHorizontal: 16,
            flexDirection: "row",
            gap: 10,
          }}
        >
          <Pressable
            onPress={() => {
              initializeGame([game[0]?.player1 ?? "", game[0]?.player2 ?? ""]);

              setStart(!start);

              if (!start) {
                setMove(0);
              }
            }}
            style={{
              borderWidth: 1,
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 6,
              backgroundColor: start ? "#dbeafe" : "#fee2e2",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: start ? "#172554" : "#450a0a",
              }}
            >
              {start ? "Arrêter" : "Démarrer"} le jeu
            </Text>
          </Pressable>

          <Pressable
            onPress={() =>
              initializeGame([game[0]?.player1 ?? "", game[0]?.player2 ?? ""])
            }
            style={{
              borderWidth: 1,
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 6,
              backgroundColor: "black",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: "white",
              }}
            >
              Reset
            </Text>
          </Pressable>
        </View>

        <View
          style={{
            flexDirection: "row",
            gap: 10,
            paddingHorizontal: 16,
          }}
        >
          <Pressable
            onPress={() => {
              if (move - 1 < 0) {
                return;
              }

              setMove((prevState) => prevState - 1);

              // TODO: Update the function to handle rollback
              updateGameBoard(
                game[1].data[move - 1].move.x,
                game[1].data[move - 1].move.y,
                game[1].data[move - 1].isShip,
              );
              changePlayerTurn();
            }}
            style={{
              borderWidth: 1,
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 6,
              backgroundColor: "black",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: "white",
              }}
            >
              Coup précédent
            </Text>
          </Pressable>

          <Pressable
            onPress={() => {
              if (move >= game[1].data.length) {
                return;
              }

              setMove((prevState) => prevState + 1);

              updateGameBoard(
                game[1].data[move].move.x,
                game[1].data[move].move.y,
                game[1].data[move].isShip,
              );

              changePlayerTurn();
            }}
            style={{
              borderWidth: 1,
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 6,
              backgroundColor: "black",
            }}
          >
            <Text
              style={{
                fontSize: 16,
                color: "white",
              }}
            >
              Coup suivant
            </Text>
          </Pressable>
        </View>

        {players ? (
          <Board
            style={{
              paddingHorizontal: 16,
            }}
          >
            <BoardInfo type="alpha" />
            <BoardGrid>
              <BoardInfo
                style={{
                  flexDirection: "column",
                  marginLeft: 0,
                }}
              />
            </BoardGrid>
          </Board>
        ) : null}

        {move + 1 === game[1].data.length ? (
          <View>
            <Text
              style={{
                fontSize: 24,
                textAlign: "center",
              }}
            >
              {game[1].data[move].player === 0
                ? game[0].player1
                : game[0].player2}{" "}
              à gagné 🥳
            </Text>
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
}
