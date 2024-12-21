import { Button, Pressable, StyleSheet } from "react-native";

import { Text, View } from "@/components/Themed";
import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { Board, BoardGrid, BoardInfo } from "@/components/game/board";
import { useGameBoard } from "@/utils/store/game";

type ShipSetup = {
  length: number;
  direction: "horizontal" | "vertical";
};

const boatsArray = [2, 3, 4, 5];

export default function BoatPlacement() {
  const { changePlayerTurn, players, playerTurn, setupBoatPlacement } =
    useGameBoard();
  const [currentShip, setCurrentShip] = useState<ShipSetup>({
    length: boatsArray[0],
    direction: "horizontal",
  });

  const boatDisplay: number[][] = Array(currentShip.length).fill(0);
  const [currentBoatCoordinates, setCurrentBoatCoordinates] = useState(0);

  // useEffect(/*setupBoatPlacement */);

  function placeBoat() {
    // placeShip
    if (currentShip.length < 5) {
      setCurrentShip({
        length: currentShip.length + 1,
        direction: currentShip.direction,
      });
    } else {
      setCurrentShip({ length: boatsArray[0], direction: "horizontal" });
      changePlayerTurn(); // à check
      // if (0 playerturn is ???) {
      // }
    }
  }

  function turnBoat() {
    if (currentShip.direction === "horizontal") {
      setupBoatPlacement(currentShip.length, "vertical");
      setCurrentShip({ length: currentShip.length, direction: "vertical" });
    } else {
      setupBoatPlacement(currentShip.length, "horizontal");
      setCurrentShip({ length: currentShip.length, direction: "horizontal" });
    }
  }

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <View>
        <View style={styles.twoColumnsView}>
          <Link href="/new-game" style={styles.backButton} asChild>
            <Pressable>
              <AntDesign name="arrowleft" size={24} color="white" />
            </Pressable>
          </Link>
          <Text style={styles.title}>
            {players?.[playerTurn].name}, place your boats
          </Text>
        </View>
        <View>
          <View style={styles.twoColumnsView}>
            <Pressable style={styles.pressableButton} onPress={placeBoat}>
              <Text style={styles.buttonText}>Confirm placement</Text>
            </Pressable>
            <Pressable style={styles.pressableButton} onPress={turnBoat}>
              <Text style={styles.buttonText}>Turn boat</Text>
            </Pressable>
          </View>
          <View>
            <Text style={styles.currentBoat}>Current boat : </Text>
            <View style={styles.boatDisplay}>
              {boatDisplay.map((_, index) => {
                return (
                  <View key={index} style={styles.cell}>
                    <Text></Text>
                  </View>
                );
              })}
            </View>
          </View>
        </View>
        <Board>
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
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "flex-start",
  },
  title: {
    paddingTop: 5,
    paddingBottom: 20,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    paddingHorizontal: 4,
  },
  backButton: {
    marginTop: 5,
    marginLeft: 5,
    paddingHorizontal: 5,
    paddingVertical: 3,
    alignSelf: "flex-start",
    backgroundColor: "#3e66bd",
    borderRadius: 5,
  },
  pressableButton: {
    backgroundColor: "#3e66bd",
    minWidth: 100,
    paddingVertical: 6,
    paddingHorizontal: 4,
    marginBottom: 20,
    borderStyle: "solid",
    borderWidth: 2,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#ffffff",
    fontSize: 15,
  },
  currentBoat: {
    fontSize: 15,
    paddingLeft: 20,
  },
  boatDisplay: {
    flex: 0,
    flexDirection: "row",
    paddingHorizontal: 20,
    paddingBottom: 10,
    justifyContent: "center",
  },
  cell: {
    width: 25,
    aspectRatio: 1,
    borderWidth: 1,
    borderColor: "black",
  },
  twoColumnsView: {
    flex: 0,
    flexDirection: "row",
    justifyContent: "space-evenly",
    paddingBottom: 5,
  },
});
