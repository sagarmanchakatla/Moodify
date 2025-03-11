import React from "react";
import { View, Text, ScrollView, Image, TouchableOpacity } from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { useLocalSearchParams } from "expo-router";
import { HistorySchema } from "@/schema/history";

const HistoryPage = () => {
  const { history } = useLocalSearchParams<{ history: string }>();
  const parsedHistory: HistorySchema[] = JSON.parse(history || "[]");

  return (
    <View className="flex-1 bg-white px-4 py-6">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-black text-2xl font-Popping-Bold">History</Text>
      </View>

      {/* Full History List */}
      <ScrollView>
        {parsedHistory.map((item, index) => (
          <TouchableOpacity
            key={index}
            className="flex-row items-center bg-gray-50 rounded-lg p-3 mb-4 shadow-sm"
          >
            {/* Album Art */}
            <Image
              source={{ uri: item.song_thumbnail }}
              className="w-16 h-16 rounded-lg"
            />

            {/* Song and Artist Details */}
            <View className="ml-4 flex-1">
              <Text
                className="text-black font-Popping-SemiBold text-lg"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.song_name}
              </Text>
              <Text
                className="text-gray-500 font-Popping text-sm"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.artist_name}
              </Text>
              <Text
                className="text-gray-500 font-Popping text-sm"
                numberOfLines={1}
                ellipsizeMode="tail"
              >
                {item.album_name}
              </Text>
            </View>

            {/* Play Button */}
            <TouchableOpacity className="p-2">
              <Feather name="play-circle" size={24} color="pink" />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default HistoryPage;
