import {
  View,
  Text,
  TouchableOpacity,
  ImageBackground,
  ScrollView,
  ActivityIndicator,
  Animated,
  Image,
} from "react-native";
import React, { useState, useRef, useEffect } from "react";
import icons from "@/constants/icons";
import axios from "axios";
import { LinearGradient } from "expo-linear-gradient";

export default function TopTenSongs() {
  const [showSongs, setShowSongs] = useState(false);
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const animatedHeight = useRef(new Animated.Value(0)).current;

  // Handle animation when showing/hiding songs
  useEffect(() => {
    Animated.timing(animatedHeight, {
      toValue: showSongs ? 1 : 0,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [showSongs]);

  const handlePress = async () => {
    setShowSongs(!showSongs);

    // Only fetch songs if we haven't loaded them before
    if (!hasLoaded && !showSongs) {
      setLoading(true);
      try {
        const response = await axios.get(
          `https://www.googleapis.com/youtube/v3/search`,
          {
            params: {
              part: "snippet",
              q: "top music today",
              type: "video",
              maxResults: 10,
              key: "AIzaSyA6_UtbwToESxHuPJLno1ESx_2Huwk5RzQ",
            },
          }
        );
        setSongs(response.data.items);
        setHasLoaded(true);
      } catch (error) {
        console.error("Failed to fetch songs:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <View className="w-full my-5 overflow-hidden rounded-2xl">
      {/* Header Banner */}
      <TouchableOpacity
        onPress={handlePress}
        activeOpacity={0.9}
        className="overflow-hidden rounded-xl"
      >
        <LinearGradient
          colors={["#3A1C71", "#D76D77", "#FFAF7B"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="flex flex-row justify-between items-center p-4 rounded-xl"
        >
          <View className="flex-row items-center">
            <Text className="font-Popping-Bold text-[18px] text-white">
              Today's Top 10
            </Text>
            <View className="ml-2 bg-white/20 px-2 py-0.5 rounded-full">
              <Text className="text-white text-xs font-Popping">Trending</Text>
            </View>
          </View>

          <View className="bg-white/20 rounded-full px-3 py-1.5">
            <Text className="font-Popping text-sm text-white">
              {showSongs ? "Hide" : "Show"}
            </Text>
          </View>
        </LinearGradient>
      </TouchableOpacity>

      {/* Songs List - Animated Container */}
      <Animated.View
        style={{
          maxHeight: animatedHeight.interpolate({
            inputRange: [0, 1],
            outputRange: [0, 160],
          }),
          opacity: animatedHeight,
        }}
        className="overflow-hidden"
      >
        <View className="mt-3 mb-1">
          {loading ? (
            <View className="h-24 justify-center items-center">
              <ActivityIndicator size="large" color="#D76D77" />
            </View>
          ) : (
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 4, gap: 24 }}
              className="space-x-6"
            >
              {songs.map((song, index) => (
                <TouchableOpacity
                  key={song.id?.videoId || index}
                  activeOpacity={0.8}
                >
                  <View className="w-32 rounded-lg overflow-hidden shadow-md bg-white ">
                    <Image
                      source={{ uri: song.snippet?.thumbnails?.medium?.url }}
                      className="w-32 h-20"
                      resizeMode="cover"
                    />
                    <View className="p-2">
                      <Text
                        className="text-xs font-Popping-SemiBold text-gray-800"
                        numberOfLines={2}
                      >
                        {song.snippet?.title}
                      </Text>
                      <Text
                        className="text-[10px] font-Popping text-gray-500 mt-1"
                        numberOfLines={1}
                      >
                        {song.snippet?.channelTitle}
                      </Text>
                    </View>
                    <View className="absolute top-0 left-0 bg-black/50 px-1.5 py-0.5 rounded-br-lg">
                      <Text className="text-white text-[10px] font-Popping-Bold">
                        #{index + 1}
                      </Text>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}

              {/* Show empty placeholders if no songs loaded yet */}
              {songs.length === 0 &&
                !loading &&
                hasLoaded &&
                Array(5)
                  .fill(0)
                  .map((_, index) => (
                    <View
                      key={index}
                      className="w-32 h-20 rounded-lg bg-gray-200 mr-3"
                    />
                  ))}
            </ScrollView>
          )}
        </View>
      </Animated.View>
    </View>
  );
}
