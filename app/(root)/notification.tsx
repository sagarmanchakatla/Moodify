import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import NotificationDisplay from '@/components/NotificationDisplay';
import DashBoardHeader from '@/components/dashBoardHeader';


const NotificationScreen: React.FC = () => {
  
  return (
    <View className="flex bg-white h-full">
      <DashBoardHeader title={'Notification'} />
      <NotificationDisplay />
    </View>
  );
};

export default NotificationScreen;
