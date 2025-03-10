import { View, Text, Alert } from 'react-native'
import React, { useEffect } from 'react'
import DashBoardLayout from '@/components/DashBoardLayout'
import * as Location from "expo-location"
import DashBoardHeader from '@/components/dashBoardHeader'
import Map from '@/components/Map'
import useUserProvider from '@/hook/useUserProvider'


export default function explore() {
  const {user,setUserLocation} = useUserProvider();
  useEffect(() => {
    async function getCurrentLocation() {
      
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        return;
      }
      let {coords:{latitude,longitude}} = await Location.getCurrentPositionAsync({});
      try{
        console.log(latitude,longitude);
        await setUserLocation({latitude,longitude});
      }catch(err:any){
        Alert.alert(err.message || "Something went wrong");
      }
    }

    getCurrentLocation();
  }, []);
  return (
    <DashBoardLayout>
      <DashBoardHeader title='Explore ' />
      <View className='flex flex-col w-full h-full p-2 bg-white'>
        <Map/>
      </View>
    </DashBoardLayout>
  )
}