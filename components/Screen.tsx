import React from 'react'
import { StyleSheet, ViewStyle } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

interface ScreenProps {
  children: React.ReactNode
  style?: ViewStyle | ViewStyle[]
}

export function Screen({ children, style }: ScreenProps) {
  return (
    <SafeAreaView style={[styles.safeArea, style]} edges={['top']}>{children}</SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white', // Change to 'transparent' if you prefer
  },
}) 