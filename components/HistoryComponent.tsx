import React from "react";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  FlatList,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import { HistorySchema } from "@/schema/history";
import { router } from "expo-router"; // Import the router

interface HistoryComponentProps {
  history: HistorySchema[];
}

const HistoryComponent: React.FC<HistoryComponentProps> = ({ history }) => {
  const handleSeeMore = () => {
    // Navigate to the HistoryPage and pass the history data
    router.push({
      pathname: "/(root)/historySongs",
      params: { history: JSON.stringify(history) }, // Pass history as a JSON string
    });
  };

  return (
    <View className="mt-6">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-black text-lg font-Popping-Bold">History</Text>
        <TouchableOpacity onPress={handleSeeMore}>
          <Text className="text-gray-500 font-Popping">See more</Text>
        </TouchableOpacity>
      </View>

      {/* Horizontal Scrollable History List */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        {history.map((item, index) => (
          <TouchableOpacity
            key={index}
            className="mr-4 bg-gray-50 rounded-lg p-3 w-40 shadow-sm"
          >
            {/* Album Art (Placeholder or from URL) */}
            <Image
              source={{ uri: item.song_thumbnail }} // Replace with actual album art URL if available
              className="w-full h-32 rounded-lg mb-2"
            />

            {/* Song Name */}
            <Text
              className="text-black font-Popping-SemiBold text-md"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item?.song_name}
            </Text>

            {/* Artist Name */}
            <Text
              className="text-gray-500 font-Popping text-sm"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.artist_name}
            </Text>

            {/* Album Name */}
            <Text
              className="text-gray-500 font-Popping text-sm"
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {item.album_name}
            </Text>

            {/* Play Button */}
            <TouchableOpacity className="mt-2 self-start">
              <Feather name="play-circle" size={24} color="pink" />
            </TouchableOpacity>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

export default HistoryComponent;
