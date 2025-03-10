import { useEffect, useState } from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import DashBoardCard from "./DashBoardCard"; // Ensure this component can display a song properly
import icons from "@/constants/icons";
import { RecentlyPlayedListSchema } from "@/schema/index";
import useUserProvider from "@/hook/useUserProvider";
import useLikeSongProvider from "@/hook/useLikeSongProvider";
import { LikeSong } from "@/schema/likeSong";

import { router } from "expo-router";

interface RecentlyPlayedListProps {
  icon?: any;
  items: RecentlyPlayedListSchema[];
}

const LikedPlayedList: React.FC<RecentlyPlayedListProps> = ({
  items,
  icon,
}) => {
  const [likedSongs, setLikedSongs] = useState<LikeSong[]>([]);
  const { user } = useUserProvider();
  const { getLikedSongs, loading } = useLikeSongProvider();

  useEffect(() => {
    const fetchLikedSong = async () => {
      if (!user?.id) return;
      try {
        const data = await getLikedSongs(user?.id);
        if (data) {
          setLikedSongs(data);
        }
      } catch (error) {
        console.log("Error fetching liked songs", error);
      }
    };
    fetchLikedSong();
  }, [user, loading]);

  return (
    <>
      <View className="flex-row justify-between  mb-2">
        <Text className="text-lg font-Popping-Bold ">Liked Songs</Text>
        <TouchableOpacity onPress={() => router.push("/(root)/likedSongs")}>
          <Text className="text-md text-primarygray">See more</Text>
        </TouchableOpacity>
      </View>
      <View className="flex flex-col w-full justify-center items-center p-4">
        {likedSongs.length === 0 ? (
          <Text className="text-gray-500">No liked songs found.</Text>
        ) : (
          likedSongs.map((song, index) => (
            <TouchableOpacity
              key={song.song_id ? song.song_id.toString() : `song-${index}`}
              className="w-full my-2"
            >
              <View className="flex flex-row items-center  p-4 rounded-lg">
                <Image
                  source={{ uri: song.song_thumbnail }}
                  className="w-16 h-16 rounded-lg"
                />
                <View className="ml-4">
                  <Text className="text-black text-lg font-semibold">
                    {song.song_title}
                  </Text>
                  <Text className="text-gray-400">{song.song_artist}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))
        )}
      </View>
    </>
  );
};

export default LikedPlayedList;
