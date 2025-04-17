import { SimilarUser } from '@/schema'
import React, { useState } from 'react'
import { View, Text, ScrollView, TextInput, Image } from 'react-native'
import { socialTabTitle } from '@/constants'
import icons from '@/constants/icons'
import { Feather } from '@expo/vector-icons'
import SocialTabs from './SocialTabs'
import ProfileMatch from './ProfileMatch'
import InvitionsCard from './InvitionsCard'
import FriendsLists from './FriendsLists'


interface SocialCardProps {
  similarUsers: SimilarUser[],
  allUsers: SimilarUser[]
}

const SocialCard: React.FC<SocialCardProps> = ({ allUsers,similarUsers }) => {
  const [activeTab, setActiveTab] = useState<"friends" | "invites" | "similar">("similar");
  const [search, setSearch] = useState<string>("");
  let content;

  if (activeTab === "similar") {
    content = <ProfileMatch otherUsers={similarUsers} searchQuery={search} />
  } else if (activeTab === "friends") {
    content = <FriendsLists users={allUsers} searchQuery={search} />
  } else {
    content = <InvitionsCard users={allUsers} searchQuery={search} />
  }
  return (
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


      <Text className="text-lg font-Popping-SemiBold mb-4 mt-2">{socialTabTitle[activeTab]}</Text>

      <ScrollView className="flex-1">
        {content}
      </ScrollView>
    </View>
  )
}

export default SocialCard