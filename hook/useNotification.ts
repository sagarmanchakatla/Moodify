import React, { useEffect, useState } from 'react'
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
}