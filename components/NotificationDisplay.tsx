import { View } from 'react-native'
import React from 'react'
import DashBoardCard from './DashBoardCard'
import { notifications } from '@/constants/data'
import icons from '@/constants/icons'

export default function NotificationDisplay() {
  return (
    <View className='flex flex-col justify-center items-center w-full'>
      {notifications.map((item, index) => (
        <DashBoardCard key={index}>
          <DashBoardCard.BigIcon icon={item.avatar} />
          <DashBoardCard.Content title={item.name} primaryText={item.message} secondartText={item.time} />
          <DashBoardCard.SmallIcon icon={icons.more}/>
        </DashBoardCard>
      ))}
    </View>
  )
}