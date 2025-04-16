import { Image } from "react-native";
import { Tabs } from "expo-router";
import React from "react";
import { Entypo, Feather, MaterialCommunityIcons } from "@expo/vector-icons";
import icons from "@/constants/icons";

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarShowLabel: false,
        headerShown: false,
        tabBarStyle: {
          display: "flex",
          backgroundColor: "white",
          // paddingVertical: 25,
          paddingTop: 38,
          // paddingBottom: 20,
          height: 95,
        },
      }}
    >
      <Tabs.Screen
        name="home"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <>
              <Feather
                name="home"
                size={24}
                color={focused ? "pink" : "text-black"}
              />
              {focused && <Entypo name="dot-single" size={24} color="pink" />}
            </>
          ),
        }}
      />
      <Tabs.Screen
        name="playlist"
        options={{
          tabBarIcon: ({ color, focused }) => (
            <>
              <MaterialCommunityIcons
                name="playlist-music-outline"
                size={28}
                color={focused ? "pink" : "black"}
              />
              {focused && <Entypo name="dot-single" size={24} color="pink" />}
            </>
          ),
        }}
      />
      <Tabs.Screen
        name="emotionDetect"
        options={{
          tabBarIcon: ({ focused }) => (
            <>
              <Image
                source={icons.primaryBackgroundColorIcon}
                style={{
                  position: "absolute",
                  top: -30,
                  width: 70,
                  height: 70,
                  borderRadius: 35,
                }}
              />
              <Feather
                name="camera"
                size={30}
                color="white"
                style={{
                  marginTop: 4,
                  opacity: 0.6,
                  position: "absolute",
                  top: -20,
                }}
              />
            </>
          ),
        }}
      />
      <Tabs.Screen
        name="social"
        options={{
          tabBarIcon: ({ focused }) => (
            <>
              <Feather
                name="message-square"
                size={24}
                color={focused ? "pink" : "black"}
              />
              {focused && <Entypo name="dot-single" size={24} color="pink" />}
            </>
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          tabBarIcon: ({ focused }) => (
            <>
              <Feather
                name="user"
                size={24}
                color={focused ? "pink" : "black"}
              />
              {focused && <Entypo name="dot-single" size={24} color="pink" />}
            </>
          ),
        }}
      />
    </Tabs>
  );
}
