import { View, Text } from 'react-native'
import React from 'react'

const Card = () => {
  return (
    <View className='flex flex-row justify-center items-center w-[80px] h-[60px] p-2 rounded-xl bg-white'>
      <Text className='text-primaryOrange font-Popping-SemiBold text-sm'>150cm <Text className='text-primarygray'>Height</Text></Text>
    </View>
  )
}
interface UsersStatesProps {
  height: number,
  weight: number,
  age: number
}

export default function UserStates({ age, height, weight }: UsersStatesProps) {
  return (
    <View className='flex flex-row justify-center items-center gap-5 w-full'>
      <View className='flex flex-row justify-center items-center w-[100px] h-[60px] p-2 rounded-xl bg-white'>
        <Text className='text-primaryOrange font-Popping-SemiBold text-sm'>{height}cm{'\n'}<Text className='text-primarygray'>Height</Text></Text>
      </View>
      <View className='flex flex-row justify-center items-center w-[100px] h-[60px] p-2 rounded-xl bg-white'>
        <Text className='text-primaryOrange font-Popping-SemiBold text-sm'>{weight}kg{'\n'}<Text className='text-primarygray'>Weight</Text></Text>
      </View>
      <View className='flex flex-row justify-center items-center w-[100px] h-[60px] p-2 rounded-xl bg-white'>
        <Text className='text-primaryOrange font-Popping-SemiBold text-sm'>{age}years{'\n'}<Text className='text-primarygray'>Age</Text></Text>
      </View>
    </View>
  )
}

