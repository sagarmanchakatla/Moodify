import { View, Text, TouchableOpacity, Image } from "react-native";
import React, { useEffect, useState } from "react";
import { SongSchema } from "@/schema/songSchema";
import useSongProvider from "@/hook/useSongProvider";
import useUserProvider from "@/hook/useUserProvider";
import useLikeSongProvider from "@/hook/useLikeSongProvider";
import { LikeSong } from "@/schema/likeSong";

interface SongCardProps {
  songs: SongSchema[];
}

export default function SongCard({ songs }: SongCardProps) {
  const { setSongPlay } = useSongProvider();
  const [likedSongs, setLikedSongs] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const { addLikedSong, getLikedSongs, removeSong } = useLikeSongProvider();
  const { user } = useUserProvider();

  useEffect(() => {
    // console.log(songs[0]);
    if (user) {
      fetchLikedSong();
    }
  }, [user]);

  const fetchLikedSong = async () => {
    if (!user?.id) return;
    setLoading(true);
    try {
      const data = await getLikedSongs(user?.id);
      if (data) {
        const likedSongIds = data.map((song: any) => song.id);
        setLikedSongs(likedSongIds);
      }
    } catch (error) {
      console.log("Error fetching", error);
    } finally {
      setLoading(false);
    }
  };

  const isLiked = (songId: number): boolean => {
    return likedSongs.includes(songId);
  };

  const handleLikePress = async (song: SongSchema) => {
    if (!user) {
      console.log("User not logged in");
      return;
    }
    try {
      if (isLiked(song?.id)) {
        await removeSong(user.id, Number(song?.id));
        setLikedSongs(likedSongs.filter((id) => id !== song?.id));
      } else {
        const likedSong: LikeSong = {
          song_id: song?.id,
          song_thumbnail: song?.thumbnail,
          song_url: song?.url || "",
          song_artist: song?.artist,
        };
        await addLikedSong(user.id, likedSong);
        setLikedSongs([...likedSongs, song.id]);
      }
    } catch (error) {
      console.log("Error toggling like status:", error);
    }
  };

  return (
    <>
      {songs.map((song, index) => (
        <TouchableOpacity
          key={song.id}
          className="flex-row items-center bg-white shadow-md rounded-lg p-4 mb-4"
          onPress={() => setSongPlay(index)}
        >
          <Image
            source={{ uri: song.thumbnail }}
            className="w-20 h-20 rounded-lg"
          />
          <View className="flex-1 ml-4">
            <Text
              className="text-lg font-semibold text-gray-900"
              numberOfLines={1}
            >
              {song.title}
            </Text>
            <Text className="text-sm text-gray-500" numberOfLines={1}>
              {song.artist}
            </Text>
          </View>

          <TouchableOpacity onPress={() => handleLikePress(song)}>
            <Text className="text-lg">{isLiked(song?.id) ? "❤️" : "🤍"}</Text>
          </TouchableOpacity>
        </TouchableOpacity>
      ))}
    </>
  );
}
