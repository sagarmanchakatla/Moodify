import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { SongSchema } from '@/schema/songSchema'
import useSongProvider from '@/hook/useSongProvider'

interface SongCardProps {
    songs: SongSchema[]
}

export default function SongCard({ songs }: SongCardProps) {
    const { setSongPlay } = useSongProvider();
    return (
        <>
            {songs.map((song, index) => (
                <TouchableOpacity
                    key={song.id}
                    className="flex-row items-center bg-white shadow-md rounded-lg p-4 mb-4"
                    onPress={() => setSongPlay(index)}
                >
                    <Image source={{ uri: song.thumbnail }} className="w-20 h-20 rounded-lg" />
                    <View className="flex-1 ml-4">
                        <Text className="text-lg font-semibold text-gray-900" numberOfLines={1}>{song.title}</Text>
                        <Text className="text-sm text-gray-500" numberOfLines={1}>{song.artist}</Text>
                    </View>
                </TouchableOpacity>
            ))}
        </>
    )
}