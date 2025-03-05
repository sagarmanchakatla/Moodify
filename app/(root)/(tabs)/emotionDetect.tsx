import { View, Text, Image, TouchableOpacity, Modal, ImageBackground } from 'react-native'
import React, { useState } from 'react'
import image from '@/constants/image'
import DashBoardLayout from '@/components/DashBoardLayout'
import DashBoardHeader from '@/components/dashBoardHeader'
import { router } from 'expo-router'
import MaterialIcons from '@expo/vector-icons/MaterialIcons';
import useImageProvider from '@/hook/useImageProvider'
import icons from '@/constants/icons'
import { detectEmotion } from '@/http'
import { Emotion, FaceEmotionSchema } from '@/schema/emotion'


export default function EmotionDetect() {
  const { uri, base64ImageString, resetImage,pickImage } = useImageProvider();
  const [emotionData, setEmotionData] = useState<FaceEmotionSchema | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<boolean>(false);


  const getEmotionResult = (data: Emotion) => {
    let emotion: string = '';
    let emotionValue: number = -1;
    for (const entry of Object.entries(data)) {
      if (entry[1] > emotionValue) {
        emotionValue = entry[1];
        emotion = entry[0];
      }
    }
    return emotion;
  }

  const handleAnalyzeEmotion = async () => {
    if (!base64ImageString) return;
    setLoading(true);
    try {
      const data = await detectEmotion(base64ImageString);
      setEmotionData(data);
    } catch (error) {
      setError(true);
      console.error("Error detecting emotion:", error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <DashBoardLayout>
      <DashBoardHeader title='Detecting Emotions' />
      <View className='flex flex-col justify-center items-center h-full gap-12 bg-white'>
        <View className='relative'>
          <Image source={uri ? { uri } : image.Scanner} style={{ width: 300, height: 300 }} />
          {uri && <MaterialIcons onPress={resetImage} name="cancel" size={30} color="red" className='text-black absolute -top-[20px] -right-[18px]' />}
        </View>
        <View className='flex flex-row justify-center items-center w-full gap-4'>
          <TouchableOpacity onPress={() => router.push("/Camera")} className='p-4 rounded-lg bg-zinc-200'>
            <Text className='font-Popping-SemiBold'>Switch Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={pickImage} className='font-Popping p-4 bg-red-200 rounded-lg'>
            <Text className='font-Popping-SemiBold'>Pick From Gallary</Text>
          </TouchableOpacity>
        </View>
        {uri &&
          <View className='flex flex-row justify-center items-center w-full gap-4'>
            <ImageBackground
              source={icons.greenBackgroundicon}
              className='p-4 rounded-lg'>
              <Text onPress={handleAnalyzeEmotion} className='font-Popping-SemiBold'>Analyse Emotion</Text>
            </ImageBackground>
          </View>
        }
        {loading && <Text>Loading</Text>}
        {!loading && error && <Text>An Error occur</Text>}
        {!loading && !error && emotionData && <Text>Detected Emotion {getEmotionResult(emotionData?.faces[0]?.emotion)}</Text>}
      </View>
    </DashBoardLayout>
  )
}