import React, { useState } from "react";
import { View, Text, Image, TouchableOpacity, Switch, ScrollView, Modal } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import DashBoardHeader from "@/components/dashBoardHeader";
import icons from "@/constants/icons";
import DashBoardCard from "@/components/DashBoardCard";
import UserStates from "@/components/UsersStates";
import { AccountsSetting, OtherSettings } from "@/constants/data";
import DashBoardLayout from "@/components/DashBoardLayout";
import useUserProvider from "@/hook/useUserProvider";
import useImageProvider from "@/hook/useImageProvider";

const ProfileScreen = () => {
  const [isNotificationEnabled, setNotificationEnabled] = useState(true);
  const { displayNameForUser, user } = useUserProvider();
  const { pickImage, uri, fileName } = useImageProvider();
  const toggleSwitch = () => setNotificationEnabled((prev) => !prev);
  const handleEdit = async () => {
    await pickImage();
  }

  return (
    <DashBoardLayout>
      <ScrollView
        contentContainerStyle={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
          paddingBottom: 100
        }}
      >
        <View className="flex-1 bg-offwhite">
          {/* 🔹 Header */}
          <DashBoardHeader title="Profile" />

          {/* 🔹 Profile Info */}
          <DashBoardCard extraStyle="mb-3">
            <DashBoardCard.BigIcon uri={user?.avatar} />
            <DashBoardCard.Content title={displayNameForUser} />
            <DashBoardCard.SmallIcon component={
              <TouchableOpacity onPress={handleEdit} className="py-1 rounded-full mt-2 relative flex flex-row justify-center items-center">
                <Image source={icons.primaryBackgroundColorIcon} />
                <Text className="absolute top-2 text-offwhite font-Popping">Edit</Text>
              </TouchableOpacity>
            } />
          </DashBoardCard>

          {/* 🔹 Stats (Height, Weight, Age) */}
          <UserStates age={user?.age || 0} height={user!.height} weight={user!.weight} />

          {/* 🔹 Account Section */}
          <View className="bg-white mx-4 mt-6 rounded-2xl shadow-md">
            <Text className="text-xl font-Popping-Bold text-gray-900 p-4">Account</Text>
            {AccountsSetting.map((item, index) => (
              <TouchableOpacity key={index} className="flex-row items-center justify-between p-4 border-b border-gray-200">
                <View className="flex-row items-center space-x-3">
                  <Image source={item.primaryIcon} />
                  <Text className="text-md font-Popping text-gray-900">{item.name}</Text>
                </View>
                <Image source={item.secondaryIcon} />
              </TouchableOpacity>
            ))}
          </View>

          {/* 🔹 Notification Section */}
          <View className="bg-white mx-4 mt-4 rounded-2xl shadow-md p-4">
            <Text className="text-xl font-bold text-gray-900">Notification</Text>
            <View className="flex-row justify-between items-center mt-3">
              <View className="flex-row items-center space-x-3">
                <Image source={icons.notifyicon} />
                <Text className="text-md font-Popping text-gray-900">Pop-up Notification</Text>
              </View>
              <Switch value={isNotificationEnabled} onValueChange={toggleSwitch} />
            </View>
          </View>

          {/* 🔹 Other Section */}
          <View className="bg-white mx-4 mt-4 rounded-2xl shadow-md">
            <Text className="text-xl font-bold text-gray-900 p-4">Other</Text>
            {OtherSettings.map((item, index) => (
              <TouchableOpacity key={index} className="flex-row items-center justify-between p-4 border-b border-gray-200">
                <View className="flex-row items-center space-x-3">
                  <Text className="text-md font-Popping text-gray-900">{item.title}</Text>
                </View>
                <Ionicons name="chevron-forward" size={16} color="#D1D5DB" />
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
      <ProfilePictureModal image={uri} show={fileName !== null} />
    </DashBoardLayout>
  );
};

export default ProfileScreen;


interface ProfilePictureModal {
  image: string,
  show: boolean,
}

const ProfilePictureModal = ({ image, show, }: ProfilePictureModal) => {
  const {uploadProfilePicture} = useUserProvider();
  const {fileName,base64ImageString,resetImage,contentType} = useImageProvider();
  const setProfilePicture = async ()=>{
    await uploadProfilePicture(base64ImageString,contentType!,fileName!);
    resetImage();
  }
  const handleCancel = ()=>{
    resetImage();
  }
  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={show}

    >
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white rounded-2xl p-6 w-80 flex items-center shadow-lg">
          <Image source={{ uri: image }} className="w-16 h-16 mb-4" />
          <View className="flex flex-row p-4 gap-5">
            <TouchableOpacity className="w-1/2 p-2 bg-red-300/70 " onPress={handleCancel}>
              <Text className="text-center text-white font-Popping-SemiBold">Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity className="w-1/2 p-2 bg-blue-500 " onPress={setProfilePicture}>
              <Text className="text-center text-white font-Popping-SemiBold">Set Profile</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  )
}