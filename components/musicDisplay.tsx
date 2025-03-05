import { View } from 'react-native'
import React from 'react'
import { musics } from '@/constants/data'
import DashBoardCard from './DashBoardCard'

export default function MusicDisplay() {
  return (
    <View className='flex flex-col justify-center items-center w-full'>
      {musics.map((item, index) => (
        <DashBoardCard key={index}>
          <DashBoardCard.BigIcon icon={item.avatar} />
          <DashBoardCard.Content title={item.title} primaryText={item.name} secondartText={item.artist} />
        </DashBoardCard>
      ))}
    </View>
  )
}

