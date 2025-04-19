import React from 'react'
import { TouchableOpacity } from 'react-native'
import { SimilarUser } from '@/schema'
import useUserProvider from '@/hook/useUserProvider'
import AvatarOrDefault from './AvatarOrDefault'
import DashBoardCard from './DashBoardCard'
import { router } from 'expo-router'
import useFilterUsers from '@/hook/useFilterUsers'

const FriendsLists: React.FC<{
    users: SimilarUser[],
    searchQuery : string
}> = ({ users,searchQuery }) => {
    const { user } = useUserProvider();
    const friendsLists = users.filter(item => user!.friends.includes(item.id));

    const {filteredUsers} = useFilterUsers(friendsLists,searchQuery)
    const handleUserPress = (userId: string) => {
        router.push(`/(root)/chat/${userId}}`);
    };

    return (
        <>
            {friendsLists.map(item => (
                <TouchableOpacity key={item.id} onPress={()=>handleUserPress(item.id)}>
                    <DashBoardCard>
                        <AvatarOrDefault uri={item.avatar} />
                        <DashBoardCard.Content
                            title={item.first_name + (!item.last_name?'':item.last_name)}
                            primaryText={`Profile Matches upto ${item.similarity_score * 100}%`}
                            secondartText={`Present Mood ${item.curr_mood}`}
                        />

                    </DashBoardCard>
                </TouchableOpacity>
            ))}
        </>
    )
}

export default FriendsLists
