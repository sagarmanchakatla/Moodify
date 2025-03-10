import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  Switch,
  ScrollView,
  Modal,
  FlatList,
} from "react-native";
import { Ionicons, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import DashBoardHeader from "@/components/dashBoardHeader";
import icons from "@/constants/icons";
import DashBoardCard from "@/components/DashBoardCard";
import UserStates from "@/components/UsersStates";
import { OtherSettings } from "@/constants/data";
import DashBoardLayout from "@/components/DashBoardLayout";
import useUserProvider from "@/hook/useUserProvider";
import useImageProvider from "@/hook/useImageProvider";

interface User {
  first_name: string;
  last_name: string;
  gender: string;
  date_of_birth: string;
  fav_artist: string;
  genre: string;
  age: number;
  height: number;
  weight: number;
  avatar?: string;
}

interface ProfilePictureModalProps {
  image: string;
  show: boolean;
}

const ProfileScreen: React.FC = () => {
  const [isNotificationEnabled, setNotificationEnabled] = useState(true);
  const { displayNameForUser, user } = useUserProvider();
  const { pickImage, uri, fileName } = useImageProvider();
  const [musicTaste, setMusicTaste] = useState("");

  useEffect(() => {
    // Simulate fetching music taste data
    setMusicTaste(
      "I enjoy upbeat music that energizes me during workouts. I prefer songs with strong beats and motivational lyrics. My playlist is a mix of pop, hip-hop, and electronic dance music that keeps me moving."
    );
  }, []);

  const toggleSwitch = () => setNotificationEnabled((prev) => !prev);
  const handleEdit = async () => {
    //await pickImage();
  };

  // Define AccountsSetting dynamically based on user data
  const personalInformation = [
    {
      name: "First Name",
      value: user?.first_name,
      icon: "person-outline",
      iconType: "ionicons",
    },
    {
      name: "Last Name",
      value: user?.last_name,
      icon: "person-outline",
      iconType: "ionicons",
    },
    {
      name: "Gender",
      value: user?.gender,
      icon: "transgender",
      iconType: "fontawesome",
    },
    {
      name: "Date of Birth",
      value: user?.date_of_birth,
      icon: "cake",
      iconType: "material",
    },
  ];

  const musicInformation = [
    {
      name: "Favorite Artists",
      value: user?.fav_artist.split("-"),
      icon: "microphone-alt",
      iconType: "fontawesome",
    },
    {
      name: "Genres",
      value: user?.genre.split("-"),
      icon: "music",
      iconType: "ionicons",
    },
  ];

  const renderIcon = (icon: string, type: string) => {
    if (type === "ionicons") {
      return <Ionicons name={icon as any} size={20} color="#6B7280" />;
    } else if (type === "material") {
      return <MaterialIcons name={icon as any} size={20} color="#6B7280" />;
    } else if (type === "fontawesome") {
      return <FontAwesome5 name={icon as any} size={18} color="#6B7280" />;
    }
    return null;
  };

  return (
    <DashBoardLayout>
      <ScrollView
        contentContainerStyle={{
          display: "flex",
          flex: 1,
          flexDirection: "column",
          justifyContent: "center",
          paddingBottom: 100,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 bg-offwhite">
          {/* 🔹 Header */}
          <DashBoardHeader title="Profile" />

          {/* 🔹 Profile Info */}
          <DashBoardCard extraStyle="mb-3">
            <DashBoardCard.BigIcon uri={user?.avatar} />
            <DashBoardCard.Content title={displayNameForUser} />
            <DashBoardCard.SmallIcon
              component={
                <TouchableOpacity
                  onPress={handleEdit}
                  className="py-1 rounded-full mt-2 relative flex flex-row justify-center items-center"
                >
                  <Image source={icons.primaryBackgroundColorIcon} />
                  <Text className="absolute top-2 text-offwhite font-Popping">
                    Edit
                  </Text>
                </TouchableOpacity>
              }
            />
          </DashBoardCard>

          {/* 🔹 Stats (Height, Weight, Age) */}
          <UserStates
            age={user?.age || 0}
            height={user?.height}
            weight={user?.weight}
          />

          {/* 🔹 Personal Information Section */}
          <View className="bg-white mx-4 mt-6 rounded-2xl shadow-md overflow-hidden">
            <View className="flex-row items-center justify-between p-4 border-b border-gray-100">
              <Text className="text-xl font-Popping-Bold text-gray-900">
                Personal Information
              </Text>
            </View>

            {personalInformation.map((item, index) => (
              <View
                key={index}
                className={`flex-row items-center justify-between p-4 ${
                  index < personalInformation.length - 1
                    ? "border-b border-gray-100"
                    : ""
                }`}
              >
                <View className="flex-row items-center space-x-3">
                  <View className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center">
                    {renderIcon(item.icon, item.iconType)}
                  </View>
                  <Text className="ml-4 text-md font-Popping text-gray-900">
                    {item.name}
                  </Text>
                </View>
                <Text className="text-md font-Popping text-gray-500">
                  {item.value}
                </Text>
              </View>
            ))}
          </View>

          {/* 🔹 Music Information Section */}
          <View className="bg-white mx-4 mt-4 rounded-2xl shadow-md overflow-hidden">
            <View className="flex-row items-center justify-between p-4 border-b border-gray-100">
              <Text className="text-xl font-Popping-Bold text-gray-900">
                Music Information
              </Text>
              {/* <TouchableOpacity>
                <Text className="text-blue-500 font-Popping">Edit</Text>
              </TouchableOpacity> */}
            </View>

            {musicInformation.map((item, index) => (
              <View
                key={index}
                className={`p-4 ${
                  index < musicInformation.length - 1
                    ? "border-b border-gray-100"
                    : ""
                }`}
              >
                <View className="flex-row items-center space-x-3 mb-2">
                  <View className="w-8 h-8 rounded-full bg-gray-100 items-center justify-center">
                    {renderIcon(item.icon, item.iconType)}
                  </View>
                  <Text className="ml-4 text-md font-Popping text-gray-900">
                    {item.name}
                  </Text>
                </View>

                <View className="flex-row flex-wrap ml-11">
                  {item.value.map(
                    (valueItem, valueIndex) =>
                      valueItem.trim() && (
                        <View
                          key={valueIndex}
                          className="bg-gray-100 rounded-full px-3 py-1 mr-2 mb-2"
                        >
                          <Text className="text-sm font-Popping text-gray-700">
                            {valueItem.trim()}
                          </Text>
                        </View>
                      )
                  )}
                </View>
              </View>
            ))}
          </View>

          {/* 🔹 Music Taste Section */}
          <View className="bg-white mx-4 mt-4 rounded-2xl shadow-md overflow-hidden">
            <View className="flex-row items-center justify-between p-4 border-b border-gray-100">
              <View className="flex-row items-center space-x-2">
                <Ionicons name="musical-notes" size={20} color="#4B5563" />
                <Text className="ml-4 text-xl font-Popping-Bold text-gray-900">
                  Music Taste
                </Text>
              </View>
              {/* <TouchableOpacity>
                <Text className="text-blue-500 font-Popping">Edit</Text>
              </TouchableOpacity> */}
            </View>

            <View className="p-4">
              <Text className="text-md font-Popping text-gray-600 leading-5">
                {musicTaste}
              </Text>

              <View className="mt-4 bg-gray-50 p-3 rounded-xl">
                <Text className="text-sm font-Popping-Bold text-gray-700 mb-2">
                  Top Listening Activity
                </Text>
                <View className="flex-row justify-between items-center mb-1">
                  <Text className="text-xs font-Popping text-gray-500">
                    Workout Music
                  </Text>
                  <Text className="text-xs font-Popping text-gray-500">
                    65%
                  </Text>
                </View>
                <View className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <View
                    className="h-full bg-blue-500 rounded-full"
                    style={{ width: "65%" }}
                  />
                </View>

                <View className="flex-row justify-between items-center mt-3 mb-1">
                  <Text className="text-xs font-Popping text-gray-500">
                    Relaxation
                  </Text>
                  <Text className="text-xs font-Popping text-gray-500">
                    25%
                  </Text>
                </View>
                <View className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <View
                    className="h-full bg-green-500 rounded-full"
                    style={{ width: "25%" }}
                  />
                </View>

                <View className="flex-row justify-between items-center mt-3 mb-1">
                  <Text className="text-xs font-Popping text-gray-500">
                    Focus
                  </Text>
                  <Text className="text-xs font-Popping text-gray-500">
                    10%
                  </Text>
                </View>
                <View className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                  <View
                    className="h-full bg-purple-500 rounded-full"
                    style={{ width: "10%" }}
                  />
                </View>
              </View>
            </View>
          </View>

          {/* 🔹 Notification Section */}
          <View className="bg-white mx-4 mt-4 rounded-2xl shadow-md p-4">
            <Text className="text-xl font-bold text-gray-900">
              Notification
            </Text>
            <View className="flex-row justify-between items-center mt-3">
              <View className="flex-row items-center space-x-3">
                <Image source={icons.notifyicon} />
                <Text className="text-md font-Popping text-gray-900">
                  Pop-up Notification
                </Text>
              </View>
              <Switch
                value={isNotificationEnabled}
                onValueChange={toggleSwitch}
              />
            </View>
          </View>

          {/* 🔹 Other Section */}
          <View className="bg-white mx-4 mt-4 mb-4 rounded-2xl shadow-md">
            <Text className="text-xl font-bold text-gray-900 p-4">Other</Text>
            {OtherSettings.map((item, index) => (
              <TouchableOpacity
                key={index}
                className="flex-row items-center justify-between p-4 border-b border-gray-200"
              >
                <View className="flex-row items-center space-x-3">
                  <Text className="text-md font-Popping text-gray-900">
                    {item.title}
                  </Text>
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

const ProfilePictureModal: React.FC<ProfilePictureModalProps> = ({
  image,
  show,
}) => {
  const { uploadProfilePicture } = useUserProvider();
  const { fileName, base64ImageString, resetImage, contentType } =
    useImageProvider();

  const setProfilePicture = async () => {
    await uploadProfilePicture(base64ImageString, contentType!, fileName!);
    resetImage();
  };

  const handleCancel = () => {
    resetImage();
  };

  return (
    <Modal animationType="slide" transparent={true} visible={show}>
      <View className="flex-1 justify-center items-center bg-black/50">
        <View className="bg-white rounded-2xl p-6 w-80 flex items-center shadow-lg">
          <Image source={{ uri: image }} className="w-16 h-16 mb-4" />
          <View className="flex flex-row p-4 gap-5">
            <TouchableOpacity
              className="w-1/2 p-2 bg-red-300/70 "
              onPress={handleCancel}
            >
              <Text className="text-center text-white font-Popping-SemiBold">
                Cancel
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              className="w-1/2 p-2 bg-blue-500 "
              onPress={setProfilePicture}
            >
              <Text className="text-center text-white font-Popping-SemiBold">
                Set Profile
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};
