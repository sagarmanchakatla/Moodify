import { View, Image, Text, ScrollView, TextInput } from "react-native";
import icons from "@/constants/icons";
import React, { useState, useEffect } from "react";
import DashBoardLayout from "@/components/DashBoardLayout";
import DashBoardHeader from "@/components/dashBoardHeader";
import { Feather } from "@expo/vector-icons";
import useSimilarUsers from "@/hook/useSimilarUsers";
import useUserProvider from "@/hook/useUserProvider";
import { router } from "expo-router";
import { socialTabTitle } from "@/constants";
import { SimilarUser } from "@/schema";
import SocialTabs from "@/components/SocialTabs";
import SocialCard from "@/components/SocialCard";

export default function SocialPage() {
  const { socialUsers, isLoading, error } = useSimilarUsers();
  const [search, setSearch] = useState<string>("");
  const [activeTab, setActiveTab] = useState<"similar" | "friends" | "invites">(
    "friends"
  );
  const [filteredUsers, setFilteredUsers] = useState<SimilarUser[]>(
    socialUsers[activeTab]
  );

  const formatList = (text: string) => {
    return text.split("-").join(", ");
  };

  const handleUserPress = (userId: string) => {
    router.push(`/(root)/chat/${userId}}`);
  };

  // Update filtered users when search changes or when original users list changes
  useEffect(() => {
    if (!search.trim()) {
      setFilteredUsers(socialUsers[activeTab]);
      return;
    }

    const searchLower = search.toLowerCase();
    const filtered = filteredUsers.filter((user) => {
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
    });

    setFilteredUsers(filtered);
  }, [search, activeTab]);

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

        <SocialTabs activeTab={activeTab} setActiveTab={setActiveTab} />

        <Text className="text-lg font-Popping-SemiBold mb-4 mt-2">
          {socialTabTitle[activeTab]}
        </Text>

        <ScrollView className="flex-1">
          {isLoading ? (
            <View className="flex items-center justify-center py-4">
              <Text className="font-Popping-Medium text-gray-500">
                Finding music buddies...
              </Text>
            </View>
          ) : error ? (
            <View className="flex items-center justify-center py-4">
              <Text className="font-Popping-Medium text-red-500">{error}</Text>
            </View>
          ) : filteredUsers?.length === 0 ? (
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
            <SocialCard tab={activeTab} users={filteredUsers} />
          )}
        </ScrollView>
      </View>
    </DashBoardLayout>
  );
}

{
  /* <TouchableOpacity
              key={similarUser.id}
              className="mb-4"
              onPress={() => handleUserPress(similarUser.id)}
            >
              <DashBoardCard>
                <DashBoardCard.BigIcon uri={similarUser.avatar} />
                <DashBoardCard.Content
                  component={
                    <View className="flex-1">
                      <Text className="text-ms font-Popping-SemiBold text-gray-800">{`${similarUser.first_name || ""} ${similarUser.last_name || ""}`}</Text>
                      <Text className="text-sm font-Popping text-gray-600">{`${((similarUser.similarity_score || 0) * 100).toFixed(0)}% Match`}</Text>
                      <View>
                        <Text className="text-xs text-gray-500">
                          Genres: {similarUser.genre || "Not specified"}
                        </Text>
                        <Text className="text-xs text-gray-500">
                          Artists: {similarUser.fav_artist || "Not specified"}
                        </Text>
                      </View>
                    </View>
                  }
                />
              </DashBoardCard>
            </TouchableOpacity> */
}
