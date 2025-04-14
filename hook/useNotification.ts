import useUserProvider from "./useUserProvider"
import supabase from "@/lib/supabase";
import { NotificationSchema } from "@/schema/notificationSchema";


const useNotification = () => {
    const { user } = useUserProvider();

    const notifyUser = async (payload: { to: string, title: string, body: string, id: string }) => {
        const response = await fetch("https://exp.host/--/api/v2/push/send", {
            method: "POST",
            body: JSON.stringify({ data: {}, ...payload }),
            headers: {
                "Content-Type": "application/json"
            }
        });
        if (!response.ok) {
            console.log(await response.json())
            throw Error("Can't notify user ");
        }
        const notificationId = await response.json();
        const { error, status } = await supabase.from("Notification").insert({
            user: payload.id,
            id: notificationId.data.id,
            title: payload.title,
            body: payload.body,
            image: user?.avatar,
        })
        // no need to handle error as the reponse will send the notification but data is not stored due to technical issues 
        return;
    }
    const fetchUserNotifications = async (): Promise<NotificationSchema[]> => {
        const id = user!.id;
        const { data, error, status } = await supabase.from("Notification").select("*").eq("user", id)
        if (error) {
            throw Error(error.message ?? error.cause);
        }
        return data as NotificationSchema[];
    }

    const deleteNotification = async(id:string)=>{
        const {error} = await supabase.from("Notification").delete().eq("id",id);
        if(error){
            console.log(error.message)
            throw Error(error.message??error.cause);
        }
        return;
    }
    return {
        notifyUser,
        fetchUserNotifications,
        deleteNotification
    }
}
export default useNotification;














































/* import React, { useEffect, useState } from 'react'
import { registerIndieID } from 'native-notify'
import { getAllUserInfo} from '@/http/notificationhttp';
import axios, { AxiosError } from 'axios';


interface UserLocationSchema {
    first_name: string,
    last_name: string,
    latitude: number,
    longitude: number,
    genre: string,
    fav_artist: string,
    id: string,
}


// stop using this hook becouse of native-notify is paid 

export default function useNotification() {
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string>('');
    const [userLocations, setUserLocations] = useState<UserLocationSchema[]>();

    useEffect(() => {
        const fetch = async () => {
            try {
                setLoading(true);
                const data = await getAllUserInfo();
                setUserLocations(data);
            } catch (err: any) {
                setError(err.message || "Can't locate any user ");
            } finally {
                setLoading(false);
            }
        }
        fetch();
    }, []);

    const registerUserIdForNotification = async (userId: string) => {
        try {
            await registerIndieID(userId, 28086, '29XY8vCePJsgJa6bdkJguw');
        } catch (err) {
            console.log(err);
        }
    }
    const notifyUser = async (payload: { userId: string, title: string, description: string }) => {
        try {
            await axios.post(`https://app.nativenotify.com/api/indie/notification`, {
                subID: payload.userId,
                appId: 28086,
                appToken: '29XY8vCePJsgJa6bdkJguw',
                title: payload.title,
                message: payload.description,
                pushData: '{ "path": "pathId" }'
            });
        } catch (err: any) {
            console.log(err);
        }
    }
    const getNotification = ()=>{
        // here look after the logic of get notification of login user
    }


    return {
        loading,
        error,
        userLocations,
        registerUserIdForNotification,
        notifyUser,
    }
} */