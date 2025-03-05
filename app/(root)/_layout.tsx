import React from 'react'
import { Stack } from 'expo-router'

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name='(tabs)' options={{headerShown : false}}/>
      <Stack.Screen name='Camera' options={{headerShown : false}}/>
      <Stack.Screen name='notification' options={{headerShown : false}}/>
      <Stack.Screen name='recentlyPlayed' options={{headerShown : false}}/>
      <Stack.Screen name='musicPlayer' options={{headerShown : false}}/>
    </Stack>
  )
}