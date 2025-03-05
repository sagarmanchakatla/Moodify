import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import NotificationDisplay from '@/components/NotificationDisplay';
import MusicDisplay from '@/components/musicDisplay';
import DashBoardHeader from '@/components/dashBoardHeader';


const NotificationScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'chats' | 'music'>('chats');

  return (
    <View className="flex bg-white h-full">
      {/* Top App Bar */}
      <DashBoardHeader title={'Notification'} />
      {/* Tabs */}
      <View className="flex-row justify-center bg-white py-3 gap-5">
        <TouchableOpacity
          className={`px-5 py-2 rounded-full ${activeTab === 'chats' ? 'bg-red-100' : 'bg-gray-200'
            }`}
          onPress={() => setActiveTab('chats')}
        >
          <Text className={`text-sm font-Popping-SemiBold ${activeTab === 'chats' ? 'text-black' : 'text-primarygray'}`}>
            Chats
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          className={`px-5 py-2 rounded-full ml-2 ${activeTab === 'music' ? 'bg-red-100' : 'bg-gray-200'
            }`}
          onPress={() => setActiveTab('music')}
        >
          <Text className={`text-sm font-Popping-SemiBold ${activeTab === 'music' ? 'text-black' : 'text-primarygray'}`}>
            Music
          </Text>
        </TouchableOpacity>
      </View>

      {/* Notification List */}
      {activeTab === "chats" ?
        <NotificationDisplay />
        : <MusicDisplay />}
    </View>
  );
};

export default NotificationScreen;
