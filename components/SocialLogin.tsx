import { StyleSheet,Image, TouchableOpacity, View,Alert } from 'react-native'
import React from 'react'
import icons from '@/constants/icons'
import * as WebBrowser from "expo-web-browser";
import { useRouter } from 'expo-router';
import useUserProvider from '@/hook/useUserProvider';



WebBrowser.maybeCompleteAuthSession(); // required for web only

export default function SocialLogin() {
    const {performOAuth} = useUserProvider();
    const router = useRouter();
    const authenticateUser = (provider : "google"|"facebook")=>{
        try{
            performOAuth(provider);
            router.replace("/page/Home");
        }catch(err){
            Alert.alert("Oauth fail to authenticates Users ");
        }
    }
    return (
        <View className="flex-row items-center justify-center w-full gap-5 ">
            <TouchableOpacity onPress={() => authenticateUser("google")}>
                <Image source={icons.google} style={{ width: 35, height: 35 }} />
            </TouchableOpacity>
            <TouchableOpacity onPress={() => authenticateUser("facebook")}>
                <Image source={icons.facebook} style={{ width: 45, height: 40 }} />
            </TouchableOpacity>
        </View>
    )
}

const styles = StyleSheet.create({})