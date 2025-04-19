import { View, Text, TouchableOpacity } from "react-native";
import React from "react";
import { router } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

const GeneratePlaylist = () => {
  return (
    <View className="mt-6 mb-4">
      <Text className="text-black text-lg font-Popping-Bold mb-3">
        Create Your Perfect Playlist
      </Text>

      <TouchableOpacity
        onPress={() => router.push("/(root)/generatePlaylist")}
        activeOpacity={0.9}
        className="w-full"
      >
        <LinearGradient
          colors={["#FF6B6A", "#FF8E53"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          className="w-full h-[140px] rounded-2xl overflow-hidden"
        >
          <View className="flex-1 p-5 justify-between">
            <View>
              <Text className="text-white font-Popping-Bold text-xl mb-1">
                AI-Powered Playlist
              </Text>
              <Text className="text-white/80 font-Popping text-sm w-3/4">
                Let us create the perfect mix based on your mood and favorite
                artists
              </Text>
            </View>

            <View className="flex-row justify-between items-end">
              <TouchableOpacity
                className="bg-white/20 px-5 py-2.5 rounded-full"
                onPress={() => router.push("/(root)/generatePlaylist")}
              >
                <Text className="text-white font-Popping-SemiBold">
                  Generate Now
                </Text>
              </TouchableOpacity>

              {/* Decorative elements */}
              <View className="flex-row">
                {[...Array(3)].map((_, i) => (
                  <View
                    key={i}
                    className={`h-${
                      (i + 1) * 5
                    } w-1.5 bg-white/30 rounded-full mx-0.5`}
                    style={{ height: (i + 1) * 10 }}
                  />
                ))}
              </View>
            </View>
          </View>
        </LinearGradient>
      </TouchableOpacity>
    </View>
  );
};

export default GeneratePlaylist;
