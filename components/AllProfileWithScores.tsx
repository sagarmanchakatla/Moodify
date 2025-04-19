import { View, Text, TouchableOpacity, Image, Alert } from 'react-native'
import React from 'react'
import { calculateSimilarityScore, calculateSimilarityScoreHelper } from '@/utils'
import useUserProvider from '@/hook/useUserProvider'
import icons from '@/constants/icons'
import useNotification from '@/hook/useNotification'
import { sendFriendRequest } from '@/http/usershttp'
import {router} from "expo-router"


interface ProfileMatchProps {
    otherUser: {
        first_name: string;
        last_name: string;
        fav_artist: string;
        genre: string;
        avatar: string;
        id: string,
        pushToken: string,
    };
}

const AllProfileWithScore: React.FC<ProfileMatchProps> = ({ otherUser }) => {
    const { user } = useUserProvider();
    const { notifyUser } = useNotification();
    const similarScore = (
        calculateSimilarityScoreHelper(user?.genre!, user?.fav_artist!, otherUser.genre, otherUser.fav_artist) * 100
    ).toFixed(2);
    const meItself = otherUser.id === user?.id;
    const isFriend = user?.friends.includes(otherUser.id);
    const invitedUser = user?.invites.includes(otherUser.id) || user?.invitedUser.includes(otherUser.id);
    const notFriend = !meItself && !isFriend && !invitedUser;


    const handleUserPress = (userId: string) => {
        router.push(`/(root)/chat/${userId}}`);
    };

    const handleNotification = async (payload: { id: string, to: string, title: string, body: string }) => {
        try {
            await sendFriendRequest(user?.id!, otherUser.id);
            notifyUser(payload);
        } catch (err) {
            console.log(err);
            Alert.alert("Can't send the notification! ");
        }
    }
    return (
        <View className="flex flex-row items-center justify-between p-4 bg-white rounded-lg shadow-md">
            {/* Avatar Section */}
            <Image
                source={otherUser.avatar ? { uri: otherUser.avatar } : icons.dummyProfilePicture}
                className="w-14 h-14 rounded-full"
                resizeMode="cover"
            />

            {/* Center Content */}
            <View className="flex-1 ml-4">
                <Text className="text-lg font-semibold">
                    {otherUser.first_name} {otherUser.last_name}
                </Text>
                <Text className="text-gray-500">Similarity: {similarScore}%</Text>
                <Text className="text-gray-600">Fav Artist: {otherUser.fav_artist}</Text>
                <Text className="text-gray-600">Genre: {otherUser.genre}</Text>
            </View>

            {/* Add Friend Button */}
            {meItself &&
                <TouchableOpacity className="bg-blue-500 px-4 py-2 rounded-full">
                    <Text className="text-white font-semibold">You</Text>
                </TouchableOpacity>}
            {isFriend &&
                <TouchableOpacity onPress={()=>handleUserPress(otherUser.id)} className="bg-blue-500 px-4 py-2 rounded-full">
                    <Text className="text-white font-semibold">Chat</Text>
                </TouchableOpacity>}

            {invitedUser &&
                <TouchableOpacity className="bg-blue-500 px-4 py-2 rounded-full">
                    <Text className="text-white font-semibold">Invited</Text>
                </TouchableOpacity>}

            {notFriend &&
                <TouchableOpacity onPress={() => handleNotification({ id: otherUser.id, to: otherUser.pushToken, body: `Hi there I am ${user!.first_name} let's chat on moodify while sharing the tracks togeather😊`, title: "Let's Chat togeather" })} className="bg-blue-500 px-3 py-2 rounded-full">
                    <Text className="text-white font-semibold">Friend Request</Text>
                </TouchableOpacity>}


        </View>
    );
};

export default AllProfileWithScore;