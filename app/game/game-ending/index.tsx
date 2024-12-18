import { Button, StyleSheet } from 'react-native';

import { Text, View } from '@/components/Themed';
import { Link } from 'expo-router';
import React from 'react';

export default function GameEnding() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Player 1 name</Text>
      <Text>Winner</Text>
      <Text style={styles.title}>Player 2 name</Text>
      <Text>Looser</Text>
      <Link href="/home" asChild>
        <Button
          title='Return to home'
        />
      </Link>
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