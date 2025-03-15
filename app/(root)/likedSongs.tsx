import { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native";
import useUserProvider from "@/hook/useUserProvider";
import useLikeSongProvider from "@/hook/useLikeSongProvider";
import { LikeSong } from "@/schema/likeSong";
import Feather from "@expo/vector-icons/Feather";

const LikedSongsScreen: React.FC = () => {
  const [likedSongs, setLikedSongs] = useState<LikeSong[]>([]);
  const { user } = useUserProvider();
  const { getLikedSongs, removeSong, loading } = useLikeSongProvider();

  useEffect(() => {
    const fetchLikedSongs = async () => {
      if (!user?.id) return;
      try {
        const data = await getLikedSongs(user.id);
        if (data) setLikedSongs(data);
      } catch (error) {
        console.log("Error fetching liked songs", error);
      }
    };
    fetchLikedSongs();
  }, [user]);

  const handleRemoveSong = async (song: LikeSong) => {
    if (!user?.id) return;
    await removeSong(user.id, song.song_id, song.song_url, song.song_title);
    setLikedSongs((prev) => prev.filter((s) => s.song_id !== song.song_id));
  };

  return (
    <View className="flex-1 bg-white px-4 py-6">
      {/* Header */}
      <View className="flex-row justify-between items-center mb-4">
        <Text className="text-black text-2xl font-Popping-Bold">
          Liked Songs
        </Text>
      </View>

      {loading ? (
        <Text className="text-gray-500">Loading...</Text>
      ) : likedSongs.length === 0 ? (
        <Text className="text-gray-500">No liked songs found.</Text>
      ) : (
        <ScrollView>
          {likedSongs.map((item) => (
            <TouchableOpacity
              key={item.song_id?.toString() || item.song_url}
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
                  {item.song_title}
                </Text>
                <Text
                  className="text-gray-500 font-Popping text-sm"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.song_artist}
                </Text>
                <Text
                  className="text-gray-500 font-Popping text-sm"
                  numberOfLines={1}
                  ellipsizeMode="tail"
                >
                  {item.album_name || "Unknown Album"}
                </Text>
              </View>

              {/* Remove Button */}
              <TouchableOpacity
                onPress={() => handleRemoveSong(item)}
                className="p-2"
              >
                <Feather name="trash-2" size={24} color="red" />
              </TouchableOpacity>
            </TouchableOpacity>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

export default LikedSongsScreen;
