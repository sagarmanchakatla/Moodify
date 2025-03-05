import { View, Text,Image,TouchableOpacity } from 'react-native'
import React from 'react'
import { PlayListsSchema } from '@/schema/songSchema'

interface PlayListCardProps {
    playLists: PlayListsSchema[]
}

export default function PlayListCard({ playLists }: PlayListCardProps) {
    return (
        <>
            {playLists.map((playlist, index) => (
                <TouchableOpacity key={playlist.id} className="flex-row items-center bg-white shadow-md rounded-lg p-4 mb-4">
                    <Image source={{ uri: playlist.thumbnail }} className="w-20 h-20 rounded-lg" />
                    <View className="flex-1 ml-4">
                        <Text className="text-lg font-semibold text-gray-900" numberOfLines={1}>{playlist.title}</Text>
                        <Text className="text-sm text-gray-500" numberOfLines={1}>{playlist.channelTitle}</Text>
                    </View>
                </TouchableOpacity>
            ))}
        </>
    )
}