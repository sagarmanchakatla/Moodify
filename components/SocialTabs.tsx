import { SocialTabType } from "@/schema/notificationSchema"
import React from "react"
import { View, TouchableOpacity,Text } from "react-native"


const SocialTabs: React.FC<{
  activeTab : string,
  setActiveTab : React.Dispatch<React.SetStateAction<keyof SocialTabType>>
}> = ({activeTab,setActiveTab}) => {
  return (
    <View className="flex-row bg-white py-3 gap-5">
      
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
    </View>
  )
}

export default SocialTabs;