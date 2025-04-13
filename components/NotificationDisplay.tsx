import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import useUserProvider from '@/hook/useUserProvider';
import useSWR from 'swr';
import { ActivityIndicator, MD2Colors } from 'react-native-paper';
import { NotificationSchema } from '@/schema/notificationSchema';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import useNotification from '@/hook/useNotification';
import AvatarOrDefault from './AvatarOrDefault';
import image from '@/constants/image';


export default function NotificationDisplay() {
  const { user } = useUserProvider();
  const { fetchUserNotifications,deleteNotification } = useNotification()
  const { data, error, isLoading, mutate } = useSWR<NotificationSchema[]>(
    '/notifications', fetchUserNotifications
  );
  const removeNotification = (id: string) => {
    deleteNotification(id)
    mutate();
  };
  let content;
  if (isLoading) {
    content = <ActivityIndicator animating={true} color={MD2Colors.pink600} size={35} />;
  } else if (error) {
    content = <Text>{error.message}</Text>;
  } else {
    content = (
      <View className="flex flex-col w-full h-full space-y-4">
        {data!.map((item) => (
          <View className="flex flex-row items-center w-full bg-white p-3 rounded-lg shadow-md" key={item.id}>
            <AvatarOrDefault uri='' />
            <View className="flex-1 ml-3">
              <Text className="text-lg font-semibold">{item.title}</Text>
              <Text className="text-gray-600 text-sm" numberOfLines={1}>
                {item.body}
              </Text>
              <Text className="text-gray-400 text-xs mt-1">
                {item.created_at}
              </Text>
            </View>
            <TouchableOpacity className="p-2" onPress={()=>removeNotification(item.id)}>
              <MaterialIcons name='cancel' size={22} color={'red'} />
            </TouchableOpacity>
          </View>
        ))}
        {data?.length === 0 && <Image source={image.emptyNotification} className='w-20 h-20 mx-auto mt-6' resizeMode='contain'/>}
      </View>
    )
  }

  return (
    <ScrollView
      contentContainerStyle={{
        display: 'flex',
        flexDirection: 'column',
        paddingHorizontal: 10,
        gap: 5,
        marginTop: 10,
      }}
    >
      {content}
    </ScrollView>
  );
}