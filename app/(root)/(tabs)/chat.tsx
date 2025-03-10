import {
  View,
  Image,
  Text,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from "react-native";
import icons from "@/constants/icons";
import React, { useState, useEffect } from "react";
import DashBoardLayout from "@/components/DashBoardLayout";
import DashBoardHeader from "@/components/dashBoardHeader";
import { Feather } from "@expo/vector-icons";
import DashBoardCard from "@/components/DashBoardCard";

import useSimilarUsers from "@/hook/useSimilarUsers";
import useUserProvider from "@/hook/useUserProvider";
import { router } from "expo-router";

export default function SocialPage() {
  const { user } = useUserProvider();
  const { similarUsers, allUsers, loading, error } = useSimilarUsers();
  const [search, setSearch] = useState<string>("");
  const [filteredUsers, setFilteredUsers] = useState(similarUsers);
  const [activeTab, setActiveTab] = useState<'similar'|'all'|'friends'|'invites'>("similar");

  const formatList = (text: string) => {
    return text.split("-").join(", ");
  };

  const handleUserPress = (userId: string) => {
    router.push(`/(root)/chat/${userId}}`);
    // router.push(`/(root)/chat/index`);
  };

  // Update filtered users when search changes or when original users list changes
  useEffect(() => {
    if (!search.trim()) {
      setFilteredUsers(activeTab === "similar" ? similarUsers : allUsers);
      return;
    }

    const searchLower = search.toLowerCase();
    const filtered = (activeTab === "similar" ? similarUsers : allUsers).filter(
      (user) => {
        // Add null checks for all properties
        const firstName = user.first_name || "";
        const lastName = user.last_name || "";
        const fullName = `${firstName} ${lastName}`.toLowerCase();
        const genres = (user.genre || "").toLowerCase();
        const artists = (user.fav_artist || "").toLowerCase();

        return (
          fullName.includes(searchLower) ||
          genres.includes(searchLower) ||
          artists.includes(searchLower)
        );
      }
    );

    setFilteredUsers(filtered);
  }, [search, similarUsers, allUsers, activeTab]);

  return (
    <DashBoardLayout>
      <DashBoardHeader title="Similar Music Fans" />
      <View className="w-full h-full bg-white px-4 py-2">
        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2 mb-4 mt-3">
          <Image source={icons.search} className="w-6 h-6" />
          <TextInput
            placeholder="Search by name, genre or artist..."
            className="flex-1 ml-2 font-Popping-SemiBold"
            value={search}
            onChangeText={(val) => setSearch(val)}
          />
          {search && (
            <Feather
              name="x"
              size={24}
              color="gray"
              onPress={() => setSearch("")}
            />
          )}
        </View>

        <View className="flex-row bg-white py-3 gap-5">
          <TouchableOpacity
            className={`px-5 py-2 rounded-full ${activeTab === "all" ? "bg-red-100" : "bg-gray-200"
              }`}
            onPress={() => setActiveTab("all")}
          >
            <Text
              className={`text-sm font-Popping-SemiBold ${activeTab === "all" ? "text-black" : "text-primarygray"
                }`}
            >
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`px-5 py-2 rounded-full ml-2 ${activeTab === "similar" ? "bg-red-100" : "bg-gray-200"
              }`}
            onPress={() => setActiveTab("similar")}
          >
            <Text
              className={`text-sm font-Popping-SemiBold ${activeTab === "similar" ? "text-black" : "text-primarygray"
                }`}
            >
              Similar
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`px-5 py-2 rounded-full ${activeTab === "friends" ? "bg-red-100" : "bg-gray-200"
              }`}
            onPress={() => setActiveTab("friends")}
          >
            <Text
              className={`text-sm font-Popping-SemiBold ${activeTab === "all" ? "text-black" : "text-primarygray"
                }`}
            >
              Friend
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`px-5 py-2 rounded-full ml-2 ${activeTab === "invites" ? "bg-red-100" : "bg-gray-200"
              }`}
            onPress={() => setActiveTab("invites")}
          >
            <Text
              className={`text-sm font-Popping-SemiBold ${activeTab === "similar" ? "text-black" : "text-primarygray"
                }`}
            >
              Invites
            </Text>
          </TouchableOpacity>
        </View>

        <Text className="text-lg font-Popping-SemiBold mb-4 mt-2">
          {activeTab === "similar"
            ? "People with similar music taste"
            : "All Music Fans"}
        </Text>

        <ScrollView className="flex-1">
          {loading ? (
            <View className="flex items-center justify-center py-4">
              <Text className="font-Popping-Medium text-gray-500">
                Finding music buddies...
              </Text>
            </View>
          ) : error ? (
            <View className="flex items-center justify-center py-4">
              <Text className="font-Popping-Medium text-red-500">{error}</Text>
            </View>
          ) : filteredUsers.length === 0 ? (
            <View className="flex items-center justify-center py-4">
              <Text className="font-Popping-Medium text-gray-500">
                {search
                  ? "No matching results found"
                  : activeTab === "similar"
                    ? "No similar music fans found"
                    : "No music fans found"}
              </Text>
            </View>
          ) : (
            filteredUsers.map((similarUser) => (
              <TouchableOpacity
                key={similarUser.id}
                className="mb-4"
                onPress={() => handleUserPress(similarUser.id)}
              >
                <DashBoardCard>
                  <DashBoardCard.BigIcon>
                    <Image
                      source={{
                        uri: similarUser.avatar || icons.dummyProfilePicture,
                      }}
                      className="w-12 h-12 rounded-full"
                    />
                  </DashBoardCard.BigIcon>
                  <DashBoardCard.Content
                    title={`${similarUser.first_name || ""} ${similarUser.last_name || ""
                      }`}
                    primaryText={`${(
                      (similarUser.similarity_score || 0) * 100
                    ).toFixed(0)}% Match`}
                    secondartText={
                      <View>
                        <Text className="text-xs text-gray-500">
                          Genres: {similarUser.genre || "Not specified"}
                        </Text>
                        <Text className="text-xs text-gray-500">
                          Artists: {similarUser.fav_artist || "Not specified"}
                        </Text>
                      </View>
                    }
                  />
                  <DashBoardCard.SmallIcon>
                    <TouchableOpacity className="bg-red-100 p-2 rounded-full">
                      <Feather name="message-circle" size={20} color="black" />
                    </TouchableOpacity>
                  </DashBoardCard.SmallIcon>
                </DashBoardCard>
              </TouchableOpacity>
            ))
          )}
        </ScrollView>
      </View>
    </DashBoardLayout>
  );
}
