import useUserProvider from "./useUserProvider";
import { SocialTabType } from "@/schema/notificationSchema";
import useSWR from "swr";
import { getSocialUsers } from "@/http/usershttp";



const useSimilarUsers = (similarityThreshold = 0.3) => {
  const { user } = useUserProvider();
  const {isLoading,data,error,mutate} = useSWR("/socials",()=>getSocialUsers(user!))

  const friendsList = user?.friends?.split("\n");
  const friendsRequestList = user?.invites?.split("\n");

  const getUsersFriendsList = data?.filter(user=>friendsList?.includes(user.id));  
  const getUsersInvitesList = data?.filter(user=>friendsRequestList?.includes(user.id)); 
  const similarUsersList = data?.filter(user=>!getUsersFriendsList?.includes(user) && !getUsersInvitesList?.includes(user));
  
  const socialUsers:SocialTabType = {
    friends : getUsersFriendsList!,
    invites : getUsersInvitesList!,
    similar : similarUsersList!
  }

  return {
    socialUsers,
    isLoading,
    error,
  };
};

export default useSimilarUsers;
