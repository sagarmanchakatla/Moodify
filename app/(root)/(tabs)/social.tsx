import {View,Text} from "react-native";
import React from "react";
import DashBoardLayout from "@/components/DashBoardLayout";
import DashBoardHeader from "@/components/dashBoardHeader";
import SocialCard from "@/components/SocialCard";
import { getSocialUsers } from "@/http/usershttp";
import useSWR from "swr";
import useUserProvider from "@/hook/useUserProvider";

export default function SocialPage() {
  const { user } = useUserProvider();

  const { isLoading, data, error, mutate } = useSWR("/socials", () => getSocialUsers(user!));
  let content;
  if (isLoading) {
    content = (
      <View className="flex items-center justify-center py-4">
        <Text className="font-Popping-Medium text-gray-500">
          Finding music buddies...
        </Text>
      </View>
    )
  } else if (error) {
    content = (
      <View className="flex items-center justify-center py-4">
        <Text className="font-Popping-Medium text-red-500">{error}</Text>
      </View>
    )
  } else {
    content = <SocialCard allUsers={data!.allUsers} similarUsers={data!.similarUsers}/>
  }

  return (
    <DashBoardLayout>
      <DashBoardHeader title="Similar Music Fans" />
      {content}
    </DashBoardLayout>
  );
}




// Update filtered users when search changes or when original users list changes
/* useEffect(() => {
  setFilteredUsers((pre) => {
    let selectedData;
    if (activeTab === "friends") {
      selectedData = users.filter(user => friends.includes(user.id));
    } else if (activeTab === "invites") {
      selectedData = users.filter(user => invites.includes(user.id));
    } else {
      selectedData = users;
    }
    return selectedData;
  });
  if (!search.trim()) {
    setFilteredUsers((pre) => {
      let selectedData;
      if (activeTab === "friends") {
        selectedData = users.filter(user => friends.includes(user.id));
      } else if (activeTab === "invites") {
        selectedData = users.filter(user => invites.includes(user.id));
      } else {
        selectedData = users;
      }
      return selectedData;
    });
    return;
  }

  const searchLower = search.toLowerCase();
  const filtered = (filteredUsers).filter(
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
}, [search, activeTab]); */