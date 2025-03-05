import { useFonts } from "expo-font";
import { useEffect } from "react";
import { Stack } from "expo-router";
import UserProvider from "@/context/UserProvider";
import { PaperProvider } from 'react-native-paper';
import "../global.css";
import ImageProvider from "@/context/ImageProvider";
import SongProvider from "@/context/SongProvider";

// Root Layout Component
export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    "Poppins-Bold": require("../assets/fonts/Poppins-Bold.ttf"),
    "Poppins-SemiBold": require("../assets/fonts/Poppins-SemiBold.ttf"),
    "Poppins-ExtraBold": require("../assets/fonts/Poppins-ExtraBold.ttf"),
    "Poppins-Light": require("../assets/fonts/Poppins-Light.ttf"),
    "Poppins-SemiLight": require("../assets/fonts/Poppins-ExtraLight.ttf"),
    "Poppins-Medium": require("../assets/fonts/Poppins-Medium.ttf"),
    "Poppins-Regular": require("../assets/fonts/Poppins-Regular.ttf"),
    "Poppins-Thin": require("../assets/fonts/Poppins-Thin.ttf"),
  });
  useEffect(() => {

  }, [fontsLoaded]);
  if (!fontsLoaded) return null;

  return (
    <PaperProvider>
      <UserProvider>
        <SongProvider>
          <ImageProvider>
            <Stack>
              <Stack.Screen name="index" options={{ headerShown: false }} />
              <Stack.Screen name="(root)" options={{ headerShown: false }} />
              <Stack.Screen name="(auth)" options={{ headerShown: false }} />
              <Stack.Screen name="error" options={{ headerShown: false }} />
            </Stack>
          </ImageProvider>
        </SongProvider>
      </UserProvider>
    </PaperProvider>
  );
}
