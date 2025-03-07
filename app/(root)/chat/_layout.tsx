import React from "react";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="[userId]" options={{ headerShown: false }} />
    </Stack>
  );
}
