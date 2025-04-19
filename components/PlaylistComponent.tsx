import React, { useEffect, useState } from "react";
import {
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
  Button,
  ActivityIndicator,
} from "react-native";
import icons from "@/constants/icons";
import Feather from "@expo/vector-icons/Feather";
import { View, Text } from "react-native";
import useUserProvider from "@/hook/useUserProvider";
import usePlaylistProvider from "@/hook/usePlaylistProvider";
import { router } from "expo-router";

interface Playlist {
  id: string;
  name: string;
  description: string;
  thumbnail: string;
  created_at: string;
  Playlist_songs: { count: number }[];
}

const PlaylistComponent = () => {
  const { user } = useUserProvider();
  const { loading, error, getUsersPlaylists } = usePlaylistProvider();
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  useEffect(() => {
    const fetchPlaylists = async () => {
      if (user?.id) {
        const userPlaylists = await getUsersPlaylists(user.id);
        if (userPlaylists) {
          setPlaylists(userPlaylists);
        }
      }
    };

    fetchPlaylists();
  }, [user?.id]);

  if (!user?.id || playlists.length === 0) {
    return null; // Don't show anything if no user or no playlists
  }

  return (
    <View className="mt-6">
      <View className="flex-row justify-between items-center">
        <Text className="text-black text-lg font-Popping-Bold">
          Your Playlists
        </Text>
        <TouchableOpacity>
          <Text className="text-gray-500 font-Popping">See more</Text>
        </TouchableOpacity>
      </View>

      {loading ? (
        <View className="mt-4 h-32 justify-center items-center">
          <ActivityIndicator size="large" color="#000" />
        </View>
      ) : (
        <View className="mt-4">
          {playlists.map((playlist, index) => (
            <TouchableOpacity
              onPress={() => router.push(`(root)/playlist/${playlist.id}`)}
            >
              <PlaylistItem
                key={playlist.id}
                playlist={playlist}
                reverse={index % 2 !== 0} // Alternate layout
              />
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

interface PlaylistItemProps {
  playlist: Playlist;
  reverse?: boolean;
}

const PlaylistItem: React.FC<PlaylistItemProps> = ({ playlist, reverse }) => {
  const songCount = playlist.Playlist_songs?.[0]?.count || 0;

  // Calculate duration (assuming average song length of 3 minutes)
  const duration = songCount * 3;
  const durationText =
    duration > 60
      ? `${Math.floor(duration / 60)} hr ${duration % 60} min`
      : `${duration} min`;

  return (
    <View
      className={`flex ${
        reverse ? "flex-row-reverse" : "flex-row"
      } rounded-lg mb-4 w-full`}
    >
      <Image
        source={
          playlist.thumbnail
            ? { uri: playlist.thumbnail }
            : icons.pinkBackgroundicon
        }
        className="w-1/2 rounded-lg aspect-square"
      />

      <View className="flex flex-col w-1/2 justify-start py-5 px-2 flex-1">
        <Text
          className="text-black font-Popping-SemiBold text-lg"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          {playlist.name}
        </Text>

        <Text
          className="text-gray-600 text-md font-Popping"
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          {songCount} songs | {durationText}
        </Text>

        <Text className="text-gray-600 text-md font-Popping">
          {playlist.description || "No description"}
        </Text>

        <TouchableOpacity className="mt-2 self-start">
          <Feather name="play-circle" size={24} color="pink" />
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default PlaylistComponent;
