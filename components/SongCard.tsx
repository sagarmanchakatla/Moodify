import {
  View,
  Text,
  TouchableOpacity,
  Image,
  Modal,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SongSchema } from "@/schema/songSchema";
import useSongProvider from "@/hook/useSongProvider";
import useUserProvider from "@/hook/useUserProvider";
import useLikeSongProvider from "@/hook/useLikeSongProvider";
import useHistoryProvider from "@/hook/useHistoryProvider";
import { LikeSong } from "@/schema/likeSong";
import usePlaylistProvider from "@/hook/usePlaylistProvider";
import { Feather, MaterialIcons, Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

interface SongCardProps {
  songs: SongSchema[];
}

export default function SongCard({ songs }: SongCardProps) {
  const { setSongPlay } = useSongProvider();
  const [likedSongs, setLikedSongs] = useState<number[]>([]);
  const [loading, setLoading] = useState(true);
  const { addLikedSong, getLikedSongs, removeSong } = useLikeSongProvider();
  const { user } = useUserProvider();
  const { addToHistory } = useHistoryProvider();

  const [showPlaylistModal, setShowPlaylistModal] = useState(false);
  const [selectedSong, setSelectedSong] = useState<SongSchema | null>(null);
  const {
    getUsersPlaylists,
    addSongToPlaylist,
    loading: playlistLoading,
  } = usePlaylistProvider();
  const [userPlaylists, setUserPlaylists] = useState<any[]>([]);
  const [addingToPlaylist, setAddingToPlaylist] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchLikedSong();
      fetchUserPlaylists();
    }
  }, [user]);

  const fetchUserPlaylists = async () => {
    if (!user?.id) return;
    const playlists = await getUsersPlaylists(user.id);
    setUserPlaylists(playlists);
  };

  const handleAddToPlaylist = async (playlistId: string) => {
    if (!selectedSong) return;
    setAddingToPlaylist(playlistId);
    await addSongToPlaylist(playlistId, selectedSong);
    setAddingToPlaylist(null);
    setShowPlaylistModal(false);
    setSelectedSong(null);
  };

  const handleSongPlay = async (index: number) => {
    setSongPlay(index);

    // Add to history when song is played
    if (user && songs[index]) {
      await addToHistory(user.id, songs[index]);
    }
  };

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
        await removeSong(
          user.id,
          Number(song?.id),
          song?.url || "",
          song?.title || ""
        );
        setLikedSongs(likedSongs.filter((id) => id !== song?.id));
      } else {
        const likedSong: LikeSong = {
          song_id: song?.id,
          song_title: song?.title,
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
          className="flex-row items-center bg-white shadow-md rounded-xl p-3 mb-4"
          onPress={() => handleSongPlay(index)}
          style={{
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}
          activeOpacity={0.7}
        >
          <View className="relative">
            <Image
              source={{ uri: song.thumbnail }}
              className="w-16 h-16 rounded-lg"
              style={{ borderWidth: 0.5, borderColor: "rgba(0,0,0,0.1)" }}
            />
            <View className="absolute inset-0 flex items-center justify-center">
              <View className="bg-black/40 rounded-full p-1.5">
                <Feather name="play" size={14} color="white" />
              </View>
            </View>
          </View>

          <View className="flex-1 ml-3 mr-2">
            <Text
              className="text-base font-Popping-SemiBold text-gray-900"
              numberOfLines={1}
            >
              {song.title}
            </Text>
            <Text
              className="text-sm font-Popping text-gray-500 mt-1"
              numberOfLines={1}
            >
              {song.artist}
            </Text>
          </View>

          <View className="flex-row items-center space-x-4">
            <TouchableOpacity
              onPress={() => handleLikePress(song)}
              className="p-2"
            >
              {isLiked(song?.id) ? (
                <Ionicons name="heart" size={22} color="#EF4444" />
              ) : (
                <Ionicons name="heart-outline" size={22} color="#6B7280" />
              )}
            </TouchableOpacity>

            <TouchableOpacity
              className="p-2"
              onPress={() => {
                setSelectedSong(song);
                setShowPlaylistModal(true);
              }}
            >
              <Feather name="plus-circle" size={22} color="#6B7280" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      ))}

      {/* Enhanced Playlist Selection Modal */}
      <Modal
        visible={showPlaylistModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowPlaylistModal(false)}
      >
        <View className="flex-1 justify-end bg-black/50">
          <View
            className="bg-white rounded-t-3xl p-6"
            style={{
              shadowColor: "#000",
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.15,
              shadowRadius: 10,
              elevation: 10,
            }}
          >
            <View className="flex-row justify-between items-center mb-5">
              <Text className="text-xl font-Popping-Bold">Add to Playlist</Text>
              <TouchableOpacity
                className="p-2"
                onPress={() => setShowPlaylistModal(false)}
              >
                <Feather name="x" size={22} color="#374151" />
              </TouchableOpacity>
            </View>

            {/* Selected song preview */}
            {selectedSong && (
              <View className="flex-row items-center mb-6 p-3 bg-gray-50 rounded-xl">
                <Image
                  source={{ uri: selectedSong.thumbnail }}
                  className="w-12 h-12 rounded-md"
                />
                <View className="ml-3 flex-1">
                  <Text className="font-Popping-SemiBold" numberOfLines={1}>
                    {selectedSong.title}
                  </Text>
                  <Text className="text-gray-500 text-sm font-Popping">
                    {selectedSong.artist}
                  </Text>
                </View>
              </View>
            )}

            {userPlaylists.length === 0 ? (
              <View className="py-10 items-center">
                <Feather name="music" size={40} color="#D1D5DB" />
                <Text className="text-gray-500 mt-4 text-center font-Popping-Medium">
                  You don't have any playlists yet
                </Text>
                <TouchableOpacity
                  className="mt-6 bg-red-500 py-2 px-6 rounded-full"
                  onPress={() => {
                    setShowPlaylistModal(false);
                    // You could add navigation to playlist creation here
                  }}
                >
                  <Text className="text-white font-Popping-SemiBold">
                    Create Playlist
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              <ScrollView
                className="max-h-96"
                showsVerticalScrollIndicator={false}
              >
                <Text className="font-Popping-Medium text-gray-500 mb-2 ml-1">
                  Select a playlist:
                </Text>
                {userPlaylists.map((playlist) => (
                  <TouchableOpacity
                    key={playlist.id}
                    className="flex-row items-center p-3 mb-2 border border-gray-100 rounded-xl"
                    onPress={() => handleAddToPlaylist(playlist.id)}
                    disabled={addingToPlaylist === playlist.id}
                    style={{
                      backgroundColor:
                        addingToPlaylist === playlist.id ? "#F3F4F6" : "white",
                    }}
                  >
                    {/* Playlist thumbnail */}
                    <Image
                      source={{
                        uri:
                          playlist.thumbnail ||
                          "https://via.placeholder.com/60x60?text=No+Cover",
                      }}
                      className="w-14 h-14 rounded-md"
                      style={{
                        borderWidth: 0.5,
                        borderColor: "rgba(0,0,0,0.1)",
                      }}
                    />

                    <View className="flex-1 ml-3">
                      <Text className="font-Popping-SemiBold" numberOfLines={1}>
                        {playlist.name}
                      </Text>
                      <Text className="text-gray-500 text-sm font-Popping">
                        {playlist?.Playlist_songs?.[0]?.count || 0} songs
                      </Text>
                    </View>

                    {addingToPlaylist === playlist.id ? (
                      <ActivityIndicator size="small" color="#EF4444" />
                    ) : (
                      <View className="bg-gray-100 p-2 rounded-full">
                        <Feather name="plus" size={18} color="#4B5563" />
                      </View>
                    )}
                  </TouchableOpacity>
                ))}
                <View className="h-4" />
              </ScrollView>
            )}

            {userPlaylists.length > 0 && (
              <TouchableOpacity
                className="mt-4 p-4 bg-gray-100 rounded-xl"
                onPress={() => setShowPlaylistModal(false)}
              >
                <Text className="text-center font-Popping-SemiBold text-gray-700">
                  Cancel
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </Modal>
    </>
  );
}
