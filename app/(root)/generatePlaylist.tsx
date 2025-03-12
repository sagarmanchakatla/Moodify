import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Modal,
  Image,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Dimensions,
  Platform,
} from "react-native";
import React, { useState, useEffect } from "react";
import { router } from "expo-router";
import usePlaylistProvider from "@/hook/usePlaylistProvider";
import useUserProvider from "@/hook/useUserProvider";
import * as ImagePicker from "expo-image-picker";
import { supabase } from "@/lib/supabase";
import { decode } from "base64-arraybuffer";
import { Feather, MaterialIcons } from "@expo/vector-icons";
import DashBoardLayout from "@/components/DashBoardLayout";
import DashBoardHeader from "@/components/dashBoardHeader";
import { BlurView } from "expo-blur";

interface Playlist {
  id: string;
  name: string;
  description: string | null;
  thumbnail: string | null;
  created_at: string;
  Playlist_songs: { count: number }[];
}

const { width } = Dimensions.get("window");
const CARD_WIDTH = width / 2 - 24; // Adjust for padding and gap

const GeneratePlaylist = () => {
  const [showModal, setShowModal] = useState(false);
  const [playlistName, setPlaylistName] = useState("");
  const [description, setDescription] = useState("");
  const [thumbnail, setThumbnail] = useState<string | null>(null);
  const [uploadLoading, setUploadLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { createPlaylist, loading, getUsersPlaylists } = usePlaylistProvider();

  const { user } = useUserProvider();

  const [playlists, setPlaylists] = useState<Playlist[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [loadingPlaylists, setLoadingPlaylists] = useState(true);

  useEffect(() => {
    if (user) {
      fetchPlaylists();
    }
  }, [user]);

  const fetchPlaylists = async () => {
    if (!user?.id) return;
    setLoadingPlaylists(true);
    try {
      const userPlaylists = await getUsersPlaylists(user?.id);
      setPlaylists(userPlaylists);
    } catch (error) {
      console.error("Error fetching playlists:", error);
    } finally {
      setLoadingPlaylists(false);
    }
  };

  const onRefresh = React.useCallback(async () => {
    setRefreshing(true);
    await fetchPlaylists();
    setRefreshing(false);
  }, []);

  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
        base64: true,
      });

      if (!result.canceled && result.assets[0].base64) {
        setUploadLoading(true);
        const base64File = result.assets[0].base64;
        const filePath = `playlist-covers/${user?.id}/${Date.now()}.jpg`;

        // Upload to Supabase Storage
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("playlist-covers")
          .upload(filePath, decode(base64File), {
            contentType: "image/jpeg",
            upsert: true,
          });

        if (uploadError) {
          console.error("Error uploading file:", uploadError);
          return;
        }

        // Get public URL
        const {
          data: { publicUrl },
        } = supabase.storage.from("playlist-covers").getPublicUrl(filePath);

        setThumbnail(publicUrl);
      }
    } catch (error) {
      console.error("Error picking image:", error);
    } finally {
      setUploadLoading(false);
    }
  };

  const handleCreatePlaylist = async () => {
    if (!user || !playlistName.trim()) {
      setError("Please enter a playlist name");
      return;
    }

    const result = await createPlaylist(
      user.id,
      playlistName,
      description,
      thumbnail
    );

    if (result) {
      setShowModal(false);
      setPlaylistName("");
      setDescription("");
      setThumbnail(null);
      setError(null);
      fetchPlaylists();
    }
  };

  const renderEmptyState = () => (
    <View className="flex-1 justify-center items-center py-20">
      <View className="bg-gray-100 rounded-full p-6 mb-4">
        <Feather name="music" size={48} color="#EF4444" />
      </View>
      <Text className="text-gray-700 text-xl mt-4 font-Popping-SemiBold text-center">
        No playlists yet
      </Text>
      <Text className="text-gray-500 mt-2 font-Popping text-center max-w-xs">
        Create your first playlist to start organizing your favorite songs
      </Text>
      <TouchableOpacity
        className="bg-red-500 px-6 py-3 rounded-full mt-6 flex-row items-center"
        onPress={() => setShowModal(true)}
      >
        <Feather name="plus" size={18} color="white" />
        <Text className="text-white text-center font-Popping-SemiBold ml-2">
          Create Playlist
        </Text>
      </TouchableOpacity>
    </View>
  );

  const getSongCountText = (playlist: Playlist) => {
    const count = playlist?.Playlist_songs?.[0]?.count || 0;
    return count === 1 ? "1 song" : `${count} songs`;
  };

  return (
    <DashBoardLayout>
      <DashBoardHeader title="Your Playlists" />
      <View className="flex-1 bg-white px-4">
        {/* Create Playlist Button */}
        {playlists.length > 0 && (
          <TouchableOpacity
            className="bg-red-500 py-3 px-6 rounded-full mb-6 mt-4 self-center flex-row items-center shadow-md"
            onPress={() => setShowModal(true)}
            style={{
              shadowColor: "#EF4444",
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.3,
              shadowRadius: 6,
              elevation: 6,
            }}
          >
            <Feather name="plus" size={18} color="white" />
            <Text className="text-white text-center font-Popping-SemiBold ml-2">
              Create New Playlist
            </Text>
          </TouchableOpacity>
        )}

        {/* Playlists Grid */}
        {loadingPlaylists ? (
          <View className="flex-1 justify-center items-center">
            <ActivityIndicator size="large" color="#EF4444" />
          </View>
        ) : (
          <ScrollView
            className="flex-1"
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={onRefresh}
                colors={["#EF4444"]}
                tintColor="#EF4444"
              />
            }
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 40 }}
          >
            {playlists.length === 0 ? (
              renderEmptyState()
            ) : (
              <View className="flex-row flex-wrap justify-between">
                {playlists.map((playlist) => (
                  <TouchableOpacity
                    key={playlist.id}
                    className="mb-6 overflow-hidden"
                    style={{ width: CARD_WIDTH }}
                    onPress={() => router.push(`(root)/playlist/${playlist.id}`)}
                    activeOpacity={0.8}
                  >
                    {/* Playlist Cover with gradient overlay */}
                    <View className="relative">
                      <Image
                        source={{
                          uri:
                            playlist.thumbnail ||
                            "https://via.placeholder.com/200x200?text=No+Cover",
                        }}
                        className="w-full rounded-2xl"
                        style={{ height: CARD_WIDTH }}
                        resizeMode="cover"
                      />

                      {/* Overlay gradient effect */}
                      <View
                        className="absolute bottom-0 left-0 right-0 h-20 rounded-b-2xl overflow-hidden"
                        style={{ backgroundColor: "rgba(0,0,0,0.6)" }}
                      >
                        <View className="p-3">
                          <Text
                            className="text-white font-Popping-Bold"
                            numberOfLines={1}
                          >
                            {playlist.name}
                          </Text>
                          <Text className="text-gray-300 font-Popping-Medium text-xs mt-1">
                            {getSongCountText(playlist)}
                          </Text>
                        </View>
                      </View>

                      {/* Play icon overlay */}
                      <View
                        className="absolute top-0 right-0 m-2 bg-black/40 p-2 rounded-full"
                        style={{ backdropFilter: "blur(5px)" }}
                      >
                        <Feather name="play" size={18} color="white" />
                      </View>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            )}
          </ScrollView>
        )}

        {/* Create Playlist Modal with improved UI */}
        <Modal
          visible={showModal}
          transparent
          animationType="slide"
          onRequestClose={() => setShowModal(false)}
        >
          <View className="flex-1 justify-end bg-black/50">
            <View
              className="bg-white rounded-t-3xl p-6"
              style={{
                shadowColor: "#000",
                shadowOffset: { width: 0, height: -2 },
                shadowOpacity: 0.2,
                shadowRadius: 8,
                elevation: 10,
              }}
            >
              <View className="flex-row justify-between items-center mb-6">
                <Text className="text-xl font-Popping-Bold">
                  Create New Playlist
                </Text>
                <TouchableOpacity
                  onPress={() => {
                    setShowModal(false);
                    setThumbnail(null);
                    setPlaylistName("");
                    setDescription("");
                    setError(null);
                  }}
                  className="p-2"
                >
                  <Feather name="x" size={24} color="#444" />
                </TouchableOpacity>
              </View>

              {error && (
                <View className="bg-red-100 p-3 rounded-lg mb-4 flex-row items-center">
                  <Feather name="alert-circle" size={18} color="#EF4444" />
                  <Text className="text-red-600 ml-2 font-Popping-Medium">
                    {error}
                  </Text>
                </View>
              )}

              {/* Thumbnail Upload Section with better styling */}
              <View className="items-center mb-6">
                <TouchableOpacity
                  onPress={pickImage}
                  disabled={uploadLoading}
                  className="relative"
                >
                  {thumbnail ? (
                    <View className="relative">
                      <Image
                        source={{ uri: thumbnail }}
                        className="w-40 h-40 rounded-xl"
                        style={{
                          shadowColor: "#000",
                          shadowOffset: { width: 0, height: 2 },
                          shadowOpacity: 0.1,
                          shadowRadius: 4,
                          elevation: 3,
                        }}
                      />
                      <TouchableOpacity
                        className="absolute top-2 right-2 bg-black/60 rounded-full p-2"
                        onPress={() => setThumbnail(null)}
                      >
                        <Feather name="x" size={16} color="white" />
                      </TouchableOpacity>

                      <View className="absolute bottom-0 right-0 bg-red-500 rounded-full p-2 m-2">
                        <Feather name="edit-2" size={16} color="white" />
                      </View>
                    </View>
                  ) : (
                    <View className="w-40 h-40 bg-gray-100 rounded-xl items-center justify-center border-2 border-dashed border-gray-300">
                      {uploadLoading ? (
                        <View className="items-center">
                          <ActivityIndicator size="small" color="#EF4444" />
                          <Text className="text-gray-500 mt-2 font-Popping-Medium">
                            Uploading...
                          </Text>
                        </View>
                      ) : (
                        <>
                          <View className="bg-gray-200 p-3 rounded-full mb-2">
                            <Feather name="image" size={24} color="#EF4444" />
                          </View>
                          <Text className="text-gray-600 font-Popping-Medium">
                            Add Cover Image
                          </Text>
                          <Text className="text-gray-400 text-xs mt-1 font-Popping">
                            Tap to browse
                          </Text>
                        </>
                      )}
                    </View>
                  )}
                </TouchableOpacity>
              </View>

              {/* Form fields with better styling */}
              <Text className="text-gray-700 font-Popping-Medium mb-2 ml-1">
                Playlist Name*
              </Text>
              <TextInput
                className="bg-gray-100 p-4 rounded-xl mb-4 font-Popping"
                placeholder="My Awesome Playlist"
                value={playlistName}
                onChangeText={(text) => {
                  setPlaylistName(text);
                  setError(null);
                }}
                placeholderTextColor="#9CA3AF"
              />
              <Text className="text-gray-700 font-Popping-Medium mb-2 ml-1">
                Description
              </Text>
              <TextInput
                className="bg-gray-100 p-4 rounded-xl mb-6 font-Popping min-h-24"
                placeholder="Write something about this playlist..."
                value={description}
                onChangeText={setDescription}
                multiline
                numberOfLines={3}
                textAlignVertical="top"
                placeholderTextColor="#9CA3AF"
              />

              {/* Action buttons */}
              <TouchableOpacity
                className={`p-4 rounded-xl mb-3 flex-row justify-center items-center ${
                  loading || uploadLoading ? "bg-gray-400" : "bg-red-500"
                }`}
                onPress={handleCreatePlaylist}
                disabled={loading || uploadLoading}
                style={{
                  shadowColor: loading || uploadLoading ? "#666" : "#EF4444",
                  shadowOffset: { width: 0, height: 4 },
                  shadowOpacity: 0.2,
                  shadowRadius: 4,
                  elevation: 5,
                }}
              >
                {loading ? (
                  <>
                    <ActivityIndicator size="small" color="white" />
                    <Text className="text-white text-center font-Popping-Bold ml-2">
                      Creating...
                    </Text>
                  </>
                ) : (
                  <>
                    <MaterialIcons
                      name="playlist-add"
                      size={20}
                      color="white"
                    />
                    <Text className="text-white text-center font-Popping-Bold ml-2">
                      Create Playlist
                    </Text>
                  </>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </View>
    </DashBoardLayout>
  );
};

export default GeneratePlaylist;
