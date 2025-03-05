import React from "react";
import { View, TouchableOpacity, Image } from "react-native";
import Feather from '@expo/vector-icons/Feather';
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import useToggle from "@/hook/useToggle";
import Entypo from '@expo/vector-icons/Entypo';
import icons from "@/constants/icons";



type ToggleType = "home" | "message" | "profile" | "history" | "camera";


const NavigationButtons: React.FC = () => {
  const { setToggle, toggle } = useToggle();

  return (
    <View className="absolute bottom-0 left-0 right-0 bg-white h-20 flex-row justify-around items-center shadow-lg">
      <TouchableOpacity onPress={(() => setToggle("home"))}>
        <Feather name="home" size={24} color={toggle === "home" ? "pink" : "black"} className="opacity-60" />
        {toggle === "home" && <Entypo name="dot-single" size={24} color="pink" />}
      </TouchableOpacity>

      <TouchableOpacity onPress={val => setToggle("playlist")}>
        <MaterialCommunityIcons name="playlist-music-outline" size={28} color={toggle === "playlist" ? "pink" : "black"} className="opacity-60" />
        {toggle === "playlist" && <Entypo name="dot-single" size={24} color="pink" />}
      </TouchableOpacity>

      <TouchableOpacity onPress={val=>setToggle("camera")} className="py-1 rounded-full mt-2 flex flex-row justify-center items-center relative -top-8">
        <Image source={icons.primaryBackgroundColorIcon} className="absolute top-0 w-[70px] h-[70px] rounded-full "/>
        <Feather name="camera" size={28} color="white" className="opacity-60 mt-4" />
      </TouchableOpacity>

      <TouchableOpacity onPress={val => setToggle("message")}>
        <Feather name="message-square" size={24} color={toggle === "message" ? "pink" : "black"} className="opacity-60" />
        {toggle === "message" && <Entypo name="dot-single" size={24} color="pink" />}
      </TouchableOpacity>

      <TouchableOpacity onPress={val => setToggle("profile")}>
        <Feather name="user" size={24} color={toggle === "profile" ? "pink" : "black"} className="opacity-60" />
        {toggle === "profile" && <Entypo name="dot-single" size={24} color="pink" />}
      </TouchableOpacity>
    </View>
  );
};

export default NavigationButtons;
