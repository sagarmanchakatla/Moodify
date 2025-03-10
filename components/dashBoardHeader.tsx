import { View, Text, TouchableOpacity, Image, Alert } from 'react-native'
import React, { useState } from 'react'
import { router } from "expo-router"
import icons from '@/constants/icons'
import { MenuLists } from '@/constants/data'
import { useRoute } from '@react-navigation/native';
import useUserProvider from '@/hook/useUserProvider'


interface DashBoardHeaderSchema {
    title: string
}
export default function DashBoardHeader({ title }: DashBoardHeaderSchema) {
    const [menu, setMenu] = useState<boolean>(false);
    return (
        <View className="flex-row items-center bg-white px-4 py-3 border-b w-full border-gray-200 relative">
            <TouchableOpacity onPress={() => router.back()}>
                <Image source={icons.backArrow} />
            </TouchableOpacity>
            <Text className="text-2xl font-Popping-Bold flex-1 text-center">{title}</Text>
            <TouchableOpacity onPress={() => setMenu(pre => !pre)}>
                <Image source={icons.detaile} />
            </TouchableOpacity>
            {menu && <MenuListComponent handleToggle={setMenu} />}
        </View>
    )
}

const MenuListComponent: React.FC<{ handleToggle: React.Dispatch<React.SetStateAction<boolean>> }> = ({ handleToggle }) => {

    type RelativePathOptions = "/recentlyPlayed" | "/notification";
    const { name } = useRoute();
    const {logout} = useUserProvider()

    const handleClick = (path: RelativePathOptions) => {
        handleToggle(false);
        const currentRoute = "/" + name;
        if (currentRoute === path) {
            return;
        } else {
            router.push(`${path}`);
        }
    }
    const handleLogout = async()=>{
        try{
            await logout();
        }catch(err){
            Alert.alert("Can't Signout User"); 
        }
    }
    return (
        <View className='flex flex-col justify-center items-center absolute top-14 right-0 w-[150px] gap-2 z-20 rounded-l-xl bg-offwhite'>
            {MenuLists.map((item, index) => (
                <TouchableOpacity className='p-3 w-full border-b-[1px] rounded-xl flex flex-row items-center gap-2' onPress={() => handleClick(item.path as RelativePathOptions)} key={index}>
                    <Image source={item.icon} className='w-6 h-6'/>
                    <Text className='text-md text-center font-Popping-SemiBold'>{item.title}</Text>
                </TouchableOpacity>
            ))}
            <TouchableOpacity className='p-3 w-full rounded-xl flex-row items-center gap-2' onPress={handleLogout}>
                <Image source={icons.logoutMenuicon} className='w-6 h-6'/>
                <Text className='text-md text-center font-Popping-SemiBold'>Logout</Text>
            </TouchableOpacity>
        </View>
    )
}