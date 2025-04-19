import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ActivityIndicator,
  ImageBackground,
  StyleSheet,
} from "react-native";
import React, { useState } from "react";
import image from "@/constants/image";
import DashBoardLayout from "@/components/DashBoardLayout";
import DashBoardHeader from "@/components/dashBoardHeader";
import { router } from "expo-router";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
import useImageProvider from "@/hook/useImageProvider";
import icons from "@/constants/icons";
import { detectEmotion } from "@/http";
import { Emotion, FaceEmotionSchema } from "@/schema/emotion";
import { LinearGradient } from "expo-linear-gradient";
import useUserProvider from "@/hook/useUserProvider";
import useSongProvider from "@/hook/useSongProvider";
import axios from "axios";

export default function EmotionDetect() {
  const { uri, base64ImageString, resetImage, pickImage } = useImageProvider();
  const [emotionData, setEmotionData] = useState<FaceEmotionSchema | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<boolean>(false);
  const [emotion, setEmotion] = useState<string>("");

  const { fetchSearchQuery } = useSongProvider();
  const { displayNameForUser, user, storeMood } = useUserProvider();

  const emotionEmojis = {
    happy: "😄",
    sad: "😢",
    angry: "😠",
    fear: "😨",
    surprise: "😲",
    disgust: "🤢",
    neutral: "😐",
    contempt: "😒",
  };

  const emotionColors = {
    happy: ["#FFD700", "#FFA500"],
    sad: ["#6495ED", "#4169E1"],
    angry: ["#FF6347", "#DC143C"],
    fear: ["#9370DB", "#8A2BE2"],
    surprise: ["#00BFFF", "#1E90FF"],
    disgust: ["#9ACD32", "#6B8E23"],
    neutral: ["#C0C0C0", "#A9A9A9"],
    contempt: ["#DDA0DD", "#BA55D3"],
  };

  const handleSearch = () => {
    if (user && emotion) {
      console.log(
        `${emotion} ${user?.fav_artist.split("-")[0]} ${user?.genre}`
      );
      fetchSearchQuery(
        `${emotion} ${user?.fav_artist.split("-")[0]} ${user?.genre}`
      );
      router.push("/(root)/(tabs)/playlist");
    }
  };

  const getEmotionResult = (data: Emotion) => {
    let emotion: string = "";
    let emotionValue: number = -1;
    for (const entry of Object.entries(data)) {
      if (entry[1] > emotionValue) {
        emotionValue = entry[1];
        emotion = entry[0];
      }
    }
    return emotion;
  };

  // const flaskDetect = async (base64ImageString: string) => {
  //   try {
  //     console.log("Calling Flask API...");
  //     const fullBase64String = `data:image/jpeg;base64,${base64ImageString}`; // Add prefix if missing
  //     console.log("Base64 Image String:", fullBase64String);

  //     const response = await axios.post(
  //       "http://192.168.0.103:5000/analyze_mood",
  //       { image: fullBase64String },
  //       { headers: { "Content-Type": "application/json" } }
  //     );

  //     console.log("Flask Response:", response.data);
  //     return response.data;
  //   } catch (error) {
  //     console.error("Error sending image to Flask:", error);
  //     return { error: "Failed to analyze mood" };
  //   }
  // };

  const getEmotionConfidence = (data: Emotion, emotionType: string) => {
    return data[emotionType as keyof Emotion] * 100;
  };

  const handleAnalyzeEmotion = async () => {
    if (!base64ImageString) return;
    setLoading(true);
    try {
      const data = await detectEmotion(base64ImageString);
      // const data1 = await flaskDetect(base64ImageString);
      // console.log(data1);
      setEmotionData(data);
      const detectedEmotion = getEmotionResult(data.faces[0]?.emotion);
      setEmotion(detectedEmotion);
      // console.log(detectedEmotion);
      // console.log(typeof detectedEmotion);
      await storeMood(detectedEmotion);
      // console.log(user);
    } catch (error) {
      setError(true);
      console.error("Error detecting emotion:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <DashBoardLayout>
      <DashBoardHeader title="Detecting Emotions" />
      <View className="flex flex-col justify-center items-center h-full bg-white px-4">
        <View className="relative mb-8">
          <View className="border-4 border-gray-200 rounded-xl overflow-hidden">
            <Image
              source={uri ? { uri } : image.Scanner}
              style={{ width: 300, height: 300 }}
              resizeMode="cover"
            />
          </View>
          {uri && (
            <TouchableOpacity
              onPress={resetImage}
              className="absolute -top-2 -right-2 bg-white rounded-full"
            >
              <MaterialIcons name="cancel" size={30} color="red" />
            </TouchableOpacity>
          )}
        </View>

        {!loading && !error && emotionData && (
          <View className="w-full mb-8">
            <LinearGradient
              colors={
                emotionColors[emotion as keyof typeof emotionColors] || [
                  "#f5f5f5",
                  "#e0e0e0",
                ]
              }
              className="p-6 rounded-xl shadow-md w-full"
              style={styles.resultCard}
            >
              <View className="flex flex-row items-center justify-between">
                <View>
                  <Text className="text-white text-lg font-Popping-Medium mb-1">
                    Detected Emotion
                  </Text>
                  <Text className="text-white text-3xl font-Popping-Bold capitalize">
                    {emotion}
                  </Text>
                  <Text className="text-white text-sm font-Popping-Regular mt-2">
                    Confidence:{" "}
                    {emotionData?.faces[0]?.emotion &&
                      getEmotionConfidence(
                        emotionData.faces[0].emotion,
                        emotion
                      ).toFixed(1)}
                    %
                  </Text>
                </View>
                <Text style={styles.emoji}>
                  {emotionEmojis[emotion as keyof typeof emotionEmojis] || "🤔"}
                </Text>
                <TouchableOpacity
                  onPress={handleSearch}
                  style={styles.getMusicButton}
                >
                  <MaterialIcons name="library-music" size={24} color="white" />
                  <Text style={styles.getMusicButtonText}>Get Music</Text>
                </TouchableOpacity>
              </View>
            </LinearGradient>
          </View>
        )}

        <View className="flex flex-row justify-center items-center w-full gap-4 mb-4">
          <TouchableOpacity
            onPress={() => router.push("/Camera")}
            className="flex-1 p-4 rounded-lg bg-zinc-200 items-center"
          >
            <Text className="font-Popping-SemiBold">Switch Camera</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => pickImage("emotion")}
            className="flex-1 p-4 bg-red-200 rounded-lg items-center"
          >
            <Text className="font-Popping-SemiBold">Pick From Gallery</Text>
          </TouchableOpacity>
        </View>

        {uri && (
          <TouchableOpacity
            onPress={handleAnalyzeEmotion}
            disabled={loading}
            className="w-full mb-4"
          >
            <ImageBackground
              source={icons.greenBackgroundicon}
              className="p-4 rounded-lg items-center"
              style={styles.analyzeButton}
            >
              <Text className="font-Popping-SemiBold text-lg">
                {loading ? "Analyzing..." : "Analyze Emotion"}
              </Text>
            </ImageBackground>
          </TouchableOpacity>
        )}

        {loading && (
          <View className="items-center mt-4">
            <ActivityIndicator size="large" color="#4CAF50" />
            <Text className="mt-2 font-Popping-Medium">
              Analyzing Expression...
            </Text>
          </View>
        )}

        {!loading && error && (
          <View className="bg-red-100 p-4 rounded-lg w-full items-center mt-4">
            <MaterialIcons name="error-outline" size={24} color="red" />
            <Text className="text-red-600 font-Popping-Medium mt-2">
              An error occurred while analyzing
            </Text>
            <TouchableOpacity
              onPress={() => setError(false)}
              className="mt-2 bg-red-200 px-4 py-2 rounded-lg"
            >
              <Text className="font-Popping-SemiBold">Try Again</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </DashBoardLayout>
  );
}

const styles = StyleSheet.create({
  resultCard: {
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  emoji: {
    fontSize: 48,
  },
  analyzeButton: {
    overflow: "hidden",
    borderRadius: 12,
  },
  getMusicButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#4CAF50",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 25,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  getMusicButtonText: {
    color: "white",
    marginLeft: 10,
    fontSize: 16,
    fontWeight: "600",
  },
});
