import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import useUserProvider from "@/hook/useUserProvider";

interface Artist {
  name: string;
  genre: string;
}

const artists: Artist[] = [
  { name: "Adele", genre: "Pop" },
  { name: "Drake", genre: "Hip Hop" },
  { name: "Ed Sheeran", genre: "Pop" },
  { name: "Beyoncé", genre: "Pop" },
  { name: "Taylor Swift", genre: "Pop" },
  { name: "Kanye West", genre: "Hip Hop" },
  { name: "Rihanna", genre: "Pop" },
  { name: "The Weeknd", genre: "Pop" },
  { name: "Billie Eilish", genre: "Pop" },
  { name: "Post Malone", genre: "Hip Hop" },
  { name: "John Legend", genre: "Romance" },
  { name: "Sam Smith", genre: "Romance" },
  { name: "Alicia Keys", genre: "Romance" },
  { name: "Ludovico Einaudi", genre: "Peaceful" },
  { name: "Yiruma", genre: "Peaceful" },
  { name: "Enya", genre: "Peaceful" },
  { name: "Joji", genre: "Lofi" },
  { name: "Nujabes", genre: "Lofi" },
  { name: "Jinsang", genre: "Lofi" },
];

const FavArtistScreen: React.FC = () => {
  const [selectedArtists, setSelectedArtists] = useState<string[]>([]);
  const [error, setError] = useState<string>("");
  const { user, updateUserProfile } = useUserProvider();
  const [filteredArtists, setFilteredArtists] = useState<Artist[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [searchResults, setSearchResults] = useState<Artist[]>([]);

  useEffect(() => {
    if (user?.genre) {
      const genres = user.genre.split("-");
      const filtered = artists.filter((artist) =>
        genres.includes(artist.genre)
      );
      setFilteredArtists(filtered);
    }
  }, [user]);

  const toggleArtist = (artist: string) => {
    if (selectedArtists.includes(artist)) {
      setSelectedArtists((prev) => prev.filter((a) => a !== artist));
    } else {
      if (selectedArtists.length < 5) {
        setSelectedArtists((prev) => [...prev, artist]);
        setError("");
      } else {
        setError("You can only select up to 5 artists.");
      }
    }
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim() === "") {
      setSearchResults([]);
    } else {
      const results = artists.filter((artist) =>
        artist.name.toLowerCase().includes(query.toLowerCase())
      );
      setSearchResults(results);
    }
  };

  const addCustomArtist = () => {
    if (searchQuery.trim() === "") {
      setError("Please enter an artist name.");
      return;
    }

    if (selectedArtists.length >= 5) {
      setError("You can only select up to 5 artists.");
      return;
    }

    const newArtist: Artist = { name: searchQuery, genre: "Custom" };
    setSelectedArtists((prev) => [...prev, newArtist.name]);
    setSearchQuery("");
    setSearchResults([]);
    setError("");
  };

  const handleSubmit = () => {
    if (selectedArtists.length === 0) {
      setError("Select at least one artist.");
    } else {
      updateUserProfile({ fav_artist: selectedArtists.join("-") });
      setError("");
      router.push("/(auth)/Welcome");
    }
  };

  return (
    <View className="flex-1 bg-white">
      {/* Content - Scrollable */}
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        className="px-6 pt-10"
      >
        {/* Title */}
        <Text className="text-2xl font-Popping-Bold text-center">
          Select Your Favorite Artists
        </Text>
        <Text className="text-gray-500 text-center mt-1 font-Popping-SemiBold text-md">
          Choose up to 3 artists from your selected genres.
        </Text>

        {/* Search Bar */}
        <View className="mt-6">
          <TextInput
            className="p-3 border border-gray-300 rounded-lg"
            placeholder="Search for an artist..."
            value={searchQuery}
            onChangeText={handleSearch}
          />
          {searchResults.length > 0 && (
            <View className="mt-2">
              {searchResults.map((artist) => (
                <TouchableOpacity
                  key={artist.name}
                  className="p-3 bg-gray-100 rounded-lg mt-2"
                  onPress={() => toggleArtist(artist.name)}
                >
                  <Text className="text-black text-lg font-medium">
                    {artist.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}
          {searchQuery.trim() !== "" && searchResults.length === 0 && (
            <TouchableOpacity
              className="p-3 bg-blue-100 rounded-lg mt-2"
              onPress={addCustomArtist}
            >
              <Text className="text-black text-lg font-medium text-center">
                Add "{searchQuery}" as a custom artist
              </Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Display Artists by Genre */}
        {user?.genre &&
          user.genre.split("-").map((genre) => (
            <View key={genre} className="mt-6">
              <Text className="text-xl font-Popping-Bold mb-2">{genre}</Text>
              <View className="flex-row flex-wrap justify-center">
                {filteredArtists
                  .filter((artist) => artist.genre === genre)
                  .slice(0, 3) // Show only 3 artists per genre
                  .map((artist) => (
                    <TouchableOpacity
                      key={artist.name}
                      className={`px-6 py-3 rounded-xl m-2 w-[45%] bg-blue-100 ${
                        selectedArtists.includes(artist.name)
                          ? "opacity-50"
                          : "opacity-100"
                      }`}
                      onPress={() => toggleArtist(artist.name)}
                    >
                      <Text className="text-black text-lg font-medium text-center">
                        {artist.name}
                      </Text>
                    </TouchableOpacity>
                  ))}
              </View>
            </View>
          ))}

        <Text className="text-red-500 font-Popping mt-4 text-center">
          {error}
        </Text>
      </ScrollView>

      {/* Fixed Bottom Button */}
      <View className="absolute bottom-5 left-0 right-0 px-6">
        <LinearGradient
          colors={["#FBC5C5", "#F8AC7D"]}
          start={{ x: 0.9, y: 0.02 }}
          end={{ x: 0.9, y: 0.91 }}
          className="w-full rounded-md"
          style={{
            borderRadius: 50,
            overflow: "hidden",
          }}
        >
          <TouchableOpacity className="p-4 rounded-full" onPress={handleSubmit}>
            <Text className="text-white text-lg font-Popping-SemiBold text-center">
              Next
            </Text>
          </TouchableOpacity>
        </LinearGradient>
      </View>
    </View>
  );
};

export default FavArtistScreen;
