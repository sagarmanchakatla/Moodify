import React from 'react'
import { Stack } from 'expo-router'

export default function _layout() {
    return (
        <Stack>
            <Stack.Screen name='login' options={{ headerShown: false }} />
            <Stack.Screen name='register' options={{ headerShown: false }} />
            <Stack.Screen name='Completeprofile' options={{ headerShown: false }} />
            <Stack.Screen name='Genre' options={{ headerShown: false }} />
            <Stack.Screen name='Welcome' options={{ headerShown: false }} />
            <Stack.Screen name='passwordReset' options={{ headerShown: false }} />
        </Stack>
    )
}