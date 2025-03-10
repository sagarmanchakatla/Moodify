import DashBoardHeader from "@/components/dashBoardHeader";
import React from "react";
import { View } from "react-native";
import { recentPlayedSongs } from "@/constants/data";
import RecentlyPlayedList from "@/components/LikedPlayedList";
// import RecentlyPlayedHeader from "@/components/RecentlyPayedHeader";
import LikedPlayedList from "@/components/LikedPlayedList";
import LikedPlayedHeader from "@/components/LikedPlayedHeader";

const RecentlyPlayedScreen: React.FC = () => {
  return (
    <View className="flex-1 bg-white">
      <DashBoardHeader title="Recently Played" />
      <View className="my-3">
        <LikedPlayedHeader time={"Today"} />
        <RecentlyPlayedList items={recentPlayedSongs} />
      </View>
      <View className="my-3">
        <LikedPlayedHeader time={"Yesterday"} />
        <RecentlyPlayedList items={recentPlayedSongs} />
      </View>
    </View>
  );
};

export default RecentlyPlayedScreen;
