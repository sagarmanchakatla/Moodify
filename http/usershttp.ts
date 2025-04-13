import supabase from "@/lib/supabase";

export const sendFriendRequest = async (userId:string,otherUserId:string)=>{
    const {error} = await supabase.from("UsersProfile").update({'invites':`${otherUserId}\n`}).eq('id',userId);
    if(error){
        console.log(error);
        throw Error(error.message ?? error.cause);
    }
}   

export const getAllUserInfo = async ()=>{
    const {data,error} = await supabase.from("UsersProfile").select("first_name,last_name,latitude,longitude,genre,fav_artist,id,pushToken").not("latitude","is",null);
    if(error){
        console.log(error);
        throw Error(error.message ?? error.cause ?? "Can't fetch the users data to display");
    }
    return data;
}