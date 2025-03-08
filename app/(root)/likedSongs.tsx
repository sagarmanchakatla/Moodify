import { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity, FlatList } from "react-native";
import useUserProvider from "@/hook/useUserProvider";
import useLikeSongProvider from "@/hook/useLikeSongProvider";
import { LikeSong } from "@/schema/likeSong";

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
    <View className="flex-1 p-4">
      <Text className="text-black text-2xl font-bold mb-4">Liked Songs</Text>

      {loading ? (
        <Text className="text-gray-500">Loading...</Text>
      ) : likedSongs.length === 0 ? (
        <Text className="text-gray-500">No liked songs found.</Text>
      ) : (
        <FlatList
          data={likedSongs}
          keyExtractor={(item) => item.song_id?.toString() || item.song_url}
          renderItem={({ item }) => (
            <View className="flex flex-row items-center  p-4 rounded-lg my-2">
              <Image
                source={{ uri: item.song_thumbnail }}
                className="w-16 h-16 rounded-lg"
              />
              <View className="ml-4 flex-1">
                <Text className="text-black text-lg font-semibold">
                  {item.song_title}
                </Text>
                <Text className="text-gray-400">{item.song_artist}</Text>
              </View>
              <TouchableOpacity
                onPress={() => handleRemoveSong(item)}
                className="ml-2 px-4 py-2 bg-red-500 rounded-lg"
              >
                <Text className="text-white">Remove</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default LikedSongsScreen;
