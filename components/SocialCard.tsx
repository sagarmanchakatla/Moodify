import { SimilarUser } from '@/schema'
import { SocialTabType } from '@/schema/notificationSchema'
import React from 'react'
import { FlatList, View, Text } from 'react-native'
import InvitionsCard from './InvitionsCard'
import ProfileMatch from './ProfileMatch'

const SocialCard: React.FC<{
  users: SimilarUser[]
  tab: keyof SocialTabType
}> = ({ users, tab }) => {
  let content;
  switch (tab) {
    case "similar":
      content = users.map(user=><ProfileMatch otherUser={user} key={user.id}/>)
    break;
    case "friends":
      break;
    case "invites":
      content = <InvitionsCard invites={users} />
      break;
    default:
      content = (
        <View>
          <Text>Hi there</Text>
        </View>
      )
  }
  return (
   <>
    {content}
   </>
  )
}

export default SocialCard