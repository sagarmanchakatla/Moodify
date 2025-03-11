import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Image,
  ImageBackground,
  Button,
} from "react-native";
import Feather from "@expo/vector-icons/Feather";
import DashBoardLayout from "@/components/DashBoardLayout";
import icons from "@/constants/icons";
import DashBoardCard from "@/components/DashBoardCard";
import TopTenSongs from "@/components/TopTenSongs";
import { recentPlayedSongs } from "@/constants/data";
import { router } from "expo-router";
import useUserProvider from "@/hook/useUserProvider";
import useSongProvider from "@/hook/useSongProvider";
import useHistoryProvider from "@/hook/useHistoryProvider";
import LikedPlayedList from "@/components/LikedPlayedList";
import HistoryComponent from "@/components/HistoryComponent";

const HomeScreen = () => {
  const { displayNameForUser, user } = useUserProvider();
  const [search, setSearch] = useState<string>();
  const { fetchSearchQuery } = useSongProvider();
  const { getHistory } = useHistoryProvider();
  const [history, setHistory] = useState<any[]>([]); // State to store history data

  useEffect(() => {
    const fetchHistory = async () => {
      if (user?.id) {
        const historyData = await getHistory(user.id);
        setHistory(historyData);
        console.log(history);
      }
    };

    fetchHistory();
  }, [user?.id]);

  const handleSearch = () => {
    if (search) {
      fetchSearchQuery(search);
      router.push("/(root)/(tabs)/playlist");
    }
  };

  return (
    <DashBoardLayout>
      <View className="flex-1 bg-white px-4 py-6">
        {/* Greeting & Notification */}
        <View className="flex-row justify-between items-center">
          <Text className="text-gray-500 text-lg font-Popping">
            Good Morning,
          </Text>
          <TouchableOpacity onPress={() => router.push("/(root)/notification")}>
            <Image source={icons.notification2icon} className="w-6 h-6" />
          </TouchableOpacity>
        </View>
        <Text className="text-black text-2xl font-Popping-Bold">
          {displayNameForUser}
        </Text>

        {/* Search Bar */}
        <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2 mt-4">
          <Image source={icons.search} className="w-6 h-6" />
          <TextInput
            placeholder="Search Here..."
            className="flex-1 ml-2 font-Popping-SemiBold"
            value={search}
            onChangeText={(val) => setSearch(val)}
            onSubmitEditing={handleSearch}
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

        {/* Song Suggestions */}
        <View className="mt-6 ">
          <View className="flex-row justify-between">
            <Text className="text-black text-lg font-Popping-SemiBold">
              Song Suggestions for You
            </Text>
            <Text className="text-gray-500 font-Popping">Try again</Text>
          </View>

          <DashBoardCard extraStyle="border-r-2 border-b-2 border-zinc-300 rounded-3xl">
            <DashBoardCard.BigIcon icon={icons.songPlacholderIcon} />
            <DashBoardCard.Content
              title={"Song 1"}
              secondartText="Singer | 3 mins"
            />
            <DashBoardCard.SmallIcon
              component={
                <TouchableOpacity>
                  <Feather name="play-circle" size={24} color="pink" />
                </TouchableOpacity>
              }
            />
          </DashBoardCard>
        </View>

        <TopTenSongs />

        {/* Popular Playlists */}
        <View className="mt-6">
          <View className="flex-row justify-between">
            <Text className="text-black text-lg font-Popping-Bold">
              Popular Playlists
            </Text>
            <Text className="text-gray-500 font-Popping">See more</Text>
          </View>

          <View className="mt-4 grid grid-cols-1">
            <PopularPlayListName />
            <PopularPlayListName reverse />
          </View>
        </View>

        {/* <Text className="font-Popping-Bold text-xl mt-5 mb-5">
          Looking for Something New
        </Text>

        <BannerComponent /> */}

        <HistoryComponent history={history} />

        {/* <LikedPlayedHeader time="Recently Play" /> */}
        <LikedPlayedList items={recentPlayedSongs} icon={icons.smallplayicon} />
      </View>
    </DashBoardLayout>
  );
};

export default HomeScreen;

const BannerComponent: React.FC = () => {
  return (
    <View className="w-full flex flex-col">
      {/* Main Background */}
      <ImageBackground
        source={icons.orangeBackgroundicon}
        className="w-full h-[190px] justify-center items-center"
      >
        {/* Banner Content */}
        <ImageBackground
          source={icons.bannerDoticon}
          className="w-full h-[140px] flex flex-col justify-between p-5 relative"
        >
          <Text className="text-white font-bold text-xl ml-5">
            Try Virtual Concert with{"\n"}your Friend
          </Text>

          <ImageBackground
            source={icons.greenBackgroundicon}
            className="absolute bottom-5 right-10 px-4 py-2 rounded-full"
          >
            <Text className="text-white font-Popping-SemiBold">Click</Text>
          </ImageBackground>
        </ImageBackground>
      </ImageBackground>
    </View>
  );
};

const PopularPlayListName: React.FC<{ reverse?: boolean }> = ({ reverse }) => {
  return (
    <View
      className={`flex ${
        reverse ? "flex-row-reverse" : "flex-row"
      } rounded-lg mb-4 w-full`}
    >
      <Image source={icons.pinkBackgroundicon} className="w-1/2 rounded-lg" />

      <View className="flex flex-col w-1/2 justify-start py-5 px-2 flex-1">
        <Text
          className="text-black font-Popping-SemiBold text-lg"
          numberOfLines={1}
          ellipsizeMode="tail"
        >
          Playlist Name
        </Text>

        <Text
          className="text-gray-600 text-md font-Popping"
          numberOfLines={2}
          ellipsizeMode="tail"
        >
          Songs Count | 20 minutes
        </Text>

        <Text className="text-gray-600 text-md font-Popping">Likes</Text>
        <Text className="text-gray-600 text-md font-Popping">Shares</Text>
        <TouchableOpacity className="mt-2">
          <Feather name="play-circle" size={24} color="pink" />
        </TouchableOpacity>
      </View>
    </View>
  );
};
