import { View, TextInput, Image, Text, TouchableOpacity } from 'react-native'
import icons from '@/constants/icons'
import React, { useState } from 'react'
import DashBoardLayout from '@/components/DashBoardLayout'
import DashBoardHeader from '@/components/dashBoardHeader'
import { Feather } from '@expo/vector-icons'
import DashBoardCard from '@/components/DashBoardCard'

export default function SocialPage() {
  const [search, setSearch] = useState<string>('');
  const [activeTab, setActiveTab] = useState<'All' | 'Shuffle'>('All');

  return (
    <DashBoardLayout>
      <DashBoardHeader title='Social' />
      <View className='w-full h-full bg-white px-4 flex gap-3'>
        <View className="flex-row items-center bg-gray-100 rounded-full px-4 py-2">
          <Image source={icons.search} className="w-6 h-6" />
          <TextInput
            placeholder="Search Here..."
            className="flex-1 ml-2 font-Popping-SemiBold"
            value={search}
            onChangeText={val => setSearch(val)}
          />
          {search && <Feather name="x" size={24} color="gray" onPress={() => setSearch("")} />}
        </View>
        <FriendsLists />
        <View className="flex-row bg-white py-3 gap-5">
          <TouchableOpacity
            className={`px-5 py-2 rounded-full ${activeTab === 'All' ? 'bg-red-100' : 'bg-gray-200'
              }`}
            onPress={() => setActiveTab('All')}
          >
            <Text className={`text-sm font-Popping-SemiBold ${activeTab === 'All' ? 'text-black' : 'text-primarygray'}`}>
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`px-5 py-2 rounded-full ml-2 ${activeTab === 'Shuffle' ? 'bg-red-100' : 'bg-gray-200'
              }`}
            onPress={() => setActiveTab('Shuffle')}
          >
            <Text className={`text-sm font-Popping-SemiBold ${activeTab === 'Shuffle' ? 'text-black' : 'text-primarygray'}`}>
              Shuffle
            </Text>
          </TouchableOpacity>
        </View>
        <View className='flex flex-col w-full'>
          {[1, 2, 3, 4, 5, 6, 7].map(item => (
            <TouchableOpacity key={item}>
              <DashBoardCard>
                <DashBoardCard.BigIcon icon={icons.songPlacholderIcon} />
                <DashBoardCard.Content title='Name' primaryText='Message' secondartText={`About ${2 * item}min ago`} />
                <DashBoardCard.SmallIcon icon={icons.more} />
              </DashBoardCard>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </DashBoardLayout>
  )
}

const FriendsLists = () => {
  return (
    <View className='flex flex-row w-full gap-5 mt-5'>
      {[1, 2, 3, 4, 5].map(item => (
        <View key={item}>
          <Image source={icons.dummyProfilePicture} />
          <Text className='text-center'>Name</Text>
        </View>
      ))}
    </View>
  )
}