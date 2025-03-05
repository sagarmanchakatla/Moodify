import { View, Text, Image, TouchableOpacity, ScrollView } from 'react-native';
import React, { useState } from 'react';
import icons from '@/constants/icons';
import DashBoardLayout from '@/components/DashBoardLayout';
import DashBoardHeader from '@/components/dashBoardHeader';
import useSongProvider from '@/hook/useSongProvider';
import SongCard from '@/components/SongCard';
import PlayListCard from '@/components/PlayListCard';
import { ActivityIndicator, MD2Colors } from 'react-native-paper';


export default function PlaylistsPage() {
  const [activeTab, setActiveTab] = useState<'All' | 'PlayList'>('All');
  const { error, loading, songs, playlists, currentlyPlaying, getCurrentSongDetailes, setSongPlay } = useSongProvider();

  const song = getCurrentSongDetailes();

  let content;
  if (loading) {
    content = (
      <ActivityIndicator animating={true} color={MD2Colors.pink600} size={35}/>
    )

  } else if (error) {
    content = <Text>{error}</Text>
  } else {
    if (activeTab === 'All') {
      content = songs.length > 0 ? (
        <SongCard songs={songs} />
      ) : (
        <Text className="text-center text-gray-500 mt-5">No songs available. Start searching!</Text>
      );
    } else {
      content = playlists.length > 0 ? (
        <PlayListCard playLists={playlists} />
      ) : (
        <Text className="text-center text-gray-500 mt-5">No playlists available.</Text>
      );
    }
  }

  const handlePlay = () => {
    if (songs.length === 0) return;
    setSongPlay(currentlyPlaying!);
  }

  return (
    <DashBoardLayout>
      <DashBoardHeader title='Playlists' />
      <View className='flex flex-col bg-white p-3 h-full'>
        <View className='items-center'>
          <Image
            source={song ? { uri: song.thumbnail } : icons.blueBackgroundicon}
            className="w-48 h-48 rounded-lg mb-4"
            resizeMode='cover'
          />
          <View className='flex-row justify-center gap-8 items-center'>
            <Image source={icons.circle} className="w-10 h-10" />
            <TouchableOpacity onPress={handlePlay}>
              <Image source={icons.bigPlay} className="w-12 h-12" />
            </TouchableOpacity>
          </View>
        </View>
        {/* Toggle buttons */}
        <View className="flex-row gap-4 my-4">
          <TouchableOpacity
            className={`px-5 py-2 rounded-full ${activeTab === 'All' ? 'bg-red-200' : 'bg-gray-200'}`}
            onPress={() => setActiveTab('All')}
          >
            <Text className={`text-sm font-semibold ${activeTab === 'All' ? 'text-black' : 'text-gray-600'}`}>All</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className={`px-5 py-2 rounded-full ${activeTab === 'PlayList' ? 'bg-red-200' : 'bg-gray-200'}`}
            onPress={() => setActiveTab('PlayList')}
          >
            <Text className={`text-sm font-semibold ${activeTab === 'PlayList' ? 'text-black' : 'text-gray-600'}`}>PlayList</Text>
          </TouchableOpacity>
        </View>
        {/* Content List */}
        <ScrollView className='flex-1 w-full h-full'>{content}</ScrollView>
      </View>
    </DashBoardLayout>
  );
}
