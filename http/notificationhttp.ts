import supabase from "@/lib/supabase";

const BASEURL = 'https://app.nativenotify.com/api/indie/notification';


export const getAllUserInfo = async ()=>{
    const {data,error} = await supabase.from("UsersProfile").select("first_name,last_name,latitude,longitude,genre,fav_artist,id").not("latitude","is",null);
    if(error){
        console.log(error);
        throw Error(error.message ?? error.cause ?? "Can't fetch the users data to display");
    }
    return data;
}
