import { Button, StyleSheet, TextInput } from 'react-native';

import { Text, View } from '@/components/Themed';
import { Link } from 'expo-router';
import React from 'react';

export default function Game() {
  return (
    <View style={styles.container}>
      <Link href="/home" asChild>
        <Button
          title='Back button'
        />
      </Link>
      <View>
        <View>
          <Text style={styles.title}>Player 1</Text>
          <Text style={styles.title}>Player 2</Text>
        </View>
        <View>
        <Button
          title='Switch grid'
        />
        <Button
          title='FIRE !!!'
        />
        </View>
      </View>
      <View>grid</View>
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