import { View, Text, ScrollView, Image, TouchableOpacity } from 'react-native';
import React, { useState } from 'react';
import { getIndieNotificationInbox, deleteIndieNotificationInbox } from 'native-notify';
import useUserProvider from '@/hook/useUserProvider';
import useSWR from 'swr';
import { ActivityIndicator, MD2Colors } from 'react-native-paper';
import icons from '@/constants/icons';
import { NotificationSchema } from '@/schema';
import MaterialIcons from "@expo/vector-icons/MaterialIcons";


export default function NotificationDisplay() {
  const { user } = useUserProvider();
  const { data, error, isLoading, mutate } = useSWR<NotificationSchema[]>(
    '/notifications',
    () => getIndieNotificationInbox(user!.id, 28086, '29XY8vCePJsgJa6bdkJguw', 10, 0)
  );
  const removeNotification = (id: number) => {
    deleteIndieNotificationInbox(user?.id!, id, 28086, "29XY8vCePJsgJa6bdkJguw");
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
          <View className="flex flex-row items-center w-full bg-white p-3 rounded-lg shadow-md" key={item.notification_id}>
            <Image source={icons.dummyProfilePicture} className="w-12 h-12 rounded-full" resizeMode="cover" />

            <View className="flex-1 ml-3">
              <Text className="text-lg font-semibold">{item.title}</Text>
              <Text className="text-gray-600 text-sm" numberOfLines={1}>
                {item.message}
              </Text>
              <Text className="text-gray-400 text-xs mt-1">
                {item.date}
              </Text>
            </View>
            <TouchableOpacity onPress={() => removeNotification(item.notification_id)} className="p-2">
              <MaterialIcons name='cancel' size={22} color={'red'} />
            </TouchableOpacity>
          </View>
        ))}
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