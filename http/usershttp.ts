import supabase from "@/lib/supabase";

export const sendFriendRequest = async (userId:string,otherUserId:string)=>{
    const {error} = await supabase.from("UsersProfile").update({'invites':`${otherUserId}\n`}).eq('id',userId);
    if(error){
        console.log(error);
        throw Error(error.message ?? error.cause);
    }
}   