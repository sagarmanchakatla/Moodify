import { View, Text, TouchableOpacity, ImageBackground } from 'react-native'
import icons from '@/constants/icons'
import React from 'react'

export default function TopTenSongs() {
    return (
        <View className="w-full my-5 rounded-full flex justify-center">
            <ImageBackground
                source={icons.topTenBackgroundicon}
                className='flex flex-row justify-between items-center p-4'
            >
                <Text className="font-Popping-Bold text-[16px]">Today # Top 10</Text>
                <TouchableOpacity className='rounded-full'>
                    <ImageBackground
                        source={icons.orangeBackgroundicon}
                        className='p-2'
                    >
                        <Text className='font-Popping text-md text-white'>Check</Text>
                    </ImageBackground>
                </TouchableOpacity>
            </ImageBackground>
        </View>
    )
}