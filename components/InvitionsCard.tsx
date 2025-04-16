import { SimilarUser } from '@/schema'
import React from 'react'
import { View, TouchableOpacity, Text } from 'react-native'
import DashBoardCard from './DashBoardCard'
import useUserProvider from '@/hook/useUserProvider'
import { postAddToFriendsList, postRejectFriendRequest } from '@/http/usershttp'
import useFilterUsers from '@/hook/useFilterUsers'

const InvitionsCard: React.FC<{
  users: SimilarUser[],
  searchQuery : string,
}> = ({ users,searchQuery }) => {
  const {user,addFriendsConnection,rejectFriendConnection} = useUserProvider();

  const invitionsList = users.filter(item=>user?.invitedUser.includes(item.id));
  const {filteredUsers} = useFilterUsers(invitionsList,searchQuery);

  const handleAcceptRequest = async (otherUserId:string)=>{
    await postAddToFriendsList(user!.id,otherUserId)
    addFriendsConnection(otherUserId);
  }

  const handleRejectRequest = async (otherUserId:string)=>{
    await postRejectFriendRequest(user!.id,otherUserId);
    rejectFriendConnection(otherUserId);
  }
  return (
    <>
      {filteredUsers?.map(item => (
        <DashBoardCard key={item.id}>
          <DashBoardCard.BigIcon uri={item.avatar} />
          <DashBoardCard.Content
            component={
              <View className="flex-1 flex-row justify-between items-center">
                {/* Left: User Info */}
                <View className="flex-1 pr-2">
                  <Text className="text-ms font-Popping-SemiBold text-gray-800">{`${item.first_name || ""} ${item.last_name || ""}`}</Text>
                  <Text className="text-sm font-Popping text-gray-600">{`${((item.similarity_score || 0) * 100).toFixed(0)}% Match`}</Text>
                  <View>
                    <Text className="text-xs text-gray-500">
                      Genres: {item.genre || "Not specified"}
                    </Text>
                    <Text className="text-xs text-gray-500">
                      Artists: {item.fav_artist || "Not specified"}
                    </Text>
                  </View>
                </View>

                {/* Right: Action Buttons */}
                <View className="flex flex-col space-y-2 gap-3">
                  <TouchableOpacity
                    className="bg-green-500 p-2 rounded"
                    onPress={()=>handleAcceptRequest(item.id)}
                  >
                    <Text className="text-white text-sm font-Popping-SemiBold">Accept</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    className="bg-red-500 p-2 rounded"
                    onPress={()=>handleRejectRequest(item.id)}
                  >
                    <Text className="text-white text-sm font-Popping-SemiBold">Reject</Text>
                  </TouchableOpacity>
                </View>
              </View>
            }
          />
        </DashBoardCard>
      ))}
    </>
  )
}

export default InvitionsCard