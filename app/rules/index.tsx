import { Button, StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';
import { Link } from 'expo-router';

export default function Rules() {
  return (
    <View style={styles.container}>
      <Link href="/home" asChild>
          <Button
            title='Back button'
          />
        </Link>
        <Text style={styles.title}>Rules</Text>
        <Text>
          How do you play Battleship? The game is pretty straightforward. 
          Each player places ships on a grid containing vertical and horizontal coordinates, 
          but players keep their ships' locations secret from their opponent. Players take turns 
          calling out row and column coordinates on the other player's grid by selecting a case 
          in an attempt to identify a square that contains a ship. 
        </Text>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
});