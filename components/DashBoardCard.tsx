import { View, Text, Image } from 'react-native'
import React, { ReactNode } from 'react'
import icons from '@/constants/icons'


interface CardContantSchema {
    title: string,
    primaryText?: string,
    secondartText?: string,
    component?: ReactNode
}

interface DashBoardCardSchema {
    children: ReactNode
    extraStyle?: string
}

export default function DashBoardCard({ children, extraStyle }: DashBoardCardSchema) {
    return (
        <View className={`flex-row items-center bg-white px-4 py-3 ${extraStyle}`}>
            {children}
        </View>
    )
}

const DisplayIcon: React.FC<{ icon?: any, uri?: string }> = ({ icon, uri }) => {
    const path = `https://zwxeuoewnfycljdyxeus.supabase.co/storage/v1/object/public/avatar/${uri}`
    return (
        <>
            {uri ? <Image source={{ uri: path }} style={{
                width: 60,
                height: 60,
                borderRadius: 50,
                marginRight: 15
            }} resizeMode='cover' /> : <Image source={icons.dummyProfilePicture} className="w-13 h-13 rounded-full mr-3" />}
        </>
    )
}


const CardContant: React.FC<CardContantSchema> = ({ title, primaryText, secondartText, component }) => {
    let content;
    if (component) {
        content = component;
    } else {
        content = (
            <View className="flex-1">
                <Text className="text-ms font-Popping-SemiBold text-gray-800">{title}</Text>
                {primaryText && <Text className="text-sm font-Popping text-gray-600">{primaryText}</Text>}
                {secondartText && <Text className="text-sm font-Popping-Light text-gray-400">{secondartText}</Text>}
            </View>
        )
    }
    return (
        <>
            {content}
        </>        
    )
}

const CardMoreIcon: React.FC<{ icon?: any, component?: ReactNode }> = ({ icon, component }) => {
    return (
        <>
            {icon && <Image source={icon} />}
            {component && component}
        </>
    )
}

DashBoardCard.BigIcon = DisplayIcon;
DashBoardCard.Content = CardContant
DashBoardCard.SmallIcon = CardMoreIcon