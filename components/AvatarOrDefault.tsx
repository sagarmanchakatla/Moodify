import image from "@/constants/image"
import React from "react"
import { Image } from "react-native"

const AvatarOrDefault: React.FC<{ uri: string }> = ({ uri }) => {
    return (
        <Image source={image.standardProfilePicture} className="w-12 h-12 rounded-full" resizeMode="cover" />
    )
}

export default AvatarOrDefault