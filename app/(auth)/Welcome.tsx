import React from "react";
import { View, Text, Image, TouchableOpacity } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import image from "@/constants/image";
import { router } from "expo-router";
import useUserProvider from "@/hook/useUserProvider";

const WelcomeScreen: React.FC = () => {
    const {user,submitUserProfile} = useUserProvider()
    const handleSubmit = ()=>{
        submitUserProfile();
        router.replace("/(root)/(tabs)/home");
    }
    return (
        <View className="flex-1 bg-gray-100 justify-between px-6 py-10">
            {/* Illustration */}
            <View className="flex-col gap-3">
                <View className="items-center mt-10">
                    <Image
                        source={image.Welcomepng}
                        resizeMode="contain"
                        style={{
                            width: 550,
                            height: 380
                        }}
                    />
                </View>

                {/* Text Section */}
                <View className="items-center">
                    <Text className="text-3xl font-Popping-Bold">Welcome, {user?.first_name.split(" ")[0]}</Text>
                    <Text className="text-gray-500 text-center mt-2 font-Popping">
                        You are all set now, let’s get you all tuned in!
                    </Text>
                </View>

            </View>
            {/* Bottom Button */}
            <View className="pb-6">
                <LinearGradient
                    colors={["#FBC5C5", "#F8AC7D"]}
                    start={{ x: 0.9, y: 0.02 }}
                    end={{ x: 0.9, y: 0.91 }}
                    className="w-full rounded-md"
                    style={{
                        borderRadius: 50,
                        overflow: "hidden",
                    }}
                >
                    <TouchableOpacity className="p-4 rounded-full" onPress={handleSubmit}>
                        <Text className="text-white text-lg font-Popping-SemiBold text-center">
                            Next
                        </Text>
                    </TouchableOpacity>
                </LinearGradient>
            </View>
        </View>
    );
};

export default WelcomeScreen;
