import image from "@/constants/image"
import React from "react"
import { Image } from "react-native"

const AvatarOrDefault: React.FC<{ uri: string }> = ({ uri }) => {
    let path;
    if(uri){
        path = `https://zwxeuoewnfycljdyxeus.supabase.co/storage/v1/object/public/avatar/${uri}`
    }
    return (
        <>
            {uri ? <Image source={{ uri: path }} style={{
                width: 60,
                height: 60,
                borderRadius: 50,
                marginRight: 15
            }} resizeMode='cover' /> : <Image source={image.standardProfilePicture} style={{width: 60,
                height: 60,
                borderRadius: 50,
                marginRight: 15}} resizeMode="cover" />}
        </>
    )
}

export default AvatarOrDefault