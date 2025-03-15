import {
    View,
    Text,
    Image,
    TouchableOpacity,
    ScrollView,
    ActivityIndicator,
    RefreshControl,
  } from "react-native";
  import React, { useEffect, useState } from "react";
  import { useLocalSearchParams, router } from "expo-router";
  import DashBoardLayout from "@/components/DashBoardLayout";
  import { Feather } from "@expo/vector-icons";
  import usePlaylistProvider from "@/hook/usePlaylistProvider";
  import useUserProvider from "@/hook/useUserProvider";
  import { LinearGradient } from "expo-linear-gradient";
  
  interface PlaylistSong {
    id: string;
    song_id: string;
    song_title: string;
    song_artist: string;
    song_thumbnail: string;
    song_url: string;
    added_at: string;
  }
  
  interface PlaylistDetails {
    id: string;
    name: string;
    description: string | null;
    thumbnail: string | null;
    created_at: string;
    user_id: string;
  }
  
  export default function PlaylistDetails() {
    const { id } = useLocalSearchParams();
    const [playlist, setPlaylist] = useState<PlaylistDetails | null>(null);
    const [songs, setSongs] = useState<PlaylistSong[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);
    const { getPlaylistDetails, getPlaylistSongs, removeSongFromPlaylist } = usePlaylistProvider();
    const { user } = useUserProvider();
  
    useEffect(() => {
      fetchPlaylistData();
    }, [id]);
  
    const fetchPlaylistData = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const playlistData = await getPlaylistDetails(id as string);
        const playlistSongs = await getPlaylistSongs(id as string);
        setPlaylist(playlistData);
        setSongs(playlistSongs);
      } catch (error) {
        console.error("Error fetching playlist:", error);
      } finally {
        setLoading(false);
      }
    };
  
    const onRefresh = React.useCallback(async () => {
      setRefreshing(true);
      await fetchPlaylistData();
      setRefreshing(false);
    }, []);
  
    const handleRemoveSong = async (songId: string) => {
      if (!playlist) return;
      await removeSongFromPlaylist(playlist.id, songId);
      // Refresh songs list
      const updatedSongs = await getPlaylistSongs(playlist.id);
      setSongs(updatedSongs);
    };
  
    if (loading) {
      return (
        <DashBoardLayout>
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#EF4444" />
          </View>
        </DashBoardLayout>
      );
    }
  
    if (!playlist) {
      return (
        <DashBoardLayout>
          <View className="flex-1 justify-center items-center p-4">
            <Text className="text-gray-500 text-center">
              Playlist not found or you don't have access to it.
            </Text>
          </View>
        </DashBoardLayout>
      );
    }
  
    return (
      <DashBoardLayout>
        <ScrollView
          className="flex-1 bg-white"
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
          }
        >
          {/* Header with back button */}
          <TouchableOpacity
            className="absolute top-12 left-4 z-10"
            onPress={() => router.back()}
          >
            <Feather name="arrow-left" size={24} color="white" />
          </TouchableOpacity>
  
          {/* Playlist Header */}
          <View className="relative">
            <Image
              source={{
                uri:
                  playlist.thumbnail ||
                  "https://via.placeholder.com/400x400?text=No+Cover",
              }}
              className="w-full h-80"
              resizeMode="cover"
            />
            <LinearGradient
              colors={["transparent", "rgba(0,0,0,0.8)"]}
              className="absolute bottom-0 left-0 right-0 h-40 justify-end p-4"
            >
              <Text className="text-white text-3xl font-Popping-Bold">
                {playlist.name}
              </Text>
              {playlist.description && (
                <Text className="text-gray-200 mt-2 font-Popping">
                  {playlist.description}
                </Text>
              )}
              <Text className="text-gray-300 mt-2 font-Popping">
                {songs.length} {songs.length === 1 ? "song" : "songs"} •{" "}
                Created {new Date(playlist.created_at).toLocaleDateString()}
              </Text>
            </LinearGradient>
          </View>
  
          {/* Songs List */}
          <View className="p-4">
            {songs.length === 0 ? (
              <View className="py-8 items-center">
                <Feather name="music" size={48} color="#CBD5E0" />
                <Text className="text-gray-400 mt-4 font-Popping text-center">
                  No songs in this playlist yet
                </Text>
              </View>
            ) : (
              songs.map((song, index) => (
                <View
                  key={song.id}
                  className="flex-row items-center bg-white rounded-lg p-3 mb-3 border border-gray-100"
                >
                  <Text className="text-gray-400 font-Popping-Medium w-8">
                    {index + 1}
                  </Text>
                  <Image
                    source={{ uri: song.song_thumbnail }}
                    className="w-12 h-12 rounded-md"
                  />
                  <View className="flex-1 ml-3">
                    <Text className="font-Popping-SemiBold" numberOfLines={1}>
                      {song.song_title}
                    </Text>
                    <Text className="text-gray-500 text-sm font-Popping">
                      {song.song_artist}
                    </Text>
                  </View>
                  {playlist.user_id === user?.id && (
                    <TouchableOpacity
                      className="p-2"
                      onPress={() => handleRemoveSong(song.song_id)}
                    >
                      <Feather name="trash-2" size={20} color="#EF4444" />
                    </TouchableOpacity>
                  )}
                </View>
              ))
            )}
          </View>
        </ScrollView>
      </DashBoardLayout>
    );
  }