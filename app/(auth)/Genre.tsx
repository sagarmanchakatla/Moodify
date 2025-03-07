import React, { useState } from "react";
import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import useUserProvider from "@/hook/useUserProvider";


interface Genre {
    name: string;
    color: string;
}

const genres: Genre[] = [
    { name: "Pop", color: "bg-red-100" },
    { name: "Hip Hop", color: "bg-green-100" },
    { name: "Romance", color: "bg-green-200" },
    { name: "Peaceful", color: "bg-red-200" },
    { name: "Lofi", color: "bg-blue-200" },
];


const GenreSelectionScreen: React.FC = () => {
    const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
    const [error,setError] = useState<string>('');
    const {updateUserProfile} = useUserProvider()

    const toggleGenre = (genre: string) => {
        setSelectedGenres((prev) =>
            prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
        );
    };

    const handleSubmit = ()=>{
        if(selectedGenres.length === 0){
            setError(pre=>"Select At least One Genre");
        }else{
            updateUserProfile({genre: selectedGenres.join("-")});
            setError(pre=>"");
            // router.push("/(auth)/Welcome");
            router.push('/(auth)/Favartist')
        }
    }

    return (
        <View className="flex-1 bg-white">
            {/* Content - Scrollable */}
            <ScrollView contentContainerStyle={{ flexGrow: 1 }} className="px-6 pt-10">
                {/* Title */}
                <Text className="text-2xl font-Popping-Bold text-center">What is your genre?</Text>
                <Text className="text-gray-500 text-center mt-1 font-Popping-SemiBold text-md">
                    It will help us curate the best playlists for you!
                </Text>

                <View className="flex-row flex-wrap justify-center mt-6">
                    {genres.map((genre) => (
                        <TouchableOpacity
                            key={genre.name}
                            className={`px-6 py-3 rounded-xl m-2 w-[45%] ${genre.color} ${selectedGenres.includes(genre.name) ? "opacity-50" : "opacity-100"
                                }`}
                            onPress={() => toggleGenre(genre.name)}
                        >
                            <Text className="text-black text-lg font-medium text-center">
                                {genre.name}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </View>
                <Text className="text-red-500 font-Popping mt-4">{error}</Text>
            </ScrollView>

            {/* Fixed Bottom Button */}
            <View className="absolute bottom-5 left-0 right-0 px-6">
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

export default GenreSelectionScreen;
