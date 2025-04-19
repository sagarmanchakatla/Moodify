import React, { useEffect, useState } from 'react';
import * as Location from 'expo-location';
import MapView, { Marker } from 'react-native-maps';
import { View, } from 'react-native';
import useUserProvider from '@/hook/useUserProvider';
import { mapStyle } from '@/constants';
import icons from '@/constants/icons';
import useSWR from 'swr';
import { getAllUserInfo } from '@/http/usershttp';
import AllProfileWithScore from './AllProfileWithScores';


export default function Map() {
  const { user } = useUserProvider();
  const [selectedTap, setSelectedTap] = useState<number | null>(null);
  const { data } = useSWR("/locations", getAllUserInfo);


  useEffect(() => {
    const getUserLocation = async () => {
      const { status } = await Location.getForegroundPermissionsAsync();
      if (status === 'granted') {
        const { coords: { latitude, longitude } } = await Location.getCurrentPositionAsync();
      }
    };
    getUserLocation();
  }, []);

  const getCurrentUser = (index: number): {
    first_name: string;
    last_name: string;
    fav_artist: string;
    genre: string;
    avatar: string;
    pushToken : string,
    id : string
  } => {
    return {
      fav_artist : data![selectedTap!].fav_artist,
      genre : data![selectedTap!].genre,
      avatar : "",
      first_name : data![selectedTap!].first_name,
      last_name : data![selectedTap!].last_name,
      id : data![selectedTap!].id,
      pushToken : data![selectedTap!].pushToken
    }
  }

  return (
    <View className="flex flex-col w-full h-full">
      <MapView
        style={{
          width: '100%',
          height: '50%',
        }}
        region={{
          latitude: user?.latitude ?? 18.9220,
          longitude: user?.longitude ?? 72.8347,
          latitudeDelta: 0.6,
          longitudeDelta: 0.5,
        }}
        rotateEnabled
        customMapStyle={mapStyle} // Apply the custom style
      >
        {data?.map((item, index) => (
          <Marker
            coordinate={{ latitude: item.latitude, longitude: item.longitude }}
            key={index}
            icon={icons.locationPointericon}
            title={item.first_name}
            onPress={() => setSelectedTap(index)}
          />
        ))}
      </MapView>
      {selectedTap!==null && <AllProfileWithScore otherUser={getCurrentUser(selectedTap)} />}
    </View>
  );
}
