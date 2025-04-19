import { View, Text, TouchableOpacity, Image, Alert } from 'react-native'
import React from 'react'
import { calculateSimilarityScore } from '@/utils'
import useUserProvider from '@/hook/useUserProvider'
import icons from '@/constants/icons'
import useNotification from '@/hook/useNotification'
import { sendFriendRequest } from '@/http/usershttp'
import useFilterUsers from '@/hook/useFilterUsers'


interface OtherUserSchema {
    first_name: string;
    last_name: string;
    fav_artist: string;
    genre: string;
    avatar: string;
    id: string,
    pushToken: string,
}

interface ProfileMatchProps {
    otherUsers: OtherUserSchema[];
    searchQuery : string
}

type OtherUserWithScoreSchema = {
    score: string
} & OtherUserSchema

const ProfileMatch: React.FC<ProfileMatchProps> = ({ otherUsers,searchQuery }) => {
    const { user, addInviteConnection } = useUserProvider();
    const { notifyUser } = useNotification();
    const similarUsersProfile = otherUsers.filter(item => !user?.invites.includes(item.id) && !user?.friends.includes(item.id) && !user?.invitedUser.includes(item.id));
    const similarUserWithScore = calculateSimilarityScore(user!.genre, user!.fav_artist, similarUsersProfile);
    const {filteredUsers} = useFilterUsers(similarUserWithScore,searchQuery);

    const handleNotification = async (payload: { id: string, to: string, title: string, body: string },otherUser:OtherUserSchema) => {
        try {
            await notifyUser(payload);
            await sendFriendRequest(user?.id!, otherUser.id);
            addInviteConnection(otherUser.id);
        } catch (err) {
            console.log(err);
            Alert.alert("Can't send the notification! ");
        }
    }
    return (
        <>
            {filteredUsers?.map((otherUser) => (
                <View className="flex flex-row items-center justify-between p-4 bg-white rounded-lg shadow-md" key={otherUser.id}>
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
                        <Text className="text-gray-500">Similarity: {otherUser.score}%</Text>
                        <Text className="text-gray-600">Fav Artist: {otherUser.fav_artist}</Text>
                        <Text className="text-gray-600">Genre: {otherUser.genre}</Text>
                    </View>

                    {/* Add Friend Button */}
                    <TouchableOpacity onPress={() => handleNotification({ id: otherUser.id, to: otherUser.pushToken, body: `Hi there I am ${user!.first_name} let's chat on moodify while sharing the tracks togeather😊`, title: "Let's Chat togeather" },otherUser)} className="bg-blue-500 px-4 py-2 rounded-full">
                        <Text className="text-white font-semibold">Add to Friend</Text>
                    </TouchableOpacity>
                </View>
            ))}
        </>
    );
};

export default ProfileMatch;
